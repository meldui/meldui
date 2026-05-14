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
  type DataTableFilterState,
  Filters,
  type PaginationState,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SortingState,
} from '@meldui/vue'
import { MOCK_USERS, type ServerResponse, filterFields, simulateServerSide } from './_shared'

const sorting = ref<SortingState>([])
const filters = ref<DataTableFilterState>({})
const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 9 })

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

const merged = computed(() => ({
  sorting: sorting.value,
  filters: filters.value,
  pagination: pagination.value,
}))
const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, merged.value))
watch(
  merged,
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
import { computed, ref, watch } from 'vue'
import { DataPagination, Filters, Select } from '@meldui/vue'

const sorting = ref([])
const filters = ref({})
const pagination = ref({ pageIndex: 0, pageSize: 9 })

// flush:'sync' watchers, replicated manually since we skipped the composable.
watch(filters, () => { pagination.value = { ...pagination.value, pageIndex: 0 } },
  { deep: true, flush: 'sync' })
watch(sorting, () => { pagination.value = { ...pagination.value, pageIndex: 0 } },
  { deep: true, flush: 'sync' })

const merged = computed(() => ({ sorting: sorting.value, filters: filters.value, pagination: pagination.value }))
watch(merged, fetchPage, { deep: true })
<\/script>`
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
