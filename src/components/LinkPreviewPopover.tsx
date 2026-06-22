import LinkPreviewCard, { type LinkPreviewVariant } from "./LinkPreviewCard"
import { useLinkPreviewMeta } from "@/hooks/useLinkPreviewMeta"
import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

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
  const [mounted, setMounted] = useState(false)
  const { meta, loading } = useLinkPreviewMeta(href, text)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!visible || !mounted) return null

  const node: ReactNode = (
    <div
      className={`link-preview-portal${centered ? " link-preview-portal--centered" : ""}`}
      style={{ top, left }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <LinkPreviewCard
        variant={variant}
        meta={meta}
        accent={accent}
        highlight={highlight}
        href={href}
        loading={loading}
      />
    </div>
  )

  return createPortal(node as never, document.body)
}
