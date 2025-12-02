import type { HeaderContext, Table } from '@tanstack/vue-table'
import { h } from 'vue'

// ============================================================================
// Types
// ============================================================================

/**
 * Options for sum aggregation
 */
export interface SumOptions {
  /** Format the result as currency */
  format?: 'number' | 'currency' | 'percent'
  /** Currency code for currency format (default: 'USD') */
  currency?: string
  /** Locale for number formatting (default: 'en-US') */
  locale?: string
  /** Number of decimal places */
  decimals?: number
  /** Prefix to add before the value */
  prefix?: string
  /** Suffix to add after the value */
  suffix?: string
}

/**
 * Options for count aggregation
 */
export interface CountOptions {
  /** Format string with {count} placeholder (default: '{count}') */
  format?: string
  /** Locale for number formatting (default: 'en-US') */
  locale?: string
}

/**
 * Options for average aggregation
 */
export interface AverageOptions {
  /** Format the result */
  format?: 'number' | 'currency' | 'percent'
  /** Currency code for currency format (default: 'USD') */
  currency?: string
  /** Locale for number formatting (default: 'en-US') */
  locale?: string
  /** Number of decimal places (default: 2) */
  decimals?: number
  /** Prefix to add before the value */
  prefix?: string
  /** Suffix to add after the value */
  suffix?: string
}

/**
 * Options for min/max aggregation
 */
export interface MinMaxOptions {
  /** Format the result */
  format?: 'number' | 'currency' | 'percent' | 'date'
  /** Currency code for currency format (default: 'USD') */
  currency?: string
  /** Locale for formatting (default: 'en-US') */
  locale?: string
  /** Number of decimal places */
  decimals?: number
  /** Date format options for date format */
  dateOptions?: Intl.DateTimeFormatOptions
  /** Prefix to add before the value */
  prefix?: string
  /** Suffix to add after the value */
  suffix?: string
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Formats a number based on the provided options
 */
function formatNumber(
  value: number,
  options: {
    format?: 'number' | 'currency' | 'percent'
    currency?: string
    locale?: string
    decimals?: number
    prefix?: string
    suffix?: string
  } = {},
): string {
  const {
    format = 'number',
    currency = 'USD',
    locale = 'en-US',
    decimals,
    prefix = '',
    suffix = '',
  } = options

  let formatted: string

  if (format === 'currency') {
    formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  } else if (format === 'percent') {
    formatted = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals ?? 0,
      maximumFractionDigits: decimals ?? 2,
    }).format(value)
  } else {
    formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  return `${prefix}${formatted}${suffix}`
}

/**
 * Extracts numeric values from table rows for a specific column
 */
function getColumnValues<TData>(table: Table<TData>, columnId: string): number[] {
  const rows = table.getFilteredRowModel().rows
  return rows
    .map((row) => {
      const value = row.getValue(columnId)
      if (typeof value === 'number') return value
      if (typeof value === 'string') {
        const parsed = Number.parseFloat(value)
        return Number.isNaN(parsed) ? null : parsed
      }
      return null
    })
    .filter((v): v is number => v !== null)
}

// ============================================================================
// Aggregation Helpers
// ============================================================================

/**
 * Creates a footer renderer that sums all values in the column
 *
 * @example
 * ```ts
 * helper.accessor('amount', {
 *   title: 'Amount',
 *   footer: aggregations.sum({ format: 'currency', currency: 'USD' })
 * })
 * ```
 */
export function sum<TData>(options: SumOptions = {}) {
  return ({ table, column }: HeaderContext<TData, unknown>) => {
    const values = getColumnValues(table, column.id)
    const total = values.reduce((acc, val) => acc + val, 0)
    return h('span', { class: 'font-medium' }, formatNumber(total, options))
  }
}

/**
 * Creates a footer renderer that counts all rows
 *
 * @example
 * ```ts
 * helper.accessor('id', {
 *   title: 'ID',
 *   footer: aggregations.count({ format: 'Total: {count} items' })
 * })
 * ```
 */
export function count<TData>(options: CountOptions = {}) {
  const { format = '{count}', locale = 'en-US' } = options

  return ({ table }: HeaderContext<TData, unknown>) => {
    const rowCount = table.getFilteredRowModel().rows.length
    const formattedCount = new Intl.NumberFormat(locale).format(rowCount)
    const text = format.replace('{count}', formattedCount)
    return h('span', { class: 'font-medium' }, text)
  }
}

/**
 * Creates a footer renderer that calculates the average of all values
 *
 * @example
 * ```ts
 * helper.accessor('score', {
 *   title: 'Score',
 *   footer: aggregations.average({ decimals: 1 })
 * })
 * ```
 */
export function average<TData>(options: AverageOptions = {}) {
  const { decimals = 2, ...rest } = options

  return ({ table, column }: HeaderContext<TData, unknown>) => {
    const values = getColumnValues(table, column.id)
    if (values.length === 0) return h('span', '-')

    const avg = values.reduce((acc, val) => acc + val, 0) / values.length
    return h('span', { class: 'font-medium' }, formatNumber(avg, { decimals, ...rest }))
  }
}

/**
 * Creates a footer renderer that finds the minimum value
 *
 * @example
 * ```ts
 * helper.accessor('price', {
 *   title: 'Price',
 *   footer: aggregations.min({ format: 'currency', prefix: 'Min: ' })
 * })
 * ```
 */
