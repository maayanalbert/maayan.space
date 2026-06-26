import type { LinkPreviewMeta } from "@/lib/linkPreviewMeta"
import { getFaviconUrl, getPreviewThumbnail } from "@/lib/linkPreviewMeta"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"

export type LinkPreviewVariant =
  | "none"
  | "tooltip"
  | "card"
  | "notion"
  | "gamma"
  | "linear"
  | "wikipedia"
  | "wikipediaStripe"
  | "wikipediaStripeTop"
  | "wikipediaStripeBottom"
  | "wikipediaStripeBottomLeft"
  | "sticky"
  | "terminal"
  | "polaroid"
  | "ticket"
  | "marginalia"
  | "receipt"
  | "orbit"
  | "flip"
  | "tilt"
  | "typewriter"
  | "filmstrip"
  | "mac"
  | "browser"
  | "browserLeft"

type Props = {
  variant: LinkPreviewVariant
  meta: LinkPreviewMeta
  accent: string
  highlight: string
  href?: string
  staticPreview?: boolean
  loading?: boolean
}

function previewVars(accent: string, highlight: string): CSSProperties {
  return {
    ["--preview-accent" as string]: accent,
    ["--preview-highlight" as string]: highlight,
  }
}

function WikipediaPreviewContent({
  meta,
  favicon,
}: {
  meta: LinkPreviewMeta
  favicon: string
}) {
  const source = meta.hostname.includes("wikipedia.org")
    ? "From Wikipedia, the free encyclopedia"
    : meta.siteName || meta.domain

  return (
    <>
      <div className="link-preview-wikipedia-thumb">
        {meta.imageUrl ? (
          <img
            src={meta.imageUrl}
            alt=""
            className="link-preview-wikipedia-photo"
          />
        ) : (
          <img
            src={favicon}
            alt=""
            width={32}
            height={32}
            className="link-preview-wikipedia-icon"
          />
        )}
      </div>
      <div className="link-preview-wikipedia-body">
        <span className="link-preview-wikipedia-title">{meta.title}</span>
        {meta.description && (
          <p className="link-preview-wikipedia-excerpt">{meta.description}</p>
        )}
        <span className="link-preview-wikipedia-source">{source}</span>
      </div>
    </>
  )
}

type SubProps = {
  meta: LinkPreviewMeta
  favicon: string
  thumbnail: string | null
  vars: CSSProperties
  staticClass: string
  loadingClass: string
}

function TiltCard({
  meta,
  favicon,
  vars,
  staticClass,
  loadingClass,
}: SubProps) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty("--rx", `${(-y * 18).toFixed(1)}deg`)
    el.style.setProperty("--ry", `${(x * 18).toFixed(1)}deg`)
    el.style.setProperty(
      "--mx",
      `${((e.clientX - rect.left) / rect.width) * 100}%`
    )
    el.style.setProperty(
      "--my",
      `${((e.clientY - rect.top) / rect.height) * 100}%`
    )
    el.style.setProperty("--sheen-opacity", "1")
  }

  function handleLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--rx", "0deg")
    el.style.setProperty("--ry", "0deg")
    el.style.setProperty("--sheen-opacity", "0")
  }

  return (
    <div
      ref={ref}
      className={`link-preview link-preview-tilt${staticClass}${loadingClass}`}
      style={
        {
          ...vars,
          "--rx": "0deg",
          "--ry": "0deg",
          "--mx": "50%",
          "--my": "50%",
          "--sheen-opacity": "0",
        } as CSSProperties
      }
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="link-preview-tilt-sheen" aria-hidden="true" />
      <div className="link-preview-tilt-header">
        <img
          src={favicon}
          alt=""
          width={14}
          height={14}
          className="link-preview-tilt-favicon"
        />
        <span className="link-preview-tilt-domain">{meta.domain}</span>
      </div>
      <span className="link-preview-tilt-title">{meta.title}</span>
      {meta.description && (
        <p className="link-preview-tilt-desc">{meta.description}</p>
      )}
    </div>
  )
}

