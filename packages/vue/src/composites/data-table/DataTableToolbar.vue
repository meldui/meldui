<script setup lang="ts" generic="TData">
import { IconLoader2, IconPinnedOff, IconRefresh, IconSearch, IconX } from '@meldui/tabler-vue'
import type { Table } from '@tanstack/vue-table'
import { computed, onUnmounted, ref, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DataTableBulkActions from './DataTableBulkActions.vue'
import DataTableFilterCommand from './DataTableFilterCommand.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'
import { createPluginMap, isBuiltInFilterType, type RegisteredFilterPlugin } from './filterPlugins'
import BooleanFilter from './filters/BooleanFilter.vue'
import DateFilter from './filters/DateFilter.vue'
import DateRangeFilter from './filters/DateRangeFilter.vue'
import MultiSelectFilter from './filters/MultiSelectFilter.vue'
import NumberFilter from './filters/NumberFilter.vue'
import RangeFilter from './filters/RangeFilter.vue'
import SelectFilter from './filters/SelectFilter.vue'
import TextFilter from './filters/TextFilter.vue'
import type {
  AdvancedFilterValue,
  BooleanOperator,
  BulkActionOption,
  DateOperator,
  FilterInstanceValue,
  FilterType,
  FilterValue,
  NumberOperator,
  SelectOperator,
  SimpleDateRangeFilterValue,
  TextOperator,
} from './types'
import type { DataTableFilterField } from './useDataTable'

interface Props {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
  filterPlugins?: RegisteredFilterPlugin[]
  searchPlaceholder?: string
  searchColumn?: string
  bulkSelectOptions?: BulkActionOption<TData>[]

  // Advanced mode (static - never changes)
  advancedMode?: boolean

  // Loading state
  loading?: boolean

  // Refresh button
  showRefreshButton?: boolean

  // Column hiding
  enableColumnHiding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search...',
  filterFields: () => [],
  filterPlugins: () => [],
  advancedMode: false,
  loading: false,
  showRefreshButton: false,
  enableColumnHiding: false,
})

// Create plugin map for quick lookup
const pluginMap = computed(() => createPluginMap(props.filterPlugins ?? []))

// Helper to get plugin for a filter type
const getPlugin = (type: string) => pluginMap.value.get(type)

// Helper to check if filter type is from a plugin
const isPluginFilter = (type: string) => !isBuiltInFilterType(type) && pluginMap.value.has(type)

// Emits
const emit = defineEmits<{
  refresh: []
}>()

// Filter instance type
interface FilterInstance<TData = unknown> {
  instanceId: string
  fieldId: string
  field: DataTableFilterField<TData>
  autoOpen: boolean
  openTrigger: number
}

// Track active filter instances
const filterInstances = ref<FilterInstance<TData>[]>([])
// Track instance values for aggregation
const instanceValues = ref<Map<string, FilterValue>>(new Map())
let instanceCounter = 0

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

// Local search input value (not debounced)
const searchInputValue = ref('')

// Debounce timer
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

// Initialize search input from table state
watchEffect(() => {
  if (!props.searchColumn) return
  const currentFilter = props.table.getColumn(props.searchColumn)?.getFilterValue() as string
  if (currentFilter !== searchInputValue.value) {
    searchInputValue.value = currentFilter ?? ''
  }
})

// Debounced search handler
const handleSearchInput = (value: string | number) => {
  const stringValue = String(value)
  searchInputValue.value = stringValue

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  searchDebounceTimer = setTimeout(() => {
    if (!props.searchColumn) return
    // Always use plain string for search (not wrapped in array)
    const filterValue = stringValue || undefined
    props.table.getColumn(props.searchColumn)?.setFilterValue(filterValue)
  }, 300)
}

/**
 * Check if filter type supports multi-instance in current mode
 */
function supportsMultiInstance(filterType: string, advancedMode: boolean): boolean {
  if (advancedMode) {
    // In advanced mode, all types support multi-instance
    return true
  }

  // Check if it's a plugin filter with explicit multi-instance support
  const plugin = getPlugin(filterType)
  if (plugin) {
    return plugin.supportsMultiInstance ?? false
  }

  // In simple mode, only these built-in types support multi-instance
  return (
    filterType === 'text' ||
    filterType === 'number' ||
    filterType === 'date' ||
    filterType === 'range' ||
    filterType === 'daterange'
  )
}

