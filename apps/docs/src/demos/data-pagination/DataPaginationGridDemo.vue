<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataPagination,
  type PaginationState,
} from '@meldui/vue'

interface Item {
  id: number
  title: string
  author: string
}

const allItems: Item[] = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  title: `Article #${i + 1}`,
  author: ['Ada', 'Alan', 'Grace', 'Edsger'][i % 4]!,
}))

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 6 })

const totalPages = computed(() => Math.ceil(allItems.length / pagination.value.pageSize))
const pageItems = computed(() => {
  const start = pagination.value.pageIndex * pagination.value.pageSize
  return allItems.slice(start, start + pagination.value.pageSize)
})

const code = `<script setup lang="ts">
import { ref, computed } from 'vue'
import { DataPagination, type PaginationState } from '@meldui/vue'

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 6 })
const totalPages = computed(() => Math.ceil(items.value.length / pagination.value.pageSize))
const pageItems = computed(() => {
  const start = pagination.value.pageIndex * pagination.value.pageSize
  return items.value.slice(start, start + pagination.value.pageSize)
})
<\/script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <Card v-for="item in pageItems" :key="item.id">…</Card>
  </div>
  <DataPagination
    v-model:pagination="pagination"
    :page-count="totalPages"
    :total-rows="items.length"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full space-y-3">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card v-for="item in pageItems" :key="item.id">
          <CardHeader>
            <CardTitle class="text-sm">{{ item.title }}</CardTitle>
          </CardHeader>
          <CardContent class="text-xs text-muted-foreground">By {{ item.author }}</CardContent>
        </Card>
      </div>
      <DataPagination
        v-model:pagination="pagination"
        :page-count="totalPages"
        :total-rows="allItems.length"
      />
    </div>
  </DemoBlock>
</template>
