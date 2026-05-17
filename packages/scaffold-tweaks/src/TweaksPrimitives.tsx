import React, {
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react"

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

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left"

const MARGIN = 24
const BTN_SIZE = 42
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
  boxShadow:
    "0 4px 12px -2px rgb(0 0 0 / 0.3), 0 0 0 0.5px rgb(255 255 255 / 0.08)",
  border: "1px solid rgb(255 255 255 / 0.08)",
  overflow: "hidden",
}

const panelBody: CSSProperties = {
  padding: 16,
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
  boxShadow:
    "0 2px 8px -1px rgb(0 0 0 / 0.4), 0 0 0 0.5px rgb(255 255 255 / 0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  userSelect: "none",
  border: "none",
  flexShrink: 0,
}

export function TweaksPanelShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [corner, setCorner] = React.useState<Corner>("bottom-right")
  // null until mounted so we don't render at (0,0) during SSR
  const [btnPos, setBtnPos] = React.useState<{ x: number; y: number } | null>(
    null
  )
  const [animating, setAnimating] = React.useState(false)
  const [dragging, setDragging] = React.useState(false)

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

  // Set initial position client-side, restoring saved corner if present
  useEffect(() => {
    const saved =
      (localStorage.getItem("tweaks-corner") as Corner | null) ?? "bottom-right"
    setCorner(saved)
    setBtnPos(cornerBtnPos(saved))
  }, [])

  // Keep button in its corner when window resizes
  useEffect(() => {
    function onResize() {
      setBtnPos(cornerBtnPos(corner))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [corner])

  // Close panel on outside click
  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      const t = e.target as Node
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      )
        setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open])

  function snapToCorner(c: Corner) {
    setCorner(c)
    setAnimating(true)
    setBtnPos(cornerBtnPos(c))
    localStorage.setItem("tweaks-corner", c)
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

  if (!btnPos) return null

  return (
    <>
      <style>{`.st-panel-body::-webkit-scrollbar{width:0;height:0;background:transparent}`}</style>
      {open && (
        <div ref={panelRef} style={panelFixedStyle(corner)}>
          <div style={panelCard}>
            <div className="st-panel-body" style={panelBody}>{children}</div>
          </div>
        </div>
      )}
      <button
        ref={btnRef}
        className="st-toggle"
        onMouseDown={handleButtonMouseDown}
        style={{
          ...toggleBtn,
          position: "fixed",
          left: btnPos.x,
          top: btnPos.y,
          cursor: dragging ? "grabbing" : "grab",
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
      {children}
      <p
        style={{
          fontSize: 12,
          color: "rgb(255 255 255 / 0.4)",
          lineHeight: 1.625,
          margin: 0,
        }}
      >
        {blurb}
      </p>
    </div>
  )
}

export function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
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
      {/* sliding pill */}
      {pillGeom && selectedIndex !== -1 && (
        <div
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: pillGeom.left,
            width: pillGeom.width,
            background: "rgb(255 255 255 / 0.14)",
            borderRadius: 6,
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
            transition:
              "left 160ms cubic-bezier(0.4, 0, 0.2, 1), width 160ms cubic-bezier(0.4, 0, 0.2, 1)",
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
                ? "rgb(255 255 255 / 0.9)"
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
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
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
          border: "1px solid rgb(255 255 255 / 0.1)",
          borderRadius: 8,
          padding: "8px 32px 8px 12px",
          background: "rgb(255 255 255 / 0.08)",
          color: "rgb(255 255 255 / 0.88)",
          appearance: "none",
          boxSizing: "border-box",
          cursor: "pointer",
          colorScheme: "dark",
          outline: "none",
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
}: {
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  formatValue?: (v: number) => string
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
  // subtle grow on hover/drag
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
        background: "rgb(255 255 255 / 0.08)",
        padding: INNER_PAD,
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      {/* inner track */}
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
            background: "rgb(255 255 255 / 0.13)",
            borderRadius: `${INNER_R}px`,
            boxShadow: "inset 0 1px 2px 0 rgb(0 0 0 / 0.4)",
          }}
        />
        {/* knob — inset inside the fill, grows on hover/drag */}
        <div
          style={{
            position: "absolute",
            top: knobInset,
            bottom: knobInset,
            left: knobLeft,
            width: knobW,
            background: active
              ? "rgb(255 255 255 / 0.7)"
              : "rgb(255 255 255 / 0.55)",
            borderRadius: 2,
            transition:
              "top 120ms ease, bottom 120ms ease, width 120ms ease, background 120ms ease",
          }}
        />
        {/* value label — fixed to far right */}
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
          <span style={{ fontSize: 13, color: "rgb(255 255 255 / 0.65)" }}>
            {display}
          </span>
        </div>
      </div>
    </div>
  )
}