// Add a new filter instance
const addFilter = (fieldId: string) => {
  const field = props.filterFields.find((f) => String(f.id) === fieldId)
  if (!field) return

  // Check if type supports multi-instance in current mode
  if (!supportsMultiInstance(field.type, props.advancedMode)) {
    // Single instance only - reopen if exists
    const existingInstance = filterInstances.value.find((i) => i.fieldId === fieldId)
    if (existingInstance) {
      existingInstance.openTrigger++
      return
    }
  }

  const instanceId = `filter-${fieldId}-${instanceCounter++}`
  ;(filterInstances.value as FilterInstance[]).push({
    instanceId,
    fieldId,
    field,
    autoOpen: true, // Will only be read once by the component during initialization
    openTrigger: 0, // Initialize trigger counter
  } as FilterInstance)
}

// Handle value change from a filter instance
const handleInstanceValueChange = (instanceId: string, value: FilterValue | undefined) => {
  const instance = filterInstances.value.find((i) => i.instanceId === instanceId)
  if (!instance) return

  if (value === undefined) {
    instanceValues.value.delete(instanceId)
  } else {
    instanceValues.value.set(instanceId, value)
  }

  aggregateAndSetColumnFilter(instance.fieldId, instance.field.type)
}

// Handle filter instance close
const handleInstanceClose = (instanceId: string) => {
  const hasValue = instanceValues.value.has(instanceId)
  if (!hasValue) {
    removeFilterInstance(instanceId)
  }
}

/**
 * Aggregate filter values based on mode
 * - Simple mode: Use natural format per type
 * - Advanced mode: Always array of operator objects
 */
const aggregateAndSetColumnFilter = (fieldId: string, filterType: FilterType) => {
  const instances = filterInstances.value.filter((i) => i.fieldId === fieldId)

  if (instances.length === 0) {
    props.table.getColumn(fieldId)?.setFilterValue(undefined)
    return
  }

  const values = instances
    .map((i) => instanceValues.value.get(i.instanceId))
    .filter((v) => v !== undefined)

  if (values.length === 0) {
    props.table.getColumn(fieldId)?.setFilterValue(undefined)
    return
  }

  let aggregatedValue: FilterInstanceValue

  if (props.advancedMode) {
    // Advanced mode: ALWAYS array of operator objects
    aggregatedValue = values as AdvancedFilterValue
  } else {
    // Simple mode: Use natural format per type
    switch (filterType) {
      case 'select':
        // Single value (primitive) - take first instance only
        aggregatedValue = values[0] as string
        break

      case 'boolean':
        // Single value (primitive) - take first instance only
        aggregatedValue = values[0] as boolean
        break

      case 'multiselect':
        // Array of selected options - take first instance only
        aggregatedValue = values[0] as string[]
        break

      case 'text':
      case 'number':
      case 'date':
        // Arrays supporting multi-instance - flatten
        aggregatedValue = values.flat() as FilterInstanceValue
        break

      case 'range':
        // Array of range tuples - multi-instance supported
        aggregatedValue = values as [number, number][]
        break

      case 'daterange':
        // Array of date range objects - multi-instance supported
        aggregatedValue = values as SimpleDateRangeFilterValue
        break

      default:
        aggregatedValue = values as FilterInstanceValue
    }
  }

  props.table.getColumn(fieldId)?.setFilterValue(aggregatedValue)
}

// Remove a filter instance
const removeFilterInstance = (instanceId: string) => {
  const index = filterInstances.value.findIndex((i) => i.instanceId === instanceId)
  if (index === -1) return

  const instance = filterInstances.value[index]
  filterInstances.value.splice(index, 1)
  instanceValues.value.delete(instanceId)

  aggregateAndSetColumnFilter(instance.fieldId, instance.field.type)
}

