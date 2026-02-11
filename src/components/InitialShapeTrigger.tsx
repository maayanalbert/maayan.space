"use client"

import { FolderLock } from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"

interface InitialShapeTriggerProps {
  onStart?: () => void
  hidden?: boolean
}

export function InitialShapeTrigger({
  onStart,
  hidden = false,
}: InitialShapeTriggerProps) {
  const baseStyles =
    "fixed top-24 right-60 flex items-center justify-center p-1"
  const interactionStyles =
    "transition-all group duration-200 ease-in-out pointer-events-auto will-change-transform will-change-opacity"
  const visibilityStyles = hidden
    ? "pointer-events-none scale-0"
    : "scale-100 hover:scale-125 opacity-40 hover:opacity-100"

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            id="initial-shape-trigger"
            aria-label="Secrets manager"
            className={`${baseStyles}`}
            onClick={() => onStart?.()}
            type="button"
          >
            <div
              className={`${interactionStyles} ${visibilityStyles} text-2xl`}
            >
              🤫
            </div>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={10}
            className="z-[100] rounded-md bg-black/5 px-2 py-1 text-xs text-black shadow-md"
          >
            Secrets manager
            <Tooltip.Arrow className="fill-black/5" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
