import React, { useEffect, useMemo, useState } from "react"

// --- Types ---------------------------------------------------------------
export type Step = {
  id: string | number
  title: string
  subtitle?: string
}

// --- Icons (SVG) --------------------------------------------------------
// Matches the tiny bordered squares you had in the left rail
function RailIconStart({ active }: { active?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="shrink-0"
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="2"
        ry="2"
        fill="none"
        className={active ? "stroke-stone-800" : "stroke-stone-400"}
        strokeWidth="1.3333"
      />
      <rect
        x="6"
        y="6"
        width="4"
        height="4"
        fill="none"
        className={active ? "stroke-stone-800" : "stroke-stone-400"}
        strokeWidth="1.3333"
      />
    </svg>
  )
}

function RailIconDot({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="2"
        ry="2"
        fill="none"
        className={active ? "stroke-stone-800" : "stroke-stone-400"}
        strokeWidth="1.3333"
      />
    </svg>
  )
}

// --- Primitive building blocks -----------------------------------------
function RailDivider() {
  return <div className="w-px h-8 bg-stone-200" />
}

function RailItem({
  kind,
  active,
}: {
  kind: "start" | "dot"
  active?: boolean
}) {
  return (
    <div className="flex h-8 w-4 items-center justify-center">
      {kind === "start" ? (
        <RailIconStart active={active} />
      ) : (
        <RailIconDot active={active} />
      )}
    </div>
  )
}

function StepCard({
  title,
  subtitle,
  active,
  onMouseEnter,
  onMouseLeave,
}: {
  title: string
  subtitle?: string
  active?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  return (
    <div
      className={[
        "flex w-full flex-col gap-0 p-2 rounded",
        active ? "bg-black/5" : "bg-transparent",
      ].join(" ")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      aria-pressed={!!active}
    >
      <div className="text-[12px] leading-4 font-medium text-stone-900">
        {title}
      </div>
      {subtitle ? (
        <div className="text-[12px] leading-4 text-stone-600">{subtitle}</div>
      ) : null}
    </div>
  )
}

// --- Composite components ------------------------------------------------
function StepRail({
  count,
  activeIndex,
}: {
  count: number
  activeIndex: number
}) {
  return (
    <div className="flex h-[240px] w-4 flex-col items-center py-2">
      {/* First item */}
      <RailItem kind="start" active={activeIndex === 0} />
      <RailDivider />
      {Array.from({ length: count - 1 }).map((_, i) => {
        const idx = i + 1
        const isLast = idx === count - 1
        return (
          <React.Fragment key={idx}>
            <RailItem kind="dot" active={activeIndex === idx} />
            {!isLast && <RailDivider />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function StepsList({
  steps,
  activeIndex,
  onHoverIndex,
}: {
  steps: Step[]
  activeIndex: number
  onHoverIndex: (i: number | null) => void
}) {
  return (
    <div className="flex h-[240px] w-[232.8px] flex-col items-start gap-4">
      {steps.map((s, i) => (
        <StepCard
          key={s.id}
          title={s.title}
          subtitle={s.subtitle}
          active={i === activeIndex}
          onMouseEnter={() => onHoverIndex(i)}
          onMouseLeave={() => onHoverIndex(null)}
        />
      ))}
    </div>
  )
}

// --- Turnkey layout you can drop in -------------------------------------
export default function StepsPanelDemo() {
  // Load Inter the way your original sample did
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const steps = useMemo<Step[]>(
    () => [
      {
        id: 1,
        title: "Stagehand Config",
        subtitle: "Configuration for Stagehand",
      },
      { id: 2, title: "Navigate", subtitle: "Navigated to flights.google.com" },
      { id: 3, title: "Click", subtitle: "Clicked the round trip dropdown" },
      { id: 4, title: "Click", subtitle: "Clicked the round trip dropdown" },
    ],
    []
  )

  // Hover state drives both the card highlight and the rail highlight
  const [hoveredIndex, setHoveredIndex] = useState<number>(1) // default matches your highlighted Container C

  return (
    <div
      className="flex h-[240px] w-[252.8px] flex-row items-center gap-1 antialiased"
      style={{
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif",
      }}
    >
      <StepRail count={steps.length} activeIndex={hoveredIndex ?? -1} />
      <StepsList
        steps={steps}
        activeIndex={hoveredIndex ?? -1}
        onHoverIndex={(i) => setHoveredIndex(i ?? -1)}
      />
    </div>
  )
}

// --- Usage notes ---------------------------------------------------------
// 1) Swap out StepsPanelDemo with your data by passing a different `steps` array
//    into <StepsList /> and keep the same layout, or create your own wrapper.
// 2) If you want click-selection instead of hover, lift state up and pass
//    `activeIndex` from clicks. The primitives (StepCard, StepRail) are agnostic.
// 3) The measurements/colors mirror your Figma export; tweak Tailwind tokens as needed.
