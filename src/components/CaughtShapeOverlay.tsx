"use client"

import React, { useCallback, useState } from "react"
import { ShapeModal, getSecretForShape } from "./ShapeModal"

export type CaughtShape = {
  x: number
  y: number
  size: number
  shapeType: number
  clr: string
}

/** A caught shape with a unique id for keying React elements. */
export type CollectedShape = CaughtShape & { id: number }

/* ------------------------------------------------------------------ */
/*  Card-stack constants                                               */
/* ------------------------------------------------------------------ */

const SHAPE_SIZE = 50 // rendered size of each shape
const CIRCLE_SPACING = 30 // tighter spacing for circles
const SQUARE_SPACING = 50 // more spacing for squares
const LEFT_OFFSET_MORE = -22 // more hidden (even indices)
const LEFT_OFFSET_LESS = -22 // more visible (odd indices)

/* ------------------------------------------------------------------ */
/*  Single collected shape – rendered inline                           */
/* ------------------------------------------------------------------ */

function ShapeIcon({ shape }: { shape: CollectedShape }) {
  const strokeWidth = 2

  const isFilled = shape.shapeType === 0 || shape.shapeType === 2
  const isCircle = shape.shapeType === 0 || shape.shapeType === 1
  const isSquare = shape.shapeType === 2 || shape.shapeType === 3

  const outerGap = isFilled ? 1.5 : strokeWidth * 0.5 + 1.5
  // viewBox needs room for the outer ring – ensure even size so center lands on a whole pixel
  const vb = Math.ceil((SHAPE_SIZE + outerGap * 2 + 2) / 2) * 2
  const center = vb / 2
  const r = SHAPE_SIZE / 2

  return (
    <svg
      width={vb}
      height={vb}
      viewBox={`0 0 ${vb} ${vb}`}
      aria-hidden="true"
      style={{ display: "block", transform: "rotate(30deg)" }}
    >
      {/* Outer black ring */}
      {isCircle ? (
        <circle
          cx={center}
          cy={center}
          r={r + outerGap}
          fill="none"
          stroke="black"
          strokeWidth={1}
        />
      ) : (
        <rect
          x={center - r - outerGap}
          y={center - r - outerGap}
          width={SHAPE_SIZE + outerGap * 2}
          height={SHAPE_SIZE + outerGap * 2}
          fill="none"
          stroke="black"
          strokeWidth={1}
        />
      )}

      {/* Main shape */}
      {isCircle ? (
        <circle
          cx={center}
          cy={center}
          r={r}
          fill={isFilled ? shape.clr : "black"}
          stroke={shape.clr}
          strokeWidth={isFilled ? 0 : strokeWidth}
        />
      ) : (
        <rect
          x={center - r}
          y={center - r}
          width={SHAPE_SIZE}
          height={SHAPE_SIZE}
          fill={isFilled ? shape.clr : "black"}
          stroke={shape.clr}
          strokeWidth={isFilled ? 0 : strokeWidth}
        />
      )}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Collection shelf – fixed on the left edge, vertically centered     */
/* ------------------------------------------------------------------ */

const isShapeSquare = (shapeType: number) => shapeType === 2 || shapeType === 3
const spacingForShape = (shapeType: number) =>
  isShapeSquare(shapeType) ? SQUARE_SPACING : CIRCLE_SPACING

function shapeName(shapeType: number): string {
  const isFilled = shapeType === 0 || shapeType === 2
  const isCircle = shapeType === 0 || shapeType === 1
  return `${isFilled ? "Filled" : "Outlined"} ${isCircle ? "circle" : "square"}`
}

export function CollectedShapesShelf({ shapes }: { shapes: CollectedShape[] }) {
  const [activeShape, setActiveShape] = useState<CollectedShape | null>(null)

  const handleShapeClick = useCallback((shape: CollectedShape) => {
    setActiveShape(shape)
  }, [])

  const handleClose = useCallback(() => {
    setActiveShape(null)
  }, [])

  if (shapes.length === 0) return null

  // Compute cumulative top positions based on each shape's type
  const tops: number[] = [0]
  for (let i = 1; i < shapes.length; i++) {
    tops[i] = tops[i - 1] + spacingForShape(shapes[i].shapeType)
  }
  const stackHeight = SHAPE_SIZE + (tops[tops.length - 1] ?? 0)

  return (
    <>
      <div
        className="fixed z-[70] pointer-events-none left-0 top-[72px]"
        style={{
          width: SHAPE_SIZE + 80,
          height: stackHeight,
        }}
      >
        {shapes.map((shape, i) => {
          const offset = i % 2 === 0 ? LEFT_OFFSET_MORE : LEFT_OFFSET_LESS
          return (
            <div
              key={shape.id}
              className="shelf-shape-card absolute flex items-center pointer-events-auto cursor-pointer will-change-transform"
              style={{
                top: tops[i],
                left: offset,
              }}
              onClick={() => handleShapeClick(shape)}
            >
              <ShapeIcon shape={shape} />
              <span className="shelf-shape-label ml-6 text-base whitespace-nowrap pointer-events-none text-white">
                {getSecretForShape(shape.shapeType, shape.clr)?.title ?? shapeName(shape.shapeType)}
              </span>
            </div>
          )
        })}
      </div>
      {activeShape ? (
        <ShapeModal shape={activeShape} onClose={handleClose} />
      ) : null}
    </>
  )
}
