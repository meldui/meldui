import type { DateValue } from '@internationalized/date'
import type { ColumnPinningState } from '@tanstack/vue-table'
import type { Component } from 'vue'
import type { FilterInstanceValue, FilterWithOperator } from '@/composites/filters/types'

// ============================================================================
// Server-Side Types
// ============================================================================

/**
 * Server filter value type - what the server API expects per field.
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
 * Server-side table parameters.
 *
 * `filters` is keyed by field id. In simple mode each value follows the natural
 * per-type shape; in advanced mode each value is an array of `{ operator, value }`
 * objects. This shape matches `DataTableFilterState` forwarded to
 * `onServerSideChange.filters` and `<Filters>`'s `change` event payload.
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
 * Re-export ColumnPinningState from TanStack Table.
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

// ============================================================================
// Aggregated filter state forwarded to onServerSideChange.
// ============================================================================

/**
 * Filter state shape passed to `onServerSideChange.filters` and emitted by
 * `<Filters>`'s `change` event. Keyed by field id; values follow the per-type
 * shapes documented on `ServerSideTableParams.filters` above.
 */
export type DataTableFilterState = Record<string, FilterInstanceValue>