function TypewriterCard({
  meta,
  favicon,
  vars,
  staticClass,
  loadingClass,
}: SubProps) {
  const [phase, setPhase] = useState(0)
  const [text, setText] = useState("")
  const phases = [meta.domain, meta.title, meta.description ?? ""]

  useEffect(() => {
    setText("")
    setPhase(0)
  }, [meta.domain])

  useEffect(() => {
    const target = phases[phase] ?? ""
    if (text.length >= target.length) {
      if (phase < phases.length - 1) {
        const t = setTimeout(() => {
          setPhase((p) => p + 1)
          setText("")
        }, 320)
        return () => clearTimeout(t)
      }
      return
    }
    const t = setTimeout(
      () => {
        setText(target.slice(0, text.length + 1))
      },
      phase === 0 ? 28 : phase === 1 ? 22 : 12
    )
    return () => clearTimeout(t)
  })

  const done0 = text.length >= phases[0].length
  const done1 = phase >= 1 && text.length >= phases[1].length

  return (
    <div
      className={`link-preview link-preview-typewriter${staticClass}${loadingClass}`}
      style={vars}
    >
      <span className="link-preview-typewriter-kicker">
        {phase === 0 ? text : phases[0]}
        {phase === 0 && <span className="link-preview-typewriter-cursor" />}
      </span>
      {done0 && (
        <span className="link-preview-typewriter-title">
          {phase === 1 ? text : phase > 1 ? phases[1] : ""}
          {phase === 1 && <span className="link-preview-typewriter-cursor" />}
        </span>
      )}
      {done1 && phases[2] && (
        <p className="link-preview-typewriter-desc">
          {phase === 2 ? text : phases[2]}
          {phase === 2 && <span className="link-preview-typewriter-cursor" />}
        </p>
      )}
      <img
        src={favicon}
        alt=""
        width={12}
        height={12}
        className="link-preview-typewriter-favicon"
      />
    </div>
  )
}

const CLICK_MOVE_THRESHOLD_PX = 8

type BrowserPreviewProps = {
  meta: LinkPreviewMeta
  favicon: string
  href?: string
  vars: CSSProperties
  staticClass: string
  loadingClass: string
  staticPreview: boolean
}

