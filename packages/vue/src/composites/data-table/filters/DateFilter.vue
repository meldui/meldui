<script setup lang="ts" generic="TData, TValue">
import type { DateValue } from '@internationalized/date'
import { IconX } from '@meldui/tabler-vue'
import type { Column } from '@tanstack/vue-table'
import { type Component, computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { DateOperator } from '../types'
import { getFilterIcon } from './filter-icons'
import {
  getAvailableOperators,
  getDefaultOperator,
  getOperatorLabel,
  isBinaryOperator,
  isNullaryOperator,
} from './operators'

// Define DateRange type for range calendar
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
  openTrigger?: number

  // Advanced mode props
  advancedMode?: boolean
  defaultOperator?: DateOperator
  availableOperators?: DateOperator[]

  // Initial value for URL state restoration
  initialValue?:
    | DateValue
    | [DateValue, DateValue]
    | {
        operator: DateOperator
        value: DateValue | [DateValue, DateValue] | null
      }
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pick a date',
  defaultOpen: false,
  advancedMode: false,
})

const emit = defineEmits<{
  remove: []
  valueChange: [
    value:
      | DateValue
      | [DateValue, DateValue]
      | {
          operator: DateOperator
          value: DateValue | [DateValue, DateValue] | null
        }
      | undefined,
  ]
  close: []
}>()

const isOpen = ref(props.defaultOpen)

// Initialize from initialValue prop for URL state restoration
const getInitialOperator = (): DateOperator => {
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    'operator' in props.initialValue
  ) {
    return props.initialValue.operator
  }
  return props.defaultOperator ?? (getDefaultOperator('date', props.advancedMode) as DateOperator)
}

const getInitialDate = (): unknown => {
  if (!props.initialValue) return undefined
  // Check if it's a DateValue (has calendar property typically)
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    !('operator' in props.initialValue) &&
    !Array.isArray(props.initialValue)
  ) {
    return props.initialValue
  }
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    'value' in props.initialValue
  ) {
    const val = props.initialValue.value
    if (val && !Array.isArray(val)) return val
  }
  return undefined
}

const getInitialDateRange = (): DateRange | undefined => {
  if (!props.initialValue) return undefined
  if (Array.isArray(props.initialValue)) {
    return { start: props.initialValue[0], end: props.initialValue[1] }
  }
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    'value' in props.initialValue
  ) {
    const val = props.initialValue.value
    if (Array.isArray(val)) {
      return { start: val[0], end: val[1] }
    }
  }
  return undefined
}

const localOperator = ref<DateOperator>(getInitialOperator())
const localDate = ref<unknown>(getInitialDate())
const localDateRange = ref<DateRange | undefined>(getInitialDateRange())
const appliedValue = ref<
  | DateValue
  | [DateValue, DateValue]
  | {
      operator: DateOperator
      value: DateValue | [DateValue, DateValue] | null
    }
  | undefined
>(props.initialValue)

// Watch openTrigger to programmatically reopen
watch(
  () => props.openTrigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal && newVal !== undefined && newVal > 0) {
      isOpen.value = true
    }
  },
)

// Get available operators
const operators = computed(
  () =>
    props.availableOperators ??
    (getAvailableOperators('date', props.advancedMode) as DateOperator[]),
)

// Check if operator requires value
const requiresValue = computed(() => !isNullaryOperator(localOperator.value))

// Check if operator requires two values (isBetween)
const requiresTwoValues = computed(() => isBinaryOperator(localOperator.value))

// Watch popover state
watch(isOpen, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    // Reset to applied values
    if (
      appliedValue.value &&
      typeof appliedValue.value === 'object' &&
      'operator' in appliedValue.value
    ) {
      localOperator.value = appliedValue.value.operator
      const val = appliedValue.value.value
      if (Array.isArray(val)) {
        // Range values [start, end]
        localDateRange.value = { start: val[0], end: val[1] }
      } else {
        localDate.value = val
      }
    } else if (Array.isArray(appliedValue.value)) {
      // Simple mode range
      localDateRange.value = {
        start: appliedValue.value[0],
        end: appliedValue.value[1],
      }
    } else if (appliedValue.value !== undefined) {
      localDate.value = appliedValue.value
    } else {
      localDate.value = undefined
      localDateRange.value = undefined
    }
  } else if (oldValue && !newValue) {
    // Reset on close (restore to applied state)
    emit('close')
  }
})

