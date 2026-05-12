<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import {
  DataTable,
  createColumnHelper,
  type DataTableFilterField,
  useDataTableController,
} from '@meldui/vue'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
}

const helper = createColumnHelper<User>()

const columns = [
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('email', { title: 'Email' }),
  helper.accessor('role', { title: 'Role' }),
  helper.accessor('status', { title: 'Status' }),
]

const allUsers: User[] = Array.from({ length: 47 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Edsger Dijkstra', 'Linus Torvalds'][i % 5],
  email: ['ada@example.com', 'alan@example.com', 'grace@example.com', 'edsger@example.com', 'linus@example.com'][i % 5],
  role: (['admin', 'user', 'user', 'guest', 'user'] as const)[i % 5],
  status: (i % 4 === 0 ? 'inactive' : 'active') as 'active' | 'inactive',
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

const { sorting, filters, pagination, state, reset } = useDataTableController({ pageSize: 10 })

const data = ref<User[]>([])
const pageCount = ref(0)
const totalRows = ref(0)

function loadPage() {
  let rows = [...allUsers]
  const roleFilter = state.value.filters.role
  if (typeof roleFilter === 'string' && roleFilter) {
    rows = rows.filter((u) => u.role === roleFilter)
  }
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
watch(state, loadPage, { deep: true })

const code = `<script setup lang="ts">
import { ref, watch } from 'vue'
import { DataTable, useDataTableController } from '@meldui/vue'

const { sorting, filters, pagination, state, reset } = useDataTableController({
  pageSize: 10,
})

const data = ref([])
const pageCount = ref(0)
const totalRows = ref(0)

async function fetchPage() {
  const res = await api.list({
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
  <button @click="reset()">Reset all axes</button>
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

const isFiltered = computed(
  () => Object.keys(filters.value).length > 0 || sorting.value.length > 0 || pagination.value.pageIndex > 0,
)
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-xs text-muted-foreground">
          Try filtering or sorting on a page &gt; 0 — the controller resets to page 0 atomically (one fetch).
        </p>
        <button
          class="rounded-md border px-3 py-1 text-xs disabled:opacity-50"
          :disabled="!isFiltered"
          @click="reset()"
        >
          Reset
        </button>
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
