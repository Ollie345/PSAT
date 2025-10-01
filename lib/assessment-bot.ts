export type IPSSResponse = number // 0-5 for each question

export interface Demographics {
  age: number
  sex: string
}

export interface MedicalHistory {
  conditions: string[]
  medications: string
  familyHistory: string
  surgeries: string
}

export function calculateIPSSScore(responses: IPSSResponse[]): number {
  // Sum all responses (each 0-5, total 0-35)
  return responses.reduce((total, response) => total + response, 0)
}

export function getSeverity(score: number): { level: string; color: string } {
  if (score <= 7) return { level: "Mild", color: "green" }
  if (score <= 19) return { level: "Moderate", color: "yellow" }
  return { level: "Severe", color: "red" }
}

export function getAgeContext(age: number): string {
  if (age < 40) return "Significant prostate enlargement is less common. Moderate–severe symptoms should be evaluated."
  if (age < 50) return "About 40% of men in their 40s have enlargement; not all have symptoms."
  if (age < 60) return "About 50% experience symptoms; regular check-ups important."
  if (age < 70) return "About 60% experience symptoms; monitoring recommended."
  return "About 70% experience symptoms; regular check-ups essential."
}

export function getMedicalContext(medicalHistory: MedicalHistory): string[] {
  const context: string[] = []
  
  if (medicalHistory.conditions.includes("Diabetes")) {
    context.push("Diabetes can affect bladder function and may contribute to urinary symptoms.")
  }

  if (medicalHistory.conditions.includes("Neurological disease")) {
    context.push("Neurological conditions can impact bladder control and urinary function.")
  }

  if (medicalHistory.familyHistory === "yes") {
    context.push("Family history increases your risk for prostate issues; regular screening is recommended.")
  }

  if (medicalHistory.medications.trim()) {
    context.push("Some medications can affect urinary function; discuss with your healthcare provider.")
  }

  if (medicalHistory.surgeries.trim()) {
    context.push("Previous surgeries can contribute to urinary symptoms and should be considered in evaluation.")
  }

  if (context.length === 0) {
    context.push("No significant medical factors noted that would directly impact urinary symptoms.")
  }

  return context
}

export function getRecommendations(severity: string): string {
  switch (severity.toLowerCase()) {
    case "mild":
      return "No immediate treatment needed. Discuss symptoms during your next regular check-up if they persist or worsen."
    case "moderate":
      return "Schedule an appointment with your healthcare provider. Medications or minimally invasive options may be helpful."
    case "severe":
      return "See your healthcare provider or urologist as soon as possible for evaluation and treatment options."
    default:
      return "Consult with your healthcare provider for personalized recommendations."
  }
}

export function generateIPSSAssessment(
  score: number,
  demographics: Demographics,
  medicalHistory: MedicalHistory
) {
  const severity = getSeverity(score)
  const ageContext = getAgeContext(demographics.age)
  const medicalContext = getMedicalContext(medicalHistory)
  const recommendations = getRecommendations(severity.level)

  return {
    score,
    severity: severity.level,
    severityColor: severity.color,
    ageContext,
    medicalContext,
    recommendations,
    redFlags: [
      "Complete inability to urinate",
      "Painful or burning urination", 
      "Blood in urine",
      "Fever or chills",
      "Severe abdominal or back pain"
    ]
  }
}
