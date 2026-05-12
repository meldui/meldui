<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DataPagination, type PaginationState } from '@meldui/vue'

interface Order {
  id: string
  customer: string
  total: string
}

const allOrders: Order[] = Array.from({ length: 23 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(4, '0')}`,
  customer: ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Linus Torvalds'][i % 4]!,
  total: `$${((i + 1) * 13.37).toFixed(2)}`,
}))

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 5 })
const totalPages = computed(() => Math.ceil(allOrders.length / pagination.value.pageSize))
const pageRows = computed(() => {
  const start = pagination.value.pageIndex * pagination.value.pageSize
  return allOrders.slice(start, start + pagination.value.pageSize)
})

const code = `<script setup lang="ts">
import { ref, computed } from 'vue'
import { DataPagination, type PaginationState } from '@meldui/vue'

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 5 })
<\/script>

<template>
  <ul class="divide-y rounded-md border">
    <li v-for="row in pageRows" :key="row.id" class="flex justify-between p-3 text-sm">
      <span>{{ row.id }}</span>
      <span>{{ row.customer }}</span>
      <span>{{ row.total }}</span>
    </li>
  </ul>
  <DataPagination
    v-model:pagination="pagination"
    :page-count="totalPages"
    :total-rows="rows.length"
    :show-page-size-selector="false"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-3">
      <ul class="divide-y rounded-md border">
        <li
          v-for="row in pageRows"
          :key="row.id"
          class="flex items-center justify-between gap-4 px-3 py-2 text-sm"
        >
          <span class="font-mono text-xs text-muted-foreground">{{ row.id }}</span>
          <span class="flex-1">{{ row.customer }}</span>
          <span class="font-medium">{{ row.total }}</span>
        </li>
      </ul>
      <DataPagination
        v-model:pagination="pagination"
        :page-count="totalPages"
        :total-rows="allOrders.length"
        :show-page-size-selector="false"
      />
    </div>
  </DemoBlock>
</template>
