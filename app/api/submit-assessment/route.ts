import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { odooAuthenticate, ensureTag, ensurePartner, createLead, postNote } from "@/lib/odoo"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>

    // Validate prostate assessment data
    if (!body.demographics || typeof body.demographics !== "object") {
      return NextResponse.json({ detail: "Missing demographics" }, { status: 400 })
    }

    const demo = body.demographics as Record<string, unknown>
    const rawAge = (demo as any).age
    const age = typeof rawAge === "number" ? rawAge : parseInt(String(rawAge), 10)
    if (!Number.isFinite(age) || age < 18 || age > 120) {
      return NextResponse.json({ detail: "Age must be between 18 and 120" }, { status: 400 })
    }

    if (!demo.sex || typeof demo.sex !== "string") {
      return NextResponse.json({ detail: "Missing sex" }, { status: 400 })
    }

    // Validate medical history
    if (!body.medicalHistory || typeof body.medicalHistory !== "object") {
      return NextResponse.json({ detail: "Missing medical history" }, { status: 400 })
    }

    const med = body.medicalHistory as Record<string, unknown>
    if (!Array.isArray(med.conditions)) {
      return NextResponse.json({ detail: "Invalid conditions format" }, { status: 400 })
    }

    if (!med.familyHistory || typeof med.familyHistory !== "string") {
      return NextResponse.json({ detail: "Missing family history" }, { status: 400 })
    }

    // Validate responses
    if (!body.responses || !Array.isArray(body.responses)) {
      return NextResponse.json({ detail: "Missing or invalid responses" }, { status: 400 })
    }

    if (body.responses.length !== 7) {
      return NextResponse.json({ detail: "Expected 7 responses" }, { status: 400 })
    }

    // Validate each response is 0-5
    const responses: number[] = []
    for (const response of body.responses) {
      if (typeof response !== "number" || response < 0 || response > 5) {
        return NextResponse.json({ detail: "All responses must be numbers between 0 and 5" }, { status: 400 })
      }
      responses.push(response)
    }

    // Calculate I-PSS score
    const score = responses.reduce((total, response) => total + response, 0)

    // Determine severity
    let severity = "Mild"
    if (score >= 20) severity = "Severe"
    else if (score >= 8) severity = "Moderate"

    // Sanitize medical fields for type safety
    const conditionsArr = Array.isArray(med.conditions) ? (med.conditions as string[]) : []
    const medicationsStr = typeof (med as any).medications === "string" ? (med as any).medications as string : null
    const familyHistoryStr = typeof (med as any).familyHistory === "string" ? (med as any).familyHistory as string : null
    const surgeriesStr = typeof (med as any).surgeries === "string" ? (med as any).surgeries as string : null

    // Extract optional contact info
    let fullName: string | null = null
    let email: string | null = null
    if (body.contact && typeof body.contact === "object") {
      const c = body.contact as Record<string, unknown>
      if (typeof c.fullName === "string" && c.fullName.trim()) fullName = c.fullName.trim()
      if (typeof c.email === "string" && c.email.trim()) email = c.email.trim().toLowerCase()
    }

    // Save assessment to database (independent)
    let savedAssessmentId: number | null = null
    try {
      const savedAssessment = await prisma.prostateAssessment.create({
        data: {
          fullName: fullName || "Anonymous User",
          email: email || `anonymous_${Date.now()}@temp.com`,
          age: age,
          sex: demo.sex,
          medicalConditions: conditionsArr,
          medications: medicationsStr,
          familyHistory: familyHistoryStr,
          surgeries: surgeriesStr,
          q1IncompleteEmptying: responses[0],
          q2Frequency: responses[1],
          q3Intermittency: responses[2],
          q4Urgency: responses[3],
          q5WeakStream: responses[4],
          q6Straining: responses[5],
          q7Nocturia: responses[6],
          totalScore: score,
          severityLevel: severity,
          completedAt: new Date(),
        },
      })

      savedAssessmentId = savedAssessment.id
      console.log("Assessment saved to database:", savedAssessment.id)
    } catch (dbError) {
      console.error("Database save error:", dbError)
      // Continue - DB failure shouldn't block Odoo or response
    }

    // Send to Odoo (fire-and-forget, independent of DB result)
    void (async () => {
      try {
        const conditions = conditionsArr
        const responsesList = responses
          .map((v, i) => `• Q${i + 1}: ${v}`)
          .join("\n")

        const descriptionLines: string[] = [
          `Personal Information`,
          `• Name: ${fullName || "Anonymous"}`,
          `• Email: ${email || "N/A"}`,
          `• Age: ${age}`,
          `• Sex: ${String(demo.sex)}`,
          ``,
          `Assessment Results`,
          `• I-PSS Score: ${score}/35`,
          `• Severity: ${severity}`,
          ``,
          `Medical History`,
          `• Conditions: ${conditions.length ? conditions.join(", ") : "None"}`,
          `• Family History: ${familyHistoryStr ?? "N/A"}`,
          `• Surgeries: ${surgeriesStr ?? "N/A"}`,
          ``,
          `Responses`,
          responsesList,
        ]
        const description = descriptionLines.join("\n")

        const uid = await odooAuthenticate()

        // Ensure tags
        const tagIds: number[] = []
        try { tagIds.push(await ensureTag(uid, "Prostate Assessment")) } catch { }
        try { tagIds.push(await ensureTag(uid, `I-PSS: ${severity}`)) } catch { }

        // Ensure partner (only if email is real)
        let partnerId: number | undefined
        if (email && !email.startsWith("anonymous_")) {
          try {
            partnerId = await ensurePartner(uid, email, fullName || "Anonymous")
          } catch (e) {
            console.warn("Odoo ensurePartner failed:", e)
          }
        }

        // Create lead
        const leadPayload: Record<string, any> = {
          name: `I-PSS Assessment - ${severity}`,
          contact_name: fullName || "Anonymous",
          email_from: email || undefined,
          partner_id: partnerId,
          description,
        }
        if (tagIds.length > 0) {
          leadPayload.tag_ids = [[6, 0, tagIds]]
        }

        const leadId = await createLead(uid, leadPayload)
        console.log("Assessment sent to Odoo:", leadId, "dbId:", savedAssessmentId ?? "unknown")

        // Optional note
        try {
          await postNote(uid, leadId, "Lead created via web assessment integration.")
        } catch { }
      } catch (err) {
        console.error("Odoo integration error:", err)
      }
    })()

    return NextResponse.json(
      {
        success: true,
        score,
        severity,
        severityColor: severity.toLowerCase(),
        ageContext: age < 50 ? "About 40% of men in their 40s have enlargement; not all have symptoms." :
          age < 60 ? "About 50% experience symptoms; regular check-ups important." :
            "About 70% experience symptoms; regular check-ups essential.",
        medicalContext: ["Medical context analysis available."],
        recommendations: severity === "Mild" ? "No immediate treatment needed. Discuss symptoms during your next regular check-up if they persist or worsen." :
          severity === "Moderate" ? "Schedule an appointment with your healthcare provider. Medications or minimally invasive options may be helpful." :
            "See your healthcare provider or urologist as soon as possible for evaluation and treatment options.",
        redFlags: [
          "Complete inability to urinate",
          "Painful or burning urination",
          "Blood in urine",
          "Fever or chills",
          "Severe abdominal or back pain"
        ]
      },
      { status: 200 },
    )
  } catch (e) {
    console.error("API error:", e)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
