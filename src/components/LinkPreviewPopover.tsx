import LinkPreviewCard, { type LinkPreviewVariant } from "./LinkPreviewCard"
import GenieEnterAnimation from "./GenieEnterAnimation"
import { useLinkPreviewMeta } from "@/hooks/useLinkPreviewMeta"
import { useToggles } from "toggletation"
import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

const BROWSER_VARIANTS = new Set<LinkPreviewVariant>(["browser", "browserLeft"])

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
  onMouseEnter: () => void
  onMouseLeave: () => void
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

  const node: ReactNode = (
    <div
      className={`link-preview-portal link-preview-portal--anim-${animClass}${centered ? " link-preview-portal--centered" : ""}`}
      style={{ top, left }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
