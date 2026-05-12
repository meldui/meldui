<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Checkbox, DataPagination, type PaginationState } from '@meldui/vue'

interface Invite {
  id: string
  email: string
  role: 'Admin' | 'Editor' | 'Viewer'
}

const allInvites: Invite[] = Array.from({ length: 28 }, (_, i) => ({
  id: `inv-${i + 1}`,
  email: `${['ada', 'alan', 'grace', 'edsger'][i % 4]}+${i + 1}@example.com`,
  role: (['Admin', 'Editor', 'Viewer'] as const)[i % 3],
}))

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 8 })
// Selected ids survive page changes — DataPagination just needs the count.
const selectedIds = ref<Set<string>>(new Set())

const totalPages = computed(() => Math.ceil(allInvites.length / pagination.value.pageSize))
const pageRows = computed(() => {
  const start = pagination.value.pageIndex * pagination.value.pageSize
  return allInvites.slice(start, start + pagination.value.pageSize)
})

function toggle(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

const code = `<script setup lang="ts">
import { ref, computed } from 'vue'
import { DataPagination, type PaginationState } from '@meldui/vue'

const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 8 })

// Track selected ids in the parent so they survive page changes.
// DataPagination just needs the count via :selected-count.
const selectedIds = ref<Set<string>>(new Set())
const selectedCount = computed(() => selectedIds.value.size)
<\/script>

<template>
  <DataPagination
    v-model:pagination="pagination"
    :page-count="totalPages"
    :total-rows="allInvites.length"
    :selected-count="selectedCount"
    show-selected-count
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
          class="flex items-center gap-3 px-3 py-2 text-sm"
        >
          <Checkbox
            :model-value="selectedIds.has(row.id)"
            @update:model-value="toggle(row.id)"
          />
          <span class="flex-1">{{ row.email }}</span>
          <span class="text-xs text-muted-foreground">{{ row.role }}</span>
        </li>
      </ul>
      <DataPagination
        v-model:pagination="pagination"
        :page-count="totalPages"
        :total-rows="allInvites.length"
        :selected-count="selectedIds.size"
        show-selected-count
      />
    </div>
  </DemoBlock>
</template>
