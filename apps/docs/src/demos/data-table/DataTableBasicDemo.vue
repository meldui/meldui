<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper, useDataTableController } from '@meldui/vue'

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

const { sorting, pagination, state } = useDataTableController({ pageSize: 10 })

const data = ref<User[]>([])
const pageCount = computed(() => Math.ceil(allUsers.length / pagination.value.pageSize))
const totalRows = ref(allUsers.length)

function loadPage() {
  const start = state.value.pagination.pageIndex * state.value.pagination.pageSize
  const end = start + state.value.pagination.pageSize
  data.value = allUsers.slice(start, end)
}

loadPage()
watch(state, loadPage, { deep: true })

const code = `<script setup>
import { watch } from 'vue'
import { DataTable, createColumnHelper, useDataTableController } from '@meldui/vue'

const helper = createColumnHelper<User>()

const columns = [
  helper.accessor('name', { title: 'Name', enableSorting: true }),
  helper.accessor('email', { title: 'Email', enableSorting: true }),
  helper.accessor('role', { title: 'Role' }),
  helper.accessor('status', { title: 'Status' }),
]

const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })

const data = ref([])
const pageCount = ref(1)
const totalRows = ref(0)

async function fetchPage() {
  const res = await api.getUsers({
    sort: state.value.sorting,
    filters: state.value.filters,
    page: state.value.pagination.pageIndex + 1,
    perPage: state.value.pagination.pageSize,
  })
  data.value = res.data
  pageCount.value = res.meta.total_pages
  totalRows.value = res.meta.total
}

watch(state, fetchPage, { deep: true })
fetchPage()
<\/script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :total-rows="totalRows"
    enable-sorting enable-pagination
    v-model:sorting="sorting"
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
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    </div>
  </DemoBlock>
</template>
