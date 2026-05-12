<script setup lang="ts">
import { ref, watch } from 'vue'
import DemoBlock from '../../../components/DemoBlock.vue'
import {
  DataTable,
  type DataTableFilterState,
  type PaginationState,
  type SortingState,
} from '@meldui/vue'
import {
  MOCK_USERS,
  type ServerResponse,
  filterFields,
  simulateServerSide,
  userColumns,
} from './_shared'

const sorting = ref<SortingState>([])
const filters = ref<DataTableFilterState>({})
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })

// flush: 'sync' is load-bearing — without it, every filter/sort change fires fetchPage twice.
watch(
  filters,
  () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  },
  { deep: true, flush: 'sync' },
)
watch(
  sorting,
  () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  },
  { deep: true, flush: 'sync' },
)

const localData = ref<ServerResponse>(
  simulateServerSide(MOCK_USERS, {
    sorting: sorting.value,
    filters: filters.value,
    pagination: pagination.value,
  }),
)

watch(
  [sorting, filters, pagination],
  () => {
    localData.value = simulateServerSide(MOCK_USERS, {
      sorting: sorting.value,
      filters: filters.value,
      pagination: pagination.value,
    })
  },
  { deep: true },
)

const code = `<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  DataTable,
  type DataTableFilterState,
  type PaginationState,
  type SortingState,
} from '@meldui/vue'

const sorting = ref<SortingState>([])
const filters = ref<DataTableFilterState>({})
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })

// Load-bearing: flush:'sync' lands the reset before the parent's fetch watcher
// runs in the same microtask, so a filter/sort change triggers one fetch — not two.
watch(filters, () => { pagination.value = { ...pagination.value, pageIndex: 0 } }, {
  deep: true, flush: 'sync',
})
watch(sorting, () => { pagination.value = { ...pagination.value, pageIndex: 0 } }, {
  deep: true, flush: 'sync',
})

watch([sorting, filters, pagination], fetchPage, { deep: true })
<\/script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :total-rows="totalRows"
    :filter-fields="filterFields"
    enable-sorting
    enable-filter
    enable-pagination
    v-model:sorting="sorting"
    v-model:filters="filters"
    v-model:pagination="pagination"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <DataTable
      :columns="userColumns"
      :data="localData.data"
      :page-count="localData.meta.total_pages"
      :total-rows="localData.meta.total"
      :filter-fields="filterFields"
      enable-sorting
      enable-filter
      enable-pagination
      v-model:sorting="sorting"
      v-model:filters="filters"
      v-model:pagination="pagination"
    />
  </DemoBlock>
</template>
