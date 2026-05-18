import React from 'react'
import { useToggles } from './TogglesContext'
import {
  TogglesPanelShell,
  Section,
  Field,
  SegmentedControl,
  SelectControl,
  SliderControl,
} from './TogglesPrimitives'
import type { FieldDef } from './types'

function groupByCategory(fields: FieldDef[]): Map<string, FieldDef[]> {
  const map = new Map<string, FieldDef[]>()
  for (const field of fields) {
    const group = map.get(field.category) ?? []
    group.push(field)
    map.set(field.category, group)
  }
  return map
}

function FieldControl({ field }: { field: FieldDef }) {
  const { getValue, setToggle, getDefaultValue } = useToggles()
  const value = getValue(field.fieldId)
  const defaultValue = getDefaultValue(field.fieldId)
  const isModified = value !== defaultValue

  const selectedOption =
    field.type === 'slider'
      ? field.options.reduce((best, opt) =>
          Math.abs(Number(opt.value) - Number(value)) <
          Math.abs(Number(best.value) - Number(value))
            ? opt
            : best
        )
      : field.options.find((o) => String(o.value) === value) ?? field.options[0]
  const blurb = selectedOption.explanation

  function handleChange(v: string) {
    setToggle(field.fieldId, v)
  }

  const stringOptions = field.options.map((o) => ({
    label: o.label ?? String(o.value),
    value: String(o.value),
  }))

  let control: React.ReactNode

  if (field.type === 'segmented') {
    control = (
      <SegmentedControl
        options={stringOptions}
        value={value}
        onChange={handleChange}
        isModified={isModified}
      />
    )
  } else if (field.type === 'select') {
    control = (
      <SelectControl
        options={stringOptions}
        value={value}
        onChange={handleChange}
        isModified={isModified}
      />
    )
  } else {
    control = (
      <SliderControl
        min={field.min}
        max={field.max}
        step={field.step}
        value={Number(value)}
        onChange={(v) => handleChange(String(v))}
        isModified={isModified}
      />
    )
  }

  return (
    <Field label={field.name} blurb={blurb}>
      {control}
    </Field>
  )
}

export function TogglesPanelBody() {
  const { fields } = useToggles()
  const grouped = groupByCategory(fields)

  return (
    <>
      {Array.from(grouped.entries()).map(([category, categoryFields]) => (
        <Section key={category} label={category}>
          {categoryFields.map((field) => (
            <FieldControl key={field.fieldId} field={field} />
          ))}
        </Section>
      ))}
    </>
  )
}

export function TogglesPanel() {
  const { toggles, fields, getDefaultValue } = useToggles()

  const changedToggles = toggles.filter(
    (t) => t.value !== getDefaultValue(t.fieldId)
  )
  const hasChanges = changedToggles.length > 0

  function buildSnippet(): string {
    if (changedToggles.length === 0) return ''
    const entries = changedToggles.map(({ fieldId, value }) => {
      const field = fields.find((f) => f.fieldId === fieldId)
      const isSlider = field?.type === 'slider'
      const serialised = isSlider ? value : JSON.stringify(value)
      return `  ${fieldId}: ${serialised}`
    })
    const defaultsProp = `defaults={{\n${entries.join(',\n')}\n}}`
    return `Update the defaults prop on TogglesProvider to reflect these selected design options:\n\n${defaultsProp}`
  }

  function handleSave() {
    const snippet = buildSnippet()
    if (!snippet) return
    navigator.clipboard.writeText(snippet).catch(() => {
      // fallback: prompt so the user can copy manually
      window.prompt('Copy this snippet and paste it into TogglesProvider:', snippet)
    })
  }

  return (
    <TogglesPanelShell hasChanges={hasChanges} onSave={handleSave}>
      <TogglesPanelBody />
    </TogglesPanelShell>
  )
}
