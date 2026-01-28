<script setup lang="ts" generic="TData, TValue">
import { IconCheck, IconX } from '@meldui/tabler-vue'
import type { Column } from '@tanstack/vue-table'
import { type Component, computed, ref, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { SelectOperator } from '../types'
import type { FilterOption } from '../useDataTable'
import { getFilterIcon } from './filter-icons'
import {
  getAvailableOperators,
  getDefaultOperator,
  getOperatorLabel,
  isArrayOperator,
  isNullaryOperator,
} from './operators'

interface Props {
  column?: Column<TData, TValue>
  title?: string
  options: FilterOption[]
  placeholder?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number

  // Advanced mode props
  advancedMode?: boolean
  defaultOperator?: SelectOperator
  availableOperators?: SelectOperator[]

  // Initial value for URL state restoration
  initialValue?: string | string[] | { operator: SelectOperator; value: string | string[] }
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select option...',
  defaultOpen: false,
  openTrigger: 0,
  advancedMode: false,
})

const emit = defineEmits<{
  remove: []
  close: []
  valueChange: [
    value: string | string[] | { operator: SelectOperator; value: string | string[] } | undefined,
  ]
}>()

const isOpen = ref(props.defaultOpen)

// Initialize from initialValue prop for URL state restoration
const getInitialOperator = (): SelectOperator => {
  if (
    props.initialValue &&
    typeof props.initialValue === 'object' &&
    'operator' in props.initialValue
  ) {
    return props.initialValue.operator
  }
  return (
    props.defaultOperator ?? (getDefaultOperator('select', props.advancedMode) as SelectOperator)
  )
}

const getInitialSingleValue = (): string | undefined => {
  if (!props.initialValue) return undefined
  if (typeof props.initialValue === 'string') return props.initialValue
  if (typeof props.initialValue === 'object' && 'value' in props.initialValue) {
    const val = props.initialValue.value
    return typeof val === 'string' ? val : val[0]
  }
  return undefined
}

const getInitialArrayValue = (): string[] => {
  if (!props.initialValue) return []
  if (Array.isArray(props.initialValue)) return props.initialValue
  if (typeof props.initialValue === 'object' && 'value' in props.initialValue) {
    const val = props.initialValue.value
    return Array.isArray(val) ? val : [val]
  }
  return []
}

const localOperator = ref<SelectOperator>(getInitialOperator())
const localValue = ref<string | undefined>(getInitialSingleValue())
const localValues = ref<string[]>(getInitialArrayValue())
const appliedValue = ref<
  string | string[] | { operator: SelectOperator; value: string | string[] } | undefined
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
    (getAvailableOperators('select', props.advancedMode) as SelectOperator[]),
)

// Check if operator requires value
const requiresValue = computed(() => !isNullaryOperator(localOperator.value))

// Check if operator requires multiple values (isAnyOf)
const requiresMultipleValues = computed(() => isArrayOperator(localOperator.value))

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
        localValues.value = val
        localValue.value = undefined
      } else {
        localValue.value = val
        localValues.value = []
      }
    } else if (typeof appliedValue.value === 'string') {
      localValue.value = appliedValue.value
      localValues.value = []
    } else {
      localValue.value = undefined
      localValues.value = []
    }
  } else if (oldValue && !newValue) {
    // Reset on close (restore to applied state)
    emit('close')
  }
})

// Watch operator changes
watch(localOperator, (newOp) => {
  if (isNullaryOperator(newOp)) {
    localValue.value = undefined
    localValues.value = []
  } else if (isArrayOperator(newOp)) {
    // Switch to multi-select mode
    if (localValue.value) {
      localValues.value = [localValue.value]
      localValue.value = undefined
    }
  } else {
    // Switch to single-select mode
    if (localValues.value.length > 0) {
      localValue.value = localValues.value[0]
      localValues.value = []
    }
  }
})

// Check if filtered
const isFiltered = computed(() => appliedValue.value !== undefined)

// Check if there are unsaved changes
const hasChanges = computed(() => {
  if (!requiresValue.value) return true // Nullary operators can always be applied
  if (requiresMultipleValues.value) {
    return localValues.value.length > 0
  }
  return localValue.value !== undefined
})

// Simple mode handlers
const handleSimpleSelect = (value: string) => {
  // Toggle: if same value clicked, clear filter
  const newValue = localValue.value === value ? undefined : value
  localValue.value = newValue
  appliedValue.value = newValue
  emit('valueChange', newValue)
  isOpen.value = false
}

// Advanced mode single select handler
const handleSingleSelect = (value: string) => {
  localValue.value = value
}

// Advanced mode multi-select handler
const handleMultiSelect = (value: string) => {
  const index = localValues.value.indexOf(value)
  if (index > -1) {
    localValues.value.splice(index, 1)
  } else {
    localValues.value.push(value)
  }
}

// Apply filter
const clearFilter = () => {
  localValue.value = undefined
  localValues.value = []
  localOperator.value =
    props.defaultOperator ?? (getDefaultOperator('select', props.advancedMode) as SelectOperator)
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
  } else if (requiresMultipleValues.value && localValues.value.length > 0) {
    // isAnyOf operator
    const filterValue = props.advancedMode
      ? { operator: localOperator.value, value: localValues.value }
      : localValues.value
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  } else if (localValue.value) {
    // Single value
    const filterValue = props.advancedMode
      ? { operator: localOperator.value, value: localValue.value }
      : localValue.value
    appliedValue.value = filterValue
    emit('valueChange', filterValue)
  }
  isOpen.value = false
}

