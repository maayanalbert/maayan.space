import React, {
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react"

const MODIFIED_BLUE = "#60a5fa"

// Lucide sliders-horizontal icon
function DialsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 5H3" />
      <path d="M12 19H3" />
      <path d="M14 3v4" />
      <path d="M16 17v4" />
      <path d="M21 12h-9" />
      <path d="M21 19h-5" />
      <path d="M21 5h-7" />
      <path d="M8 10v4" />
      <path d="M8 12H3" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left"

const MARGIN = 24
const BTN_SIZE = 42
const BTN_GAP = 10
const PANEL_GAP = 12

function cornerBtnPos(c: Corner): { x: number; y: number } {
  const w = window.innerWidth
  const h = window.innerHeight
  return {
    x: c.endsWith("right") ? w - MARGIN - BTN_SIZE : MARGIN,
    y: c.startsWith("top") ? MARGIN : h - MARGIN - BTN_SIZE,
  }
}

function nearestCorner(mx: number, my: number): Corner {
  const left = mx < window.innerWidth / 2
  const top = my < window.innerHeight / 2
  return `${top ? "top" : "bottom"}-${left ? "left" : "right"}` as Corner
}

function panelFixedStyle(c: Corner): CSSProperties {
  const offset = MARGIN + BTN_SIZE + PANEL_GAP
  switch (c) {
    case "bottom-right":
      return { position: "fixed", bottom: offset, right: MARGIN, zIndex: 50 }
    case "bottom-left":
      return { position: "fixed", bottom: offset, left: MARGIN, zIndex: 50 }
    case "top-right":
      return { position: "fixed", top: offset, right: MARGIN, zIndex: 50 }
    case "top-left":
      return { position: "fixed", top: offset, left: MARGIN, zIndex: 50 }
  }
}

const panelCard: CSSProperties = {
  width: 288,
  background: "#1c1c1c",
  borderRadius: 16,
  border: "1px solid rgb(255 255 255 / 0.12)",
  overflow: "hidden",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  lineHeight: "normal",
}

const panelBody: CSSProperties = {
  padding: "18px 16px 16px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  maxHeight: 448,
  overflowY: "auto",
  scrollbarWidth: "none",
}

const toggleBtn: CSSProperties = {
  width: 42,
  height: 42,
  background: "#1c1c1c",
  color: "white",
  borderRadius: 9999,
  border: "1px solid rgb(255 255 255 / 0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  userSelect: "none",
  flexShrink: 0,
}

export function TogglesPanelShell({
  children,
  hasChanges,
  onSave,
}: {
  children: ReactNode
  hasChanges?: boolean
  onSave?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  const [corner, setCorner] = React.useState<Corner>("bottom-right")
  const [btnPos, setBtnPos] = React.useState<{ x: number; y: number } | null>(
    null
  )
  const [animating, setAnimating] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const dragRef = useRef<{
    startX: number
    startY: number
    startBtnX: number
    startBtnY: number
    moved: boolean
  } | null>(null)
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const saved =
      (localStorage.getItem("toggles-corner") as Corner | null) ?? "bottom-right"
    setCorner(saved)
    setBtnPos(cornerBtnPos(saved))
  }, [])

  useEffect(() => {
    function onResize() {
      setBtnPos(cornerBtnPos(corner))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [corner])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  function snapToCorner(c: Corner) {
    setCorner(c)
    setAnimating(true)
    setBtnPos(cornerBtnPos(c))
    localStorage.setItem("toggles-corner", c)
    if (snapTimer.current) clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => setAnimating(false), 300)
  }

  function handleButtonMouseDown(e: React.MouseEvent) {
    if (!btnPos) return
    e.preventDefault()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startBtnX: btnPos.x,
      startBtnY: btnPos.y,
      moved: false,
    }

    function onMove(me: MouseEvent) {
      if (!dragRef.current) return
      const dx = me.clientX - dragRef.current.startX
      const dy = me.clientY - dragRef.current.startY
      if (!dragRef.current.moved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        dragRef.current.moved = true
        setDragging(true)
        setOpen(false)
      }
      if (dragRef.current.moved) {
        setBtnPos({
          x: dragRef.current.startBtnX + dx,
          y: dragRef.current.startBtnY + dy,
        })
      }
    }

    function onUp(me: MouseEvent) {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
      if (!dragRef.current?.moved) {
        setOpen((o) => !o)
      } else {
        snapToCorner(nearestCorner(me.clientX, me.clientY))
      }
      setDragging(false)
      dragRef.current = null
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
  }

  function handleSaveClick() {
    onSave?.()
    setCopied(true)
    if (copiedTimer.current) clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(false), 1800)
  }

  if (!btnPos) return null

  const isBottom = corner.startsWith("bottom")
  const isRight = corner.endsWith("right")
  const panelTransformOrigin = `${isBottom ? "bottom" : "top"} ${isRight ? "right" : "left"}`
  const panelTranslate = isBottom ? "translateY(4px)" : "translateY(-4px)"

  return (
    <>
      <style>{`.st-panel-body::-webkit-scrollbar{width:0;height:0;background:transparent}`}</style>
      <div
        ref={panelRef}
        style={{
          ...panelFixedStyle(corner),
          opacity: open ? 1 : 0,
          transform: open
            ? "scale(1) translateY(0)"
            : `scale(0.98) ${panelTranslate}`,
          transformOrigin: panelTransformOrigin,
          pointerEvents: open ? "auto" : "none",
          transition:
            "opacity 80ms ease, transform 180ms cubic-bezier(0.25, 0, 0, 1)",
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={panelCard}>
            <div className="st-panel-body" style={panelBody}>
              {children}
            </div>
          </div>
          {/* Floating pill */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "#252525",
              border: "1px solid rgb(255 255 255 / 0.14)",
              borderRadius: "0 16px 0 10px",
              padding: "4px 6px 4px 8px",
              zIndex: 1,
              boxShadow: "0 2px 6px rgb(0 0 0 / 0.35)",
            }}
          >
            <button
              onClick={handleSaveClick}
              onMouseEnter={(e) => { if (hasChanges) (e.currentTarget as HTMLButtonElement).style.background = "rgb(96 165 250 / 0.12)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none" }}
              style={{
                background: "none",
                border: "none",
                cursor: hasChanges ? "pointer" : "default",
                color: hasChanges ? MODIFIED_BLUE : "rgb(255 255 255 / 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                borderRadius: 999,
                padding: 0,
                pointerEvents: hasChanges ? "auto" : "none",
                transition: "color 180ms ease, background 120ms ease",
              }}
              aria-label="Copy defaults snippet"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
            <button
              onClick={() => setOpen(false)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgb(255 255 255 / 0.1)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none" }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgb(255 255 255 / 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 20,
                borderRadius: 999,
                padding: 0,
                transition: "color 120ms ease, background 120ms ease",
              }}
              aria-label="Close panel"
            >
              <XIcon />
            </button>
          </div>
        </div>
      </div>

      <button
        ref={btnRef}
        className="st-toggle"
        onMouseDown={handleButtonMouseDown}
        style={{
          ...toggleBtn,
          position: "fixed",
          left: btnPos.x,
          top: btnPos.y,
          cursor: dragging ? "grabbing" : "pointer",
          transition: animating
            ? "left 300ms cubic-bezier(0.25, 0, 0, 1), top 300ms cubic-bezier(0.25, 0, 0, 1)"
            : "none",
          zIndex: 51,
        }}
        aria-label="Toggle design panel"
      >
        <DialsIcon />
      </button>
    </>
  )
}

