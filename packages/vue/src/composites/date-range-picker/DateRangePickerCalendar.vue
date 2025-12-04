<script setup lang="ts">
import type { DateValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { cn } from '@/lib/utils'
import type { DateRange } from './types'

const props = defineProps<{
  mode: 'single' | 'range'
  modelValue?: DateValue | DateRange
  locale?: string
  minValue?: DateValue
  maxValue?: DateValue
  disabled?: boolean
  readonly?: boolean
  numberOfMonths?: number
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  'update:modelValue': [value: DateValue | DateRange | undefined]
}>()

const handleSingleUpdate = (value: DateValue | undefined) => {
  emit('update:modelValue', value)
}

const handleRangeUpdate = (value: DateRange) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    data-slot="date-range-picker-calendar"
    :class="cn(props.class)"
  >
    <Calendar
      v-if="mode === 'single'"
      :model-value="modelValue as DateValue"
      :locale="locale"
      :min-value="minValue"
      :max-value="maxValue"
      :disabled="disabled"
      :readonly="readonly"
      :number-of-months="numberOfMonths"
      @update:model-value="handleSingleUpdate"
    />
    <RangeCalendar
      v-else
      :model-value="modelValue as DateRange"
      :locale="locale"
      :min-value="minValue"
      :max-value="maxValue"
      :disabled="disabled"
      :readonly="readonly"
      :number-of-months="numberOfMonths"
      @update:model-value="handleRangeUpdate"
    />
  </div>
</template>
