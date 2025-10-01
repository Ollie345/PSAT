"use client"

import { useState } from "react"
import LandingPage from "./LandingPage"
import DemographicsPage from "./DemographicsPage"
import MedicalHistoryPage from "./MedicalHistoryPage"
import SymptomsPage from "./SymptomsPage"
import ResultsPage from "./ResultsPage"

// I-PSS Questions (0-5 scale: Never → Almost always)
const ipssQuestions = [
  "How often have you had a sensation of not emptying your bladder completely after you finished urinating?",
  "How often have you had to urinate again less than two hours after you finished urinating?",
  "How often have you found you stopped and started again several times when you urinated?",
  "How often have you found it difficult to postpone urination?",
  "How often have you had a weak urinary stream?",
  "How often have you had to push or strain to begin urination?",
  "How many times did you most typically get up to urinate from the time you went to bed at night until the time you got up in the morning?"
]

const HealthAssessmentFlow = () => {
  const [currentStep, setCurrentStep] = useState("demographics") // demographics, medical, symptoms, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [demographics, setDemographics] = useState({
    age: "",
    sex: "",
  })
  const [medicalHistory, setMedicalHistory] = useState({
    conditions: [],
    medications: "",
    familyHistory: "",
    surgeries: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState(null)

  const totalQuestions = ipssQuestions.length

  const handleDemographicsSubmit = (data) => {
    setDemographics(data)
    setCurrentStep("medical")
  }

  const handleMedicalHistorySubmit = (data) => {
    setMedicalHistory(data)
    setCurrentStep("symptoms")
  }

  const handleQuestionResponse = (response) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestionIndex]: response,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      handleSubmitAssessment()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    } else {
      setCurrentStep("medical")
    }
  }

  const handleBackToMedical = () => {
    setCurrentStep("medical")
  }

  const handleBackToDemographics = () => {
    setCurrentStep("landing")
  }

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // Ensure we have responses for all 7 questions (0-6)
      const responsesArray = []
      for (let i = 0; i < totalQuestions; i++) {
        responsesArray.push(responses[i] !== undefined ? responses[i] : 0)
      }

      const assessmentData = {
        demographics,
        medicalHistory,
        responses: responsesArray,
      }

      console.log("Submitting assessment:", assessmentData)

      // For now, we'll simulate the API call since we don't have the database set up yet
      // In production, this would call the actual API
      setTimeout(() => {
        // Mock successful response
        setResults({
          success: true,
          score: 16,
          severity: "Moderate",
          severityColor: "yellow",
          ageContext: "About 40% of men in their 40s have enlargement; not all have symptoms.",
          medicalContext: ["No significant medical factors noted that would directly impact urinary symptoms."],
          recommendations: "Schedule an appointment with your healthcare provider. Medications or minimally invasive options may be helpful.",
          redFlags: [
            "Complete inability to urinate",
            "Painful or burning urination",
            "Blood in urine",
            "Fever or chills",
            "Severe abdominal or back pain"
          ]
        })
        setCurrentStep("results")
        setIsSubmitting(false)
      }, 1000)

    } catch (err) {
      console.error("Submission error:", err)
      setError(err.message || "Something went wrong. Please try again.")
      setCurrentStep("symptoms") // Stay on symptoms page if error
      setIsSubmitting(false)
    }
  }

  const handleStartOver = () => {
    setCurrentStep("landing")
    setCurrentQuestionIndex(0)
    setResponses({})
    setDemographics({ age: "", sex: "" })
    setMedicalHistory({ conditions: [], medications: "", familyHistory: "", surgeries: "" })
    setResults(null)
    setError("")
  }

  // Progress calculation for 4 circles (0 = landing page)
  const getProgressCircle = () => {
    if (currentStep === "landing") return 0
    if (currentStep === "demographics") return 1
    if (currentStep === "medical") return 2
    if (currentStep === "symptoms") {
      // Split symptoms into two parts for 4-circle progress
      return currentQuestionIndex < 2 ? 3 : 4
    }
    if (currentStep === "results") return 4
    return 0
  }

    if (currentStep === "results") return 4
    return 1
  }

  // Render current step
  if (currentStep === "landing") {
    return <LandingPage onStartAssessment={() => setCurrentStep("landing")} />
  }

  
  if (currentStep === "demographics") {
    return (
      <DemographicsPage
        demographics={demographics}
        onSubmit={handleDemographicsSubmit}
        progressCircle={getProgressCircle()}
      />
    )
  }

  if (currentStep === "medical") {
    return (
      <MedicalHistoryPage
        medicalHistory={medicalHistory}
        onSubmit={handleMedicalHistorySubmit}
        onPrevious={handleBackToDemographics}
        progressCircle={getProgressCircle()}
      />
    )
  }

  if (currentStep === "symptoms") {
    return (
      <SymptomsPage
        question={ipssQuestions[currentQuestionIndex]}
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        response={responses[currentQuestionIndex] || 0}
        onResponse={handleQuestionResponse}
        onNext={handleNextQuestion}
        onPrevious={handlePreviousQuestion}
        progressCircle={getProgressCircle()}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (currentStep === "results") {
    return (
      <ResultsPage
        result={results}
        onStartOver={handleStartOver}
        progressCircle={getProgressCircle()}
        error={error}
      />
    )
  }

  return null
}

export default HealthAssessmentFlow