export function Section({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "rgb(255 255 255 / 0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          margin: 0,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
    </div>
  )
}

export function Field({
  label,
  blurb,
  children,
}: {
  label: string
  blurb: string
  children: ReactNode
}) {
  const [expanded, setExpanded] = React.useState(false)

  const blurbParagraphs = blurb.split("\n\n")
  const blurbText = (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {blurbParagraphs.map((para, i) => (
        <p
          key={i}
          style={{
            fontSize: 12,
            color: "rgb(255 255 255 / 0.6)",
            lineHeight: 1.625,
            margin: 0,
          }}
        >
          {para}
        </p>
      ))}
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "rgb(255 255 255 / 0.88)",
            margin: 0,
          }}
        >
          {label}
        </p>
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgb(255 255 255 / 0.35)",
            padding: "2px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 150ms ease",
            }}
          >
            <path
              d="M2 4.5L6 8L10 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {children}

      <div
        style={{
          overflow: "hidden",
          maxHeight: expanded ? "120px" : "0px",
          opacity: expanded ? 1 : 0,
          transition: "max-height 200ms ease, opacity 200ms ease",
        }}
      >
        {blurbText}
      </div>
    </div>
  )
}

export function SegmentedControl({
  options,
  value,
  onChange,
  isModified,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  isModified?: boolean
}) {
  const selectedIndex = options.findIndex((o) => o.value === value)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [pillGeom, setPillGeom] = React.useState<{
    left: number
    width: number
  } | null>(null)

  useEffect(() => {
    const btn = btnRefs.current[selectedIndex]
    const container = containerRef.current
    if (!btn || !container) return
    const bRect = btn.getBoundingClientRect()
    const cRect = container.getBoundingClientRect()
    setPillGeom({ left: bRect.left - cRect.left, width: bRect.width })
  }, [selectedIndex, options])

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        padding: 4,
        background: "rgb(255 255 255 / 0.08)",
        borderRadius: 8,
      }}
    >
      {pillGeom && selectedIndex !== -1 && (
        <div
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: pillGeom.left,
            width: pillGeom.width,
            background: isModified
              ? "rgb(96 165 250 / 0.15)"
              : "rgb(255 255 255 / 0.14)",
            borderRadius: 6,
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
            transition:
              "left 160ms cubic-bezier(0.4, 0, 0.2, 1), width 160ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease",
            pointerEvents: "none",
          }}
        />
      )}
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={(el) => {
            btnRefs.current[i] = el
          }}
          className="st-seg-btn"
          onClick={() => onChange(opt.value)}
          style={{
            fontSize: 12,
            padding: "6px 10px",
            borderRadius: 6,
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color:
              value === opt.value
                ? isModified
                  ? MODIFIED_BLUE
                  : "rgb(255 255 255 / 0.9)"
                : "rgb(255 255 255 / 0.4)",
            position: "relative",
            zIndex: 1,
            transition: "color 160ms ease",
            whiteSpace: "nowrap",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      <path
        d="M2 4.5L6 8L10 4.5"
        stroke="rgb(255 255 255 / 0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SelectControl({
  options,
  value,
  onChange,
  isModified,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
  isModified?: boolean
}) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        className="st-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: 13,
          border: `1px solid ${isModified ? "rgb(96 165 250 / 0.3)" : "rgb(255 255 255 / 0.1)"}`,
          borderRadius: 8,
          padding: "8px 32px 8px 12px",
          background: isModified
            ? "rgb(96 165 250 / 0.06)"
            : "rgb(255 255 255 / 0.08)",
          color: isModified ? MODIFIED_BLUE : "rgb(255 255 255 / 0.88)",
          appearance: "none",
          boxSizing: "border-box",
          cursor: "pointer",
          colorScheme: "dark",
          outline: "none",
          transition: "color 200ms ease, background 200ms ease, border-color 200ms ease",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChevronDown />
      </div>
    </div>
  )
}

