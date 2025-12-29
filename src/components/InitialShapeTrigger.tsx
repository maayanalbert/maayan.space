"use client"

interface InitialShapeTriggerProps {
  onStart?: () => void
  hidden?: boolean
}

export function InitialShapeTrigger({
  onStart,
  hidden = false,
}: InitialShapeTriggerProps) {
  const baseStyles =
    "fixed top-6 right-6 w-10 h-10 rounded-sm flex items-center justify-center bg-[rgb(255,70,100)]"
  const interactionStyles =
    "transition-transform duration-200 ease-out pointer-events-auto active:scale-105 will-change-transform will-change-opacity"
  const visibilityStyles = hidden
    ? "pointer-events-none scale-0"
    : "scale-100 hover:scale-110"

  return (
    <button
      aria-label="Start shapes"
      className={`${baseStyles} ${interactionStyles} ${visibilityStyles}`}
      onClick={() => onStart?.()}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="#ffd3dc"
        aria-hidden="true"
      >
        <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
      </svg>
    </button>
  )
}
