import type { CellContext } from '@tanstack/vue-table'
import { h, type VNode } from 'vue'
import { Badge } from '@/components/ui/badge'

// ============================================================================
// Types
// ============================================================================

/**
 * Available badge variants matching the Badge component
 */
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'neutral'

/**
 * Badge variant mapping based on value
 */
export interface BadgeOptions<TValue extends string = string> {
  /**
   * Map of values to badge variants
   * @example { active: 'default', inactive: 'secondary', pending: 'warning' }
   */
  variantMap?: Partial<Record<TValue, BadgeVariant>>
  /**
   * Default variant when value is not in variantMap
   * @default 'secondary'
   */
  defaultVariant?: BadgeVariant
  /**
   * Optional formatter for the display text
   * @default Capitalizes the value
   */
  format?: (value: TValue) => string
}

/**
 * Date formatting options
 */
export interface DateOptions {
  /**
   * Date format string (uses Intl.DateTimeFormat)
   * @default 'PP' (e.g., "Jan 1, 2024")
   */
  format?: 'short' | 'medium' | 'long' | 'full' | Intl.DateTimeFormatOptions
  /**
   * Locale for formatting
   * @default 'en-US'
   */
  locale?: string
  /**
   * Text to show for null/undefined values
   * @default '-'
   */
  fallback?: string
}

/**
 * Currency formatting options
 */
export interface CurrencyOptions {
  /**
   * Currency code (e.g., 'USD', 'EUR', 'GBP')
   * @default 'USD'
   */
  currency?: string
  /**
   * Locale for formatting
   * @default 'en-US'
   */
  locale?: string
  /**
   * Minimum fraction digits
   * @default 0
   */
  minimumFractionDigits?: number
  /**
   * Maximum fraction digits
   * @default 2
   */
  maximumFractionDigits?: number
  /**
   * Text to show for null/undefined values
   * @default '-'
   */
  fallback?: string
}

/**
 * Number formatting options
 */
export interface NumberOptions {
  /**
   * Locale for formatting
   * @default 'en-US'
   */
  locale?: string
  /**
   * Minimum fraction digits
   */
  minimumFractionDigits?: number
  /**
   * Maximum fraction digits
   */
  maximumFractionDigits?: number
  /**
   * Use grouping separators (e.g., 1,000)
   * @default true
   */
  useGrouping?: boolean
  /**
   * Compact display (e.g., 1K, 1M)
   * @default false
   */
  compact?: boolean
  /**
   * Text to show for null/undefined values
   * @default '-'
   */
  fallback?: string
}

/**
 * Boolean formatting options
 */
export interface BooleanOptions {
  /**
   * Text to show for true
   * @default 'Yes'
   */
  trueText?: string
  /**
   * Text to show for false
   * @default 'No'
   */
  falseText?: string
  /**
   * Use badge styling
   * @default false
   */
  asBadge?: boolean
  /**
   * Badge variant for true
   * @default 'default'
   */
  trueVariant?: BadgeVariant
  /**
   * Badge variant for false
   * @default 'secondary'
   */
  falseVariant?: BadgeVariant
}

// ============================================================================
// Cell Renderer Factory
// ============================================================================

/**
 * Common cell renderers for DataTable columns.
 *
 * @example
 * ```ts
 * import { createColumnHelper, cellRenderers } from '@meldui/vue'
 *
 * const helper = createColumnHelper<User>()
 *
 * const columns = [
 *   helper.accessor('status', {
 *     title: 'Status',
 *     cell: cellRenderers.badge({
 *       variantMap: { active: 'default', inactive: 'secondary' }
 *     })
 *   }),
 *   helper.accessor('createdAt', {
 *     title: 'Created',
 *     cell: cellRenderers.date({ format: 'medium' })
 *   }),
 *   helper.accessor('salary', {
 *     title: 'Salary',
 *     cell: cellRenderers.currency({ currency: 'USD' })
 *   })
 * ]
 * ```
 */
