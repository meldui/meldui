<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper } from '@meldui/vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

const helper = createColumnHelper<User>()

const columns = [
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('email', { title: 'Email', enableSorting: true }),
  helper.accessor('role', { title: 'Role' }),
  helper.accessor('status', { title: 'Status' }),
]

const allUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Williams', 'David Brown'][i % 5],
  email: ['john@example.com', 'jane@example.com', 'michael@example.com', 'sarah@example.com', 'david@example.com'][i % 5],
  role: ['Admin', 'User', 'User', 'Guest', 'User'][i % 5],
  status: i % 4 === 0 ? 'Inactive' : 'Active',
}))

const data = ref<User[]>([])
const pageCount = ref(1)

function handleChange({ pagination }: any) {
  const start = pagination.pageIndex * pagination.pageSize
  const end = start + pagination.pageSize
  data.value = allUsers.slice(start, end)
  pageCount.value = Math.ceil(allUsers.length / pagination.pageSize)
}

handleChange({ pagination: { pageIndex: 0, pageSize: 10 } })

const code = `\u003cscript setup>
import { ref } from 'vue'
import { DataTable, createColumnHelper } from '@meldui/vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

const helper = createColumnHelper\u003cUser>()

const columns = [
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('email', { title: 'Email', enableSorting: true }),
  helper.accessor('role', { title: 'Role' }),
  helper.accessor('status', { title: 'Status' }),
]

const data = ref([])
const pageCount = ref(1)

function handleChange({ sorting, filters, pagination }) {
  // Fetch from your API using sorting, filters, pagination
  const response = await api.getUsers({ ...pagination, ...sorting })
  data.value = response.data
  pageCount.value = response.meta.total_pages
}
\u003c/script>

\u003ctemplate>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :on-server-side-change="handleChange"
    search-column="name"
    search-placeholder="Search users..."
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
        search-column="name"
        search-placeholder="Search users..."
      />
    </div>
  </DemoBlock>
</template>
