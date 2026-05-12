<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Filters } from '@meldui/vue'
import type { DataTableFilterField, FilterInstanceValue } from '@meldui/vue'

interface User {
  id: string
  name: string
  role: 'admin' | 'user' | 'guest'
  age: number
}

const fields: DataTableFilterField<User>[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    defaultOperator: 'contains',
    availableOperators: ['contains', 'equals', 'startsWith', 'endsWith', 'notContains'],
  },
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    min: 18,
    max: 80,
  },
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
]

const filters = ref<Record<string, FilterInstanceValue>>({})

const prettyValue = computed(() => JSON.stringify(filters.value, null, 2))

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { Filters, type DataTableFilterField } from '@meldui/vue'

const fields: DataTableFilterField<User>[] = [
  {
    id: 'name',
    label: 'Name',
    type: 'text',
    defaultOperator: 'contains',
    availableOperators: ['contains', 'equals', 'startsWith', 'endsWith', 'notContains'],
  },
  { id: 'age', label: 'Age', type: 'number', min: 18, max: 80 },
  { id: 'role', label: 'Role', type: 'select', options: [/* ... */] },
]

const filters = ref({})
<\/script>

<template>
  <!-- advancedMode adds an operator dropdown to every chip and switches the
       emitted shape to an array of { operator, value } per field. -->
  <Filters :fields="fields" advanced-mode v-model:filterValues="filters" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-3">
      <Filters :fields="fields" advanced-mode v-model:filterValues="filters" />
      <div class="rounded-md bg-muted p-3 font-mono text-xs">
        <p class="mb-1 text-muted-foreground">update:filterValues payload</p>
        <pre class="whitespace-pre-wrap break-all">{{ prettyValue }}</pre>
      </div>
    </div>
  </DemoBlock>
</template>
