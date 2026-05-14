<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import {
  DataTable,
  createColumnHelper,
  type DataTableFilterField,
  type DataTableFilterState,
  type PaginationState,
  type SortingState,
  useDataTableController,
} from '@meldui/vue'

interface User {
  id: string
  name: string
  role: 'admin' | 'user' | 'guest'
}

const helper = createColumnHelper<User>()

const columns = [
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('role', { title: 'Role' }),
]

const allUsers: User[] = Array.from({ length: 38 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['Ada', 'Alan', 'Grace', 'Edsger', 'Linus'][i % 5],
  role: (['admin', 'user', 'user', 'guest', 'user'] as const)[i % 5],
}))

const filterFields: DataTableFilterField<User>[] = [
  {
    id: 'role',
    type: 'select',
    label: 'Role',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' },
    ],
  },
]

// Simulated URL query — in a real app, source this from useRoute()/useRouter().
const fakeQuery = ref<Record<string, string>>({ page: '1', size: '10', sort: 'name:asc', role: 'user' })

function parseSorting(value: string | undefined): SortingState {
  if (!value) return []
  const [id, dir] = value.split(':')
  return id ? [{ id, desc: dir === 'desc' }] : []
}

function parseFilters(query: Record<string, string>): DataTableFilterState {
  return query.role ? { role: query.role } : {}
}

function serializeState(s: {
  sorting: SortingState
  filters: DataTableFilterState
  pagination: PaginationState
}) {
  const q: Record<string, string> = {
    page: String(s.pagination.pageIndex + 1),
    size: String(s.pagination.pageSize),
  }
  if (s.sorting[0]) q.sort = `${s.sorting[0].id}:${s.sorting[0].desc ? 'desc' : 'asc'}`
  if (typeof s.filters.role === 'string' && s.filters.role) q.role = s.filters.role
  return q
}

const initial = fakeQuery.value
const { sorting, filters, pagination, state } = useDataTableController({
  pageSize: Number(initial.size) || 10,
  initialSorting: parseSorting(initial.sort),
  initialFilters: parseFilters(initial),
  initialPagination: {
    pageIndex: Math.max(0, Number(initial.page) - 1) || 0,
    pageSize: Number(initial.size) || 10,
  },
})

const data = ref<User[]>([])
const pageCount = ref(0)
const totalRows = ref(0)

function loadPage() {
  let rows = [...allUsers]
  const role = state.value.filters.role
  if (typeof role === 'string' && role) rows = rows.filter((u) => u.role === role)
  const sort = state.value.sorting[0]
  if (sort) {
    const dir = sort.desc ? -1 : 1
    rows.sort((a, b) => (a[sort.id as keyof User] > b[sort.id as keyof User] ? dir : -dir))
  }
  totalRows.value = rows.length
  pageCount.value = Math.max(1, Math.ceil(rows.length / state.value.pagination.pageSize))
  const start = state.value.pagination.pageIndex * state.value.pagination.pageSize
  data.value = rows.slice(start, start + state.value.pagination.pageSize)
}

loadPage()

watch(
  state,
  (s) => {
    fakeQuery.value = serializeState(s)
    loadPage()
  },
  { deep: true },
)

const queryString = computed(() => new URLSearchParams(fakeQuery.value).toString())

const code = `<script setup lang="ts">
// Pull useRoute / useRouter from your router (e.g. vue-router).
const route = useRoute()
const router = useRouter()

const { sorting, filters, pagination, state } = useDataTableController({
  pageSize: Number(route.query.size) || 10,
  initialSorting: parseSorting(route.query.sort as string),
  initialFilters: parseFilters(route.query),
  initialPagination: {
    pageIndex: Math.max(0, Number(route.query.page) - 1) || 0,
    pageSize: Number(route.query.size) || 10,
  },
})

watch(
  state,
  (s) => {
    router.replace({ query: serializeState(s) })
    fetchPage()
  },
  { deep: true },
)
<\/script>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-3">
      <div class="rounded-md bg-muted px-3 py-2 font-mono text-xs">
        <span class="text-muted-foreground">simulated URL → </span>?{{ queryString }}
      </div>
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
    </div>
  </DemoBlock>
</template>
