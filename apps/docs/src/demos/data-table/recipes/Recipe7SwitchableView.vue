<script setup lang="ts">
import { ref, watch } from 'vue'
import DemoBlock from '../../../components/DemoBlock.vue'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataPagination,
  DataTable,
  Filters,
  useDataTableController,
} from '@meldui/vue'
import {
  MOCK_USERS,
  type ServerResponse,
  filterFields,
  simulateServerSide,
  userColumns,
} from './_shared'

const view = ref<'table' | 'grid'>('table')

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 9 })
const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
watch(
  state,
  (s) => {
    localData.value = simulateServerSide(MOCK_USERS, s)
  },
  { deep: true },
)

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { DataPagination, DataTable, Filters, useDataTableController } from '@meldui/vue'

const view = ref<'table' | 'grid'>('table')

// One controller backs both views. Sorting/filter/pagination state is preserved
// across toggles because it lives in the composable, not the rendering component.
const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 9 })
watch(state, fetchPage, { deep: true })
<\/script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <button :class="view === 'table' && 'active'" @click="view = 'table'">Table</button>
      <button :class="view === 'grid' && 'active'" @click="view = 'grid'">Grid</button>
    </div>
    <Filters :fields="filterFields" v-model:filterValues="filters" />
    <DataTable
      v-if="view === 'table'"
      :columns="columns" :data="data"
      :page-count="pageCount" :total-rows="totalRows"
      enable-sorting enable-pagination
      v-model:sorting="sorting"
      v-model:pagination="pagination"
    />
    <template v-else>
      <div class="grid lg:grid-cols-3 gap-4">
        <Card v-for="user in data" :key="user.id">…</Card>
      </div>
      <DataPagination :page-count="pageCount" :total-rows="totalRows" v-model:pagination="pagination" />
    </template>
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-4">
      <div class="flex items-center gap-2">
        <button
          class="rounded-md border px-3 py-1 text-sm"
          :class="view === 'table' ? 'bg-primary text-primary-foreground' : ''"
          @click="view = 'table'"
        >
          Table
        </button>
        <button
          class="rounded-md border px-3 py-1 text-sm"
          :class="view === 'grid' ? 'bg-primary text-primary-foreground' : ''"
          @click="view = 'grid'"
        >
          Grid
        </button>
      </div>
      <Filters :fields="filterFields" v-model:filterValues="filters" />
      <DataTable
        v-if="view === 'table'"
        :columns="userColumns"
        :data="localData.data"
        :page-count="localData.meta.total_pages"
        :total-rows="localData.meta.total"
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
      <template v-else>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="user in localData.data" :key="user.id">
            <CardHeader>
              <CardTitle class="text-sm">{{ user.name }}</CardTitle>
            </CardHeader>
            <CardContent class="flex items-center justify-between text-xs text-muted-foreground">
              <Badge variant="neutral">{{ user.role }}</Badge>
              <span>{{ user.department }}</span>
            </CardContent>
          </Card>
        </div>
        <DataPagination
          :page-count="localData.meta.total_pages"
          :total-rows="localData.meta.total"
          v-model:pagination="pagination"
        />
      </template>
    </div>
  </DemoBlock>
</template>
