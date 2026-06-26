const SLIDE_END = 0.5
const TRANSLATE_START = 0.4
export const GENIE_DURATION_MS = 560
const PATH_STEPS = 28

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function quadEaseInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function quadBezier(x0: number, x1: number, x2: number, t: number) {
  const mt = 1 - t
  return mt * mt * x0 + 2 * mt * t * x1 + t * t * x2
}

type GenieFrame = {
  topY: number
  bottomY: number
  bottomLeftX: number
  bottomRightX: number
  topLeftX: number
  topRightX: number
  leftControlX: number
  rightControlX: number
}

/** Expand-from-anchor genie frame (reverse of dock minimize). */
export function computeGenieFrame(progress: number, width: number, height: number, anchorX = 0.5): GenieFrame {
  const p = clamp(progress, 0, 1)
  const slideProgress = clamp(p / SLIDE_END, 0, 1)
  const translateProgress = clamp((p - TRANSLATE_START) / (1 - TRANSLATE_START), 0, 1)

  const anchorPx = anchorX * width
  const bottomY = height
  const topY = lerp(height, 0, quadEaseInOut(translateProgress))

  const bottomLeftX = lerp(anchorPx, 0, quadEaseInOut(slideProgress))
  const bottomRightX = lerp(anchorPx, width, quadEaseInOut(slideProgress))
  const topLeftX = 0
  const topRightX = width

  // Side bulge peaks mid-animation — the signature genie "liquid funnel" curve.
  const bulge = Math.sin(p * Math.PI) * width * 0.14
  const leftControlX = Math.min(topLeftX, bottomLeftX) - bulge
  const rightControlX = Math.max(topRightX, bottomRightX) + bulge

  return {
    topY,
    bottomY,
    bottomLeftX,
    bottomRightX,
    topLeftX,
    topRightX,
    leftControlX,
    rightControlX,
  }
}

function leftEdgeX(frame: GenieFrame, y: number) {
  if (y >= frame.bottomY) return frame.bottomLeftX
  if (y <= frame.topY) return frame.topLeftX
  const t = (frame.bottomY - y) / (frame.bottomY - frame.topY)
  return quadBezier(frame.bottomLeftX, frame.leftControlX, frame.topLeftX, t)
}

function rightEdgeX(frame: GenieFrame, y: number) {
  if (y >= frame.bottomY) return frame.bottomRightX
  if (y <= frame.topY) return frame.topRightX
  const t = (frame.bottomY - y) / (frame.bottomY - frame.topY)
  return quadBezier(frame.bottomRightX, frame.rightControlX, frame.topRightX, t)
}

/** SVG path for clip-path — curved sides, anchor at bottom. */
export function computeGenieClipPath(
  progress: number,
  width: number,
  height: number,
  anchorX = 0.5
): string {
  if (progress >= 1) return "none"
  if (progress <= 0) {
    const ax = anchorX * width
    return `path("M ${ax} ${height} L ${ax} ${height} Z")`
  }

  const frame = computeGenieFrame(progress, width, height, anchorX)
  if (frame.topY >= frame.bottomY - 0.5) {
    const ax = anchorX * width
    return `path("M ${ax} ${height} L ${ax} ${height} Z")`
  }

  const pts: string[] = []
  for (let i = 0; i <= PATH_STEPS; i++) {
    const t = i / PATH_STEPS
    const y = lerp(frame.bottomY, frame.topY, t)
    const x = leftEdgeX(frame, y)
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  for (let i = PATH_STEPS; i >= 0; i--) {
    const t = i / PATH_STEPS
    const y = lerp(frame.bottomY, frame.topY, t)
    const x = rightEdgeX(frame, y)
    pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return `path("M ${pts.join(" L ")} Z")`
}

/** Slice transforms for optional mesh rendering (more accurate warp). */
export function computeGenieSlices(
  progress: number,
  width: number,
  height: number,
  anchorX = 0.5,
  rowCount = 50
): { y: number; h: number; scaleX: number; translateX: number }[] {
  const frame = computeGenieFrame(progress, width, height, anchorX)
  const slices: { y: number; h: number; scaleX: number; translateX: number }[] = []

  if (frame.topY >= frame.bottomY - 0.5 || progress <= 0) {
    return slices
  }

  const sliceH = height / rowCount

  for (let i = 0; i < rowCount; i++) {
    const yMid = (i + 0.5) * sliceH
    if (yMid < frame.topY || yMid > frame.bottomY) continue

    const left = leftEdgeX(frame, yMid)
    const right = rightEdgeX(frame, yMid)
    const sliceWidth = Math.max(0.5, right - left)
    const scaleX = sliceWidth / width
    const anchorPx = anchorX * width
    const translateX = left - anchorPx * (1 - scaleX)

    slices.push({ y: i * sliceH, h: sliceH, scaleX, translateX })
  }

  return slices
}

export function genieEaseProgress(elapsedMs: number) {
  return clamp(elapsedMs / GENIE_DURATION_MS, 0, 1)
}
