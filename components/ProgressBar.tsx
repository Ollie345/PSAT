"use client"

import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "framer-motion"

type ProgressBarProps = {
  activeStep: 1 | 2 | 3 | 4
  currentIndex?: number
  totalCount?: number
  className?: string
}

const labels = ["Start", "Questions", "Details", "Summary"]

export default function ProgressBar({ activeStep, currentIndex, totalCount, className }: ProgressBarProps) {
  // Within-step progress applies only to step 3 (Questions)
  const total = Number.isFinite(totalCount) && (totalCount as number) > 0 ? (totalCount as number) : 0
  const idx = typeof currentIndex === "number" ? currentIndex : 0
  const within = activeStep === 3 && total > 0 ? Math.min(1, Math.max(0, (idx + 1) / total)) : 0

  const perConnector = 100 / 3
  const fill =
    activeStep <= 1 ? 0 :
    activeStep === 2 ? perConnector :
    activeStep === 3 ? perConnector + within * perConnector :
    100

  const shouldReduce = useReducedMotion()

  return (
    <div className={cn("w-full px-4 py-3", className)}>
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-8 right-8 top-[16px] h-1 bg-gray-200 rounded" aria-hidden="true" />
        <motion.div
          className="absolute left-8 top-[16px] h-1 bg-blue-600 rounded"
          style={{ width: 0 }}
          animate={shouldReduce ? { width: `calc(${fill}% - 16px)` } : {
            width: `calc(${fill}% - 16px)`,
            transition: { type: "spring", stiffness: 120, damping: 20 }
          }}
          aria-hidden="true"
        />

        <ol className="relative grid grid-cols-4 items-center gap-2 sm:gap-4">
          {[1, 2, 3, 4].map((step, i) => {
            const isCompleted = step < activeStep
            const isActive = step === activeStep
            return (
              <li key={step} className="flex flex-col items-center text-center">
                <motion.div
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300",
                    isCompleted && "bg-emerald-500 text-white",
                    isActive && !isCompleted && "bg-blue-600 text-white ring-2 ring-blue-300",
                    !isActive && !isCompleted && "bg-gray-200 text-gray-600"
                  )}
                  animate={isActive && !shouldReduce ? { scale: 1.06 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? "✓" : step}
                </motion.div>
                <span
                  className={cn(
                    "mt-2 text-[10px] sm:text-xs font-medium",
                    isCompleted || isActive ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {labels[i]}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}