// Watch operator changes
watch(localOperator, (newOp) => {
  if (isNullaryOperator(newOp)) {
    localDate.value = undefined
    localDateRange.value = undefined
  }
})

// Check if filtered
const isFiltered = computed(() => appliedValue.value !== undefined)

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (!requiresValue.value) return true // Nullary operators can always be applied
  if (requiresTwoValues.value) {
    return (
      localDateRange.value !== undefined &&
      localDateRange.value.start !== undefined &&
      localDateRange.value.end !== undefined
    )
  }
  return localDate.value !== undefined
})

// Apply filter
const clearFilter = () => {
  localDate.value = undefined
  localDateRange.value = undefined
  localOperator.value =
    props.defaultOperator ?? (getDefaultOperator('date', props.advancedMode) as DateOperator)
  appliedValue.value = undefined
  emit('valueChange', undefined)
  emit('remove')
}

const applyFilter = () => {
  if (isNullaryOperator(localOperator.value)) {
    // Nullary operator (isToday, isYesterday, etc.) - no date value needed
    const filterValue = props.advancedMode
      ? {
          operator: localOperator.value,
          value: null as DateValue | [DateValue, DateValue] | null,
        }
      : undefined
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  } else if (requiresTwoValues.value && localDateRange.value?.start && localDateRange.value?.end) {
    // Between operator (isBetween) - using range calendar
    const filterValue = props.advancedMode
      ? {
          operator: localOperator.value,
          value: [localDateRange.value.start, localDateRange.value.end] as [DateValue, DateValue],
        }
      : ([localDateRange.value.start, localDateRange.value.end] as [DateValue, DateValue])
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  } else if (localDate.value) {
    // Single date
    const filterValue = props.advancedMode
      ? {
          operator: localOperator.value,
          value: localDate.value as DateValue,
        }
      : (localDate.value as DateValue)
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  }
  isOpen.value = false
}

const handleSingleDateSelect = (date: unknown) => {
  localDate.value = date

  // Auto-apply in simple mode only
  if (!props.advancedMode && date) {
    applyFilter()
  }
}

const handleRangeSelect = (range: unknown) => {
  localDateRange.value = range as DateRange

  // Auto-apply when both dates are selected (simple mode behavior)
  if (range && typeof range === 'object' && 'start' in range && 'end' in range) {
    const rangeValue = range as DateRange
    if (rangeValue.start && rangeValue.end) {
      // In advanced mode, require explicit Apply button click
      // The range is stored but not applied until user clicks Apply
    }
  }
}

// Computed property to cast localDate to Calendar component's expected type
const calendarDate = computed({
  get: () => localDate.value as DateValue | undefined,
  set: (value) => {
    localDate.value = value
  },
})

const calendarRange = computed<DateRange | undefined>({
  get: () => {
    if (!localDateRange.value) return undefined
    return {
      start: localDateRange.value.start as DateValue | undefined,
      end: localDateRange.value.end as DateValue | undefined,
    }
  },
  set: (value) => {
    localDateRange.value = value
  },
})

