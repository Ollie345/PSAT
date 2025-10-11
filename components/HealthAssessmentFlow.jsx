"use client"

import { useState } from "react"
import DemographicsPage from "./DemographicsPage"
import MedicalHistoryPage from "./MedicalHistoryPage"
import SymptomsPage from "./SymptomsPage"
import ResultsPage from "./ResultsPage"
import NameEmailPage from "./NameEmailPage"
import ProcessingPage from "./ProcessingPage"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
 

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
  const [currentStep, setCurrentStep] = useState("demographics") // demographics, symptoms, contact, medical, processing, results
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
  const [contactInfo, setContactInfo] = useState({ fullName: "", email: "" })

  const totalQuestions = ipssQuestions.length

  const handleDemographicsSubmit = (data) => {
    setDemographics(data)
    setCurrentStep("symptoms")
  }

  const handleMedicalHistorySubmit = (data) => {
    setMedicalHistory(data)
    submitAssessment(data)
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
      // Completed questions → go to contact step
      setCurrentStep("contact")
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    } else {
      setCurrentStep("medical")
    }
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactInfo(prev => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!contactInfo.fullName || !contactInfo.email) {
      setError("Please enter your name and email")
      return
    }
    setError("")
    setCurrentStep("medical")
  }

  const submitAssessment = async (medicalOverride) => {
    setIsSubmitting(true)
    setError("")
    setCurrentStep("processing")

    const responsesArray = []
    for (let i = 0; i < totalQuestions; i++) {
      responsesArray.push(responses[i] !== undefined ? responses[i] : 0)
    }

    try {
      const assessmentData = {
        demographics,
        medicalHistory: medicalOverride || medicalHistory,
        responses: responsesArray,
        contact: contactInfo,
      }

      const response = await fetch("/api/submit-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentData),
      })
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      const result = await response.json()
      setResults(result)
      setCurrentStep("results")
    } catch (err) {
      console.error("Submission error:", err)
      setError(err.message || "Something went wrong. Please try again.")
      setCurrentStep("results")
    } finally {
      setIsSubmitting(false)
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

  

  const shouldReduce = useReducedMotion()
  let content = null

  if (currentStep === "demographics") {
    content = (
      <DemographicsPage
        demographics={demographics}
        onSubmit={handleDemographicsSubmit}
      />
    )
  } else if (currentStep === "symptoms") {
    content = (
      <SymptomsPage
        question={ipssQuestions[currentQuestionIndex]}
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        response={responses[currentQuestionIndex] || 0}
        onResponse={handleQuestionResponse}
        onNext={handleNextQuestion}
        onPrevious={handlePreviousQuestion}
        isSubmitting={isSubmitting}
      />
    )
  } else if (currentStep === "contact") {
    content = (
      <NameEmailPage
        contactInfo={contactInfo}
        onChange={handleContactChange}
        onSubmit={handleContactSubmit}
        onPrevious={() => setCurrentStep("symptoms")}
        isSubmitting={isSubmitting}
        error={error}
      />
    )
  } else if (currentStep === "medical") {
    content = (
      <MedicalHistoryPage
        medicalHistory={medicalHistory}
        onSubmit={handleMedicalHistorySubmit}
        onPrevious={() => setCurrentStep("contact")}
      />
    )
  } else if (currentStep === "processing") {
    content = <ProcessingPage />
  } else if (currentStep === "results") {
    content = (
      <ResultsPage
        result={results}
        onStartOver={handleStartOver}
        error={error}
      />
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  )
}

export default HealthAssessmentFlow
