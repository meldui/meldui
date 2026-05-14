<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper, useDataTableController } from '@meldui/vue'
import type { DataTableFilterField } from '@meldui/vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  is_verified: boolean
}

const helper = createColumnHelper<User>()

const columns = [
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('email', { title: 'Email' }),
  helper.accessor('role', { title: 'Role' }),
  helper.accessor('status', { title: 'Status' }),
  helper.accessor('is_verified', { title: 'Verified' }),
]

const filterFields: DataTableFilterField<User>[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Filter by name...' },
  {
    id: 'role',
    label: 'Role',
    type: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Guest', value: 'guest' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  { id: 'is_verified', label: 'Verified', type: 'boolean' },
]

const allUsers: User[] = Array.from({ length: 30 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Williams', 'David Brown', 'Emily Davis'][i % 6],
  email: ['john@example.com', 'jane@example.com', 'michael@example.com', 'sarah@example.com', 'david@example.com', 'emily@example.com'][i % 6],
  role: ['admin', 'user', 'user', 'guest', 'user', 'admin'][i % 6],
  status: i % 4 === 0 ? 'inactive' : 'active',
  is_verified: i % 3 !== 0,
}))

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })
const filterSearch = { id: 'name', placeholder: 'Search users...' }

const data = ref<User[]>([])
const pageCount = computed(() => Math.max(Math.ceil(allUsers.length / pagination.value.pageSize), 1))
const totalRows = ref(allUsers.length)

function loadPage() {
  const start = state.value.pagination.pageIndex * state.value.pagination.pageSize
  data.value = allUsers.slice(start, start + state.value.pagination.pageSize)
}

loadPage()
watch(state, loadPage, { deep: true })

const code = `<script setup>
import { DataTable, createColumnHelper, useDataTableController } from '@meldui/vue'
import type { DataTableFilterField } from '@meldui/vue'

const filterFields: DataTableFilterField<User>[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Filter by name...' },
  {
    id: 'role', label: 'Role', type: 'select',
    options: [{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }],
  },
  { id: 'is_verified', label: 'Verified', type: 'boolean' },
]

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })
const filterSearch = { id: 'name', placeholder: 'Search users...' }

watch(state, fetchPage, { deep: true })
<\/script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :total-rows="totalRows"
    :filter-fields="filterFields"
    :filter-search="filterSearch"
    enable-sorting enable-filter enable-pagination
    v-model:sorting="sorting"
    v-model:filters="filters"
    v-model:pagination="pagination"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-fields="filterFields"
        :filter-search="filterSearch"
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
