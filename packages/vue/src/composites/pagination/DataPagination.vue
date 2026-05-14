<script setup lang="ts">
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@meldui/tabler-vue'
import type { PaginationState } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  pagination: PaginationState
  pageCount: number
  totalRows?: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
  showSelectedCount?: boolean
  selectedCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [10, 20, 30, 40, 50],
  showPageSizeSelector: true,
  showPageInfo: true,
  showSelectedCount: false,
  selectedCount: 0,
})

const emit = defineEmits<{
  'update:pagination': [next: PaginationState]
}>()

const currentPage = computed(() => props.pagination.pageIndex + 1)
const canPreviousPage = computed(() => props.pagination.pageIndex > 0)
const canNextPage = computed(() => props.pagination.pageIndex < props.pageCount - 1)

const pageSize = computed({
  get: () => props.pagination.pageSize,
  set: (value) => {
    emit('update:pagination', { pageIndex: props.pagination.pageIndex, pageSize: value })
  },
})

function setPageIndex(next: number) {
  if (next === props.pagination.pageIndex) return
  emit('update:pagination', { pageIndex: next, pageSize: props.pagination.pageSize })
}
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex-1 text-sm text-muted-foreground">
      <span v-if="showSelectedCount && selectedCount > 0 && totalRows !== undefined">
        {{ selectedCount }} of {{ totalRows }} row(s) selected
      </span>
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div v-if="showPageSizeSelector" class="flex items-center space-x-2">
        <p class="text-sm font-medium">Rows per page</p>
        <Select v-model="pageSize">
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="pageSize.toString()" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div v-if="showPageInfo" class="flex items-center justify-center text-sm font-medium">
        Page {{ currentPage }} of {{ Math.max(pageCount, 1) }}
      </div>

      <div class="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          class="hidden h-8 w-8 lg:flex"
          :disabled="!canPreviousPage"
          @click="setPageIndex(0)"
        >
          <span class="sr-only">Go to first page</span>
          <IconChevronsLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :disabled="!canPreviousPage"
          @click="setPageIndex(pagination.pageIndex - 1)"
        >
          <span class="sr-only">Go to previous page</span>
          <IconChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8"
          :disabled="!canNextPage"
          @click="setPageIndex(pagination.pageIndex + 1)"
        >
          <span class="sr-only">Go to next page</span>
          <IconChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          class="hidden h-8 w-8 lg:flex"
          :disabled="!canNextPage"
          @click="setPageIndex(pageCount - 1)"
        >
          <span class="sr-only">Go to last page</span>
          <IconChevronsRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
