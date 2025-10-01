"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, ArrowRight, AlertCircle } from "lucide-react"
import ProgressCircles from "./ProgressCircles"

const DemographicsPage = ({ demographics, onSubmit, progressCircle }) => {
  const [formData, setFormData] = useState(demographics)
  const [error, setError] = useState("")

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
    if (!formData.age || !formData.sex) {
      setError("Please fill in all fields")
      return
    }

    const age = parseInt(formData.age)
    if (age < 18 || age > 120) {
      setError("Please enter an age between 18 and 120")
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
            <h1 className="text-3xl font-bold text-gray-900">Let's Get Started</h1>
            <p className="text-lg text-gray-600">Please provide some basic information to personalize your assessment.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="h-4 w-4" />
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="120"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    required
                    className="text-base"
                  />
                  <p className="text-xs text-gray-500">Must be between 18 and 120 years old</p>
                </div>

                {/* Sex */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm sm:text-base">
                    <User className="h-4 w-4" />
                    Sex Assigned at Birth
                  </Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) => handleInputChange("sex", value)}
                  >
                    <SelectTrigger className="text-base">
                      <SelectValue placeholder="Select your sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Navigation */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg"
                  >
                    Continue to Medical History
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs sm:text-sm text-gray-500">
            🔒 Your information is completely confidential and will never be shared.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DemographicsPage
