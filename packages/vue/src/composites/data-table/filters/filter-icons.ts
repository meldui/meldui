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
import type { FilterType } from '../types'

/**
 * Get the default icon for a filter type
 */
export function getDefaultFilterIcon(filterType: FilterType | undefined): Component {
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
  filterType: FilterType | undefined,
): Component {
  return icon ?? getDefaultFilterIcon(filterType)
}