export const cellRenderers = {
  /**
   * Renders a badge with variant based on the cell value
   */
  badge<TData, TValue extends string>(
    options: BadgeOptions<TValue> = {},
  ): (props: CellContext<TData, TValue>) => VNode {
    const { variantMap, defaultVariant = 'secondary', format } = options
    const safeVariantMap = (variantMap ?? {}) as Partial<Record<string, BadgeVariant>>

    return (props: CellContext<TData, TValue>) => {
      const value = props.getValue()
      if (value == null) return h('span', { class: 'text-muted-foreground' }, '-')

      const variant = safeVariantMap[value] ?? defaultVariant
      const text = format ? format(value) : capitalize(String(value))

      return h(Badge, { variant }, () => text)
    }
  },

  /**
   * Formats a date value
   */
  date<TData, TValue extends Date | string | number>(
    options: DateOptions = {},
  ): (props: CellContext<TData, TValue>) => VNode | string {
    const { format = 'medium', locale = 'en-US', fallback = '-' } = options

    return (props: CellContext<TData, TValue>) => {
      const value = props.getValue()
      if (value == null) return h('span', { class: 'text-muted-foreground' }, fallback)

      try {
        const date = value instanceof Date ? value : new Date(value)
        if (Number.isNaN(date.getTime())) {
          return h('span', { class: 'text-muted-foreground' }, fallback)
        }

        let formatOptions: Intl.DateTimeFormatOptions

        if (typeof format === 'string') {
          switch (format) {
            case 'short':
              formatOptions = { dateStyle: 'short' }
              break
            case 'medium':
              formatOptions = { dateStyle: 'medium' }
              break
            case 'long':
              formatOptions = { dateStyle: 'long' }
              break
            case 'full':
              formatOptions = { dateStyle: 'full' }
              break
            default:
              formatOptions = { dateStyle: 'medium' }
          }
        } else {
          formatOptions = format
        }

        return new Intl.DateTimeFormat(locale, formatOptions).format(date)
      } catch {
        return h('span', { class: 'text-muted-foreground' }, fallback)
      }
    }
  },

  /**
   * Formats a number as currency
   */
  currency<TData, TValue extends number>(
    options: CurrencyOptions = {},
  ): (props: CellContext<TData, TValue>) => VNode | string {
    const {
      currency = 'USD',
      locale = 'en-US',
      minimumFractionDigits = 0,
      maximumFractionDigits = 2,
      fallback = '-',
    } = options

    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    })

    return (props: CellContext<TData, TValue>) => {
      const value = props.getValue()
      if (value == null) return h('span', { class: 'text-muted-foreground' }, fallback)

      try {
        return formatter.format(value)
      } catch {
        return h('span', { class: 'text-muted-foreground' }, fallback)
      }
    }
  },

  /**
   * Formats a number value
   */
  number<TData, TValue extends number>(
    options: NumberOptions = {},
  ): (props: CellContext<TData, TValue>) => VNode | string {
    const {
      locale = 'en-US',
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping = true,
      compact = false,
      fallback = '-',
    } = options

    const formatOptions: Intl.NumberFormatOptions = {
      useGrouping,
    }

    if (minimumFractionDigits !== undefined) {
      formatOptions.minimumFractionDigits = minimumFractionDigits
    }
    if (maximumFractionDigits !== undefined) {
      formatOptions.maximumFractionDigits = maximumFractionDigits
    }
    if (compact) {
      formatOptions.notation = 'compact'
    }

    const formatter = new Intl.NumberFormat(locale, formatOptions)

    return (props: CellContext<TData, TValue>) => {
      const value = props.getValue()
      if (value == null) return h('span', { class: 'text-muted-foreground' }, fallback)

      try {
        return formatter.format(value)
      } catch {
        return h('span', { class: 'text-muted-foreground' }, fallback)
      }
    }
  },

  /**
   * Formats a boolean value
   */
  boolean<TData, TValue extends boolean>(
    options: BooleanOptions = {},
  ): (props: CellContext<TData, TValue>) => VNode | string {
    const {
      trueText = 'Yes',
      falseText = 'No',
      asBadge = false,
      trueVariant = 'default',
      falseVariant = 'secondary',
    } = options

    return (props: CellContext<TData, TValue>) => {
      const value = props.getValue()
      const text = value ? trueText : falseText
      const variant = value ? trueVariant : falseVariant

      if (asBadge) {
        return h(Badge, { variant }, () => text)
      }

      return text
    }
  },

  /**
   * Truncates text with ellipsis
   */
  truncate<TData, TValue extends string>(
    maxLength: number,
    options: { showTooltip?: boolean } = {},
  ): (props: CellContext<TData, TValue>) => VNode | string {
    const { showTooltip = true } = options

    return (props: CellContext<TData, TValue>) => {
      const value = props.getValue()
      if (value == null) return h('span', { class: 'text-muted-foreground' }, '-')

      if (value.length <= maxLength) return value

      const truncated = value.slice(0, maxLength) + '...'

      if (showTooltip) {
        return h(
          'span',
          {
            class: 'truncate',
            title: value,
          },
          truncated,
        )
      }

      return truncated
    }
  },
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Capitalizes the first letter of a string
 */
function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
