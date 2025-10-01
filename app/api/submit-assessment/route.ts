import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>

    // Validate prostate assessment data
    if (!body.demographics || typeof body.demographics !== "object") {
      return NextResponse.json({ detail: "Missing demographics" }, { status: 400 })
    }

    const demo = body.demographics as Record<string, unknown>
    if (!demo.age || typeof demo.age !== "string") {
      return NextResponse.json({ detail: "Missing or invalid age" }, { status: 400 })
    }

    const age = parseInt(demo.age)
    if (isNaN(age) || age < 18 || age > 120) {
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

    // Extract optional contact info
    let fullName: string | null = null
    let email: string | null = null
    if (body.contact && typeof body.contact === "object") {
      const c = body.contact as Record<string, unknown>
      if (typeof c.fullName === "string" && c.fullName.trim()) fullName = c.fullName.trim()
      if (typeof c.email === "string" && c.email.trim()) email = c.email.trim().toLowerCase()
    }

    // Save assessment to database
    try {
      const savedAssessment = await prisma.prostateAssessment.create({
        data: {
          fullName: fullName || "Anonymous User",
          email: email || `anonymous_${Date.now()}@temp.com`,
          age: age,
          sex: demo.sex,
          medicalConditions: med.conditions,
          medications: med.medications || null,
          familyHistory: med.familyHistory || null,
          surgeries: med.surgeries || null,
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

      console.log("Assessment saved to database:", savedAssessment.id)

    } catch (dbError) {
      console.error("Database save error:", dbError)
      // Continue with response even if database save fails
    }

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
