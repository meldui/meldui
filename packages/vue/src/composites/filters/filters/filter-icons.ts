import {
  IconAdjustmentsHorizontal,
  IconCalendar,
  IconCalendarPlus,
  IconCircleCheck,
  IconCirclePlus,
  IconHash,
  IconLetterCase,
  IconToggleRight,
} from '@meldui/tabler-vue'
import type { Component } from 'vue'

export type FilterType =
  | 'text'
  | 'select'
  | 'multiselect'
  | 'number'
  | 'range'
  | 'boolean'
  | 'date'
  | 'daterange'

/**
 * Get the default icon for a filter type.
 * Accepts plugin-registered string types and falls through to the default icon.
 */
export function getDefaultFilterIcon(
  filterType: FilterType | (string & {}) | undefined,
): Component {
  switch (filterType) {
    case 'text':
      return IconLetterCase
    case 'select':
      return IconCircleCheck
    case 'multiselect':
      return IconCirclePlus
    case 'number':
      return IconHash
    case 'range':
      return IconAdjustmentsHorizontal
    case 'boolean':
      return IconToggleRight
    case 'date':
      return IconCalendar
    case 'daterange':
      return IconCalendarPlus
    default:
      return IconCirclePlus // Default fallback
  }
}

/**
 * Get the filter icon (provided icon or default based on type)
 */
export function getFilterIcon(
  icon: Component | undefined,
  filterType: FilterType | (string & {}) | undefined,
): Component {
  return icon ?? getDefaultFilterIcon(filterType)
}
