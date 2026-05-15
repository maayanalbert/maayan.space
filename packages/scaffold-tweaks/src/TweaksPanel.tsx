import React from 'react'
import { useTweaks } from './TweaksContext'
import {
  TweaksPanelShell,
  Section,
  Field,
  SegmentedControl,
  SelectControl,
  SliderControl,
} from './TweaksPrimitives'
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
  const { getValue, setTweak } = useTweaks()
  const value = getValue(field.fieldId)

  const selectedOption =
    field.options.find((o) => String(o.value) === value) ?? field.options[0]
  const blurb = selectedOption.explanation

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
        onChange={(v) => setTweak(field.fieldId, v)}
      />
    )
  } else if (field.type === 'select') {
    control = (
      <SelectControl
        options={stringOptions}
        value={value}
        onChange={(v) => setTweak(field.fieldId, v)}
      />
    )
  } else {
    control = (
      <SliderControl
        min={field.min}
        max={field.max}
        step={field.step}
        value={Number(value)}
        onChange={(v) => setTweak(field.fieldId, String(v))}
      />
    )
  }

  return (
    <Field label={field.name} blurb={blurb}>
      {control}
    </Field>
  )
}

export function TweaksPanel() {
  const { fields } = useTweaks()
  const grouped = groupByCategory(fields)

  return (
    <TweaksPanelShell>
      {Array.from(grouped.entries()).map(([category, categoryFields]) => (
        <Section key={category} label={category}>
          {categoryFields.map((field) => (
            <FieldControl key={field.fieldId} field={field} />
          ))}
        </Section>
      ))}
    </TweaksPanelShell>
  )
}
