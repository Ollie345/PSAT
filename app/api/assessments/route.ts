import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limitParam = url.searchParams.get("limit")
    const limit = Math.min(Math.max(parseInt(limitParam || "20", 10) || 20, 1), 100)

    const assessments = await prisma.prostateAssessment.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        completedAt: true,
        age: true,
        sex: true,
        totalScore: true,
        severityLevel: true,
        q1IncompleteEmptying: true,
        q2Frequency: true,
        q3Intermittency: true,
        q4Urgency: true,
        q5WeakStream: true,
        q6Straining: true,
        q7Nocturia: true,
      },
    })

    return NextResponse.json({ success: true, count: assessments.length, assessments }, { status: 200 })
  } catch (e) {
    console.error("List assessments API error:", e)
    return NextResponse.json({ success: false, detail: "Internal server error" }, { status: 500 })
  }
}