function BrowserPreviewCard({
  meta,
  favicon,
  href,
  vars,
  staticClass,
  loadingClass,
  staticPreview,
}: BrowserPreviewProps) {
  const gesture = useRef<{ x: number; y: number; moved: boolean } | null>(null)
  const gestureListeners = useRef<{
    move: (event: PointerEvent) => void
    up: (event: PointerEvent) => void
    cancel: () => void
  } | null>(null)
  const screenshotFallback = meta.screenshotUrl
  const ogImage = meta.imageUrl
  const previewImage = screenshotFallback || ogImage
  const scrollable = Boolean(screenshotFallback)
  const clickable = Boolean(href) && !staticPreview

  const openHref = useCallback(() => {
    if (!href) return
    window.open(href, "_blank", "noopener,noreferrer")
  }, [href])

  const removeGestureListeners = useCallback(() => {
    const listeners = gestureListeners.current
    if (!listeners) return
    window.removeEventListener("pointermove", listeners.move)
    window.removeEventListener("pointerup", listeners.up)
    window.removeEventListener("pointercancel", listeners.cancel)
    gestureListeners.current = null
    gesture.current = null
  }, [])

  const handlePointerDownCapture = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!clickable) return
      removeGestureListeners()
      gesture.current = { x: event.clientX, y: event.clientY, moved: false }

      const onMove = (moveEvent: PointerEvent) => {
        if (!gesture.current || gesture.current.moved) return
        const dx = moveEvent.clientX - gesture.current.x
        const dy = moveEvent.clientY - gesture.current.y
        if (dx * dx + dy * dy > CLICK_MOVE_THRESHOLD_PX * CLICK_MOVE_THRESHOLD_PX) {
          gesture.current.moved = true
        }
      }

      const onUp = (upEvent: PointerEvent) => {
        if (!gesture.current) {
          removeGestureListeners()
          return
        }
        const dx = upEvent.clientX - gesture.current.x
        const dy = upEvent.clientY - gesture.current.y
        const moved =
          gesture.current.moved ||
          dx * dx + dy * dy > CLICK_MOVE_THRESHOLD_PX * CLICK_MOVE_THRESHOLD_PX
        removeGestureListeners()
        if (!moved) {
          upEvent.preventDefault()
          openHref()
        }
      }

      const onCancel = () => {
        removeGestureListeners()
      }

      gestureListeners.current = { move: onMove, up: onUp, cancel: onCancel }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
      window.addEventListener("pointercancel", onCancel)
    },
    [clickable, openHref, removeGestureListeners]
  )

  useEffect(() => removeGestureListeners, [removeGestureListeners])

  return (
    <div
      className={`link-preview link-preview-browser${staticClass}${loadingClass}`}
      style={vars}
      onPointerDownCapture={clickable ? handlePointerDownCapture : undefined}
    >
      <div className="link-preview-browser-chrome">
        <div className="link-preview-browser-dots" aria-hidden="true">
          <span className="link-preview-browser-dot dot-red" />
          <span className="link-preview-browser-dot dot-yellow" />
          <span className="link-preview-browser-dot dot-green" />
        </div>
        <div className="link-preview-browser-urlbar">
          <img
            src={favicon}
            alt=""
            width={10}
            height={10}
            className="link-preview-browser-favicon"
          />
          <span className="link-preview-browser-url">{meta.hostname}</span>
        </div>
      </div>
      <div
        className={`link-preview-browser-viewport${scrollable ? " link-preview-browser-viewport--scrollable" : ""}`}
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt={meta.title}
            className={`link-preview-browser-screenshot${screenshotFallback ? "" : " link-preview-browser-screenshot--cover"}`}
            draggable={false}
          />
        ) : (
          <div className="link-preview-browser-fallback">
            <img src={favicon} alt="" width={28} height={28} />
            <span>{meta.domain}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function FilmstripCard({
  meta,
  favicon,
  vars,
  staticClass,
  loadingClass,
}: SubProps) {
  const [panel, setPanel] = useState(0)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (x < 0.33) setPanel(0)
    else if (x < 0.66) setPanel(1)
    else setPanel(2)
  }

  function handleLeave() {
    setPanel(0)
  }

  const panels = [
    <div key="a" className="link-preview-filmstrip-panel">
      <img
        src={favicon}
        alt=""
        width={28}
        height={28}
        className="link-preview-filmstrip-icon"
      />
      <span className="link-preview-filmstrip-domain">{meta.domain}</span>
    </div>,
    <div key="b" className="link-preview-filmstrip-panel">
      <span className="link-preview-filmstrip-label">Title</span>
      <span className="link-preview-filmstrip-title">{meta.title}</span>
    </div>,
    <div key="c" className="link-preview-filmstrip-panel">
      <span className="link-preview-filmstrip-label">About</span>
      <p className="link-preview-filmstrip-desc">
        {meta.description ?? "No description available."}
      </p>
    </div>,
  ]

  return (
    <div
      className={`link-preview link-preview-filmstrip${staticClass}${loadingClass}`}
      style={vars}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="link-preview-filmstrip-viewport">
        <div
          className="link-preview-filmstrip-track"
          style={{ transform: `translateX(${-panel * 100}%)` }}
        >
          {panels}
        </div>
      </div>
      <div className="link-preview-filmstrip-dots">
        {panels.map((_, i) => (
          <span
            key={i}
            className={`link-preview-filmstrip-dot${panel === i ? " active" : ""}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function LinkPreviewCard({
  variant,
  meta,
  accent,
  highlight,
  href,
  staticPreview = false,
  loading = false,
}: Props) {
  if (variant === "none") return null

  const favicon = getFaviconUrl(meta.hostname)
  const thumbnail = getPreviewThumbnail(meta)
  const vars = previewVars(accent, highlight)
  const staticClass = staticPreview ? " link-preview-static" : ""
  const loadingClass = loading && !meta.fetched ? " link-preview--loading" : ""

  if (variant === "tooltip") {
    return (
      <div
        className={`link-preview link-preview-tooltip${staticClass}${loadingClass}`}
        style={vars}
      >
        <span className="link-preview-tooltip-arrow" aria-hidden="true" />
        <span className="link-preview-tooltip-kicker">Opens</span>
        <span className="link-preview-tooltip-domain">{meta.domain}</span>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div
        className={`link-preview link-preview-card${staticClass}${loadingClass}`}
        style={vars}
      >
        <img
          src={favicon}
          alt=""
          width={14}
          height={14}
          className="link-preview-card-favicon"
        />
        <div className="link-preview-card-body">
          <span className="link-preview-card-eyebrow">{meta.domain}</span>
          <span className="link-preview-card-title">{meta.title}</span>
        </div>
      </div>
    )
  }

  if (variant === "notion") {
    return (
      <div
        className={`link-preview link-preview-notion${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-notion-accent" aria-hidden="true" />
        <div className="link-preview-notion-inner">
          <div className="link-preview-notion-icon-wrap">
            <img src={thumbnail} alt="" width={16} height={16} />
          </div>
          <div className="link-preview-notion-copy">
            <span className="link-preview-notion-title">{meta.title}</span>
            {meta.description && (
              <p className="link-preview-notion-desc">{meta.description}</p>
            )}
            <span className="link-preview-notion-footer">Link to web page</span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "gamma") {
    return (
      <div
        className={`link-preview link-preview-gamma${staticClass}${loadingClass}`}
        style={vars}
      >
        {meta.imageUrl ? (
          <div className="link-preview-gamma-hero link-preview-gamma-hero--image">
            <img
              src={meta.imageUrl}
              alt=""
              className="link-preview-gamma-hero-photo"
            />
            <span className="link-preview-gamma-hero-domain">
              {meta.domain}
            </span>
          </div>
        ) : (
          <div className="link-preview-gamma-hero">
            <img
              src={favicon}
              alt=""
              width={28}
              height={28}
              className="link-preview-gamma-hero-icon"
            />
            <span className="link-preview-gamma-hero-domain">
              {meta.domain}
            </span>
          </div>
        )}
        <div className="link-preview-gamma-body">
          <span className="link-preview-gamma-title">{meta.title}</span>
          {meta.description && (
            <p className="link-preview-gamma-desc">{meta.description}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === "wikipedia") {
    return (
      <div
        className={`link-preview link-preview-wikipedia${staticClass}${loadingClass}`}
      >
        <WikipediaPreviewContent meta={meta} favicon={favicon} />
      </div>
    )
  }

  if (variant === "wikipediaStripe") {
    return (
      <div
        className={`link-preview link-preview-wikipedia-stripe${staticClass}${loadingClass}`}
        style={vars}
      >
        <div
          className="link-preview-wikipedia-stripe-accent"
          aria-hidden="true"
        />
        <div className="link-preview-wikipedia-stripe-inner">
          <WikipediaPreviewContent meta={meta} favicon={favicon} />
        </div>
      </div>
    )
  }

  if (variant === "wikipediaStripeTop") {
    return (
      <div
        className={`link-preview link-preview-wikipedia-stripe-stack${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-wikipedia-stripe-bar" aria-hidden="true" />
        <div className="link-preview-wikipedia-stripe-inner">
          <WikipediaPreviewContent meta={meta} favicon={favicon} />
        </div>
      </div>
    )
  }

  if (variant === "wikipediaStripeBottom") {
    return (
      <div
        className={`link-preview link-preview-wikipedia-stripe-stack${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-wikipedia-stripe-inner">
          <WikipediaPreviewContent meta={meta} favicon={favicon} />
        </div>
        <div className="link-preview-wikipedia-stripe-bar" aria-hidden="true" />
      </div>
    )
  }

  if (variant === "wikipediaStripeBottomLeft") {
    return (
      <div
        className={`link-preview link-preview-wikipedia-stripe-stack${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-wikipedia-stripe-corner-row">
          <div
            className="link-preview-wikipedia-stripe-accent"
            aria-hidden="true"
          />
          <div className="link-preview-wikipedia-stripe-inner">
            <WikipediaPreviewContent meta={meta} favicon={favicon} />
          </div>
        </div>
        <div className="link-preview-wikipedia-stripe-bar" aria-hidden="true" />
      </div>
    )
  }

  if (variant === "sticky") {
    return (
      <div
        className={`link-preview link-preview-sticky${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-sticky-tape" aria-hidden="true" />
        <span className="link-preview-sticky-title">{meta.title}</span>
        {meta.description && (
          <p className="link-preview-sticky-desc">{meta.description}</p>
        )}
        <span className="link-preview-sticky-url">{meta.domain}</span>
      </div>
    )
  }

  if (variant === "terminal") {
    return (
      <div
        className={`link-preview link-preview-terminal${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-terminal-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="link-preview-terminal-body">
          <code className="link-preview-terminal-prompt">
            <span className="link-preview-terminal-user">you</span>
            <span className="link-preview-terminal-at">@</span>
            <span className="link-preview-terminal-host">web</span>
            <span className="link-preview-terminal-cmd">
              {" "}
              ~ % curl -sL {meta.domain}
            </span>
          </code>
          <code className="link-preview-terminal-out">{`"title": "${meta.title}"`}</code>
          {meta.description && (
            <code className="link-preview-terminal-out link-preview-terminal-dim">
              {`"desc": "${meta.description.slice(0, 80)}${meta.description.length > 80 ? "…" : ""}"`}
            </code>
          )}
          <code className="link-preview-terminal-cursor" aria-hidden="true">
            ▋
          </code>
        </div>
      </div>
    )
  }

  if (variant === "polaroid") {
    return (
      <div
        className={`link-preview link-preview-polaroid${staticClass}${loadingClass}`}
      >
        <div className="link-preview-polaroid-frame">
          <div className="link-preview-polaroid-photo">
            <img src={meta.imageUrl || favicon} alt="" />
          </div>
          <p className="link-preview-polaroid-caption">{meta.title}</p>
        </div>
      </div>
    )
  }

  if (variant === "ticket") {
    return (
      <div
        className={`link-preview link-preview-ticket${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-ticket-perforation" aria-hidden="true" />
        <div className="link-preview-ticket-stub">
          <span>ADMIT</span>
          <span>ONE</span>
          <span className="link-preview-ticket-stub-url">
            {meta.domain.split(".")[0]}
          </span>
        </div>
        <div className="link-preview-ticket-body">
          <span className="link-preview-ticket-title">{meta.title}</span>
          <span className="link-preview-ticket-meta">{meta.domain}</span>
          {meta.description && (
            <p className="link-preview-ticket-fine">{meta.description}</p>
          )}
        </div>
      </div>
    )
  }

  if (variant === "marginalia") {
    return (
      <div
        className={`link-preview link-preview-marginalia${staticClass}${loadingClass}`}
        style={vars}
      >
        <svg
          className="link-preview-marginalia-arrow"
          viewBox="0 0 40 48"
          aria-hidden="true"
        >
          <path
            d="M4 44 Q 20 28, 36 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <p className="link-preview-marginalia-text">
          {meta.description || meta.title}
        </p>
        <span className="link-preview-marginalia-ref">{meta.title}</span>
        <span className="link-preview-marginalia-domain">{meta.domain}</span>
      </div>
    )
  }

  if (variant === "receipt") {
    return (
      <div
        className={`link-preview link-preview-receipt${staticClass}${loadingClass}`}
      >
        <p className="link-preview-receipt-brand">LINK RECEIPT</p>
        <p className="link-preview-receipt-meta">
          {new Date().toLocaleDateString()}
        </p>
        <p className="link-preview-receipt-rule" aria-hidden="true">
          · · · · · · · · · · · · · · ·
        </p>
        <p className="link-preview-receipt-item">{meta.title}</p>
        {meta.description && (
          <p className="link-preview-receipt-item link-preview-receipt-dim">
            {meta.description}
          </p>
        )}
        <p className="link-preview-receipt-rule" aria-hidden="true">
          - - - - - - - - - - - - - -
        </p>
        <p className="link-preview-receipt-total">
          <span>TOTAL</span>
          <span>{meta.domain}</span>
        </p>
        <p className="link-preview-receipt-thanks">thank you for visiting</p>
      </div>
    )
  }

  if (variant === "orbit") {
    return (
      <div
        className={`link-preview link-preview-orbit${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-orbit-ring" aria-hidden="true" />
        <div className="link-preview-orbit-core">
          <img
            src={favicon}
            alt=""
            width={20}
            height={20}
            className="link-preview-orbit-icon"
          />
          <span className="link-preview-orbit-title">{meta.title}</span>
          {meta.description && (
            <p className="link-preview-orbit-desc">{meta.description}</p>
          )}
          <span className="link-preview-orbit-domain">{meta.domain}</span>
        </div>
      </div>
    )
  }

  if (variant === "linear") {
    return (
      <div
        className={`link-preview link-preview-linear${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-linear-top">
          <span className="link-preview-linear-dot" aria-hidden="true" />
          <span className="link-preview-linear-status">External link</span>
        </div>
        <span className="link-preview-linear-title">{meta.title}</span>
        {meta.description && (
          <p className="link-preview-linear-desc">{meta.description}</p>
        )}
        <code className="link-preview-linear-url">{meta.domain}</code>
      </div>
    )
  }

  if (variant === "flip") {
    return (
      <div
        className={`link-preview link-preview-flip${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-flip-inner">
          <div className="link-preview-flip-face link-preview-flip-front">
            {thumbnail ? (
              <img src={thumbnail} alt="" className="link-preview-flip-image" />
            ) : (
              <div className="link-preview-flip-front-fallback">
                <img src={favicon} alt="" width={32} height={32} />
              </div>
            )}
            <div className="link-preview-flip-front-badge">{meta.domain}</div>
          </div>
          <div className="link-preview-flip-face link-preview-flip-back">
            <img
              src={favicon}
              alt=""
              width={14}
              height={14}
              className="link-preview-flip-back-icon"
            />
            <span className="link-preview-flip-back-title">{meta.title}</span>
            {meta.description && (
              <p className="link-preview-flip-back-desc">{meta.description}</p>
            )}
            <span className="link-preview-flip-back-hint">hover to flip ↩</span>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "tilt") {
    return (
      <TiltCard
        meta={meta}
        favicon={favicon}
        thumbnail={thumbnail}
        vars={vars}
        staticClass={staticClass}
        loadingClass={loadingClass}
      />
    )
  }

  if (variant === "typewriter") {
    return (
      <TypewriterCard
        meta={meta}
        favicon={favicon}
        thumbnail={thumbnail}
        vars={vars}
        staticClass={staticClass}
        loadingClass={loadingClass}
      />
    )
  }

  if (variant === "filmstrip") {
    return (
      <FilmstripCard
        meta={meta}
        favicon={favicon}
        thumbnail={thumbnail}
        vars={vars}
        staticClass={staticClass}
        loadingClass={loadingClass}
      />
    )
  }

  if (variant === "browser" || variant === "browserLeft") {
    return (
      <BrowserPreviewCard
        meta={meta}
        favicon={favicon}
        href={href}
        vars={vars}
        staticClass={staticClass}
        loadingClass={loadingClass}
        staticPreview={staticPreview}
      />
    )
  }

  if (variant === "mac") {
    return (
      <div
        className={`link-preview link-preview-mac${staticClass}${loadingClass}`}
        style={vars}
      >
        <div className="link-preview-mac-handle" aria-hidden="true" />
        <div className="link-preview-mac-bezel">
          <div className="link-preview-mac-screen">
            <div className="link-preview-mac-window">
              <div className="link-preview-mac-titlebar">
                <div className="link-preview-mac-closebox" />
                <span className="link-preview-mac-windowtitle">
                  {meta.domain}
                </span>
              </div>
              <div className="link-preview-mac-windowbody">
                <div className="link-preview-mac-icon-row">
                  <img
                    src={favicon}
                    alt=""
                    width={16}
                    height={16}
                    className="link-preview-mac-favicon"
                  />
                  <span className="link-preview-mac-site">{meta.domain}</span>
                </div>
                <span className="link-preview-mac-title">{meta.title}</span>
                {meta.description && (
                  <p className="link-preview-mac-desc">{meta.description}</p>
                )}
              </div>
            </div>
            <div className="link-preview-mac-scanlines" aria-hidden="true" />
          </div>
        </div>
        <div className="link-preview-mac-lower">
          <div className="link-preview-mac-drive" aria-hidden="true" />
          <span className="link-preview-mac-badge">Macintosh</span>
        </div>
      </div>
    )
  }

  return null
}
