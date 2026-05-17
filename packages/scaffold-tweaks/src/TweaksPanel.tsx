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
    setTweak(field.fieldId, v)
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
      />
    )
  } else if (field.type === 'select') {
    control = (
      <SelectControl
        options={stringOptions}
        value={value}
        onChange={handleChange}
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
      />
    )
  }

  return (
    <Field label={field.name} blurb={blurb}>
      {control}
    </Field>
  )
}

export function TweaksPanelBody() {
  const { fields } = useTweaks()
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

export function TweaksPanel() {
  return (
    <TweaksPanelShell>
      <TweaksPanelBody />
    </TweaksPanelShell>
  )
}
