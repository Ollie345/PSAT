import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Evenly split N questions across 4 steps; returns active step 1..4.
// For N=0, default to step 1.
export function computeFourStepFromIndex(currentIndex: number, totalCount: number): 1 | 2 | 3 | 4 {
  if (!Number.isFinite(totalCount) || totalCount <= 0) return 1
  const clampedIndex = Math.min(Math.max(currentIndex, 0), Math.max(totalCount - 1, 0))
  const perStep = totalCount / 4
  // Use 0-based buckets, then map to 1..4; ensure the last index maps to 4
  const bucket = Math.min(3, Math.floor(clampedIndex / perStep))
  return (bucket + 1) as 1 | 2 | 3 | 4
}
