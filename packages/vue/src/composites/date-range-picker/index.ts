// Main component
export { default as DateRangePicker } from './DateRangePicker.vue'

// Sub-components (for advanced customization)
export { default as DateRangePickerCalendar } from './DateRangePickerCalendar.vue'
export { default as DateRangePickerContent } from './DateRangePickerContent.vue'
export { default as DateRangePickerPresets } from './DateRangePickerPresets.vue'
export { default as DateRangePickerTrigger } from './DateRangePickerTrigger.vue'

// Presets
export { defaultRangePresets, defaultSinglePresets } from './presets'

// Types
export type {
  DatePreset,
  DateRange,
  DateRangePickerEmits,
  DateRangePickerProps,
  DateRangePreset,
} from './types'
