import {
  GENIE_DURATION_MS,
  computeGenieClipPath,
  computeGenieSlices,
  genieEaseProgress,
} from "@/lib/genieEffect"
import { useEffect, useRef, useState, type ReactNode } from "react"

const SLICE_COUNT = 50

type Props = {
  active: boolean
  /** 0 = left edge anchor, 0.5 = center */
  anchorX?: number
  replayKey?: number
  children: ReactNode
}

export default function GenieEnterAnimation({
  active,
  anchorX = 0.5,
  replayKey = 0,
  children,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [finished, setFinished] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!active || finished) return
    const measure = measureRef.current
    if (!measure) return

    const update = () => {
      setSize({ width: measure.offsetWidth, height: measure.offsetHeight })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(measure)
    return () => ro.disconnect()
  }, [active, finished, replayKey, children])

  useEffect(() => {
    if (!active) return
    const root = rootRef.current
    if (!root) return

    setFinished(false)
    let raf = 0
    let start: number | null = null

    const tick = (now: number) => {
      if (start === null) start = now
      const progress = genieEaseProgress(now - start)
      const width = size.width || root.getBoundingClientRect().width
      const height = size.height || root.getBoundingClientRect().height

      if (width < 1 || height < 1) {
        raf = requestAnimationFrame(tick)
        return
      }

      root.style.clipPath = computeGenieClipPath(progress, width, height, anchorX)

      const rows = root.querySelectorAll<HTMLElement>(".genie-slice")
      const slices = computeGenieSlices(progress, width, height, anchorX, rows.length)

      rows.forEach((row, index) => {
        const slice = slices[index]
        const strip = row.querySelector<HTMLElement>(".genie-slice-strip")
        if (!slice || !strip) {
          row.style.visibility = "hidden"
          return
        }

        row.style.visibility = "visible"
        row.style.top = `${slice.y}px`
        row.style.height = `${slice.h}px`
        strip.style.transformOrigin = `${anchorX * width}px ${height - slice.y}px`
        strip.style.transform = `translateX(${slice.translateX}px) scaleX(${slice.scaleX})`
      })

      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        root.style.clipPath = "none"
        setFinished(true)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, anchorX, replayKey, size.width, size.height])

  const showMesh = !finished

  return (
    <div
      ref={rootRef}
      className={`genie-enter${finished ? " genie-enter--done" : ""}${showMesh ? " genie-enter--mesh" : ""}`}
    >
      {showMesh ? (
        <>
          <div ref={measureRef} className="genie-measure" aria-hidden="true">
            {children}
          </div>
          <div
            className="genie-slices"
            style={
              size.height > 0
                ? { width: size.width, height: size.height }
                : undefined
            }
          >
            {Array.from({ length: SLICE_COUNT }, (_, i) => (
              <div key={i} className="genie-slice">
                <div className="genie-slice-strip">
                  <div className="genie-slice-content">{children}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        children
      )}
    </div>
  )
}

export { GENIE_DURATION_MS }
