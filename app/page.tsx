"use client"

import LandingPage from "@/components/LandingPage"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  return <LandingPage onStartAssessment={() => router.push("/assessment")} />
}
