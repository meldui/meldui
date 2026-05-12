<script setup lang="ts" generic="TData">
import { IconPinnedOff, IconRefresh } from '@meldui/tabler-vue'
import type { Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import type { RegisteredFilterPlugin } from '@/composites/filters/filterPlugins'
import Filters from '@/composites/filters/Filters.vue'
import type { DataTableFilterField } from '@/composites/filters/types'
import type { BulkActionOption, DataTableFilterState } from './types'
import DataTableBulkActions from './DataTableBulkActions.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'

interface Props {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
  filterPlugins?: RegisteredFilterPlugin[]
  bulkSelectOptions?: BulkActionOption<TData>[]
  advancedMode?: boolean
  loading?: boolean
  showRefreshButton?: boolean
  enableColumnHiding?: boolean
  enableFilter?: boolean
  /**
   * Controlled `filterValues` v-model from `<DataTable>`. Passed through to
   * the internal `<Filters>` instance when `enableFilter` is true.
   */
  filterValues?: DataTableFilterState
  searchField?: { id: string; placeholder?: string; debounceMs?: number }
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
  'update:filterValues': [next: DataTableFilterState]
}>()

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
    <!-- Internal filter mode: render <Filters> controlled by the parent's v-model:filters -->
    <Filters
      v-if="enableFilter"
      class="flex-1"
      :filter-values="filterValues"
      :fields="filterFields"
      :plugins="filterPlugins"
      :advanced-mode="advancedMode"
      :search-field="searchField"
      :loading="loading"
      @update:filter-values="(next) => emit('update:filterValues', next)"
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

    <!-- External filter mode: render only slots + right-side actions -->
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