const resetFilters = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
    searchDebounceTimer = null
  }

  searchInputValue.value = ''
  props.table.resetColumnFilters()
  filterInstances.value = []
  instanceValues.value.clear()
}

// Check if any columns are pinned beyond default pinning
const hasUserPins = computed(() => {
  const tableMeta = props.table.options.meta as
    | { defaultPinning?: { left: string[]; right: string[] } }
    | undefined
  const currentPinning = props.table.getState().columnPinning
  const defaultPinning = tableMeta?.defaultPinning || { left: [], right: [] }

  const userLeftPins = (currentPinning.left || []).filter(
    (id) => !(defaultPinning.left || []).includes(id),
  )
  const userRightPins = (currentPinning.right || []).filter(
    (id) => !(defaultPinning.right || []).includes(id),
  )

  return userLeftPins.length > 0 || userRightPins.length > 0
})

// Reset pinning to default state
const resetPinning = () => {
  const tableMeta = props.table.options.meta as
    | { defaultPinning?: { left: string[]; right: string[] } }
    | undefined
  const defaultPinning = tableMeta?.defaultPinning || { left: [], right: [] }
  props.table.setColumnPinning(defaultPinning)
}

// Cleanup on unmount
onUnmounted(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
})
</script>

<template>
    <div class="flex flex-wrap justify-between gap-2">
        <div class="flex flex-1 items-center flex-wrap gap-2">
            <!-- Toolbar Start Slot -->
            <slot name="toolbar-start" :table="table" />

            <!-- Search Input -->
            <div v-if="searchColumn" class="relative">
                <IconLoader2
                    v-if="loading"
                    class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin"
                />
                <IconSearch
                    v-else
                    class="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    :model-value="searchInputValue"
                    @update:model-value="handleSearchInput"
                    :placeholder="searchPlaceholder"
                    :disabled="loading"
                    class="h-8 w-[150px] pl-8 lg:w-[250px]"
                />
            </div>

            <!-- Dynamic Filter Instances - Type-specific rendering for proper type narrowing -->
            <template
                v-for="instance in filterInstances"
                :key="instance.instanceId"
            >
                <!-- Text Filter -->
                <TextFilter
                    v-if="instance.field.type === 'text'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :placeholder="instance.field.placeholder"
                    :icon="instance.field.icon"
                    :default-open="instance.autoOpen"
                    :open-trigger="instance.openTrigger"
                    :advanced-mode="advancedMode"
                    :default-operator="
                        instance.field.defaultOperator as TextOperator
                    "
                    :available-operators="
                        instance.field.availableOperators as TextOperator[]
                    "
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- Number Filter -->
                <NumberFilter
                    v-else-if="instance.field.type === 'number'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :placeholder="instance.field.placeholder"
                    :icon="instance.field.icon"
                    :min="instance.field.min"
                    :max="instance.field.max"
                    :step="instance.field.step"
                    :unit="instance.field.unit"
                    :default-open="instance.autoOpen"
                    :open-trigger="instance.openTrigger"
                    :advanced-mode="advancedMode"
                    :default-operator="
                        instance.field.defaultOperator as NumberOperator
                    "
                    :available-operators="
                        instance.field.availableOperators as NumberOperator[]
                    "
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- Date Filter -->
                <DateFilter
                    v-else-if="instance.field.type === 'date'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :placeholder="instance.field.placeholder"
                    :icon="instance.field.icon"
                    :default-open="instance.autoOpen"
                    :open-trigger="instance.openTrigger"
                    :advanced-mode="advancedMode"
                    :default-operator="
                        instance.field.defaultOperator as DateOperator
                    "
                    :available-operators="
                        instance.field.availableOperators as DateOperator[]
                    "
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- Select Filter -->
                <SelectFilter
                    v-else-if="instance.field.type === 'select'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :placeholder="instance.field.placeholder"
                    :icon="instance.field.icon"
                    :options="instance.field.options ?? []"
                    :default-open="instance.autoOpen"
                    :open-trigger="instance.openTrigger"
                    :advanced-mode="advancedMode"
                    :default-operator="
                        instance.field.defaultOperator as SelectOperator
                    "
                    :available-operators="
                        instance.field.availableOperators as SelectOperator[]
                    "
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- Boolean Filter -->
                <BooleanFilter
                    v-else-if="instance.field.type === 'boolean'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :icon="instance.field.icon"
                    :default-open="instance.autoOpen"
                    :open-trigger="instance.openTrigger"
                    :advanced-mode="advancedMode"
                    :default-operator="
                        instance.field.defaultOperator as BooleanOperator
                    "
                    :available-operators="
                        instance.field.availableOperators as BooleanOperator[]
                    "
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- MultiSelect Filter -->
                <MultiSelectFilter
                    v-else-if="instance.field.type === 'multiselect'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :icon="instance.field.icon"
                    :options="instance.field.options ?? []"
                    :default-open="instance.autoOpen"
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- Range Filter -->
                <RangeFilter
                    v-else-if="instance.field.type === 'range'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :icon="instance.field.icon"
                    :range="
                        instance.field.range ?? [
                            instance.field.min ?? 0,
                            instance.field.max ?? 100,
                        ]
                    "
                    :step="instance.field.step"
                    :unit="instance.field.unit"
                    :default-open="instance.autoOpen"
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- DateRange Filter -->
                <DateRangeFilter
                    v-else-if="instance.field.type === 'daterange'"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :placeholder="instance.field.placeholder"
                    :icon="instance.field.icon"
                    :default-open="instance.autoOpen"
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />

                <!-- Plugin Filter (custom filter types) -->
                <component
                    v-else-if="isPluginFilter(instance.field.type)"
                    :is="getPlugin(instance.field.type)?.component"
                    :column="table.getColumn(instance.fieldId)"
                    :title="instance.field.label"
                    :placeholder="instance.field.placeholder"
                    :icon="instance.field.icon"
                    :default-open="instance.autoOpen"
                    :open-trigger="instance.openTrigger"
                    :advanced-mode="advancedMode"
                    :default-operator="instance.field.defaultOperator"
                    :available-operators="
                        instance.field.availableOperators ??
                        getPlugin(instance.field.type)?.operators
                    "
                    v-bind="instance.field"
                    @value-change="
                        (value: unknown) =>
                            handleInstanceValueChange(
                                instance.instanceId,
                                value as FilterValue | undefined,
                            )
                    "
                    @remove="removeFilterInstance(instance.instanceId)"
                    @close="handleInstanceClose(instance.instanceId)"
                />
            </template>

            <!-- Filter Command Button -->
            <DataTableFilterCommand
                v-if="filterFields.length > 0"
                :filter-fields="filterFields"
                :active-filter-count="filterInstances.length"
                :disabled="loading"
                @add-filter="addFilter"
            />

            <!-- Clear All Filters Button -->
            <Button
                v-if="isFiltered"
                variant="outline"
                size="sm"
                class="h-8"
                :disabled="loading"
                @click="resetFilters"
            >
                <IconX class="mr-1 h-4 w-4" />
                <span class="text-xs">Reset</span>
            </Button>
        </div>

        <div class="flex gap-2">
            <!-- Bulk Actions Dropdown -->
            <DataTableBulkActions
                v-if="bulkSelectOptions && bulkSelectOptions.length > 0"
                :table="table"
                :options="bulkSelectOptions"
            />

            <!-- Reset Pinning Button -->
            <Button
                v-if="hasUserPins"
                variant="outline"
                size="sm"
                class="h-8"
                @click="resetPinning"
            >
                <IconPinnedOff class="h-4 w-4" />
            </Button>

            <!-- Refresh Button -->
            <Button
                v-if="showRefreshButton"
                variant="outline"
                size="sm"
                class="h-8"
                :disabled="loading"
                @click="emit('refresh')"
            >
                <IconRefresh class="h-4 w-4" :class="{ 'animate-spin': loading }" />
            </Button>

            <!-- Toolbar End Slot -->
            <slot name="toolbar-end" :table="table" />

            <!-- View Options (Column Hiding) -->
            <DataTableViewOptions v-if="enableColumnHiding" :table="table" />
        </div>
    </div>
</template>