// Display logic
const selectedOption = computed(() => {
  if (typeof appliedValue.value === 'string') {
    return props.options.find((option) => option.value === appliedValue.value)
  }
  return undefined
})

const selectedOptions = computed(() => {
  let values: string[] = []

  if (Array.isArray(appliedValue.value)) {
    values = appliedValue.value
  } else if (
    appliedValue.value &&
    typeof appliedValue.value === 'object' &&
    'value' in appliedValue.value
  ) {
    const val = appliedValue.value.value
    values = Array.isArray(val) ? val : [val]
  }

  return props.options.filter((option) => values.includes(option.value))
})

// Format display value
const displayValue = computed(() => {
  if (!appliedValue.value) return ''

  if (typeof appliedValue.value === 'string') {
    return selectedOption.value?.label || appliedValue.value
  }

  if (Array.isArray(appliedValue.value)) {
    return selectedOptions.value.map((o) => o.label).join(', ')
  }

  const { operator, value } = appliedValue.value
  if (isNullaryOperator(operator)) {
    return getOperatorLabel(operator)
  }
  if (Array.isArray(value)) {
    return selectedOptions.value.map((o) => o.label).join(', ')
  }
  const option = props.options.find((o) => o.value === value)
  return option?.label || value
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
          role="combobox"
          size="sm"
          :class="cn('h-8', isFiltered && 'rounded-r-none border-r-0')"
          :aria-label="`Filter by ${title || 'option'}`"
        >
          <!-- Icon -->
          <component :is="getFilterIcon(icon, 'select')" class="mr-2 h-4 w-4 shrink-0" />

          <!-- Title | Operator | Value -->
          <span class="text-xs">
            {{ title || 'Filter' }}
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
                <!-- Show badges for isAnyOf/isNoneOf operators (even for single selection) -->
                <template
                  v-if="
                    appliedValue &&
                    typeof appliedValue === 'object' &&
                    'operator' in appliedValue &&
                    (appliedValue.operator === 'isAnyOf' || appliedValue.operator === 'isNoneOf') &&
                    selectedOptions.length > 0
                  "
                >
                  <Badge
                    v-if="selectedOptions.length > 2"
                    variant="secondary"
                    class="rounded-sm px-1 font-normal text-xs"
                  >
                    {{ selectedOptions.length }} selected
                  </Badge>
                  <template v-else>
                    <Badge
                      v-for="option in selectedOptions"
                      :key="option.value"
                      variant="secondary"
                      class="rounded-sm px-1 font-normal text-xs mr-1 last:mr-0"
                    >
                      {{ option.label }}
                    </Badge>
                  </template>
                </template>
                <!-- For other operators - show as text -->
                <span v-else class="font-normal">{{ displayValue }}</span>
              </template>
            </template>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-[240px] p-0" align="start">
        <div class="flex flex-col">
          <!-- Operator selector (advanced mode only) -->
          <div v-if="advancedMode" class="p-2 border-b">
            <Select v-model="localOperator">
              <SelectTrigger class="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="op in operators" :key="op" :value="op">
                  {{ getOperatorLabel(op) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Option list -->
          <Command v-if="requiresValue">
            <CommandInput :placeholder="`Search ${title?.toLowerCase()}...`" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  v-for="option in options"
                  :key="option.value"
                  :value="option.value"
                  @select="
                    advancedMode
                      ? requiresMultipleValues
                        ? handleMultiSelect(option.value)
                        : handleSingleSelect(option.value)
                      : handleSimpleSelect(option.value)
                  "
                  class="py-2"
                >
                  <IconCheck
                    :class="
                      cn(
                        'h-4 w-4',
                        requiresMultipleValues
                          ? localValues.includes(option.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                          : localValue === option.value
                            ? 'opacity-100'
                            : 'opacity-0',
                      )
                    "
                  />
                  <component
                    v-if="option.icon"
                    :is="option.icon"
                    class="mr-2 h-4 w-4 text-muted-foreground"
                  />
                  {{ option.label }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>

          <!-- Preview (advanced mode) -->
          <div v-if="advancedMode && hasChanges" class="p-2 border-t">
            <p class="text-xs text-muted-foreground">
              Filter:
              <span class="font-medium text-foreground">
                {{ getOperatorLabel(localOperator) }}
                <template v-if="requiresMultipleValues && localValues.length > 0">
                  {{
                    localValues
                      .map((v) => options.find((o) => o.value === v)?.label || v)
                      .join(', ')
                  }}
                </template>
                <template v-else-if="requiresValue && localValue">
                  {{ options.find((o) => o.value === localValue)?.label || localValue }}
                </template>
              </span>
            </p>
          </div>

          <!-- Apply button (advanced mode only) -->
          <div v-if="advancedMode" class="p-2 border-t">
            <Button
              v-if="hasChanges"
              size="sm"
              class="w-full h-7 text-xs"
              :disabled="
                (requiresValue && !requiresMultipleValues && !localValue) ||
                (requiresMultipleValues && localValues.length === 0)
              "
              @click="applyFilter"
            >
              Apply Filter
            </Button>
          </div>
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
