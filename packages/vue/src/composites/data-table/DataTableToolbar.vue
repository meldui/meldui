<script setup lang="ts" generic="TData">
import { IconPinnedOff, IconRefresh } from '@meldui/tabler-vue'
import type { Table } from '@tanstack/vue-table'
import { computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import type { RegisteredFilterPlugin } from '@/composites/filters/filterPlugins'
import Filters from '@/composites/filters/Filters.vue'
import type { DataTableFilterField } from '@/composites/filters/types'
import { useFilters } from '@/composites/filters/useFilters'
import type { BulkActionOption, DataTableFilterState } from './types'
import DataTableBulkActions from './DataTableBulkActions.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

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

  // Filter UI gate (true = render filters in toolbar, false = parent owns filtering)
  enableFilter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search...',
  filterFields: () => [],
  filterPlugins: () => [],
  advancedMode: false,
  loading: false,
  showRefreshButton: false,
  enableColumnHiding: false,
  enableFilter: false,
})

const emit = defineEmits<{
  refresh: []
}>()

// Build a one-time snapshot of the table's columnFilters to seed useFilters.
// This preserves URL state restoration (initialFilters) for the BC path while
// keeping the sync strictly one-direction (Filters → TanStack) afterward.
const initialSeed = (() => {
  const result: Record<string, DataTableFilterState[string]> = {}
  let initialSearch: string | undefined
  if (props.enableFilter) {
    for (const cf of props.table.getState().columnFilters) {
      if (cf.id === props.searchColumn) {
        initialSearch = cf.value as string | undefined
      } else {
        result[cf.id] = cf.value as DataTableFilterState[string]
      }
    }
  }
  return { values: result, search: initialSearch }
})()

const searchFieldConfig = computed(() =>
  props.enableFilter && props.searchColumn
    ? { id: props.searchColumn, placeholder: props.searchPlaceholder }
    : undefined,
)

const filtersState = useFilters<TData>({
  filterFields: props.filterFields,
  filterPlugins: props.filterPlugins,
  advancedMode: props.advancedMode,
  initialValues: initialSeed.values,
  initialSearch: initialSeed.search,
  searchField: searchFieldConfig.value,
})

// Sync useFilters' aggregated values into TanStack columnFilters whenever they change.
// One-direction only: Filters writes to TanStack, never reads back. The mount-time
// seed above is the single reverse read, intentionally non-reactive.
watch(
  () => filtersState.filterValues.value,
  (next, prev) => {
    if (!props.enableFilter) return
    const allKeys = new Set([...Object.keys(next), ...Object.keys(prev ?? {})])
    for (const fieldId of allKeys) {
      if (fieldId === props.searchColumn) continue // handled by search watcher
      const newVal = next[fieldId]
      const oldVal = prev?.[fieldId]
      if (newVal !== oldVal) {
        props.table.getColumn(fieldId)?.setFilterValue(newVal)
      }
    }
  },
  { deep: true },
)

watch(
  () => filtersState.searchValue.value,
  (next) => {
    if (!props.enableFilter || !props.searchColumn) return
    props.table.getColumn(props.searchColumn)?.setFilterValue(next)
  },
)

// Resolve column for plugin filters that may rely on column-scoped state.
const getColumn = (fieldId: string) => props.table.getColumn(fieldId)

// Pinning helpers (unchanged)
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

const resetPinning = () => {
  const tableMeta = props.table.options.meta as
    | { defaultPinning?: { left: string[]; right: string[] } }
    | undefined
  const defaultPinning = tableMeta?.defaultPinning || { left: [], right: [] }
  props.table.setColumnPinning(defaultPinning)
}
</script>

<template>
  <div class="flex flex-wrap justify-between gap-2">
    <!-- Filter row (rendered only when enableFilter is true) -->
    <Filters
      v-if="enableFilter"
      class="flex-1"
      :state="filtersState"
      :fields="filterFields"
      :plugins="filterPlugins"
      :advanced-mode="advancedMode"
      :search-field="searchFieldConfig"
      :loading="loading"
      :get-column="getColumn"
    >
      <template #start>
        <slot name="toolbar-start" :table="table" />
      </template>
      <template #right>
        <DataTableBulkActions
          v-if="bulkSelectOptions && bulkSelectOptions.length > 0"
          :table="table"
          :options="bulkSelectOptions"
        />
        <Button v-if="hasUserPins" variant="outline" size="sm" class="h-8" @click="resetPinning">
          <IconPinnedOff class="h-4 w-4" />
        </Button>
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
        <slot name="toolbar-end" :table="table" />
        <DataTableViewOptions v-if="enableColumnHiding" :table="table" />
      </template>
    </Filters>

    <!-- When filtering is delegated to the parent: render only the right-side area -->
    <template v-else>
      <div class="flex flex-1 items-center flex-wrap gap-2">
        <slot name="toolbar-start" :table="table" />
      </div>
      <div class="flex gap-2">
        <DataTableBulkActions
          v-if="bulkSelectOptions && bulkSelectOptions.length > 0"
          :table="table"
          :options="bulkSelectOptions"
        />
        <Button v-if="hasUserPins" variant="outline" size="sm" class="h-8" @click="resetPinning">
          <IconPinnedOff class="h-4 w-4" />
        </Button>
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
        <slot name="toolbar-end" :table="table" />
        <DataTableViewOptions v-if="enableColumnHiding" :table="table" />
      </div>
    </template>
  </div>
</template>
