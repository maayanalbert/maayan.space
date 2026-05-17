import React, { useRef, useState, useEffect, type CSSProperties } from "react"

// ─── shared visuals ────────────────────────────────────────────────────────

const PANEL_W = 240

const panelCard: CSSProperties = {
  width: PANEL_W,
  background: "#1c1c1c",
  borderRadius: 16,
  boxShadow:
    "0 4px 12px -2px rgb(0 0 0 / 0.35), 0 0 0 0.5px rgb(255 255 255 / 0.08)",
  border: "1px solid rgb(255 255 255 / 0.08)",
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
}

const fakeRow: CSSProperties = {
  height: 10,
  borderRadius: 5,
  background: "rgb(255 255 255 / 0.1)",
}

function FakePanel() {
  return (
    <div style={panelCard}>
      {[90, 60, 75, 50, 80].map((w, i) => (
        <div key={i} style={{ ...fakeRow, width: `${w}%` }} />
      ))}
    </div>
  )
}

function Btn({
  open,
  onClick,
}: {
  open: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 42,
        height: 42,
        borderRadius: 9999,
        background: open ? "#fff" : "#1c1c1c",
        color: open ? "#000" : "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 2px 8px -1px rgb(0 0 0 / 0.4), 0 0 0 0.5px rgb(255 255 255 / 0.1)",
        transition: "background 150ms ease, color 150ms ease",
        flexShrink: 0,
      }}
      aria-label="Toggle panel"
    >
      ⊞
    </button>
  )
}

// ─── demo wrapper ──────────────────────────────────────────────────────────

function Demo({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: (open: boolean, toggle: () => void) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "relative",
          width: PANEL_W,
          height: 240,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        {children(open, () => setOpen((o) => !o))}
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "rgb(255 255 255 / 0.88)",
            margin: "0 0 4px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "rgb(255 255 255 / 0.4)",
            lineHeight: 1.5,
            margin: 0,
            maxWidth: PANEL_W,
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

// ─── animation variants ────────────────────────────────────────────────────

/** 1. Instant — no transition */
function InstantDemo() {
  return (
    <Demo
      label="No animation"
      description="Conditional render — panel mounts and unmounts instantly."
    >
      {(open, toggle) => (
        <>
          {open && (
            <div style={{ position: "absolute", bottom: 54, right: 0 }}>
              <FakePanel />
            </div>
          )}
          <Btn open={open} onClick={toggle} />
        </>
      )}
    </Demo>
  )
}

/** 2. Fade only */
function FadeDemo() {
  return (
    <Demo
      label="Fade"
      description="Opacity fades in and out. Simple but doesn't hint at where the panel came from."
    >
      {(open, toggle) => (
        <>
          <div
            style={{
              position: "absolute",
              bottom: 54,
              right: 0,
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transition: open
                ? "opacity 180ms ease"
                : "opacity 140ms ease",
            }}
          >
            <FakePanel />
          </div>
          <Btn open={open} onClick={toggle} />
        </>
      )}
    </Demo>
  )
}

/** 3. Slide up + fade */
function SlideDemo() {
  return (
    <Demo
      label="Slide up + fade"
      description="Translates upward from the button. Directional but no spatial relationship to the toggle."
    >
      {(open, toggle) => (
        <>
          <div
            style={{
              position: "absolute",
              bottom: 54,
              right: 0,
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(12px)",
              pointerEvents: open ? "auto" : "none",
              transition: open
                ? "opacity 200ms ease, transform 200ms cubic-bezier(0.25, 0, 0, 1)"
                : "opacity 150ms ease, transform 150ms cubic-bezier(0.4, 0, 1, 1)",
            }}
          >
            <FakePanel />
          </div>
          <Btn open={open} onClick={toggle} />
        </>
      )}
    </Demo>
  )
}

/** 4. Scale from corner + fade (current implementation) */
function ScaleCornerDemo() {
  return (
    <Demo
      label="Scale from corner + fade"
      description="Scales out from the button's corner. Feels like the panel grows directly from the toggle."
    >
      {(open, toggle) => (
        <>
          <div
            style={{
              position: "absolute",
              bottom: 54,
              right: 0,
              opacity: open ? 1 : 0,
              transform: open
                ? "scale(1) translateY(0)"
                : "scale(0.93) translateY(8px)",
              transformOrigin: "bottom right",
              pointerEvents: open ? "auto" : "none",
              transition: open
                ? "opacity 180ms ease, transform 180ms cubic-bezier(0.25, 0, 0, 1)"
                : "opacity 140ms ease, transform 140ms cubic-bezier(0.4, 0, 1, 1)",
            }}
          >
            <FakePanel />
          </div>
          <Btn open={open} onClick={toggle} />
        </>
      )}
    </Demo>
  )
}

/** 5. Spring pop — keyframe overshoot */
function SpringDemo() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function toggle() {
    if (!open) {
      setVisible(true)
      requestAnimationFrame(() => setOpen(true))
    } else {
      setOpen(false)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(false), 200)
    }
  }

  return (
    <Demo
      label="Spring pop"
      description="Overshoots slightly past 1× before settling. Lively and physical — can feel playful or jittery depending on context."
    >
      {(_open, _toggle) => (
        <>
          <style>{`
            @keyframes st-spring-in {
              0%   { opacity: 0; transform: scale(0.88) translateY(10px); }
              60%  { opacity: 1; transform: scale(1.03) translateY(-2px); }
              80%  { transform: scale(0.99) translateY(1px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes st-spring-out {
              0%   { opacity: 1; transform: scale(1); }
              100% { opacity: 0; transform: scale(0.9) translateY(8px); }
            }
          `}</style>
          {visible && (
            <div
              style={{
                position: "absolute",
                bottom: 54,
                right: 0,
                transformOrigin: "bottom right",
                animation: open
                  ? "st-spring-in 280ms cubic-bezier(0.25, 0, 0, 1) forwards"
                  : "st-spring-out 180ms ease forwards",
                pointerEvents: open ? "auto" : "none",
              }}
            >
              <FakePanel />
            </div>
          )}
          <Btn open={open} onClick={toggle} />
        </>
      )}
    </Demo>
  )
}

// ─── page ──────────────────────────────────────────────────────────────────

export default function TweaksTestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 40px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ marginBottom: 64, textAlign: "center" }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "rgb(255 255 255 / 0.88)",
            margin: "0 0 8px",
          }}
        >
          Panel animation variants
        </h1>
        <p style={{ fontSize: 14, color: "rgb(255 255 255 / 0.4)", margin: 0 }}>
          Click the button in each demo to compare open/close animations.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 48,
          overflowX: "auto",
          width: "100%",
          paddingBottom: 32,
        }}
      >
        <InstantDemo />
        <FadeDemo />
        <SlideDemo />
        <ScaleCornerDemo />
        <SpringDemo />
      </div>
    </div>
  )
}
