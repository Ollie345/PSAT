"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, BarChart3, RotateCcw, AlertTriangle, Calendar, Heart } from "lucide-react"
import ProgressCircles from "./ProgressCircles"

const ResultsPage = ({ result, onStartOver, progressCircle, error }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "mild": return "bg-green-100 text-green-800 border-green-200"
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "severe": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case "mild": return "🟢"
      case "moderate": return "🟡"
      case "severe": return "🔴"
      default: return "⚪"
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <ProgressCircles activeCircle={progressCircle} />

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={onStartOver} className="bg-blue-600 hover:bg-blue-700">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <ProgressCircles activeCircle={progressCircle} />

            <Card>
              <CardContent className="p-6 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Calculating Your Results...</h2>
                <p className="text-gray-600">Please wait while we analyze your responses.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Circles */}
          <ProgressCircles activeCircle={progressCircle} />

          {/* Header */}
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900">Your I-PSS Results</h1>
            <p className="text-lg text-gray-600">Here's what your symptoms indicate about your prostate health.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Prostate Symptom Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="text-4xl sm:text-5xl font-bold text-blue-600">{result.score}/35</div>
                  <div className="text-sm text-gray-600">Your I-PSS Score</div>
                </div>

                <Badge className={`${getSeverityColor(result.severity)} text-sm px-4 py-2 border`} variant="secondary">
                  {getSeverityIcon(result.severity)} {result.severity} Symptoms
                </Badge>
              </div>

              {/* Age Context */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Age Context</h3>
                </div>
                <p className="text-sm text-gray-700">{result.ageContext}</p>
              </div>

              {/* Medical Context */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Medical Context</h3>
                </div>
                <div className="space-y-2">
                  {result.medicalContext.map((context, index) => (
                    <p key={index} className="text-sm text-gray-700">• {context}</p>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-900">Recommendations</h3>
                <p className="text-sm text-gray-700">{result.recommendations}</p>
              </div>

              {/* Red Flags */}
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="space-y-2">
                  <div className="font-semibold text-orange-800">Important: Seek immediate medical attention if you experience:</div>
                  <ul className="text-sm text-orange-700 space-y-1 ml-4">
                    {result.redFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button onClick={onStartOver} variant="outline" className="w-full flex items-center justify-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Take Assessment Again
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800 text-center">
              <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and not a substitute for medical advice.
              Consult a healthcare provider for concerns about your prostate health.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
