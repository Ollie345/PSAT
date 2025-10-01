"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

const LandingPage = ({ onStartAssessment }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Header Badge */}
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">
            🩺 Free 3-Minute Prostate Check
          </Badge>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Understanding Your <span className="text-blue-600">Prostate Health</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Take this quick I-PSS assessment to understand your urinary symptoms and when to consult a healthcare provider.
            </p>
          </div>

          {/* Simple Benefits */}
          <Card className="max-w-2xl mx-auto mx-4 sm:mx-auto">
            <CardContent className="p-6 sm:p-8 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Get clarity in 3 minutes:</h2>
              <div className="space-y-2 text-gray-700">
                <p>✅ Understand your urinary symptoms</p>
                <p>✅ Get your I-PSS score and severity level</p>
                <p>✅ Know when to consult a healthcare provider</p>
              </div>
            </CardContent>
          </Card>

          {/* Single Testimonial */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-lg max-w-2xl mx-auto mx-4 sm:mx-auto">
            <p className="text-gray-700 italic mb-3">
              "The assessment helped me understand my symptoms and know when to see a urologist."
            </p>
            <p className="text-blue-700 font-semibold">— Michael, 52</p>
          </div>

          {/* CTA */}
          <Card className="max-w-xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white mx-4 sm:mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold mb-3">Ready to get answers?</h2>
              <Button
                onClick={onStartAssessment}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-lg w-full sm:w-auto"
              >
                Start Free Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Trust Line */}
          <p className="text-sm text-gray-600">🔒 Completely private • 💯 Free • ⚡ Takes 3 minutes</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
