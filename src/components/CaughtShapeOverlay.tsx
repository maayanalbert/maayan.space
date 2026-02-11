"use client"

import React from "react"

export type CaughtShape = {
  x: number
  y: number
  size: number
  shapeType: number
  clr: string
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function CaughtShapeOverlay({
  shape,
  className,
}: {
  shape: CaughtShape | null
  className?: string
}) {
  if (!shape) return null

  // The p5 sketch uses roughly 10-20px sizes. Enlarge aggressively for the "caught" moment.
  const displaySize = clamp(shape.size * 6, 84, 260)
  const strokeWidth = 6
  const pad = 14
  const inner = 100 - pad * 2

  const isFilled = shape.shapeType === 0 || shape.shapeType === 2
  const isCircle = shape.shapeType === 0 || shape.shapeType === 1
  const isSquare = shape.shapeType === 2 || shape.shapeType === 3
  const isPlus = shape.shapeType === 4

  return (
    <div
      className={["fixed z-[60] pointer-events-none", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        left: shape.x,
        top: shape.y,
        width: displaySize,
        height: displaySize,
        transform: "translate(-50%, -50%)",
        willChange: "opacity",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {isCircle ? (
          <circle
            cx="50"
            cy="50"
            r={inner * 0.5}
            fill={isFilled ? shape.clr : "transparent"}
            stroke={shape.clr}
            strokeWidth={isFilled ? 0 : strokeWidth}
          />
        ) : null}

        {isSquare ? (
          <rect
            x={pad}
            y={pad}
            width={inner}
            height={inner}
            fill={isFilled ? shape.clr : "transparent"}
            stroke={shape.clr}
            strokeWidth={isFilled ? 0 : strokeWidth}
          />
        ) : null}

        {isPlus ? (
          <>
            <line
              x1="50"
              y1={pad}
              x2="50"
              y2={100 - pad}
              stroke={shape.clr}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <line
              x1={pad}
              y1="50"
              x2={100 - pad}
              y2="50"
              stroke={shape.clr}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </>
        ) : null}
      </svg>
    </div>
  )
}