export function SliderControl({
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  isModified,
}: {
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  formatValue?: (v: number) => string
  isModified?: boolean
}) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; value: number } | null>(null)

  const pct = ((value - min) / (max - min)) * 100
  const display = formatValue ? formatValue(value) : String(value)

  const KNOB_W = 2
  const KNOB_PAD = 8
  const OUTER_R = 10
  const INNER_PAD = 4
  const INNER_R = OUTER_R - INNER_PAD + 1

  const active = isDragging || isHovered
  const knobInset = active ? 6 : KNOB_PAD
  const knobW = KNOB_W

  const knobLeft = `clamp(4px, calc(${pct}% - ${knobW + KNOB_PAD}px), calc(100% - 4px - ${knobW}px))`

  function handlePointerDown(e: React.PointerEvent) {
    const track = trackRef.current
    if (!track) return

    const rect = track.getBoundingClientRect()
    const rawLeft = (pct / 100) * rect.width - (knobW + KNOB_PAD)
    const clampedLeft = Math.min(Math.max(rawLeft, 4), rect.width - 4 - knobW)
    const knobX = rect.left + clampedLeft
    const HIT = 10
    if (e.clientX < knobX - HIT || e.clientX > knobX + knobW + HIT) return

    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragStartRef.current = { x: e.clientX, value }
    setIsDragging(true)
  }

  function handlePointerMove(e: React.PointerEvent) {
    const track = trackRef.current
    if (!dragStartRef.current || !track) return
    const rect = track.getBoundingClientRect()
    const dx = e.clientX - dragStartRef.current.x
    const raw = dragStartRef.current.value + (dx / rect.width) * (max - min)
    const stepped = Math.round(raw / step) * step
    const decimals = step.toString().includes(".")
      ? step.toString().split(".")[1].length
      : 0
    const clean = parseFloat(stepped.toFixed(decimals))
    onChange(Math.min(max, Math.max(min, clean)))
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragStartRef.current) return
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    setIsDragging(false)
    dragStartRef.current = null
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: OUTER_R,
        height: 36,
        cursor: isDragging ? "grabbing" : "grab",
        background: isModified
          ? "rgb(96 165 250 / 0.08)"
          : "rgb(255 255 255 / 0.08)",
        padding: INNER_PAD,
        boxSizing: "border-box",
        userSelect: "none",
        transition: "background 200ms ease",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          borderRadius: INNER_R,
          overflow: "hidden",
        }}
      >
        {/* fill */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: `${pct}%`,
            background: isModified
              ? "rgb(96 165 250 / 0.25)"
              : "rgb(255 255 255 / 0.13)",
            borderRadius: `${INNER_R}px`,
            boxShadow: "inset 0 1px 2px 0 rgb(0 0 0 / 0.4)",
            transition: "background 200ms ease",
          }}
        />
        {/* knob */}
        <div
          style={{
            position: "absolute",
            top: knobInset,
            bottom: knobInset,
            left: knobLeft,
            width: knobW,
            background: active
              ? isModified
                ? MODIFIED_BLUE
                : "rgb(255 255 255 / 0.7)"
              : isModified
              ? "rgb(96 165 250 / 0.8)"
              : "rgb(255 255 255 / 0.55)",
            borderRadius: 2,
            transition:
              "top 120ms ease, bottom 120ms ease, width 120ms ease, background 120ms ease",
          }}
        />
        {/* value label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            pointerEvents: "none",
          }}
        >
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 13,
              color: isModified ? MODIFIED_BLUE : "rgb(255 255 255 / 0.65)",
              transition: "color 200ms ease",
            }}
          >
            {display}
          </span>
        </div>
      </div>
    </div>
  )
}
