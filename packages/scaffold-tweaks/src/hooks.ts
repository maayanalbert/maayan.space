import { type ComponentType } from 'react'
import { useTweaks } from './TweaksContext'

export function useVariant<T extends ComponentType<any>>(
  fieldId: string,
  variantMap: Record<string, T>
): T {
  const { getValue } = useTweaks()
  const value = getValue(fieldId)
  const keys = Object.keys(variantMap)
  return variantMap[value] ?? variantMap[keys[0]]
}
