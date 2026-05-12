<script setup lang="ts">
import { ref, watch } from 'vue'
import DemoBlock from '../../../components/DemoBlock.vue'
import { DataTable, Filters, useDataTableController } from '@meldui/vue'
import {
  MOCK_USERS,
  type ServerResponse,
  filterFields,
  simulateServerSide,
  userColumns,
} from './_shared'

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
import { DataTable, Filters, useDataTableController } from '@meldui/vue'

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })
watch(state, fetchPage, { deep: true })
<\/script>

<template>
  <div class="space-y-4">
    <!-- External filter UI; the same \`filters\` ref still flows into DataTable. -->
    <div class="rounded-md border p-3">
      <Filters :fields="filterFields" v-model:filterValues="filters" />
    </div>
    <!-- Sort + pagination remain internal. -->
    <DataTable
      :columns="columns"
      :data="data"
      :page-count="pageCount"
      :total-rows="totalRows"
      enable-sorting
      enable-pagination
      v-model:sorting="sorting"
      v-model:pagination="pagination"
    />
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-4">
      <div class="rounded-md border p-3">
        <Filters :fields="filterFields" v-model:filterValues="filters" />
      </div>
      <DataTable
        :columns="userColumns"
        :data="localData.data"
        :page-count="localData.meta.total_pages"
        :total-rows="localData.meta.total"
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    </div>
  </DemoBlock>
</template>
