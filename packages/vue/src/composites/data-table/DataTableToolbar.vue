<script setup lang="ts" generic="TData">
import { IconPinnedOff, IconRefresh } from '@meldui/tabler-vue'
import type { Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import type { RegisteredFilterPlugin } from '@/composites/filters/filterPlugins'
import Filters from '@/composites/filters/Filters.vue'
import type { DataTableFilterField } from '@/composites/filters/types'
import type { UseFiltersReturn } from '@/composites/filters/useFilters'
import type { BulkActionOption } from './types'
import DataTableBulkActions from './DataTableBulkActions.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface Props {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
  filterPlugins?: RegisteredFilterPlugin[]
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

  // Filter state hoisted from <DataTable>. Provided when enableFilter is true.
  filtersState?: UseFiltersReturn<TData>
}

const props = withDefaults(defineProps<Props>(), {
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
    <!-- Filter row (rendered only when enableFilter is true and filtersState provided by parent) -->
    <Filters
      v-if="enableFilter && filtersState"
      class="flex-1"
      :state="filtersState"
      :fields="filterFields"
      :plugins="filterPlugins"
      :advanced-mode="advancedMode"
      :search-field="filtersState.searchField"
      :loading="loading"
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
