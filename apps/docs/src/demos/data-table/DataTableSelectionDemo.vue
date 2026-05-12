<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper, useDataTableController } from '@meldui/vue'
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

const { sorting, pagination, state } = useDataTableController({ pageSize: 10 })

const data = ref<User[]>([])
const pageCount = computed(() => Math.ceil(users.length / pagination.value.pageSize))
const totalRows = ref(users.length)

function loadPage() {
  const start = state.value.pagination.pageIndex * state.value.pagination.pageSize
  data.value = users.slice(start, start + state.value.pagination.pageSize)
}

loadPage()
watch(state, loadPage, { deep: true })

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
    :total-rows="totalRows"
    :bulk-select-options="bulkActions"
    enable-row-selection
    enable-sorting
    enable-pagination
    v-model:sorting="sorting"
    v-model:pagination="pagination"
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
        :total-rows="totalRows"
        :bulk-select-options="bulkActions"
        enable-row-selection
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    </div>
  </DemoBlock>
</template>
