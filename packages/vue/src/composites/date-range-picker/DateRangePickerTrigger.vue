<script setup lang="ts">
import { IconCalendar } from '@meldui/tabler-vue'
import type { DateValue } from 'reka-ui'
import { useDateFormatter } from 'reka-ui'
import { toDate } from 'reka-ui/date'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { DateRange } from './types'

interface Props {
  mode: 'single' | 'range'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue?: any
  placeholder?: string
  disabled?: boolean
  locale?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pick a date',
  locale: 'en',
})

const formatter = useDateFormatter(props.locale)

const displayText = computed(() => {
  if (!props.modelValue) {
    return props.placeholder
  }

  if (props.mode === 'single') {
    const date = props.modelValue as DateValue
    return formatter.custom(toDate(date), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const range = props.modelValue as DateRange
  if (!range.start || !range.end) {
    return props.placeholder
  }

  const startFormatted = formatter.custom(toDate(range.start), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const endFormatted = formatter.custom(toDate(range.end), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return `${startFormatted} - ${endFormatted}`
})

const hasValue = computed(() => {
  if (!props.modelValue) return false
  if (props.mode === 'single') return true
  const range = props.modelValue as DateRange
  return range.start && range.end
})
</script>

<template>
  <PopoverTrigger as-child>
    <Button
      variant="outline"
      data-slot="date-range-picker-trigger"
      :disabled="disabled"
      :class="
        cn('w-full justify-start font-normal', !hasValue && 'text-muted-foreground', props.class)
      "
    >
      <IconCalendar class="mr-2 size-4" />
      <span>{{ displayText }}</span>
    </Button>
  </PopoverTrigger>
</template>
