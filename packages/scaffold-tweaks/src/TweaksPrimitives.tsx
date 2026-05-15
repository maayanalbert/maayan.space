import React, {
  useEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react"

// Dials icon — three horizontal sliders at different positions
function DialsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="1"
        y1="4"
        x2="15"
        y2="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="5"
        cy="4"
        r="2"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="1"
        y1="8"
        x2="15"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="11"
        cy="8"
        r="2"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="1"
        y1="12"
        x2="15"
        y2="12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="7"
        cy="12"
        r="2"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

const panelShell: CSSProperties = {
  position: "fixed",
  bottom: 24,
  right: 24,
  zIndex: 50,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 12,
}

const panelCard: CSSProperties = {
  width: 288,
  background: "white",
  borderRadius: 16,
  boxShadow:
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
  border: "1px solid #f5f5f5",
  overflow: "hidden",
}

const panelBody: CSSProperties = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 20,
  maxHeight: 448,
  overflowY: "auto",
}

const toggleBtn: CSSProperties = {
  width: 36,
  height: 36,
  background: "#171717",
  color: "white",
  borderRadius: 9999,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.2)",
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
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <div ref={ref} style={panelShell}>
      {open && (
        <div style={panelCard}>
          <div style={panelBody}>{children}</div>
        </div>
      )}
      <button
        className="st-toggle"
        onClick={() => setOpen((o) => !o)}
        style={toggleBtn}
        aria-label="Toggle design panel"
      >
        <DialsIcon />
      </button>
    </div>
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
          color: "#a3a3a3",
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
      <p style={{ fontSize: 14, fontWeight: 500, color: "#404040", margin: 0 }}>
        {label}
      </p>
      {children}
      <p
        style={{
          fontSize: 12,
          color: "#a3a3a3",
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
  const pct = selectedIndex === -1 ? 0 : (selectedIndex / options.length) * 100

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        padding: 4,
        background: "#f5f5f5",
        borderRadius: 8,
      }}
    >
      {/* sliding pill */}
      {selectedIndex !== -1 && (
        <div
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: `calc(${pct}% + 4px)`,
            width: `calc(${100 / options.length}% - 8px)`,
            background: "white",
            borderRadius: 6,
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.08)",
            transition: "left 160ms cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: "none",
          }}
        />
      )}
      {options.map((opt) => (
        <button
          key={opt.value}
          className="st-seg-btn"
          onClick={() => onChange(opt.value)}
          style={{
            flex: 1,
            fontSize: 12,
            padding: "6px 0",
            borderRadius: 6,
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: value === opt.value ? "#171717" : "#737373",
            position: "relative",
            zIndex: 1,
            transition: "color 160ms ease",
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
      style={{ pointerEvents: 'none' }}
    >
      <path
        d="M2 4.5L6 8L10 4.5"
        stroke="#a3a3a3"
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
    <div style={{ position: 'relative', width: '100%' }}>
      <select
        className="st-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          fontSize: 13,
          border: '1px solid #e5e5e5',
          borderRadius: 8,
          padding: '8px 32px 8px 12px',
          background: 'white',
          color: '#171717',
          appearance: 'none',
          boxSizing: 'border-box',
          cursor: 'pointer',
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
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
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
  const pct = ((value - min) / (max - min)) * 100
  const display = formatValue ? formatValue(value) : String(value)
  return (
    <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', height: 34, cursor: 'pointer' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#e9e9eb' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: '#d1d1d6' }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 12px', pointerEvents: 'none',
      }}>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: '#3c3c43' }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          appearance: 'none', WebkitAppearance: 'none',
          background: 'transparent', cursor: 'pointer', margin: 0, padding: 0, opacity: 0,
        }}
      />
    </div>
  )
}
