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
import type { TextOperator } from '../types'
import { getFilterIcon } from './filter-icons'
import {
  getAvailableOperators,
  getDefaultOperator,
  getOperatorLabel,
  isNullaryOperator,
} from './operators'

interface Props {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number

  // Advanced mode props
  advancedMode?: boolean
  defaultOperator?: TextOperator
  availableOperators?: TextOperator[]

  // Initial value for URL state restoration
  initialValue?: string | { operator: TextOperator; value: string }
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter text...',
  defaultOpen: false,
  advancedMode: false,
})

const emit = defineEmits<{
  remove: []
  valueChange: [value: string | { operator: TextOperator; value: string } | undefined]
  close: []
}>()

const isOpen = ref(props.defaultOpen)

// Initialize from initialValue prop for URL state restoration
const getInitialOperator = (): TextOperator => {
  if (props.initialValue && typeof props.initialValue === 'object') {
    return props.initialValue.operator
  }
  return props.defaultOperator ?? (getDefaultOperator('text', props.advancedMode) as TextOperator)
}

const getInitialValue = (): string => {
  if (props.initialValue) {
    return typeof props.initialValue === 'object' ? props.initialValue.value : props.initialValue
  }
  return ''
}

const localOperator = ref<TextOperator>(getInitialOperator())
const localValue = ref(getInitialValue())
const appliedValue = ref<string | { operator: TextOperator; value: string } | undefined>(
  props.initialValue,
)
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
    (getAvailableOperators('text', props.advancedMode) as TextOperator[]),
)

// Check if operator requires value
const requiresValue = computed(() => !isNullaryOperator(localOperator.value))

// Watch popover state
watch(isOpen, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    // Reset to applied values
    if (appliedValue.value && typeof appliedValue.value === 'object') {
      localOperator.value = appliedValue.value.operator
      localValue.value = appliedValue.value.value
    } else {
      localValue.value = (appliedValue.value as string) ?? ''
    }

    setTimeout(() => {
      const inputEl = inputRef.value?.$el as HTMLInputElement
      inputEl?.focus()
    }, 150)
  } else if (oldValue && !newValue) {
    // Reset on close
    if (appliedValue.value && typeof appliedValue.value === 'object') {
      localOperator.value = appliedValue.value.operator
      localValue.value = appliedValue.value.value
    } else {
      localValue.value = (appliedValue.value as string) ?? ''
    }
    emit('close')
  }
})

// Watch operator changes
watch(localOperator, (newOp) => {
  if (isNullaryOperator(newOp)) {
    localValue.value = ''
  }
})

// Check if filtered
const isFiltered = computed(() => appliedValue.value !== undefined)

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (props.advancedMode) {
    if (!appliedValue.value)
      return localValue.value !== '' || isNullaryOperator(localOperator.value)
    if (typeof appliedValue.value === 'object') {
      return (
        localOperator.value !== appliedValue.value.operator ||
        localValue.value !== appliedValue.value.value
      )
    }
    return true
  }
  return localValue.value !== (appliedValue.value ?? '')
})

// Apply filter
const clearFilter = () => {
  localValue.value = ''
  localOperator.value =
    props.defaultOperator ?? (getDefaultOperator('text', props.advancedMode) as TextOperator)
  appliedValue.value = undefined
  emit('valueChange', undefined)
  emit('remove')
}

const applyFilter = () => {
  if (isNullaryOperator(localOperator.value)) {
    // Nullary operator
    const filterValue = props.advancedMode
      ? { operator: localOperator.value, value: '' }
      : undefined
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  } else if (localValue.value) {
    // Simple mode: emit plain string (toolbar will aggregate into array)
    // Advanced mode: emit operator object (toolbar will aggregate into array)
    const filterValue = props.advancedMode
      ? { operator: localOperator.value, value: localValue.value }
      : localValue.value // Plain string in simple mode
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

  if (typeof appliedValue.value === 'string') {
    return appliedValue.value
  }

  const { operator, value } = appliedValue.value
  if (isNullaryOperator(operator)) {
    return getOperatorLabel(operator)
  }
  return value
})

// Show operator in pill
const displayOperator = computed(() => {
  if (!props.advancedMode || !appliedValue.value) return ''
  if (typeof appliedValue.value === 'string') return ''
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
                    :aria-label="`Filter by ${title || 'text'}`"
                >
                    <!-- Icon -->
                    <component
                        :is="getFilterIcon(icon, 'text')"
                        class="mr-2 h-4 w-4 shrink-0"
                    />

                    <!-- Title | Operator | Value -->
                    <span class="text-xs">
                        {{ title || "Text" }}
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

                    <!-- Value input (hidden for nullary operators) -->
                    <Input
                        v-if="requiresValue"
                        ref="inputRef"
                        v-model="localValue"
                        type="text"
                        :placeholder="props.placeholder"
                        class="h-8 text-xs"
                        @keydown="handleKeyDown"
                    />

                    <!-- Preview (advanced mode) -->
                    <p
                        v-if="
                            advancedMode && (requiresValue ? localValue : true)
                        "
                        class="text-xs text-muted-foreground"
                    >
                        Filter:
                        <span class="font-medium text-foreground">
                            {{ getOperatorLabel(localOperator) }}
                            <template v-if="requiresValue"
                                >"{{ localValue }}"</template
                            >
                        </span>
                    </p>

                    <!-- Apply button -->
                    <Button
                        v-if="hasChanges"
                        size="sm"
                        class="w-full h-7 text-xs"
                        :disabled="requiresValue && !localValue"
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