export function min<TData>(options: MinMaxOptions = {}) {
  const { format = 'number', dateOptions, ...rest } = options

  return ({ table, column }: HeaderContext<TData, unknown>) => {
    const rows = table.getFilteredRowModel().rows
    const values = rows.map((row) => row.getValue(column.id))

    if (values.length === 0) return h('span', '-')

    if (format === 'date') {
      const dates = values
        .filter((v): v is Date | string | number => v != null)
        .map((v) => (v instanceof Date ? v : new Date(v as string | number)))
        .filter((d) => !Number.isNaN(d.getTime()))

      if (dates.length === 0) return h('span', '-')

      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
      const formatted = new Intl.DateTimeFormat(
        rest.locale ?? 'en-US',
        dateOptions ?? { dateStyle: 'medium' },
      ).format(minDate)
      return h(
        'span',
        { class: 'font-medium' },
        `${rest.prefix ?? ''}${formatted}${rest.suffix ?? ''}`,
      )
    }

    const numericValues = getColumnValues(table, column.id)
    if (numericValues.length === 0) return h('span', '-')

    const minValue = Math.min(...numericValues)
    return h('span', { class: 'font-medium' }, formatNumber(minValue, { format, ...rest }))
  }
}

/**
 * Creates a footer renderer that finds the maximum value
 *
 * @example
 * ```ts
 * helper.accessor('price', {
 *   title: 'Price',
 *   footer: aggregations.max({ format: 'currency', prefix: 'Max: ' })
 * })
 * ```
 */
export function max<TData>(options: MinMaxOptions = {}) {
  const { format = 'number', dateOptions, ...rest } = options

  return ({ table, column }: HeaderContext<TData, unknown>) => {
    const rows = table.getFilteredRowModel().rows
    const values = rows.map((row) => row.getValue(column.id))

    if (values.length === 0) return h('span', '-')

    if (format === 'date') {
      const dates = values
        .filter((v): v is Date | string | number => v != null)
        .map((v) => (v instanceof Date ? v : new Date(v as string | number)))
        .filter((d) => !Number.isNaN(d.getTime()))

      if (dates.length === 0) return h('span', '-')

      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))
      const formatted = new Intl.DateTimeFormat(
        rest.locale ?? 'en-US',
        dateOptions ?? { dateStyle: 'medium' },
      ).format(maxDate)
      return h(
        'span',
        { class: 'font-medium' },
        `${rest.prefix ?? ''}${formatted}${rest.suffix ?? ''}`,
      )
    }

    const numericValues = getColumnValues(table, column.id)
    if (numericValues.length === 0) return h('span', '-')

    const maxValue = Math.max(...numericValues)
    return h('span', { class: 'font-medium' }, formatNumber(maxValue, { format, ...rest }))
  }
}

/**
 * Options for range aggregation (excludes date format)
 */
export interface RangeOptions {
  /** Format the result */
  format?: 'number' | 'currency' | 'percent'
  /** Currency code for currency format (default: 'USD') */
  currency?: string
  /** Locale for formatting (default: 'en-US') */
  locale?: string
  /** Number of decimal places */
  decimals?: number
  /** Prefix to add before the value */
  prefix?: string
  /** Suffix to add after the value */
  suffix?: string
}

/**
 * Creates a footer renderer that shows a range (min - max)
 *
 * @example
 * ```ts
 * helper.accessor('price', {
 *   title: 'Price',
 *   footer: aggregations.range({ format: 'currency' })
 * })
 * ```
 */
export function range<TData>(options: RangeOptions = {}) {
  const { format = 'number', ...rest } = options

  return ({ table, column }: HeaderContext<TData, unknown>) => {
    const values = getColumnValues(table, column.id)
    if (values.length === 0) return h('span', '-')

    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)

    const formattedMin = formatNumber(minValue, { format, ...rest, prefix: '', suffix: '' })
    const formattedMax = formatNumber(maxValue, { format, ...rest, prefix: '', suffix: '' })

    const prefix = rest.prefix ?? ''
    const suffix = rest.suffix ?? ''

    return h(
      'span',
      { class: 'font-medium' },
      `${prefix}${formattedMin} – ${formattedMax}${suffix}`,
    )
  }
}

/**
 * Creates a custom footer renderer with access to table and column context
 *
 * @example
 * ```ts
 * helper.accessor('status', {
 *   title: 'Status',
 *   footer: aggregations.custom(({ table }) => {
 *     const completed = table.getFilteredRowModel().rows
 *       .filter(r => r.original.status === 'completed').length
 *     return `${completed} completed`
 *   })
 * })
 * ```
 */
export function custom<TData>(
  renderer: (context: HeaderContext<TData, unknown>) => string | number,
) {
  return (context: HeaderContext<TData, unknown>) => {
    const result = renderer(context)
    return h('span', { class: 'font-medium' }, String(result))
  }
}

/**
 * Aggregation helpers for DataTable footer columns
 *
 * @example
 * ```ts
 * import { aggregations, createColumnHelper } from '@meldui/vue'
 *
 * const helper = createColumnHelper<Invoice>()
 *
 * const columns = [
 *   helper.accessor('id', {
 *     title: 'ID',
 *     footer: aggregations.count({ format: '{count} invoices' })
 *   }),
 *   helper.accessor('amount', {
 *     title: 'Amount',
 *     footer: aggregations.sum({ format: 'currency' })
 *   }),
 *   helper.accessor('tax', {
 *     title: 'Tax',
 *     footer: aggregations.average({ format: 'percent' })
 *   }),
 * ]
 * ```
 */
export const aggregations = {
  sum,
  count,
  average,
  min,
  max,
  range,
  custom,
}
