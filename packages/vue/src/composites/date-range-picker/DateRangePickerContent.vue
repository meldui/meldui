<script setup lang="ts">
import type { DateValue } from 'reka-ui'
import { PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import DateRangePickerCalendar from './DateRangePickerCalendar.vue'
import DateRangePickerPresets from './DateRangePickerPresets.vue'
import type { DatePreset, DateRange, DateRangePreset } from './types'

interface Props {
  mode: 'single' | 'range'
  // biome-ignore lint/suspicious/noExplicitAny: Flexible typing for vModel compatibility with useVModel
  modelValue?: any
  presets: DatePreset[] | DateRangePreset[]
  showCalendar?: boolean
  locale?: string
  minValue?: DateValue
  maxValue?: DateValue
  disabled?: boolean
  readonly?: boolean
  numberOfMonths?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  showCalendar: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | DateRange | undefined]
  'preset-select': [preset: DatePreset | DateRangePreset]
}>()

const handlePresetSelect = (preset: DatePreset | DateRangePreset) => {
  const value = preset.value()
  emit('update:modelValue', value)
  emit('preset-select', preset)
}

const handleCalendarUpdate = (value: DateValue | DateRange | undefined) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <PopoverContent
    data-slot="date-range-picker-content"
    :class="cn('w-auto min-w-[var(--reka-popover-trigger-width)] p-0', props.class)"
    align="start"
  >
    <div class="flex">
      <DateRangePickerPresets
        :presets="presets"
        :class="cn('px-2', showCalendar ? 'border-r' : 'flex-1')"
        @select="handlePresetSelect"
      />
      <DateRangePickerCalendar
        v-if="showCalendar"
        :mode="mode"
        :model-value="modelValue"
        :locale="locale"
        :min-value="minValue"
        :max-value="maxValue"
        :disabled="disabled"
        :readonly="readonly"
        :number-of-months="numberOfMonths"
        @update:model-value="handleCalendarUpdate"
      />
    </div>
  </PopoverContent>
</template>
