import { Page, getPageColor, getPageHighlight, getPageDeepColor } from "@/pageHelpers"
import { useToggles } from "toggletation"
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { Check, Copy } from "react-feather"
import LinkPreviewPopover from "./LinkPreviewPopover"
import { type LinkPreviewVariant } from "./LinkPreviewCard"
import {
  prefetchLinkPreview,
  preloadPreviewImagesForHref,
} from "@/lib/linkPreviewCache"

interface Props {
  text: string
  href: string
  page: Page
  newTab?: boolean
  copyOnClick?: boolean
}

const SHOW_DELAY_MS = 220
const HIDE_DELAY_MS = 120
const COPIED_RESET_MS = 2000

export default function TextLink({
  text,
  href,
  page,
  newTab = true,
  copyOnClick = false,
}: Props) {
  const { getValue } = useToggles()
  const linkStyle = getValue("linkStyle") as string
  const linkHoverStyle = getValue("linkHoverStyle") as string
  const linkPreviewStyle = getValue("linkPreviewStyle") as LinkPreviewVariant
  const accent = getPageColor(page, true)
  const highlight = getPageHighlight(page)
  const deep = getPageDeepColor(page)

  const anchorRef = useRef<HTMLAnchorElement>(null)
  const showTimer = useRef<ReturnType<typeof setTimeout>>()
  const hideTimer = useRef<ReturnType<typeof setTimeout>>()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewPos, setPreviewPos] = useState({ top: 0, left: 0 })
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>()

  const hover = linkHoverStyle || "fade"
  const previewVariant = linkPreviewStyle || "none"
  const showPreview = previewVariant !== "none" && !copyOnClick

  useEffect(() => {
    return () => clearTimeout(copiedTimer.current)
  }, [])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!copyOnClick) return
      event.preventDefault()
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        clearTimeout(copiedTimer.current)
        copiedTimer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS)
      })
    },
    [copyOnClick, text]
  )

  const linkVars: CSSProperties = {
    ["--link-accent" as string]: accent,
    ["--link-shadow" as string]: highlight,
  }

  let style: CSSProperties = { ...linkVars }
  let className = `cursor-pointer link-hover-${hover}${copyOnClick ? " inline-flex items-center gap-1.5" : ""}`

  switch (linkStyle) {
    case "underline":
      style = {
        ...linkVars,
        color: accent,
        textDecoration: "underline",
        textDecorationColor: accent,
        textUnderlineOffset: "3px",
      }
      break
    case "highlight":
      style = {
        ...linkVars,
        color: deep,
        backgroundColor: highlight,
        borderRadius: "2px",
        padding: "0 2px",
      }
      break
    case "dotted":
      style = {
        ...linkVars,
        color: accent,
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: accent,
        textUnderlineOffset: "3px",
      }
      break
    default:
      style = { ...linkVars, color: accent }
  }

  style = { ...style, cursor: "pointer" }

  const updatePreviewPosition = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const gap = 8
    const centered = previewVariant === "browser"
    setPreviewPos({
      top: rect.top - gap,
      left: centered ? rect.left + rect.width / 2 : rect.left,
    })
  }, [previewVariant])

  const openPreview = useCallback(() => {
    clearTimeout(hideTimer.current)
    preloadPreviewImagesForHref(href, text)
    void prefetchLinkPreview(href, text)
    showTimer.current = setTimeout(() => {
      updatePreviewPosition()
      setPreviewVisible(true)
    }, SHOW_DELAY_MS)
  }, [href, text, updatePreviewPosition])

  const closePreview = useCallback(() => {
    clearTimeout(showTimer.current)
    hideTimer.current = setTimeout(() => setPreviewVisible(false), HIDE_DELAY_MS)
  }, [])

  const previewNode = showPreview ? (
    <LinkPreviewPopover
      href={href}
      text={text}
      visible={previewVisible}
      top={previewPos.top}
      left={previewPos.left}
      centered={previewVariant === "browser"}
      variant={previewVariant}
      accent={accent}
      highlight={highlight}
      onMouseEnter={() => clearTimeout(hideTimer.current)}
      onMouseLeave={closePreview}
    />
  ) : null

  return (
    <>
      {" "}
      <a
        ref={anchorRef}
        href={copyOnClick ? undefined : href}
        role={copyOnClick ? "button" : undefined}
        target={copyOnClick || !newTab ? undefined : "_blank"}
        rel={copyOnClick || !newTab ? undefined : "noopener noreferrer"}
        className={className}
        style={style}
        onClick={copyOnClick ? handleClick : undefined}
        onMouseEnter={showPreview ? openPreview : undefined}
        onMouseLeave={showPreview ? closePreview : undefined}
        onFocus={showPreview ? openPreview : undefined}
        onBlur={showPreview ? closePreview : undefined}
        aria-label={copyOnClick ? `Copy ${text}` : undefined}
      >
        {text}
        {copyOnClick ? (
          copied ? (
            <Check size={16} strokeWidth={2.5} aria-hidden />
          ) : (
            <Copy size={16} strokeWidth={2} aria-hidden />
          )
        ) : null}
      </a>
      {previewNode}
    </>
  )
}
