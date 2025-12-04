import { getLocalTimeZone, today } from '@internationalized/date'
import type { DatePreset, DateRangePreset } from './types'

/**
 * Get today's date in the local timezone.
 */
const getToday = () => today(getLocalTimeZone())

/**
 * Default presets for single date selection mode.
 */
export const defaultSinglePresets: DatePreset[] = [
  {
    label: 'Today',
    value: () => getToday(),
  },
  {
    label: 'Yesterday',
    value: () => getToday().subtract({ days: 1 }),
  },
  {
    label: '1 week ago',
    value: () => getToday().subtract({ weeks: 1 }),
  },
  {
    label: '1 month ago',
    value: () => getToday().subtract({ months: 1 }),
  },
]

/**
 * Default presets for date range selection mode.
 */
export const defaultRangePresets: DateRangePreset[] = [
  {
    label: 'Today',
    value: () => ({
      start: getToday(),
      end: getToday(),
    }),
  },
  {
    label: 'Yesterday',
    value: () => {
      const yesterday = getToday().subtract({ days: 1 })
      return {
        start: yesterday,
        end: yesterday,
      }
    },
  },
  {
    label: 'Last 7 days',
    value: () => ({
      start: getToday().subtract({ days: 6 }),
      end: getToday(),
    }),
  },
  {
    label: 'Last 30 days',
    value: () => ({
      start: getToday().subtract({ days: 29 }),
      end: getToday(),
    }),
  },
  {
    label: 'This month',
    value: () => {
      const now = getToday()
      return {
        start: now.set({ day: 1 }),
        end: now,
      }
    },
  },
  {
    label: 'Last month',
    value: () => {
      const now = getToday()
      const lastMonth = now.subtract({ months: 1 })
      const lastMonthStart = lastMonth.set({ day: 1 })
      // Get last day of last month by getting day 0 of current month
      const lastMonthEnd = now.set({ day: 1 }).subtract({ days: 1 })
      return {
        start: lastMonthStart,
        end: lastMonthEnd,
      }
    },
  },
]
