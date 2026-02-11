"use client"

import { Gamepad2 } from "lucide-react"

interface InitialShapeTriggerProps {
  onStart?: () => void
  hidden?: boolean
}

export function InitialShapeTrigger({
  onStart,
  hidden = false,
}: InitialShapeTriggerProps) {
  const baseStyles =
    "fixed top-3 right-3 w-8 h-8 flex items-center justify-center bg-[rgb(255,70,100)]"
  const interactionStyles =
    "transition-transform group duration-200 ease-in-out pointer-events-auto will-change-transform will-change-opacity"
  const visibilityStyles = hidden
    ? "pointer-events-none scale-0"
    : "scale-100 hover:scale-125"

  return (
    <button
      aria-label="Start shapes"
      className={`${baseStyles} ${interactionStyles} ${visibilityStyles}`}
      onClick={() => onStart?.()}
      type="button"
    >
      <Gamepad2
        className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 delay-0 ease-in-out"
        fill="transparent"
        color="white"
        height={20}
        width={20}
      />
    </button>
  )
}
