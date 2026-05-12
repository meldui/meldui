<script setup lang="ts">
import { ref, watch } from 'vue'
import DemoBlock from '../../../components/DemoBlock.vue'
import { DataPagination, DataTable, Filters, useDataTableController } from '@meldui/vue'
import {
  MOCK_USERS,
  type ServerResponse,
  filterFields,
  simulateServerSide,
  userColumns,
} from './_shared'

const { filters, pagination, state } = useDataTableController({ pageSize: 10 })
const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
watch(
  state,
  (s) => {
    localData.value = simulateServerSide(MOCK_USERS, s)
  },
  { deep: true },
)

const code = `<script setup lang="ts">
import { DataPagination, DataTable, Filters, useDataTableController } from '@meldui/vue'

const { filters, pagination, state } = useDataTableController({ pageSize: 10 })
watch(state, fetchPage, { deep: true })
<\/script>

<template>
  <div class="space-y-4">
    <Filters :fields="filterFields" v-model:filterValues="filters" />
    <!-- DataTable is a pure renderer here — no enable-* flags, no v-models. -->
    <DataTable :columns="columns" :data="data" />
    <DataPagination
      :page-count="pageCount"
      :total-rows="totalRows"
      v-model:pagination="pagination"
    />
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-4">
      <Filters :fields="filterFields" v-model:filterValues="filters" />
      <DataTable :columns="userColumns" :data="localData.data" />
      <DataPagination
        :page-count="localData.meta.total_pages"
        :total-rows="localData.meta.total"
        v-model:pagination="pagination"
      />
    </div>
  </DemoBlock>
</template>
