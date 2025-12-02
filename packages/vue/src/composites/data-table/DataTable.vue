<script setup lang="ts" generic="TData">
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  FlexRender,
  type PaginationState,
  type SortingState,
} from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DataTablePagination from './DataTablePagination.vue'
import DataTableToolbar from './DataTableToolbar.vue'
import type { BulkActionOption } from './types'
import { type DataTableFilterField, useDataTable } from './useDataTable'
import { usePinnedColumns } from './usePinnedColumns'

interface Props {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  // Server-side props (required)
  pageCount: number
  onServerSideChange: (params: {
    sorting: SortingState
    filters: ColumnFiltersState
    pagination: PaginationState
  }) => void
  // Feature toggles
  enableRowSelection?: boolean
  // Pagination options
  defaultPerPage?: number
  pageSizeOptions?: number[]
  // Toolbar options
  filterFields?: DataTableFilterField<TData>[]
  searchPlaceholder?: string
  searchColumn?: string
  showToolbar?: boolean
  showPagination?: boolean
  showSelectedCount?: boolean
  bulkSelectOptions?: BulkActionOption<TData>[]
  // Empty state
  emptyMessage?: string
  // Advanced filter mode (static - never changes)
  advancedMode?: boolean
  // Column pinning
  defaultPinning?: ColumnPinningState
  enableColumnPinning?: boolean
  // Table container styling
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  enableRowSelection: false,
  defaultPerPage: 10,
  pageSizeOptions: () => [10, 20, 30, 40, 50],
  filterFields: () => [],
  searchPlaceholder: 'Search...',
  showToolbar: true,
  showPagination: true,
  showSelectedCount: false,
  emptyMessage: 'No results found.',
  advancedMode: false,
  enableColumnPinning: false,
  maxHeight: '600px',
})

const tableState = useDataTable({
  data: () => props.data,
  columns: () => props.columns,
  pageCount: () => props.pageCount,
  defaultPerPage: props.defaultPerPage,
  enableRowSelection: props.enableRowSelection,
  filterFields: props.filterFields,
  onServerSideChange: props.onServerSideChange,
  advancedMode: props.advancedMode,
  defaultPinning: props.defaultPinning,
  enableColumnPinning: props.enableColumnPinning,
})

const { table } = tableState

// Create a reactive reference to the table instance for pinning
const tableInstanceRef = computed(() => table)

// Pinning composable (only when pinning is enabled)
const {
  tableRef: pinnedTableRef,
  isScrolled,
  hasRightScroll,
} = props.enableColumnPinning
  ? usePinnedColumns(tableInstanceRef)
  : {
      tableRef: ref(null),
      isScrolled: ref(false),
      hasRightScroll: ref(false),
    }

// Ref callback function for the table container
const setTableContainerRef = (el: Element | null) => {
  if (el && pinnedTableRef) {
    pinnedTableRef.value = el as HTMLElement
  }
}

// Helper to get pinning class for a column
const getPinningClass = (columnId: string) => {
  if (!props.enableColumnPinning) return ''

  const { left = [], right = [] } = table.getState().columnPinning

  // Check if column is pinned left
  if (left.includes(columnId)) {
    const isLastLeftPinned = left[left.length - 1] === columnId
    return isLastLeftPinned ? 'pinned-left pinned-left-last' : 'pinned-left'
  }

  // Check if column is pinned right
  if (right.includes(columnId)) {
    const isFirstRightPinned = right[0] === columnId
    return isFirstRightPinned ? 'pinned-right pinned-right-first' : 'pinned-right'
  }

  return ''
}

// Expose table state for parent components to access selected rows
defineExpose({
  ...tableState,
})
</script>

<template>
    <div class="w-full space-y-4">
        <!-- Toolbar -->
        <DataTableToolbar
            v-if="showToolbar"
            :table="table"
            :filter-fields="filterFields"
            :search-placeholder="searchPlaceholder"
            :search-column="searchColumn"
            :bulk-select-options="bulkSelectOptions"
            :advanced-mode="advancedMode"
        />

        <!-- Table Container with horizontal and vertical scroll -->
        <div
            :ref="setTableContainerRef"
            class="rounded-md border table-container overflow-auto"
            :class="{
                'is-scrolled': isScrolled,
                'has-right-scroll': hasRightScroll,
            }"
        >
            <!--maxHeight needs to be added in style property to add this style in container of <Table> component which has over-flow: auto-->
            <Table :style="{ maxHeight: maxHeight }">
                <TableHeader class="bg-muted">
                    <TableRow
                        v-for="headerGroup in table.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                            :colSpan="header.colSpan"
                            :data-column-id="header.column.id"
                            :class="getPinningClass(header.column.id)"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <TableRow
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                            :data-state="
                                row.getIsSelected() ? 'selected' : undefined
                            "
                        >
                            <TableCell
                                v-for="cell in row.getVisibleCells()"
                                :key="cell.id"
                                :data-column-id="cell.column.id"
                                :class="getPinningClass(cell.column.id)"
                            >
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </TableCell>
                        </TableRow>
                    </template>
                    <TableRow v-else>
                        <TableCell
                            :colspan="columns.length"
                            class="h-24 text-center"
                        >
                            {{ emptyMessage }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- Pagination -->
        <DataTablePagination
            v-if="showPagination"
            :table="table"
            :page-size-options="pageSizeOptions"
            :show-selected-count="showSelectedCount"
        />
    </div>
</template>

<style scoped>
/* Sticky header for vertical scroll */
:deep(thead th) {
    position: sticky;
    top: 0;
    z-index: 15;
    background-color: var(--muted);
    border-bottom: 1px solid var(--border);
    /*box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);*/
}

/* Base pinned column styles */
:deep(.pinned-left),
:deep(.pinned-right) {
    position: sticky;
    z-index: 10;
}

:deep(.pinned-left) {
    left: var(--col-left-offset, 0);
}

:deep(.pinned-right) {
    right: var(--col-right-offset, 0);
}

/* Border separators for edge pinned columns */
:deep(.pinned-left-last) {
    border-right: 1px solid var(--border);
}

:deep(.pinned-right-first) {
    border-left: 1px solid var(--border);
}

/* Header pinned columns - elevated z-index */
:deep(thead .pinned-left),
:deep(thead .pinned-right) {
    z-index: 20;
}

/* Dark mode support - adjust shadow opacity */
:global(.dark) .table-container.is-scrolled :deep(.pinned-left::after),
:global(.dark) .table-container.has-right-scroll :deep(.pinned-right::before) {
    box-shadow: inset 8px 0 6px -6px rgba(0, 0, 0, 0.4);
}

/* Ensure table and cells have solid backgrounds */
:deep(table) {
    background-color: var(--background);
    border-collapse: separate;
    border-spacing: 0;
}

:deep(thead),
:deep(th) {
    background-color: var(--muted);
}

:deep(tbody tr) {
    background-color: var(--background);
}

:deep(tbody tr:hover) {
    background-color: var(--accent);
}

:deep(tbody tr[data-state="selected"]) {
    background-color: var(--muted);
}

:deep(td) {
    background-color: inherit;
}
</style>
