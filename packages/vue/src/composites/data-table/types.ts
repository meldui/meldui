import type { DateValue } from '@internationalized/date'
import type { ColumnPinningState } from '@tanstack/vue-table'
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
 * Check if filter type is complex (simple mode only)
 */
export function isComplexFilterType(type: FilterType): type is ComplexFilterType {
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

/**
 * Text filter operators
 */
export type TextOperator =
  | 'contains' // Default - case insensitive substring match
  | 'equals' // Exact match
  | 'startsWith' // Starts with
  | 'endsWith' // Ends with
  | 'notContains' // Does not contain
  | 'notEquals' // Not equal to
  | 'isEmpty' // Is empty/null
  | 'isNotEmpty' // Has value

/**
 * Number filter operators
 */
export type NumberOperator =
  | 'equals' // Default - exact match
  | 'notEquals' // Not equal
  | 'greaterThan' // >
  | 'greaterThanOrEqual' // >=
  | 'lessThan' // <
  | 'lessThanOrEqual' // <=
  | 'between' // Range (replaces old "range" type)
  | 'isEmpty' // Is null
  | 'isNotEmpty' // Has value

/**
 * Date filter operators
 */
export type DateOperator =
  | 'is' // Default - exact date
  | 'isBefore' // Before date
  | 'isAfter' // After date
  | 'isBetween' // Date range (replaces old "daterange" type)
  | 'isEmpty' // Is null
  | 'isNotEmpty' // Has value

/**
 * Select filter operators
 */
export type SelectOperator =
  | 'is' // Default - equals (single value)
  | 'isAnyOf' // In array (replaces old "multiselect" type)
  | 'isNot' // Not equals
  | 'isNoneOf' // Not in array
  | 'isEmpty' // Is null
  | 'isNotEmpty' // Has value

/**
 * Boolean filter operators
 */
export type BooleanOperator =
  | 'is' // Default - equals
  | 'isEmpty' // Is null
  | 'isNotEmpty' // Has value

/**
 * Union of all operators
 */
export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | SelectOperator
  | BooleanOperator

/**
 * Map filter types to their operators
 */
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

/**
 * Simple filter value format (no operators)
 * Each type uses its most natural representation
 */

// Multi-instance supported (arrays)
export type SimpleTextFilterValue = string[] // ["john", "jane"]
export type SimpleNumberFilterValue = number[] // [25, 30, 40]
export type SimpleDateFilterValue = DateValue[] // [DateValue1, DateValue2]

// Single instance only (primitives)
export type SimpleSelectFilterValue = string // "admin"
export type SimpleBooleanFilterValue = boolean // true

// Special cases (arrays of complex values, multi-instance supported)
export type SimpleMultiSelectFilterValue = string[] // ["active", "inactive"]
export type SimpleRangeFilterValue = [number, number][] // [[30000, 150000], [200000, 250000]]
export type SimpleDateRangeFilterValue = { start: DateValue; end: DateValue }[] // [{start, end}, ...]

/**
 * Union of all simple filter values
 */
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

/**
 * Advanced filter value with operator
 * ALWAYS in array format for consistency
 */
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

/**
 * Union of all advanced filter values
 */
export type AdvancedFilterValue =
  | AdvancedTextFilterValue
  | AdvancedNumberFilterValue
  | AdvancedDateFilterValue
  | AdvancedSelectFilterValue
  | AdvancedBooleanFilterValue

/**
 * Filter instance value (mode-dependent)
 * Simple mode: natural format per type
 * Advanced mode: always array of operator objects
 */
export type FilterInstanceValue = SimpleFilterValue | AdvancedFilterValue

/**
 * Legacy types for backward compatibility
 */
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
// Server-Side Types
// ============================================================================

/**
 * Server filter value type - what the server API expects
 */
export type ServerFilterValue =
  | string // select, search
  | boolean // boolean
  | string[] // text (multi), number (multi), multiselect
  | number[] // number (multi)
  | DateValue[] // date (multi)
  | { start: number; end: number }[] // range (transformed from tuples)
  | { start: DateValue; end: DateValue }[] // daterange
  | FilterWithOperator[] // advanced mode (all types)

/**
 * Server-side table parameters
 *
 * Simple Mode Examples:
 * {
 *   filters: {
 *     name: ["john", "jane"],              // text - multi-instance array
 *     age: [25, 30, 40],                   // number - multi-instance array
 *     role: "admin",                       // select - single primitive
 *     is_verified: true,                   // boolean - single primitive
 *     status: ["active", "inactive"],      // multiselect - array
 *     salary: [{ start: 30000, end: 50000 }], // range - transformed to objects
 *     created_at: [{ start, end }]         // daterange - objects
 *   }
 * }
 *
 * Advanced Mode Examples:
 * {
 *   filters: {
 *     name: [
 *       { operator: "contains", value: "john" },
 *       { operator: "startsWith", value: "admin" }
 *     ],
 *     age: [
 *       { operator: "equals", value: 25 },
 *       { operator: "between", value: [30, 40] }
 *     ],
 *     role: [{ operator: "is", value: "admin" }],
 *     is_verified: [{ operator: "is", value: true }],
 *     status: [{ operator: "isAnyOf", value: ["active", "inactive"] }],
 *     salary: [{ operator: "between", value: [30000, 50000] }],
 *     created_at: [{ operator: "isBetween", value: [start, end] }]
 *   }
 * }
 */
export interface ServerSideTableParams {
  page: number
  per_page: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  filters?: Record<string, ServerFilterValue>
}

/**
 * Server response for paginated data
 */
export interface ServerSideTableResponse<T> {
  data: T[]
  meta: {
    current_page: number
    per_page: number
    total: number
    total_pages: number
  }
}

// ============================================================================
// Bulk Actions
// ============================================================================

/**
 * Bulk action option for DataTable row selection actions
 */
export interface BulkActionOption<TData = unknown> {
  label: string
  icon?: Component
  variant?: 'default' | 'destructive'
  action: (selectedRows: TData[]) => void
}

// ============================================================================
// Column Pinning
// ============================================================================

/**
 * Re-export ColumnPinningState from TanStack Table
 * Interface for column pinning state
 *
 * @example
 * ```ts
 * const pinning: ColumnPinningState = {
 *   left: ['select', 'name'],
 *   right: ['actions']
 * };
 * ```
 */
export type { ColumnPinningState }

/**
 * Helper type for initial pinning configuration
 */
export interface DataTablePinningConfig {
  left?: string[]
  right?: string[]
}
