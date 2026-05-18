import { type ComponentType } from 'react'
import { useToggles } from './TogglesContext'

export function useVariant<T extends ComponentType<any>>(
  fieldId: string,
  variantMap: Record<string, T>
): T {
  const { getValue } = useToggles()
  const value = getValue(fieldId)
  const keys = Object.keys(variantMap)
  return variantMap[value] ?? variantMap[keys[0]]
}
