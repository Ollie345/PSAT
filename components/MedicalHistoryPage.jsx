"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Pill, Users, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"
import ProgressCircles from "./ProgressCircles"

const conditions = [
  "Diabetes",
  "Neurological disease",
  "Heart disease",
  "Hypertension",
  "Kidney disease",
  "Recurrent UTI",
  "None"
]

const MedicalHistoryPage = ({ medicalHistory, onSubmit, onPrevious, progressCircle }) => {
  const [formData, setFormData] = useState({
    conditions: medicalHistory.conditions || [],
    medications: medicalHistory.medications || "",
    familyHistory: medicalHistory.familyHistory || "",
    surgeries: medicalHistory.surgeries || "",
  })
  const [error, setError] = useState("")

  const handleConditionChange = (condition, checked) => {
    setFormData(prev => {
      let newConditions = [...prev.conditions]

      if (condition === "None") {
        // If "None" is selected, clear all other conditions
        newConditions = checked ? ["None"] : []
      } else {
        // If any other condition is selected, remove "None"
        if (checked) {
          newConditions = newConditions.filter(c => c !== "None")
          if (!newConditions.includes(condition)) {
            newConditions.push(condition)
          }
        } else {
          newConditions = newConditions.filter(c => c !== condition)
        }
      }

      return {
        ...prev,
        conditions: newConditions
      }
    })
    if (error) setError("")
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (formData.conditions.length === 0) {
      setError("Please select at least one condition")
      return
    }

    if (!formData.familyHistory) {
      setError("Please select your family history")
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Circles */}
          <ProgressCircles activeCircle={progressCircle} />

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
            <p className="text-lg text-gray-600">Help us understand your medical background to provide better insights.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Conditions */}
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base font-medium">
                    Do you have any of these conditions? (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conditions.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.conditions.includes(condition)}
                          onCheckedChange={(checked) => handleConditionChange(condition, checked)}
                        />
                        <Label
                          htmlFor={condition}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                <div className="space-y-2">
                  <Label htmlFor="medications" className="flex items-center gap-2 text-sm sm:text-base">
                    <Pill className="h-4 w-4" />
                    Current Medications
                  </Label>
                  <Textarea
                    id="medications"
                    placeholder="List any medications you're currently taking (optional)"
                    value={formData.medications}
                    onChange={(e) => handleInputChange("medications", e.target.value)}
                    className="min-h-[80px] text-base"
                  />
                  <p className="text-xs text-gray-500">Include dosage if possible</p>
                </div>

                {/* Family History */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <Users className="h-4 w-4" />
                    Family History of Prostate Cancer
                  </Label>
                  <Select
                    value={formData.familyHistory}
                    onValueChange={(value) => handleInputChange("familyHistory", value)}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select your family history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Surgeries */}
                <div className="space-y-2">
                  <Label htmlFor="surgeries" className="flex items-center gap-2 text-sm sm:text-base">
                    <Heart className="h-4 w-4" />
                    Previous Surgeries
                  </Label>
                  <Textarea
                    id="surgeries"
                    placeholder="Describe any previous surgeries, especially those related to urinary or reproductive health (optional)"
                    value={formData.surgeries}
                    onChange={(e) => handleInputChange("surgeries", e.target.value)}
                    className="min-h-[80px] text-base"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
                  <Button
                    type="button"
                    onClick={onPrevious}
                    variant="outline"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Continue to Symptoms
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs sm:text-sm text-gray-500">
            🔒 Your medical information is completely confidential and will never be shared.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MedicalHistoryPage
