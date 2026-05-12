<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../../components/DemoBlock.vue'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataPagination,
  Filters,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useDataTableController,
} from '@meldui/vue'
import type { SortingState } from '@tanstack/vue-table'
import { MOCK_USERS, type ServerResponse, filterFields, simulateServerSide } from './_shared'

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 12 })
const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
watch(
  state,
  (s) => {
    localData.value = simulateServerSide(MOCK_USERS, s)
  },
  { deep: true },
)

const sortOptions = [
  { key: 'name-asc', label: 'Name (A→Z)', value: [{ id: 'name', desc: false }] as SortingState },
  { key: 'name-desc', label: 'Name (Z→A)', value: [{ id: 'name', desc: true }] as SortingState },
  { key: 'newest', label: 'Newest first', value: [{ id: 'created_at', desc: true }] as SortingState },
]

const sortKey = computed<string>({
  get() {
    const s = sorting.value[0]
    return (
      sortOptions.find((o) => o.value[0]?.id === s?.id && o.value[0]?.desc === s?.desc)?.key ??
      'name-asc'
    )
  },
  set(k) {
    sorting.value = sortOptions.find((o) => o.key === k)?.value ?? []
  },
})

const code = `<script setup lang="ts">
import { computed, watch } from 'vue'
import { DataPagination, Filters, useDataTableController } from '@meldui/vue'

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 12 })
watch(state, fetchPage, { deep: true })

// Map between SortingState and a single-select dropdown.
const sortOptions = [
  { key: 'name-asc',  value: [{ id: 'name', desc: false }] },
  { key: 'name-desc', value: [{ id: 'name', desc: true }] },
  { key: 'newest',    value: [{ id: 'created_at', desc: true }] },
]
const sortKey = computed({
  get: () => /* find matching option */,
  set: (k) => { sorting.value = sortOptions.find(o => o.key === k)?.value ?? [] },
})
<\/script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <Filters class="flex-1" :fields="filterFields" v-model:filterValues="filters" />
      <Select v-model="sortKey"><!-- options --></Select>
    </div>
    <div class="grid gap-4 lg:grid-cols-3">
      <Card v-for="user in data" :key="user.id">…</Card>
    </div>
    <DataPagination :page-count="pageCount" :total-rows="totalRows" v-model:pagination="pagination" />
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <Filters class="flex-1" :fields="filterFields" v-model:filterValues="filters" />
        <Select v-model="sortKey">
          <SelectTrigger class="h-8 w-48"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="opt in sortOptions" :key="opt.key" :value="opt.key">
              {{ opt.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
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
    </div>
  </DemoBlock>
</template>
