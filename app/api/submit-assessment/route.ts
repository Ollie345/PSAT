import { NextResponse } from "next/server"
import { calculateScore, generateAssessment, symptoms, type SymptomResponse } from "@/lib/assessment-bot"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>

    // Basic validation
    const requiredFields = ["name", "email", "age", "marital_status"]
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== "string" || (body[field] as string).trim() === "") {
        return NextResponse.json({ detail: `Missing field: ${field}` }, { status: 400 })
      }
    }

    // Build responses object for scoring
    const symptomResponses: Record<string, SymptomResponse> = {}
    Object.keys(symptoms).forEach((key) => {
      const val = String(body[key] ?? "").toLowerCase()
      symptomResponses[key] = ["yes", "no", "sometimes"].includes(val) ? (val as SymptomResponse) : ""
    })

    const score = calculateScore(symptomResponses)
    const result = generateAssessment(score)

    return NextResponse.json(
      {
        success: true,
        score,
        ...result,
      },
      { status: 200 },
    )
  } catch (e) {
    console.error("API error:", e)
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 })
  }
}
