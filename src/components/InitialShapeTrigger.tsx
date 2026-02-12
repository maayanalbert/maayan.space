"use client"

import { FolderLock } from "lucide-react"
import * as Tooltip from "@radix-ui/react-tooltip"

interface InitialShapeTriggerProps {
  onStart?: () => void
  hidden?: boolean
  isBlackMode?: boolean
}

export function InitialShapeTrigger({
  onStart,
  hidden = false,
  isBlackMode = false,
}: InitialShapeTriggerProps) {
  const baseStyles = "fixed right-28 flex items-center justify-center p-1 z-50"
  const interactionStyles =
    "transition-all group duration-200 ease-in-out pointer-events-auto will-change-transform will-change-opacity"
  const visibilityStyles = hidden
    ? "pointer-events-none scale-0"
    : `scale-100 hover:scale-125`

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            id="initial-shape-trigger"
            aria-label="Secrets manager"
            className={`${baseStyles} ${
              isBlackMode ? "top-[72px]" : "bottom-[72px]"
            }`}
            onClick={() => onStart?.()}
            type="button"
          >
            <div
              className={`${interactionStyles} ${visibilityStyles} text-3xl`}
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
