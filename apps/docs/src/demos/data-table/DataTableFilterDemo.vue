<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper } from '@meldui/vue'
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

const data = ref(allUsers.slice(0, 10))
const pageCount = ref(3)

function handleChange({ pagination }: any) {
  const start = pagination.pageIndex * pagination.pageSize
  data.value = allUsers.slice(start, start + pagination.pageSize)
  pageCount.value = Math.ceil(allUsers.length / pagination.pageSize)
}

const code = `\u003cscript setup>
import { DataTable, createColumnHelper } from '@meldui/vue'
import type { DataTableFilterField } from '@meldui/vue'

const filterFields: DataTableFilterField\u003cUser>[] = [
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
\u003c/script>

\u003ctemplate>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :on-server-side-change="handleChange"
    :filter-fields="filterFields"
    search-column="name"
  />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full">
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        :filter-fields="filterFields"
        search-column="name"
        search-placeholder="Search users..."
      />
    </div>
  </DemoBlock>
</template>
