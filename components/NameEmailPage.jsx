"use client"

import ProgressBar from "./ProgressBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react"

const NameEmailPage = ({ contactInfo, onChange, onSubmit, onPrevious, isSubmitting, error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto space-y-6">
          <ProgressBar activeStep={3} />
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Send Results</h1>
            <p className="text-lg text-gray-600">Enter your details to view and receive your results</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Jane Doe"
                    value={contactInfo.fullName}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={contactInfo.email}
                    onChange={onChange}
                    required
                  />
                  <p className="text-xs text-gray-500">We'll send your detailed results here</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

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
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Get My Results"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              <p className="text-center text-xs sm:text-sm text-gray-500 pt-4">
                🔒 Your information is completely confidential and will never be shared.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NameEmailPage


