"use client"

import { SHAPE_COLORS } from "./DynamicShapes"

type ShapeRenderer = (color: string) => JSX.Element

const SHAPE_VARIANTS: { key: string; render: ShapeRenderer }[] = [
  {
    key: "filled-circle",
    render: (color) => (
      <circle
        cx="12"
        cy="12"
        r="10"
        color={color}
        stroke={color}
        strokeWidth="1"
        fill="transparent"
      />
    ),
  },
  {
    key: "filled-square",
    render: (color) => (
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        stroke={color}
        strokeWidth="1"
        fill="transparent"
      />
    ),
  },
]

export function ShapeCombinations() {
  const combinations = SHAPE_VARIANTS.flatMap((variant) =>
    SHAPE_COLORS.map((color) => ({
      key: `${variant.key}-${color}`,
      render: variant.render(color),
    }))
  )

  return (
    <div className="fixed bottom-0 right-3 z-50 flex flex-row items-end gap-1 pointer-events-none">
      {combinations.map(({ key, render }) => (
        <div
          key={key}
          className="w-9 h-9 flex items-center justify-center"
          aria-hidden
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            role="presentation"
            className="shrink-0"
          >
            {render}
          </svg>
        </div>
      ))}
    </div>
  )
}
