"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function ProcessingPage() {
  const shouldReduce = useReducedMotion()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <motion.div
            className="h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"
            animate={shouldReduce ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <h1 className="text-2xl font-bold text-gray-900">Please wait</h1>
          <p className="text-gray-600">We’re getting your results ready…</p>
        </div>
      </div>
    </div>
  )
}


