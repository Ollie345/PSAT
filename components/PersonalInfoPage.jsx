"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Calendar, Heart, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"

const PersonalInfoPage = ({ personalInfo, onPersonalInfoChange, onSubmit, onPrevious, isSubmitting, error }) => {
  const handleSelectChange = (field, value) => {
    onPersonalInfoChange({ target: { name: field, value } })
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 sm:space-y-6 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Almost Done!</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">Just a few details to personalize your results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Doe"
                value={personalInfo.name}
                onChange={onPersonalInfoChange}
                required
                className="text-base"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm sm:text-base">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={personalInfo.email}
                onChange={onPersonalInfoChange}
                required
                className="text-base"
              />
              <p className="text-xs text-gray-500">We'll send your detailed results here</p>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="h-4 w-4" />
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="18"
                max="100"
                placeholder="45"
                value={personalInfo.age}
                onChange={onPersonalInfoChange}
                required
                className="text-base"
              />
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm sm:text-base">
                <Heart className="h-4 w-4" />
                Marital Status
              </Label>
              <Select
                value={personalInfo.marital_status}
                onValueChange={(value) => handleSelectChange("marital_status", value)}
              >
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="Select your marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="partnered">In a relationship</SelectItem>
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
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
              <Button
                type="button"
                onClick={onPrevious}
                variant="outline"
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Questions
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 w-full sm:w-auto"
              >
                {isSubmitting ? "Getting Results..." : "Get My Results"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs sm:text-sm text-gray-500 px-4">
        🔒 Your information is completely confidential and will never be shared.
      </p>
    </div>
  )
}

export default PersonalInfoPage
