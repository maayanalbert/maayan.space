import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from 'react'
import type { FieldDef, ToggleState, TogglesContextValue } from './types'

const STYLE_ID = 'toggletation-styles'
const LS_KEY = 'toggletation-state'

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

const TogglesContext = createContext<TogglesContextValue>({
  toggles: [],
  fields: [],
  setToggle: () => {},
  getValue: () => '',
  getDefaultValue: () => '',
})

function getDefaultForField(
  field: FieldDef,
  defaults?: Record<string, string | number>
): string {
  if (defaults && defaults[field.fieldId] !== undefined) {
    return String(defaults[field.fieldId])
  }
  const current = field.options.find((o) => o.current) ?? field.options[0]
  return String(current.value)
}

function loadFromStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

function saveToStorage(toggles: ToggleState[]) {
  try {
    const map: Record<string, string> = {}
    for (const t of toggles) map[t.fieldId] = t.value
    localStorage.setItem(LS_KEY, JSON.stringify(map))
  } catch {}
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function TogglesProvider({
  fields,
  defaults,
  persist = false,
  children,
}: {
  fields: FieldDef[]
  defaults?: Record<string, string | number>
  /** When true, read/write toggle state to localStorage (dev panel). Off in production. */
  persist?: boolean
  children: ReactNode
}) {
  const [toggles, setToggles] = useState<ToggleState[]>(() =>
    fields.map((f) => ({
      fieldId: f.fieldId,
      value: getDefaultForField(f, defaults),
    }))
  )

  // Restore persisted values before paint so SSR markup matches the first client frame.
  useIsomorphicLayoutEffect(() => {
    if (!persist) return
    const stored = loadFromStorage()
    setToggles((prev) => {
      const next = prev.map((t) => ({
        ...t,
        value: stored[t.fieldId] ?? t.value,
      }))
      const changed = next.some((t, i) => t.value !== prev[i]?.value)
      return changed ? next : prev
    })
  }, [persist])

  // Sync any fields added after initial mount (e.g. hot-reload)
  useEffect(() => {
    if (!persist) return
    setToggles((prev) => {
      const stored = loadFromStorage()
      const existing = new Set(prev.map((t) => t.fieldId))
      const newEntries = fields
        .filter((f) => !existing.has(f.fieldId))
        .map((f) => ({
          fieldId: f.fieldId,
          value: stored[f.fieldId] ?? getDefaultForField(f, defaults),
        }))
      return newEntries.length === 0 ? prev : [...prev, ...newEntries]
    })
  }, [fields, persist, defaults])

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

  function setToggle(fieldId: string, value: string) {
    setToggles((prev) => {
      const next = prev.map((t) =>
        t.fieldId === fieldId ? { ...t, value } : t
      )
      if (persist) saveToStorage(next)
      return next
    })
  }

  function getValue(fieldId: string): string {
    return toggles.find((t) => t.fieldId === fieldId)?.value ?? ''
  }

  function getDefaultValue(fieldId: string): string {
    const field = fields.find((f) => f.fieldId === fieldId)
    if (!field) return ''
    return getDefaultForField(field, defaults)
  }

  return (
    <TogglesContext.Provider
      value={{ toggles, fields, setToggle, getValue, getDefaultValue }}
    >
      {children}
    </TogglesContext.Provider>
  )
}

export function useToggles(): TogglesContextValue {
  return useContext(TogglesContext)
}
