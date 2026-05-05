import type { Column } from '@tanstack/vue-table'
import type { Component } from 'vue'
import type { FilterOperator } from './types'

// ============================================================================
// Filter Plugin Types
// ============================================================================

/**
 * Props that will be passed to a custom filter component
 */
export interface FilterPluginComponentProps<TData = unknown, TValue = unknown> {
  /** The column being filtered */
  column?: Column<TData, TValue>
  /** Filter title/label */
  title: string
  /** Placeholder text */
  placeholder?: string
  /** Icon component */
  icon?: Component
  /** Whether to auto-open on mount */
  defaultOpen?: boolean
  /** Trigger to re-open the filter */
  openTrigger?: number
  /** Whether advanced mode is enabled */
  advancedMode?: boolean
  /** Default operator */
  defaultOperator?: FilterOperator
  /** Available operators */
  availableOperators?: FilterOperator[]
  /** Any additional custom props from the filter field */
  [key: string]: unknown
}

/**
 * Events that a custom filter component should emit.
 * This is documentation only - use defineEmits with these event names:
 * - 'value-change': [value: YourValueType | undefined]
 * - 'remove': []
 * - 'close': []
 */

/**
 * Filter plugin definition
 *
 * @example
 * ```ts
 * const currencyFilter = defineFilter({
 *   type: 'currency',
 *   component: CurrencyFilterComponent,
 *   operators: ['equals', 'greaterThan', 'lessThan', 'between'],
 *   defaultOperator: 'equals',
 * })
 * ```
 */
export interface FilterPlugin<TValue = unknown> {
  /** Unique filter type identifier */
  type: string
  /** Vue component that renders the filter UI */
  component: Component
  /** Available operators for this filter type (optional) */
  operators?: FilterOperator[]
  /** Default operator when none specified (optional) */
  defaultOperator?: FilterOperator
  /**
   * Whether this filter supports multiple instances
   * @default false in simple mode, true in advanced mode
   */
  supportsMultiInstance?: boolean
  /**
   * Serialize the filter value for server-side requests
   * Use this to transform the component's internal value to a format your API expects
   */
  serialize?: (value: TValue) => unknown
  /**
   * Deserialize a server value back to the component's format
   * Use this when loading saved filters
   */
  deserialize?: (value: unknown) => TValue
}

/**
 * Registered filter plugin with resolved defaults
 */
export interface RegisteredFilterPlugin<TValue = unknown> extends FilterPlugin<TValue> {
  /** Whether this is a built-in filter type */
  isBuiltIn: false
}

// ============================================================================
// Filter Plugin Registry
// ============================================================================

/**
 * Built-in filter types that cannot be overridden
 */
export const BUILT_IN_FILTER_TYPES = [
  'text',
  'number',
  'date',
  'select',
  'boolean',
  'multiselect',
  'range',
  'daterange',
] as const

export type BuiltInFilterType = (typeof BUILT_IN_FILTER_TYPES)[number]

/**
 * Check if a filter type is built-in
 */
export function isBuiltInFilterType(type: string): type is BuiltInFilterType {
  return BUILT_IN_FILTER_TYPES.includes(type as BuiltInFilterType)
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Define a custom filter plugin
 *
 * @example
 * ```ts
 * // Create a currency filter
 * const currencyFilter = defineFilter({
 *   type: 'currency',
 *   component: CurrencyFilterComponent,
 *   operators: ['equals', 'greaterThan', 'lessThan', 'between'],
 *   defaultOperator: 'equals',
 *   supportsMultiInstance: true,
 *   serialize: (value) => ({
 *     amount: value.amount,
 *     currency: value.currency
 *   }),
 * })
 *
 * // Use in DataTable
 * <DataTable
 *   :filter-plugins="[currencyFilter]"
 *   :filter-fields="[
 *     { id: 'price', label: 'Price', type: 'currency', currency: 'USD' }
 *   ]"
 * />
 * ```
 *
 * @param plugin - Filter plugin configuration
 * @returns Registered filter plugin ready for use
 */
export function defineFilter<TValue = unknown>(
  plugin: FilterPlugin<TValue>,
): RegisteredFilterPlugin<TValue> {
  // Validate plugin type doesn't conflict with built-in types
  if (isBuiltInFilterType(plugin.type)) {
    console.warn(
      `[DataTable] Filter type "${plugin.type}" is a built-in type and cannot be overridden. ` +
        `Choose a different type name for your custom filter.`,
    )
  }

  return {
    ...plugin,
    isBuiltIn: false,
  }
}

// ============================================================================
// Plugin Resolution
// ============================================================================

/**
 * Create a plugin map from an array of plugins for quick lookup
 */
export function createPluginMap(
  plugins: RegisteredFilterPlugin[],
): Map<string, RegisteredFilterPlugin> {
  const map = new Map<string, RegisteredFilterPlugin>()

  for (const plugin of plugins) {
    if (isBuiltInFilterType(plugin.type)) {
      // Skip built-in types - they're handled separately
      continue
    }
    map.set(plugin.type, plugin)
  }

  return map
}

/**
 * Get a filter plugin by type
 */
export function getFilterPlugin(
  type: string,
  pluginMap: Map<string, RegisteredFilterPlugin>,
): RegisteredFilterPlugin | undefined {
  return pluginMap.get(type)
}

/**
 * Check if a filter type is from a plugin
 */
export function isPluginFilterType(
  type: string,
  pluginMap: Map<string, RegisteredFilterPlugin>,
): boolean {
  return pluginMap.has(type)
}

// ============================================================================
// Utility Types for Plugin Authors
// ============================================================================

/**
 * Helper type for creating typed filter components
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import type { FilterPluginComponentProps } from '@meldui/vue'
 *
 * interface CurrencyValue {
 *   amount: number
 *   currency: string
 * }
 *
 * const props = defineProps<FilterPluginComponentProps & {
 *   currency?: string
 *   min?: number
 *   max?: number
 * }>()
 *
 * const emit = defineEmits<{
 *   'value-change': [value: CurrencyValue | undefined]
 *   'remove': []
 *   'close': []
 * }>()
 * </script>
 * ```
 */
