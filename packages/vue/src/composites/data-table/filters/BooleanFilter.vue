<script setup lang="ts" generic="TData, TValue">
import { IconX } from '@meldui/tabler-vue'
import type { Column } from '@tanstack/vue-table'
import { type Component, computed, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { BooleanOperator } from '../types'
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
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number

  // Advanced mode props
  advancedMode?: boolean
  defaultOperator?: BooleanOperator
  availableOperators?: BooleanOperator[]

  // Initial value for URL state restoration
  initialValue?: boolean | { operator: BooleanOperator; value: boolean }
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
  openTrigger: 0,
  advancedMode: false,
})

const emit = defineEmits<{
  remove: []
  close: []
  valueChange: [value: boolean | { operator: BooleanOperator; value: boolean } | undefined]
}>()

const isOpen = ref(props.defaultOpen)

// Initialize from initialValue prop for URL state restoration
const getInitialOperator = (): BooleanOperator => {
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    'operator' in props.initialValue
  ) {
    return props.initialValue.operator
  }
  return (
    props.defaultOperator ?? (getDefaultOperator('boolean', props.advancedMode) as BooleanOperator)
  )
}

const getInitialValue = (): boolean => {
  if (typeof props.initialValue === 'boolean') return props.initialValue
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    'value' in props.initialValue
  ) {
    return props.initialValue.value
  }
  return false
}

const localOperator = ref<BooleanOperator>(getInitialOperator())
const localValue = ref<boolean>(getInitialValue())
const appliedValue = ref<boolean | { operator: BooleanOperator; value: boolean } | undefined>(
  props.initialValue,
)

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
    (getAvailableOperators('boolean', props.advancedMode) as BooleanOperator[]),
)

// Check if operator requires value
const requiresValue = computed(() => !isNullaryOperator(localOperator.value))

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
      localValue.value = appliedValue.value.value
    } else if (typeof appliedValue.value === 'boolean') {
      localValue.value = appliedValue.value
    } else {
      localValue.value = false
    }
  } else if (oldValue && !newValue) {
    // Reset on close (restore to applied state)
    emit('close')
  }
})

// Watch operator changes
watch(localOperator, (newOp) => {
  if (isNullaryOperator(newOp)) {
    localValue.value = false
  }
})

// Check if filtered
const isFiltered = computed(() => appliedValue.value !== undefined)

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (!requiresValue.value) return true // Nullary operators can always be applied
  return true // Boolean always has a value (true/false)
})

// Simple mode handler
const handleSimpleUpdate = (checked: boolean) => {
  // When checked, filter for true values; when unchecked, show all
  localValue.value = checked
  const newValue = checked ? true : undefined
  appliedValue.value = newValue
  emit('valueChange', newValue)
}

// Apply filter
const clearFilter = () => {
  localValue.value = false
  localOperator.value =
    props.defaultOperator ?? (getDefaultOperator('boolean', props.advancedMode) as BooleanOperator)
  appliedValue.value = undefined
  emit('valueChange', undefined)
  emit('remove')
}

const applyFilter = () => {
  if (isNullaryOperator(localOperator.value)) {
    // Nullary operator
    const filterValue = props.advancedMode
      ? { operator: localOperator.value, value: false }
      : undefined
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  } else {
    // Boolean value
    const filterValue = props.advancedMode
      ? { operator: localOperator.value, value: localValue.value }
      : localValue.value
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  }
  isOpen.value = false
}

// Format display value
const displayValue = computed(() => {
  if (!appliedValue.value) return ''

  if (typeof appliedValue.value === 'boolean') {
    return appliedValue.value ? 'True' : 'False'
  }

  const { operator, value } = appliedValue.value
  if (isNullaryOperator(operator)) {
    return getOperatorLabel(operator)
  }
  return value ? 'True' : 'False'
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
          :class="cn('h-8', isFiltered && 'rounded-r-none border-r-0')"
          :aria-label="`Filter by ${title || 'boolean'}`"
        >
          <!-- Icon -->
          <component :is="getFilterIcon(icon, 'boolean')" class="mr-2 h-4 w-4 shrink-0" />

          <!-- Title | Operator | Value -->
          <span class="text-xs">
            {{ title || 'Boolean' }}
            <template v-if="isFiltered">
              <!-- Show operator with separator -->
              <template v-if="displayOperator">
                <span class="mx-1.5 text-muted-foreground">|</span>
                <span class="text-muted-foreground">{{ displayOperator }}</span>
              </template>
              <!-- Value (only show if not nullary operator) -->
              <template
                v-if="
                  !displayOperator ||
                  (appliedValue &&
                    typeof appliedValue === 'object' &&
                    'operator' in appliedValue &&
                    !isNullaryOperator(appliedValue.operator))
                "
              >
                <span class="mx-1.5 text-muted-foreground">|</span>
                <span class="font-normal">{{ displayValue }}</span>
              </template>
            </template>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[220px] p-3" align="start">
        <div class="space-y-3">
          <!-- Operator selector (advanced mode only) -->
          <Select v-if="advancedMode" v-model="localOperator">
            <SelectTrigger class="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="op in operators" :key="op" :value="op">
                {{ getOperatorLabel(op) }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- Boolean switch (shown for operators that require value) -->
          <div v-if="requiresValue" class="flex items-center justify-between space-x-2">
            <Label :for="`${column?.id}-switch`" class="text-sm font-medium">
              {{ title || 'Boolean Filter' }}
            </Label>
            <Switch
              :id="`${column?.id}-switch`"
              :model-value="localValue"
              @update:model-value="
                (v: boolean) => (advancedMode ? (localValue = v) : handleSimpleUpdate(v))
              "
            />
          </div>

          <!-- Preview (advanced mode) -->
          <p v-if="advancedMode && hasChanges" class="text-xs text-muted-foreground">
            Filter:
            <span class="font-medium text-foreground">
              {{ getOperatorLabel(localOperator) }}
              <template v-if="requiresValue">
                {{ localValue ? 'True' : 'False' }}
              </template>
            </span>
          </p>

          <!-- Apply button (advanced mode only) -->
          <Button
            v-if="advancedMode && hasChanges"
            size="sm"
            class="w-full h-7 text-xs"
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
