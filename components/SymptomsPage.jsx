"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import ProgressBar from "./ProgressBar"

const ratingOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Less than 1 time in 5" },
  { value: 2, label: "Less than half the time" },
  { value: 3, label: "About half the time" },
  { value: 4, label: "More than half the time" },
  { value: 5, label: "Almost always" }
]

const SymptomsPage = ({
  question,
  currentIndex,
  totalQuestions,
  response,
  onResponse,
  onNext,
  onPrevious,
  progressCircle,
  isSubmitting
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const shouldReduce = useReducedMotion()

  const handleRatingSelect = (value) => {
    onResponse(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* 4-step Progress Bar */}
          <ProgressBar activeStep={3} currentIndex={currentIndex} totalCount={totalQuestions} />

          {/* Question Card */}
          <Card>
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl text-gray-900 leading-tight">
                Question {currentIndex + 1} of {totalQuestions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                {question}
              </p>

              {/* Rating Options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  How often have you experienced this symptom over the past month?
                </p>
                <div className="space-y-2">
                  {ratingOptions.map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={shouldReduce ? undefined : { scale: 1.01 }}
                      whileTap={shouldReduce ? undefined : { scale: 0.99 }}
                      className={`flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                        response === option.value ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentIndex}`}
                        value={option.value}
                        checked={response === option.value}
                        onChange={() => handleRatingSelect(option.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                          response === option.value ? "border-blue-500 bg-blue-500" : "border-gray-300"
                        }`}
                      >
                        {response === option.value && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                      </div>
                      <span className="text-sm sm:text-base font-medium">
                        {option.label}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
                <Button
                  onClick={onPrevious}
                  variant="outline"
                  disabled={currentIndex === 0}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={onNext}
                  disabled={response === undefined || response === null || isSubmitting}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Getting Results...
                    </>
                  ) : currentIndex === totalQuestions - 1 ? (
                    "Get My Results"
                  ) : (
                    "Next"
                  )}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs sm:text-sm text-gray-500">
            💡 Take your time to accurately reflect your experiences over the past month.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SymptomsPage
