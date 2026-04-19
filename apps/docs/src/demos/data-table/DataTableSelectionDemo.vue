<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper } from '@meldui/vue'
import type { BulkActionOption } from '@meldui/vue'
import { IconTrash, IconDownload } from '@meldui/tabler-vue'

interface User {
  id: string
  name: string
  email: string
  role: string
}

const helper = createColumnHelper<User>()

const columns = [
  helper.selection(),
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('email', { title: 'Email' }),
  helper.accessor('role', { title: 'Role' }),
]

const bulkActions: BulkActionOption<User>[] = [
  { label: 'Delete', icon: IconTrash, variant: 'destructive', action: (rows) => alert(`Delete ${rows.length} rows`) },
  { label: 'Export', icon: IconDownload, action: (rows) => alert(`Export ${rows.length} rows`) },
]

const users: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['John Smith', 'Jane Doe', 'Michael Johnson', 'Sarah Williams'][i % 4],
  email: ['john@example.com', 'jane@example.com', 'michael@example.com', 'sarah@example.com'][i % 4],
  role: ['Admin', 'User', 'User', 'Guest'][i % 4],
}))

const data = ref(users.slice(0, 10))
const pageCount = ref(2)

function handleChange({ pagination }: any) {
  const start = pagination.pageIndex * pagination.pageSize
  data.value = users.slice(start, start + pagination.pageSize)
}

const code = `\u003cscript setup>
import { DataTable, createColumnHelper } from '@meldui/vue'
import type { BulkActionOption } from '@meldui/vue'
import { IconTrash, IconDownload } from '@meldui/tabler-vue'

const helper = createColumnHelper\u003cUser>()

const columns = [
  helper.selection(),  // Adds checkbox column
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('email', { title: 'Email' }),
  helper.accessor('role', { title: 'Role' }),
]

const bulkActions: BulkActionOption\u003cUser>[] = [
  {
    label: 'Delete',
    icon: IconTrash,
    variant: 'destructive',
    action: (rows) => console.log('Delete', rows),
  },
  {
    label: 'Export',
    icon: IconDownload,
    action: (rows) => console.log('Export', rows),
  },
]
\u003c/script>

\u003ctemplate>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :on-server-side-change="handleChange"
    enable-row-selection
    :bulk-select-options="bulkActions"
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
        enable-row-selection
        :bulk-select-options="bulkActions"
      />
    </div>
  </DemoBlock>
</template>
