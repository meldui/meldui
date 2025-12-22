<script setup lang="ts" generic="TData">
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@meldui/tabler-vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DataTablePaginationProps } from './componentProps'

const props = withDefaults(defineProps<DataTablePaginationProps<TData>>(), {
  pageSizeOptions: () => [10, 20, 30, 40, 50],
  showSelectedCount: false,
  showPageSizeSelector: true,
  showPageInfo: true,
})

const selectedCount = computed(() => props.table.getFilteredSelectedRowModel().rows.length)
const totalCount = computed(() => props.table.getFilteredRowModel().rows.length)

const currentPage = computed(() => props.table.getState().pagination.pageIndex + 1)

const pageCount = computed(() => props.table.getPageCount())

const canPreviousPage = computed(() => props.table.getCanPreviousPage())
const canNextPage = computed(() => props.table.getCanNextPage())

const pageSize = computed({
  get: () => props.table.getState().pagination.pageSize,
  set: (value) => props.table.setPageSize(value),
})
</script>

<template>
    <div class="flex items-center justify-between px-2">
        <div class="flex-1 text-sm text-muted-foreground">
            <span v-if="showSelectedCount && selectedCount > 0">
                {{ selectedCount }} of {{ totalCount }} row(s) selected
            </span>
        </div>
        <div class="flex items-center space-x-6 lg:space-x-8">
            <!-- Page Size Selector -->
            <div v-if="showPageSizeSelector" class="flex items-center space-x-2">
                <p class="text-sm font-medium">Rows per page</p>
                <Select v-model="pageSize">
                    <SelectTrigger class="h-8 w-[70px]">
                        <SelectValue :placeholder="pageSize.toString()" />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem
                            v-for="size in pageSizeOptions"
                            :key="size"
                            :value="size"
                        >
                            {{ size }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Page indicator -->
            <div
                v-if="showPageInfo"
                class="flex items-center justify-center text-sm font-medium"
            >
                Page {{ currentPage }} of {{ pageCount }}
            </div>

            <!-- Pagination Controls -->
            <div class="flex items-center gap-1">
                <!-- First Page Button -->
                <Button
                    variant="outline"
                    size="icon"
                    class="hidden h-8 w-8 lg:flex"
                    :disabled="!canPreviousPage"
                    @click="table.setPageIndex(0)"
                >
                    <span class="sr-only">Go to first page</span>
                    <IconChevronsLeft class="h-4 w-4" />
                </Button>

                <!-- Previous Page Button -->
                <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    :disabled="!canPreviousPage"
                    @click="table.previousPage()"
                >
                    <span class="sr-only">Go to previous page</span>
                    <IconChevronLeft class="h-4 w-4" />
                </Button>

                <!-- Next Page Button -->
                <Button
                    variant="outline"
                    size="icon"
                    class="h-8 w-8"
                    :disabled="!canNextPage"
                    @click="table.nextPage()"
                >
                    <span class="sr-only">Go to next page</span>
                    <IconChevronRight class="h-4 w-4" />
                </Button>

                <!-- Last Page Button -->
                <Button
                    variant="outline"
                    size="icon"
                    class="hidden h-8 w-8 lg:flex"
                    :disabled="!canNextPage"
                    @click="table.setPageIndex(pageCount - 1)"
                >
                    <span class="sr-only">Go to last page</span>
                    <IconChevronsRight class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>
</template>
