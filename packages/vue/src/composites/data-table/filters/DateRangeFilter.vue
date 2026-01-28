<script setup lang="ts" generic="TData, TValue">
import type { DateValue } from '@internationalized/date'
import { IconX } from '@meldui/tabler-vue'
import type { Column } from '@tanstack/vue-table'
import { type Component, computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { cn } from '@/lib/utils'
import { getFilterIcon } from './filter-icons'

// Define DateRange type for range calendar
// Note: Properties are required but values can be undefined (matches reka-ui's DateRange)
interface DateRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

interface Props {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  icon?: Component
  defaultOpen?: boolean

  // Initial value for URL state restoration
  initialValue?: DateRange
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pick date range',
  defaultOpen: false,
})

const emit = defineEmits<{
  remove: []
  valueChange: [value: DateRange | undefined]
  close: []
}>()

const localRange = ref<unknown>(props.initialValue)
const appliedValue = ref<unknown>(props.initialValue)
const isOpen = ref(props.defaultOpen)

// Watch popover open/close to reset local value and emit close event
watch(isOpen, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    // Popover opened - reset local range to applied value
    localRange.value = appliedValue.value
  } else if (oldValue && !newValue) {
    // Popover closed - reset local range to applied value (discard unsaved changes)
    localRange.value = appliedValue.value

    // Emit close event
    emit('close')
  }
})

const handleSelect = (range: unknown) => {
  localRange.value = range

  // Auto-apply when both start and end dates are selected
  if (range && typeof range === 'object' && 'start' in range && 'end' in range) {
    const rangeValue = range as { start: unknown; end: unknown }
    if (rangeValue.start && rangeValue.end) {
      appliedValue.value = range
      emit('valueChange', range as DateRange)
      // Close popover after daterange selection
      setTimeout(() => {
        isOpen.value = false
      }, 50)
    }
  }
}

const clearFilter = () => {
  localRange.value = undefined
  appliedValue.value = undefined
  emit('valueChange', undefined)
  emit('remove')
}

const isFiltered = computed(() => {
  if (!appliedValue.value || typeof appliedValue.value !== 'object') return false
  const val = appliedValue.value as { start?: unknown; end?: unknown }
  return val.start !== undefined && val.end !== undefined
})

// Computed property to cast localRange to RangeCalendar component's expected type
const calendarRange = computed({
  get: () => localRange.value as DateRange | undefined,
  set: (value) => {
    localRange.value = value
  },
})

const formatDateRange = (range: unknown) => {
  // Only format if both start and end dates exist
  if (!range || typeof range !== 'object') return ''
  const rangeObj = range as { start?: unknown; end?: unknown }
  if (!rangeObj.start || !rangeObj.end) return ''

  const start = rangeObj.start
  const end = rangeObj.end

  // Type guards to ensure dates have required properties
  if (
    typeof start !== 'object' ||
    !start ||
    !('year' in start && 'month' in start && 'day' in start)
  )
    return ''
  if (typeof end !== 'object' || !end || !('year' in end && 'month' in end && 'day' in end))
    return ''

  const startDate = new Date(
    (start as { year: number; month: number; day: number }).year,
    (start as { year: number; month: number; day: number }).month - 1,
    (start as { year: number; month: number; day: number }).day,
  )
  const endDate = new Date(
    (end as { year: number; month: number; day: number }).year,
    (end as { year: number; month: number; day: number }).month - 1,
    (end as { year: number; month: number; day: number }).day,
  )

  // Format as range
  const startFormatted = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const endFormatted = endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return `${startFormatted} - ${endFormatted}`
}
</script>

<template>
  <div class="flex items-center">
    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          size="sm"
          :class="cn('h-8', isFiltered && 'rounded-r-none border-r-0')"
          :aria-label="`Filter by ${title || 'date'}`"
        >
          <!-- Icon on the left -->
          <component :is="getFilterIcon(icon, 'daterange')" class="mr-2 h-4 w-4 shrink-0" />

          <!-- Title | Selected Date/Range -->
          <span class="text-xs">
            {{ title || 'Date Range' }}
            <template v-if="isFiltered">
              <span class="mx-1.5 text-muted-foreground">|</span>
              <span class="font-normal">{{ formatDateRange(appliedValue) }}</span>
            </template>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <RangeCalendar :model-value="calendarRange" @update:model-value="handleSelect" />
      </PopoverContent>
    </Popover>

    <!-- Clear button - shows when filtered, appears as part of single button -->
    <Button
      v-if="isFiltered"
      variant="outline"
      size="sm"
      class="h-8 w-8 p-0 rounded-l-none border-l-0"
      @click="clearFilter"
    >
      <IconX class="h-4 w-4" />
      <span class="sr-only">Clear filter</span>
    </Button>
  </div>
</template>
