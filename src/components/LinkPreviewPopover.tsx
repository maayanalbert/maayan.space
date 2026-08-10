import LinkPreviewCard, { type LinkPreviewVariant } from "./LinkPreviewCard"
import GenieEnterAnimation from "./GenieEnterAnimation"
import { useLinkPreviewMeta } from "@/hooks/useLinkPreviewMeta"
import { useToggles } from "toggletation"
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

const BROWSER_VARIANTS = new Set<LinkPreviewVariant>(["browser", "browserLeft"])
const VIEWPORT_EDGE = 12

type Props = {
  href: string
  text: string
  visible: boolean
  top: number
  left: number
  centered?: boolean
  variant: LinkPreviewVariant
  accent: string
  highlight: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function LinkPreviewPopover({
  href,
  text,
  visible,
  top,
  left,
  centered,
  variant,
  accent,
  highlight,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const { getValue } = useToggles()
  const [mounted, setMounted] = useState(false)
  const [genieKey, setGenieKey] = useState(0)
  const [adjustedLeft, setAdjustedLeft] = useState(left)
  const portalRef = useRef<HTMLDivElement>(null)
  const { meta, loading } = useLinkPreviewMeta(href, text)
  const isBrowser = BROWSER_VARIANTS.has(variant)
  const enterAnim = isBrowser
    ? String(getValue("browserPreviewAnim") || "slide")
    : "slide"
  const useGenie = enterAnim === "genie"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (visible && useGenie) setGenieKey((k) => k + 1)
  }, [visible, useGenie, href])

  // Keep the preview inside the viewport horizontally (esp. on mobile).
  // Uses offsetWidth so enter-animation transforms don't skew the measurement.
  useLayoutEffect(() => {
    if (!visible) {
      setAdjustedLeft(left)
      return
    }

    const el = portalRef.current
    if (!el) return

    const clampToViewport = () => {
      const card = el.querySelector<HTMLElement>(".link-preview")
      const width = card?.offsetWidth || el.offsetWidth
      if (width < 1) return

      const vw = window.innerWidth
      const maxRight = vw - VIEWPORT_EDGE
      let next = left
      const visualLeft = centered ? next - width / 2 : next
      const visualRight = visualLeft + width

      if (visualRight > maxRight) {
        next = centered ? maxRight - width / 2 : maxRight - width
      }
      const nextVisualLeft = centered ? next - width / 2 : next
      if (nextVisualLeft < VIEWPORT_EDGE) {
        next = centered ? VIEWPORT_EDGE + width / 2 : VIEWPORT_EDGE
      }

      setAdjustedLeft(next)
    }

    clampToViewport()

    const ro = new ResizeObserver(clampToViewport)
    const card = el.querySelector<HTMLElement>(".link-preview")
    if (card) ro.observe(card)
    else ro.observe(el)
    window.addEventListener("resize", clampToViewport)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", clampToViewport)
    }
  }, [
    visible,
    left,
    top,
    href,
    variant,
    centered,
    loading,
    meta.fetched,
    meta.title,
  ])

  if (!visible || !mounted) return null

  const card = (
    <LinkPreviewCard
      variant={variant}
      meta={meta}
      accent={accent}
      highlight={highlight}
      href={href}
      loading={loading}
    />
  )

  const animClass = useGenie ? "genie" : enterAnim

  const openHref = () => {
    // Browser variants open via their own scroll-safe pointer gesture.
    if (isBrowser) return
    window.open(href, "_blank", "noopener,noreferrer")
  }

  const node: ReactNode = (
    <div
      ref={portalRef}
      data-link-preview-portal=""
      className={`link-preview-portal link-preview-portal--anim-${animClass}${centered ? " link-preview-portal--centered" : ""}`}
      style={{ top, left: adjustedLeft }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={isBrowser ? undefined : openHref}
    >
      {useGenie ? (
        <GenieEnterAnimation
          active
          anchorX={centered ? 0.5 : 0}
          replayKey={genieKey}
        >
          {card}
        </GenieEnterAnimation>
      ) : (
        card
      )}
    </div>
  )

  return createPortal(node as never, document.body)
}
