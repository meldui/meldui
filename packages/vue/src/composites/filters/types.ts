import type { DateValue } from '@internationalized/date'
import type { Component } from 'vue'

// ============================================================================
// Filter Types
// ============================================================================

/**
 * All available filter types
 *
 * MODE RESTRICTIONS:
 * - Simple mode (advancedMode: false): All 8 types allowed
 * - Advanced mode (advancedMode: true): Only base types allowed (text, number, date, select, boolean)
 *
 * Complex types (multiselect, range, daterange) are NOT allowed in advanced mode.
 * Use base types with operators instead:
 *   - multiselect → select with defaultOperator: "isAnyOf"
 *   - range → number with defaultOperator: "between"
 *   - daterange → date with defaultOperator: "isBetween"
 */
export type FilterType =
  | 'text' // Text input
  | 'number' // Number input
  | 'date' // Single date picker
  | 'select' // Single select dropdown
  | 'boolean' // Boolean toggle
  | 'multiselect' // Multi-select dropdown (SIMPLE MODE ONLY)
  | 'range' // Number range slider (SIMPLE MODE ONLY)
  | 'daterange' // Date range picker (SIMPLE MODE ONLY)

/**
 * Base filter types (allowed in both simple and advanced modes)
 */
export type BaseFilterType = 'text' | 'number' | 'date' | 'select' | 'boolean'

/**
 * Complex filter types (SIMPLE MODE ONLY - not allowed in advanced mode)
 */
export type ComplexFilterType = 'multiselect' | 'range' | 'daterange'

/**
 * Map complex types to base types for migration reference
 * Note: These mappings are for developer guidance only.
 * The system enforces that complex types cannot be used in advanced mode.
 */
export const COMPLEX_TO_BASE_TYPE_MAP: Record<ComplexFilterType, BaseFilterType> = {
  multiselect: 'select', // Use select + isAnyOf operator instead
  range: 'number', // Use number + between operator instead
  daterange: 'date', // Use date + isBetween operator instead
} as const

/**
 * Check if filter type is complex (simple mode only).
 * Accepts plugin-registered string types and returns false for them.
 */
export function isComplexFilterType(
  type: FilterType | (string & {}),
): type is ComplexFilterType {
  return type === 'multiselect' || type === 'range' || type === 'daterange'
}

/**
 * Get base type for any filter type
 */
export function getBaseFilterType(type: FilterType): BaseFilterType {
  if (isComplexFilterType(type)) {
    return COMPLEX_TO_BASE_TYPE_MAP[type]
  }
  return type as BaseFilterType
}

// ============================================================================
// Operator Definitions
// ============================================================================

export type TextOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'notContains'
  | 'notEquals'
  | 'isEmpty'
  | 'isNotEmpty'

export type NumberOperator =
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'isEmpty'
  | 'isNotEmpty'

export type DateOperator = 'is' | 'isBefore' | 'isAfter' | 'isBetween' | 'isEmpty' | 'isNotEmpty'

export type SelectOperator = 'is' | 'isAnyOf' | 'isNot' | 'isNoneOf' | 'isEmpty' | 'isNotEmpty'

export type BooleanOperator = 'is' | 'isEmpty' | 'isNotEmpty'

export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | SelectOperator
  | BooleanOperator

export type OperatorForType<T extends FilterType> = T extends 'text'
  ? TextOperator
  : T extends 'number' | 'range'
    ? NumberOperator
    : T extends 'date' | 'daterange'
      ? DateOperator
      : T extends 'select' | 'multiselect'
        ? SelectOperator
        : T extends 'boolean'
          ? BooleanOperator
          : never

// ============================================================================
// Simple Mode Filter Values
// ============================================================================

export type SimpleTextFilterValue = string[]
export type SimpleNumberFilterValue = number[]
export type SimpleDateFilterValue = DateValue[]
export type SimpleSelectFilterValue = string
export type SimpleBooleanFilterValue = boolean
export type SimpleMultiSelectFilterValue = string[]
export type SimpleRangeFilterValue = [number, number][]
export type SimpleDateRangeFilterValue = { start: DateValue; end: DateValue }[]

export type SimpleFilterValue =
  | SimpleTextFilterValue
  | SimpleNumberFilterValue
  | SimpleDateFilterValue
  | SimpleSelectFilterValue
  | SimpleBooleanFilterValue
  | SimpleMultiSelectFilterValue
  | SimpleRangeFilterValue
  | SimpleDateRangeFilterValue

// ============================================================================
// Advanced Mode Filter Values
// ============================================================================

export interface FilterWithOperator<
  TValue = unknown,
  TOperator extends FilterOperator = FilterOperator,
> {
  operator: TOperator
  value: TValue
}

export type AdvancedTextFilterValue = FilterWithOperator<string, TextOperator>[]
export type AdvancedNumberFilterValue = FilterWithOperator<
  number | [number, number],
  NumberOperator
>[]
export type AdvancedDateFilterValue = FilterWithOperator<
  DateValue | [DateValue, DateValue] | null,
  DateOperator
>[]
export type AdvancedSelectFilterValue = FilterWithOperator<string | string[], SelectOperator>[]
export type AdvancedBooleanFilterValue = FilterWithOperator<boolean, BooleanOperator>[]

export type AdvancedFilterValue =
  | AdvancedTextFilterValue
  | AdvancedNumberFilterValue
  | AdvancedDateFilterValue
  | AdvancedSelectFilterValue
  | AdvancedBooleanFilterValue

export type FilterInstanceValue = SimpleFilterValue | AdvancedFilterValue

export type FilterValue =
  | string
  | string[]
  | number
  | number[]
  | [number, number]
  | DateValue
  | DateValue[]
  | { start: DateValue; end: DateValue }
  | boolean
  | FilterWithOperator

// ============================================================================
// Filter Field Config
// ============================================================================

export interface FilterOption {
  label: string
  value: string
  icon?: Component
}

export interface DataTableFilterField<TData = unknown> {
  id: keyof TData
  label: string
  placeholder?: string
  /**
   * Filter type - can be a built-in type or a custom plugin type string
   * Built-in types: text, number, date, select, boolean, multiselect, range, daterange
   * Custom types: any string registered via filterPlugins
   */
  type: FilterType | (string & {})
  options?: FilterOption[]
  icon?: Component

  // Number-specific
  min?: number
  max?: number
  step?: number
  unit?: string

  // Range-specific
  range?: [number, number]

  // Advanced mode configuration
  defaultOperator?: FilterOperator
  availableOperators?: FilterOperator[]

  [key: string]: unknown
}
