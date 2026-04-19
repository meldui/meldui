<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataTable, createColumnHelper } from '@meldui/vue'

interface Employee {
  id: string
  name: string
  email: string
  department: string
  location: string
  role: string
  salary: number
}

const helper = createColumnHelper<Employee>()

const columns = [
  helper.selection(),
  helper.accessor('name', { title: 'Name', enableSorting: true, size: 150 }),
  helper.accessor('email', { title: 'Email', size: 220 }),
  helper.accessor('department', { title: 'Department', size: 150 }),
  helper.accessor('location', { title: 'Location', size: 150 }),
  helper.accessor('role', { title: 'Role', size: 120 }),
  helper.accessor('salary', { title: 'Salary', size: 120 }),
  helper.actions({
    display: 'inline',
    actions: [
      { label: 'Edit', onClick: () => {} },
    ],
  }),
]

const employees: Employee[] = Array.from({ length: 15 }, (_, i) => ({
  id: `${i + 1}`,
  name: ['Alice Chen', 'Bob Martinez', 'Carol Davis', 'Dan Wilson', 'Eva Brown'][i % 5],
  email: ['alice@co.com', 'bob@co.com', 'carol@co.com', 'dan@co.com', 'eva@co.com'][i % 5],
  department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5],
  location: ['New York', 'San Francisco', 'Austin', 'Seattle', 'Remote'][i % 5],
  role: ['Senior', 'Lead', 'Junior', 'Manager', 'Director'][i % 5],
  salary: 60000 + (i * 5000),
}))

const data = ref(employees.slice(0, 10))
const pageCount = ref(2)

function handleChange({ pagination }: any) {
  const start = pagination.pageIndex * pagination.pageSize
  data.value = employees.slice(start, start + pagination.pageSize)
}

const code = `\u003cscript setup lang="ts">
import { DataTable, createColumnHelper } from '@meldui/vue'

const helper = createColumnHelper\u003cEmployee>()

const columns = [
  helper.selection(),
  helper.accessor('name', { title: 'Name', enableSorting: true, size: 150 }),
  helper.accessor('email', { title: 'Email', size: 220 }),
  helper.accessor('department', { title: 'Department', size: 150 }),
  helper.accessor('location', { title: 'Location', size: 150 }),
  helper.accessor('role', { title: 'Role', size: 120 }),
  helper.accessor('salary', { title: 'Salary', size: 120 }),
  helper.actions({
    display: 'inline',
    actions: [{ label: 'Edit', onClick: (row) => edit(row) }],
  }),
]
\u003c/script>

\u003ctemplate>
  <DataTable
    :columns="columns"
    :data="data"
    :page-count="pageCount"
    :on-server-side-change="handleChange"
    enable-column-pinning
    enable-row-selection
    :default-pinning="{
      left: ['select', 'name'],
      right: ['actions'],
    }"
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
        enable-column-pinning
        enable-row-selection
        :default-pinning="{
          left: ['select', 'name'],
          right: ['actions'],
        }"
      />
    </div>
  </DemoBlock>
</template>
