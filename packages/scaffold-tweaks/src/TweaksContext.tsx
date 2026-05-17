import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import type { FieldDef, TweakState, TweaksContextValue } from './types'

const STYLE_ID = 'toggletation-styles'

const INJECTED_CSS = `
.st-toggle:hover { background: #252525 !important; }
.st-seg-btn:hover { color: rgba(255, 255, 255, 0.7) !important; }
.st-select:focus { outline: none; }
.st-toggle { transition: background 180ms ease, color 180ms ease; }
.st-seg-btn { transition: background 120ms ease, color 120ms ease; }
.st-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 9999px; outline: none; cursor: pointer; background: linear-gradient(to right, #c8c8c8 var(--st-pct, 50%), #e8e8e8 var(--st-pct, 50%)); }
.st-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 0; height: 0; }
.st-slider::-moz-range-thumb { width: 0; height: 0; border: none; }
`

const TweaksContext = createContext<TweaksContextValue>({
  tweaks: [],
  fields: [],
  setTweak: () => {},
  getValue: () => '',
})

export function TogglesProvider({
  fields,
  children,
}: {
  fields: FieldDef[]
  children: ReactNode
}) {
  const [tweaks, setTweaks] = useState<TweakState[]>(() =>
    fields.map((f) => {
      const current = f.options.find((o) => o.current) ?? f.options[0]
      return { fieldId: f.fieldId, value: String(current.value) }
    })
  )

  // Sync any fields added after initial mount (e.g. hot-reload)
  useEffect(() => {
    setTweaks((prev) => {
      const existing = new Set(prev.map((t) => t.fieldId))
      const newEntries = fields
        .filter((f) => !existing.has(f.fieldId))
        .map((f) => {
          const current = f.options.find((o) => o.current) ?? f.options[0]
          return { fieldId: f.fieldId, value: String(current.value) }
        })
      return newEntries.length === 0 ? prev : [...prev, ...newEntries]
    })
  }, [fields])

  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = INJECTED_CSS
    document.head.appendChild(style)
    return () => {
      document.getElementById(STYLE_ID)?.remove()
    }
  }, [])

  function setTweak(fieldId: string, value: string) {
    setTweaks((prev) =>
      prev.map((t) => (t.fieldId === fieldId ? { ...t, value } : t))
    )
  }

  function getValue(fieldId: string): string {
    return tweaks.find((t) => t.fieldId === fieldId)?.value ?? ''
  }

  return (
    <TweaksContext.Provider value={{ tweaks, fields, setTweak, getValue }}>
      {children}
    </TweaksContext.Provider>
  )
}

export function useToggles(): TweaksContextValue {
  return useContext(TweaksContext)
}
