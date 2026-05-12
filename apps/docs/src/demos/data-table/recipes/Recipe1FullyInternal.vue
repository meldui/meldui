<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../../components/DemoBlock.vue'
import { DataTable, useDataTableController } from '@meldui/vue'
import { MOCK_USERS, type ServerResponse, filterFields, simulateServerSide, userColumns } from './_shared'

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })
const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
watch(
  state,
  (s) => {
    localData.value = simulateServerSide(MOCK_USERS, s)
  },
  { deep: true },
)

const code = `<script setup lang="ts">
import { ref, watch } from 'vue'
import { DataTable, useDataTableController } from '@meldui/vue'

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })

const data = ref([])
const pageCount = ref(0)
const totalRows = ref(0)

async function fetchPage() {
  const res = await api.users.list({
    page: state.value.pagination.pageIndex + 1,
    perPage: state.value.pagination.pageSize,
    sort: state.value.sorting,
    filters: state.value.filters,
  })
  data.value = res.data
  pageCount.value = res.meta.total_pages
  totalRows.value = res.meta.total
}

watch(state, fetchPage, { deep: true })
fetchPage()
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
