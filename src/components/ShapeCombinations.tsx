"use client"

import { SHAPE_COLORS } from "./DynamicShapes"

type ShapeRenderer = (color: string) => JSX.Element

const SHAPE_VARIANTS: { key: string; render: ShapeRenderer }[] = [
  {
    key: "filled-circle",
    render: (color) => <circle cx="12" cy="12" r="8" fill={color} />,
  },
  {
    key: "outline-circle",
    render: (color) => (
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    ),
  },
  {
    key: "filled-square",
    render: (color) => <rect x="6" y="6" width="12" height="12" fill={color} />,
  },
  {
    key: "outline-square",
    render: (color) => (
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
    ),
  },
  {
    key: "cross",
    render: (color) => (
      <>
        <line
          x1="12"
          y1="6"
          x2="12"
          y2="18"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="6"
          y1="12"
          x2="18"
          y2="12"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </>
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1 pointer-events-none">
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
