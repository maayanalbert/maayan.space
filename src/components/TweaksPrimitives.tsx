import { ReactNode, useState } from "react"

export function TweaksPanelShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              Design
            </span>
          </div>
          <div className="px-4 py-4 space-y-5 max-h-[28rem] overflow-y-auto">
            {children}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 bg-neutral-900 text-white rounded-full shadow-lg flex items-center justify-center text-sm font-medium hover:bg-neutral-700 transition-colors select-none"
        aria-label="Toggle design panel"
      >
        Aa
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
    <div className="space-y-3">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
        {label}
      </p>
      <div className="space-y-4">{children}</div>
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
    <div className="space-y-2">
      <p className="text-sm font-medium text-neutral-700">{label}</p>
      {children}
      <p className="text-xs text-neutral-400 leading-relaxed">{blurb}</p>
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
  return (
    <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${
            value === opt.value
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function SliderControl({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number
  max: number
  step?: number
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-neutral-900"
      />
      <span className="text-xs text-neutral-500 w-6 text-right tabular-nums">
        {value}
      </span>
    </div>
  )
}