const formatDate = (date: unknown) => {
  if (!date) return ''

  // Type guard to ensure date has required properties
  if (typeof date !== 'object' || !date || !('year' in date && 'month' in date && 'day' in date))
    return ''

  const jsDate = new Date(
    (date as { year: number; month: number; day: number }).year,
    (date as { year: number; month: number; day: number }).month - 1,
    (date as { year: number; month: number; day: number }).day,
  )

  return jsDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatDateRange = (range: DateRange) => {
  if (!range.start || !range.end) return ''
  return `${formatDate(range.start)} - ${formatDate(range.end)}`
}

// Format display value
const displayValue = computed(() => {
  if (!appliedValue.value) return ''

  if (typeof appliedValue.value === 'object' && 'year' in appliedValue.value) {
    return formatDate(appliedValue.value)
  }

  if (Array.isArray(appliedValue.value)) {
    return formatDateRange({
      start: appliedValue.value[0] as DateValue,
      end: appliedValue.value[1] as DateValue,
    })
  }

  const { operator, value } = appliedValue.value
  if (isNullaryOperator(operator)) {
    return getOperatorLabel(operator)
  }
  if (Array.isArray(value)) {
    return formatDateRange({
      start: value[0] as DateValue,
      end: value[1] as DateValue,
    })
  }
  return formatDate(value)
})

// Show operator in pill
const displayOperator = computed(() => {
  if (!props.advancedMode || !appliedValue.value) return ''
  if (
    typeof appliedValue.value !== 'object' ||
    !(appliedValue.value && 'operator' in appliedValue.value)
  )
    return ''
  return getOperatorLabel(appliedValue.value.operator)
})
</script>

<template>
    <div class="flex items-center">
        <Popover v-model:open="isOpen">
            <PopoverTrigger as-child>
                <Button
                    variant="outline"
                    size="sm"
                    :class="
                        cn(
                            'h-8',
                            isFiltered && 'rounded-r-none border-r-0',
                        )
                    "
                    :aria-label="`Filter by ${title || 'date'}`"
                >
                    <!-- Icon -->
                    <component
                        :is="getFilterIcon(icon, 'date')"
                        class="mr-2 h-4 w-4 shrink-0"
                    />

                    <!-- Title | Operator | Value -->
                    <span class="text-xs">
                        {{ title || "Date" }}
                        <template v-if="isFiltered">
                            <!-- Show operator with separator -->
                            <template v-if="displayOperator">
                                <span class="mx-1.5 text-muted-foreground"
                                    >|</span
                                >
                                <span class="text-muted-foreground">{{
                                    displayOperator
                                }}</span>
                            </template>
                            <!-- Value (only show if not nullary operator) -->
                            <template
                                v-if="
                                    !displayOperator ||
                                    (appliedValue &&
                                        typeof appliedValue === 'object' &&
                                        'operator' in appliedValue &&
                                        !isNullaryOperator(
                                            appliedValue.operator,
                                        ))
                                "
                            >
                                <span class="mx-1.5 text-muted-foreground"
                                    >|</span
                                >
                                <span class="font-normal">{{
                                    displayValue
                                }}</span>
                            </template>
                        </template>
                    </span>
                </Button>
            </PopoverTrigger>

            <PopoverContent class="w-auto p-3" align="start">
                <div class="space-y-3">
                    <!-- Operator selector (advanced mode only) -->
                    <Select v-if="advancedMode" v-model="localOperator">
                        <SelectTrigger class="h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="op in operators"
                                :key="op"
                                :value="op"
                            >
                                {{ getOperatorLabel(op) }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <!-- Single date picker -->
                    <Calendar
                        v-if="requiresValue && !requiresTwoValues"
                        :model-value="calendarDate"
                        @update:model-value="handleSingleDateSelect"
                    />

                    <!-- Between operator - range calendar (single calendar for both dates) -->
                    <RangeCalendar
                        v-if="requiresTwoValues"
                        :model-value="calendarRange"
                        @update:model-value="handleRangeSelect"
                    />

                    <!-- Preview (advanced mode) -->
                    <p
                        v-if="advancedMode && hasChanges"
                        class="text-xs text-muted-foreground"
                    >
                        Filter:
                        <span class="font-medium text-foreground">
                            {{ getOperatorLabel(localOperator) }}
                            <template
                                v-if="
                                    requiresTwoValues &&
                                    localDateRange?.start &&
                                    localDateRange?.end
                                "
                            >
                                {{
                                    formatDateRange({
                                        start: localDateRange.start as DateValue,
                                        end: localDateRange.end as DateValue,
                                    })
                                }}
                            </template>
                            <template v-else-if="requiresValue && localDate">
                                {{ formatDate(localDate) }}
                            </template>
                        </span>
                    </p>

                    <!-- Apply button (advanced mode or between operator) -->
                    <Button
                        v-if="advancedMode || requiresTwoValues"
                        size="sm"
                        class="w-full h-7 text-xs"
                        :disabled="
                            (requiresValue &&
                                !requiresTwoValues &&
                                !localDate) ||
                            (requiresTwoValues &&
                                (!localDateRange?.start ||
                                    !localDateRange?.end))
                        "
                        @click="applyFilter"
                    >
                        Apply Filter
                    </Button>
                </div>
            </PopoverContent>
        </Popover>

        <!-- Clear button -->
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
