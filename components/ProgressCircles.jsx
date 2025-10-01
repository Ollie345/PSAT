"use client"

import { Check } from "lucide-react"

const ProgressCircles = ({ activeCircle }) => {
  const circles = [
    { number: 1, label: "Demographics" },
    { number: 2, label: "Medical History" },
    { number: 3, label: "Symptoms" },
    { number: 4, label: "Results" }
  ]

  // Don't show progress circles on landing page
  if (activeCircle === 0) return null

  return (
    <div className="flex justify-center items-center space-x-4 py-4">
      {circles.map((circle, index) => (
        <div key={circle.number} className="flex items-center">
          {/* Circle */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              circle.number < activeCircle
                ? "bg-green-500 text-white"
                : circle.number === activeCircle
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {circle.number < activeCircle ? (
              <Check className="w-5 h-5" />
            ) : (
              circle.number
            )}
          </div>

          {/* Label */}
          <span
            className={`ml-2 text-xs font-medium ${
              circle.number <= activeCircle ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {circle.label}
          </span>

          {/* Connector line (except for last circle) */}
          {index < circles.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-4 transition-colors duration-300 ${
                circle.number < activeCircle ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ProgressCircles
