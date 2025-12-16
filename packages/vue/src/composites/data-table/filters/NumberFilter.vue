<script setup lang="ts" generic="TData, TValue">
import { IconX } from '@meldui/tabler-vue'
import type { Column } from '@tanstack/vue-table'
import { type Component, computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { NumberOperator } from '../types'
import { getFilterIcon } from './filter-icons'
import {
  getAvailableOperators,
  getDefaultOperator,
  getOperatorLabel,
  isBinaryOperator,
  isNullaryOperator,
} from './operators'

interface Props {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  unit?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number

  // Advanced mode props
  advancedMode?: boolean
  defaultOperator?: NumberOperator
  availableOperators?: NumberOperator[]

  // Initial value for URL state restoration
  initialValue?:
    | number
    | [number, number]
    | { operator: NumberOperator; value: number | [number, number] }
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter number...',
  defaultOpen: false,
  advancedMode: false,
})

const emit = defineEmits<{
  remove: []
  valueChange: [
    value:
      | number
      | [number, number]
      | { operator: NumberOperator; value: number | [number, number] }
      | undefined,
  ]
  close: []
}>()

const isOpen = ref(props.defaultOpen)

// Initialize from initialValue prop for URL state restoration
const getInitialOperator = (): NumberOperator => {
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    'operator' in props.initialValue
  ) {
    return props.initialValue.operator
  }
  return (
    props.defaultOperator ?? (getDefaultOperator('number', props.advancedMode) as NumberOperator)
  )
}

const getInitialValue = (): string => {
  if (props.initialValue === undefined || props.initialValue === null) return ''
  if (typeof props.initialValue === 'number') return String(props.initialValue)
  if (typeof props.initialValue === 'object' && 'value' in props.initialValue) {
    const val = props.initialValue.value
    return typeof val === 'number' ? String(val) : ''
  }
  return ''
}

const getInitialMinMax = (): [string, string] => {
  if (!props.initialValue) return ['', '']
  if (Array.isArray(props.initialValue)) {
    return [String(props.initialValue[0]), String(props.initialValue[1])]
  }
  if (typeof props.initialValue === 'object' && 'value' in props.initialValue) {
    const val = props.initialValue.value
    if (Array.isArray(val)) {
      return [String(val[0]), String(val[1])]
    }
  }
  return ['', '']
}

const [initMin, initMax] = getInitialMinMax()
const localOperator = ref<NumberOperator>(getInitialOperator())
const localValue = ref(getInitialValue())
const localMin = ref(initMin)
const localMax = ref(initMax)
const appliedValue = ref<
  | number
  | [number, number]
  | { operator: NumberOperator; value: number | [number, number] }
  | undefined
>(props.initialValue)
const inputRef = ref<{ $el: HTMLInputElement } | null>(null)

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
    (getAvailableOperators('number', props.advancedMode) as NumberOperator[]),
)

// Check if operator requires value
const requiresValue = computed(() => !isNullaryOperator(localOperator.value))

// Check if operator requires two values (between)
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
        localMin.value = String(val[0])
        localMax.value = String(val[1])
      } else {
        localValue.value = String(val)
      }
    } else if (Array.isArray(appliedValue.value)) {
      // Simple mode range
      localMin.value = String(appliedValue.value[0])
      localMax.value = String(appliedValue.value[1])
    } else if (appliedValue.value !== undefined) {
      localValue.value = String(appliedValue.value)
    } else {
      localValue.value = ''
      localMin.value = ''
      localMax.value = ''
    }

    setTimeout(() => {
      const inputEl = inputRef.value?.$el as HTMLInputElement
      inputEl?.focus()
    }, 150)
  } else if (oldValue && !newValue) {
    // Reset on close (restore to applied state)
    emit('close')
  }
})

// Watch operator changes
watch(localOperator, (newOp) => {
  if (isNullaryOperator(newOp)) {
    localValue.value = ''
    localMin.value = ''
    localMax.value = ''
  }
})

// Check if filtered
const isFiltered = computed(() => appliedValue.value !== undefined)

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (!requiresValue.value) return true // Nullary operators can always be applied
  if (requiresTwoValues.value) {
    return localMin.value !== '' && localMax.value !== ''
  }
  return localValue.value !== ''
})

