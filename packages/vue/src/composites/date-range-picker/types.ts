import type {
  CalendarRootProps,
  DateValue,
  RangeCalendarRootProps,
  DateRange as RekaDateRange,
} from 'reka-ui'
import type { HTMLAttributes } from 'vue'

/**
 * A date range object containing start and end dates.
 * Re-exported from reka-ui for compatibility.
 */
export type DateRange = RekaDateRange

/**
 * Preset for single date selection mode.
 */
export interface DatePreset {
  /** Display label for the preset button */
  label: string
  /** Function that returns the date value when the preset is selected */
  value: () => DateValue
}

/**
 * Preset for date range selection mode.
 */
export interface DateRangePreset {
  /** Display label for the preset button */
  label: string
  /** Function that returns the date range when the preset is selected */
  value: () => DateRange
}

/**
 * Props for the DateRangePicker component.
 */
export interface DateRangePickerProps {
  /** Selection mode: 'single' for single date, 'range' for date range */
  mode?: 'single' | 'range'

  /** Current value (DateValue for single mode, DateRange for range mode) */
  modelValue?: DateValue | DateRange

  /** Default value when uncontrolled */
  defaultValue?: DateValue | DateRange

  /** Custom presets (DatePreset[] for single mode, DateRangePreset[] for range mode) */
  presets?: DatePreset[] | DateRangePreset[]

  /** Whether to show the calendar (true) or only presets (false) */
  showCalendar?: boolean

  /** Whether to close the popover when a preset is selected */
  closeOnPresetSelect?: boolean

  /** Locale for date formatting (passed to calendar) */
  locale?: string

  /** Minimum selectable date */
  minValue?: DateValue

  /** Maximum selectable date */
  maxValue?: DateValue

  /** Whether the picker is disabled */
  disabled?: boolean

  /** Whether the picker is read-only */
  readonly?: boolean

  /** Number of months to display */
  numberOfMonths?: number

  /** Placeholder text when no date is selected */
  placeholder?: string

  /** Custom class for the root element */
  class?: HTMLAttributes['class']
}

/**
 * Events emitted by the DateRangePicker component.
 */
export interface DateRangePickerEmits {
  /** Emitted when the value changes */
  (e: 'update:modelValue', value: DateValue | DateRange | undefined): void
  /** Emitted when a preset is selected */
  (e: 'preset-select', preset: DatePreset | DateRangePreset): void
}

/**
 * Props for internal calendar wrapper (single mode).
 */
export type DateRangePickerCalendarSingleProps = Pick<
  CalendarRootProps,
  'locale' | 'minValue' | 'maxValue' | 'disabled' | 'readonly' | 'numberOfMonths'
> & {
  modelValue?: DateValue
  class?: HTMLAttributes['class']
}

/**
 * Props for internal calendar wrapper (range mode).
 */
export type DateRangePickerCalendarRangeProps = Pick<
  RangeCalendarRootProps,
  'locale' | 'minValue' | 'maxValue' | 'disabled' | 'readonly' | 'numberOfMonths'
> & {
  modelValue?: DateRange
  class?: HTMLAttributes['class']
}
