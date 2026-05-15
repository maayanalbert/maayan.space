export type FieldType = 'segmented' | 'select' | 'slider'

export type Option = {
  value: string | number
  label?: string
  explanation: string
  current: boolean
}

type BaseField = {
  fieldId: string
  name: string
  category: string
  options: Option[]
}

export type SegmentedField = BaseField & { type: 'segmented' }
export type SelectField = BaseField & { type: 'select' }
export type SliderField = BaseField & {
  type: 'slider'
  min: number
  max: number
  step?: number
}

export type FieldDef = SegmentedField | SelectField | SliderField

export type TweakState = {
  fieldId: string
  value: string
}

export type TweaksContextValue = {
  tweaks: TweakState[]
  fields: FieldDef[]
  setTweak: (fieldId: string, value: string) => void
  getValue: (fieldId: string) => string
}