// Apply filter
const clearFilter = () => {
  localValue.value = ''
  localMin.value = ''
  localMax.value = ''
  localOperator.value =
    props.defaultOperator ?? (getDefaultOperator('number', props.advancedMode) as NumberOperator)
  appliedValue.value = undefined
  emit('valueChange', undefined)
  emit('remove')
}

const applyFilter = () => {
  if (isNullaryOperator(localOperator.value)) {
    // Nullary operator
    const filterValue = props.advancedMode ? { operator: localOperator.value, value: 0 } : undefined
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  } else if (requiresTwoValues.value && localMin.value && localMax.value) {
    // Between operator
    const min = Number(localMin.value)
    const max = Number(localMax.value)
    const filterValue = props.advancedMode
      ? {
          operator: localOperator.value,
          value: [min, max] as [number, number],
        }
      : ([min, max] as [number, number])
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  } else if (localValue.value) {
    // Single value
    const numValue = Number(localValue.value)
    const filterValue = props.advancedMode
      ? { operator: localOperator.value, value: numValue }
      : numValue
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  }
  isOpen.value = false
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    applyFilter()
  } else if (event.key === 'Escape') {
    isOpen.value = false
  }
}

// Format display value
const displayValue = computed(() => {
  if (!appliedValue.value) return ''

  if (typeof appliedValue.value === 'number') {
    return `${appliedValue.value}${props.unit || ''}`
  }

  if (Array.isArray(appliedValue.value)) {
    return `${appliedValue.value[0]} - ${appliedValue.value[1]}${props.unit || ''}`
  }

  const { operator, value } = appliedValue.value
  if (isNullaryOperator(operator)) {
    return getOperatorLabel(operator)
  }
  if (Array.isArray(value)) {
    return `${value[0]} - ${value[1]}${props.unit || ''}`
  }
  return `${value}${props.unit || ''}`
})

// Show operator in pill
const displayOperator = computed(() => {
  if (!props.advancedMode || !appliedValue.value) return ''
  if (typeof appliedValue.value !== 'object' || !('operator' in appliedValue.value)) return ''
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
                    :aria-label="`Filter by ${title || 'number'}`"
                >
                    <!-- Icon -->
                    <component
                        :is="getFilterIcon(icon, 'number')"
                        class="mr-2 h-4 w-4 shrink-0"
                    />

                    <!-- Title | Operator | Value -->
                    <span class="text-xs">
                        {{ title || "Number" }}
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

            <PopoverContent class="w-[280px]" align="start">
                <div class="space-y-2">
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

                    <!-- Single value input -->
                    <Input
                        v-if="requiresValue && !requiresTwoValues"
                        ref="inputRef"
                        v-model="localValue"
                        type="number"
                        :placeholder="placeholder"
                        class="h-8 text-xs"
                        @keydown="handleKeyDown"
                    />

                    <!-- Between operator - two inputs -->
                    <div v-if="requiresTwoValues" class="flex gap-2">
                        <Input
                            v-model="localMin"
                            type="number"
                            placeholder="Min"
                            class="h-8 text-xs flex-1"
                            @keydown="handleKeyDown"
                        />
                        <Input
                            v-model="localMax"
                            type="number"
                            placeholder="Max"
                            class="h-8 text-xs flex-1"
                            @keydown="handleKeyDown"
                        />
                    </div>

                    <!-- Preview (advanced mode) -->
                    <p
                        v-if="advancedMode && hasChanges"
                        class="text-xs text-muted-foreground"
                    >
                        Filter:
                        <span class="font-medium text-foreground">
                            {{ getOperatorLabel(localOperator) }}
                            <template
                                v-if="requiresTwoValues && localMin && localMax"
                            >
                                {{ localMin }} - {{ localMax }}{{ unit }}
                            </template>
                            <template v-else-if="requiresValue && localValue">
                                {{ localValue }}{{ unit }}
                            </template>
                        </span>
                    </p>

                    <!-- Apply button -->
                    <Button
                        v-if="hasChanges"
                        size="sm"
                        class="w-full h-7 text-xs"
                        :disabled="
                            (requiresValue &&
                                !requiresTwoValues &&
                                !localValue) ||
                            (requiresTwoValues && (!localMin || !localMax))
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
