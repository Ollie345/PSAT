"use client"

import { useState } from "react"
import DemographicsPage from "./DemographicsPage"
import MedicalHistoryPage from "./MedicalHistoryPage"
import SymptomsPage from "./SymptomsPage"
import ResultsPage from "./ResultsPage"
import ProgressCircles from "./ProgressCircles"

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
      // Submit assessment
      setIsSubmitting(true)n      setError("")nn      try {n        const assessmentData = {n          demographics,n          medicalHistory,n          responses: responsesArray,n        }nn        const response = await fetch("/api/submit-assessment", {n          method: "POST",n          headers: {n            "Content-Type": "application/json",n          },n          body: JSON.stringify(assessmentData),n        })nn        if (!response.ok) {n          throw new Error(`API Error: ${response.status} ${response.statusText}`)n        }nn        const result = await response.json()n        setResults(result)n        setCurrentStep("results")n      } catch (err) {n        console.error("Submission error:", err)n        setError(err.message || "Something went wrong. Please try again.")n        setCurrentStep("symptoms")n      } finally {n        setIsSubmitting(false)n      }      }, 1000)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    } else {
      setCurrentStep("medical")
    }
  }

  const handleStartOver = () => {
    setCurrentStep("demographics")
    setCurrentQuestionIndex(0)
    setResponses({})
    setDemographics({ age: "", sex: "" })
    setMedicalHistory({ conditions: [], medications: "", familyHistory: "", surgeries: "" })
    setResults(null)
    setError("")
  }

  // Progress calculation for 4 circles
  const getProgressCircle = () => {
    if (currentStep === "demographics") return 1
    if (currentStep === "medical") return 2
    if (currentStep === "symptoms") {
      // Split symptoms into two parts for 4-circle progress
      return currentQuestionIndex < 2 ? 3 : 4
    }
    if (currentStep === "results") return 4
    return 1
  }

  // Render current step
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
        onPrevious={() => setCurrentStep("demographics")}
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
