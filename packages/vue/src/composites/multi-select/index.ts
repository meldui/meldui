export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectGroup {
  label: string
  options: string[] | MultiSelectOption[]
}

export interface MultiSelectProps {
  modelValue?: string[]
  options?: string[] | MultiSelectOption[]
  groups?: MultiSelectGroup[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  maxDisplay?: number
  max?: number
  disabled?: boolean
  creatable?: boolean
  createLabel?: (value: string) => string
}

export type MultiSelectEmits = (e: 'update:modelValue', value: string[]) => void

export { default as MultiSelect } from './MultiSelect.vue'
