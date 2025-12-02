<script setup lang="ts" generic="TData">
import { IconAlertCircle, IconRefresh } from '@meldui/tabler-vue'
import {
  type Cell,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  FlexRender,
  type PaginationState,
  type Row,
  type SortingState,
} from '@tanstack/vue-table'
import {
  type ComponentPublicInstance,
  type CSSProperties,
  computed,
  type HTMLAttributes,
  ref,
  useSlots,
} from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DataTablePagination from './DataTablePagination.vue'
import DataTableToolbar from './DataTableToolbar.vue'
import type { RegisteredFilterPlugin } from './filterPlugins'
import type { BulkActionOption } from './types'
import { type DataTableFilterField, useDataTable } from './useDataTable'
import { usePinnedColumns } from './usePinnedColumns'
import { useTableKeyboard } from './useTableKeyboard'

// Get slots for dynamic cell slot detection
const slots = useSlots()

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
  showPageSizeSelector?: boolean
  showPageNumbers?: boolean
  siblingCount?: number
  paginationPosition?: 'bottom' | 'top' | 'both'
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
  // Loading state
  loading?: boolean
  loadingMessage?: string
  // Error state
  error?: string | Error
  // Advanced filter mode (static - never changes)
  advancedMode?: boolean
  // Column pinning
  defaultPinning?: ColumnPinningState
  enableColumnPinning?: boolean
  // Column resizing
  enableColumnResizing?: boolean
  columnResizeMode?: 'onChange' | 'onEnd'
  // Table container styling
  maxHeight?: string
  // Table density
  density?: 'compact' | 'comfortable' | 'spacious'
  // Row styling
  rowClass?: (row: Row<TData>) => string | Record<string, boolean> | undefined
  rowStyle?: (row: Row<TData>) => CSSProperties | undefined
  rowProps?: (row: Row<TData>) => HTMLAttributes | undefined
  // Header styling
  headerClass?: HTMLAttributes['class']
  // Bordered cells (spreadsheet-like)
  bordered?: boolean
  // Keyboard navigation
  enableKeyboardNavigation?: boolean
  // Refresh button
  showRefreshButton?: boolean
  // Row expansion
  enableRowExpansion?: boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
  // Custom filter plugins
  filterPlugins?: RegisteredFilterPlugin[]
}

const props = withDefaults(defineProps<Props>(), {
  enableRowSelection: false,
  defaultPerPage: 10,
  pageSizeOptions: () => [10, 20, 30, 40, 50],
  showPageSizeSelector: true,
  showPageNumbers: true,
  siblingCount: 1,
  paginationPosition: 'bottom',
  filterFields: () => [],
  searchPlaceholder: 'Search...',
  showToolbar: true,
  showPagination: true,
  showSelectedCount: false,
  emptyMessage: 'No results found.',
  loading: false,
  loadingMessage: 'Loading data...',
  advancedMode: false,
  enableColumnPinning: false,
  enableColumnResizing: false,
  columnResizeMode: 'onChange',
  maxHeight: '600px',
  density: 'comfortable',
  bordered: false,
  enableKeyboardNavigation: false,
  showRefreshButton: false,
  enableRowExpansion: false,
  filterPlugins: () => [],
})

// Emits
const emit = defineEmits<{
  retry: []
  rowActivate: [row: Row<TData>]
}>()

// Retry handler for error state
const handleRetry = () => {
  emit('retry')
}

// Computed error message
const errorMessage = computed(() => {
  if (!props.error) return ''
  return props.error instanceof Error ? props.error.message : props.error
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
  enableColumnResizing: props.enableColumnResizing,
  columnResizeMode: props.columnResizeMode,
  enableRowExpansion: props.enableRowExpansion,
  getRowCanExpand: props.getRowCanExpand,
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

// Ref for the table container (used for both pinning and keyboard navigation)
const tableContainerRef = ref<HTMLElement | null>(null)

// Ref callback function for the table container
const setTableContainerRef = (el: Element | ComponentPublicInstance | null) => {
  const element = el instanceof Element ? el : null
  tableContainerRef.value = element as HTMLElement | null
  if (element && pinnedTableRef) {
    pinnedTableRef.value = element as HTMLElement
  }
}

// Keyboard navigation composable (only when enabled)
const keyboardState = props.enableKeyboardNavigation
  ? useTableKeyboard({
      table,
      tableContainerRef,
      enableSelection: props.enableRowSelection,
      enablePagination: props.showPagination,
      onRowActivate: (row) => emit('rowActivate', row),
    })
  : {
      focusedRowIndex: ref(-1),
      isFocused: ref(false),
      focusTable: () => {},
      blurTable: () => {},
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

// Helper to check if a cell slot exists for a column
const hasCellSlot = (columnId: string) => {
  return !!slots[`cell-${columnId}`]
}

// Helper to get cell slot props
const getCellSlotProps = (cell: Cell<TData, unknown>, row: Row<TData>) => {
  return {
    cell,
    row,
    value: cell.getValue(),
  }
}

// Helper to get row slot props
const getRowSlotProps = (row: Row<TData>, index: number) => {
  return {
    row,
    cells: row.getVisibleCells(),
    isSelected: row.getIsSelected(),
    index,
  }
}

// Pagination slot props
const paginationSlotProps = computed(() => ({
  table,
  pageCount: table.getPageCount(),
  currentPage: table.getState().pagination.pageIndex + 1,
  pageSize: table.getState().pagination.pageSize,
  canPrevious: table.getCanPreviousPage(),
  canNext: table.getCanNextPage(),
}))

// Footer slot props
const footerSlotProps = computed(() => ({
  table,
  footerGroups: table.getFooterGroups(),
}))

// Check if any column has a footer defined
const hasColumnFooters = computed(() => {
  return table
    .getFooterGroups()
    .some((group) => group.headers.some((header) => header.column.columnDef.footer))
})

// Check if footer slot is provided
const hasFooterSlot = computed(() => !!slots.footer)

// Expose table state for parent components to access selected rows
defineExpose({
  ...tableState,
  ...keyboardState,
})
</script>

<template>
    <div class="w-full space-y-4">
        <!-- Toolbar: Use #toolbar slot to completely replace, or use default with #toolbar-start/#toolbar-end -->
        <template v-if="showToolbar">
            <slot name="toolbar" :table="table" :loading="loading">
                <DataTableToolbar
                    :table="table"
                    :filter-fields="filterFields"
                    :filter-plugins="filterPlugins"
                    :search-placeholder="searchPlaceholder"
                    :search-column="searchColumn"
                    :bulk-select-options="bulkSelectOptions"
                    :advanced-mode="advancedMode"
                    :loading="loading"
                    :show-refresh-button="showRefreshButton"
                    @refresh="tableState.refresh"
                >
                    <!-- Pass through toolbar slots -->
                    <template #toolbar-start="slotProps">
                        <slot name="toolbar-start" v-bind="slotProps" />
                    </template>
                    <template #toolbar-end="slotProps">
                        <slot name="toolbar-end" v-bind="slotProps" />
                    </template>
                </DataTableToolbar>
            </slot>
        </template>

        <!-- Top Pagination (when position is 'top' or 'both') -->
        <template v-if="showPagination && (paginationPosition === 'top' || paginationPosition === 'both')">
            <slot name="pagination" v-bind="paginationSlotProps">
                <DataTablePagination
                    :table="table"
                    :page-size-options="pageSizeOptions"
                    :show-selected-count="showSelectedCount"
                    :show-page-size-selector="showPageSizeSelector"
                    :show-page-numbers="showPageNumbers"
                    :sibling-count="siblingCount"
                />
            </slot>
        </template>

        <!-- Table Container with horizontal and vertical scroll -->
        <div
            :ref="setTableContainerRef"
            class="rounded-md border table-container overflow-auto"
            :class="{
                'is-scrolled': isScrolled,
                'has-right-scroll': hasRightScroll,
            }"
            :data-loading="loading"
            :data-density="density"
            :tabindex="enableKeyboardNavigation ? 0 : undefined"
            :data-keyboard-navigation="enableKeyboardNavigation || undefined"
        >
            <!--maxHeight needs to be added in style property to add this style in container of <Table> component which has over-flow: auto-->
            <Table :style="{ maxHeight: maxHeight }">
                <TableHeader :class="headerClass ?? 'bg-muted'">
                    <TableRow
                        v-for="headerGroup in table.getHeaderGroups()"
                        :key="headerGroup.id"
                    >
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                            :colSpan="header.colSpan"
                            :data-column-id="header.column.id"
                            :class="[getPinningClass(header.column.id), { 'relative': enableColumnResizing, 'border-r border-border last:border-r-0': bordered }]"
                            :style="{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                            <!-- Column resize handle -->
                            <div
                                v-if="enableColumnResizing && header.column.getCanResize()"
                                class="resize-handle"
                                :data-resizing="header.column.getIsResizing() || undefined"
                                @mousedown="header.getResizeHandler()?.($event)"
                                @touchstart="header.getResizeHandler()?.($event)"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <!-- Error state -->
                    <template v-if="error">
                        <TableRow>
                            <TableCell :colspan="columns.length" class="p-0">
                                <slot
                                    name="error"
                                    :error="error"
                                    :retry="handleRetry"
                                >
                                    <Alert variant="destructive" class="m-4">
                                        <IconAlertCircle class="size-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription class="flex items-center justify-between">
                                            <span>{{ errorMessage }}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                @click="handleRetry"
                                            >
                                                <IconRefresh class="mr-1 size-4" />
                                                Retry
                                            </Button>
                                        </AlertDescription>
                                    </Alert>
                                </slot>
                            </TableCell>
                        </TableRow>
                    </template>

                    <!-- Loading state -->
                    <template v-else-if="loading">
                        <TableRow
                            v-for="rowIndex in table.getState().pagination.pageSize"
                            :key="`skeleton-row-${rowIndex}`"
                        >
                            <TableCell
                                v-for="(column, colIndex) in columns"
                                :key="`skeleton-cell-${rowIndex}-${colIndex}`"
                                :class="{ 'border-r border-border last:border-r-0': bordered }"
                            >
                                <Skeleton class="h-5 w-full" />
                            </TableCell>
                        </TableRow>
                    </template>

                    <!-- Data rows -->
                    <template v-else-if="table.getRowModel().rows?.length">
                        <template
                            v-for="(row, index) in table.getRowModel().rows"
                            :key="row.id"
                        >
                            <!-- Row slot: Use #row to completely replace row rendering -->
                            <slot
                                name="row"
                                v-bind="getRowSlotProps(row, index)"
                            >
                                <TableRow
                                    :data-state="
                                        row.getIsSelected()
                                            ? 'selected'
                                            : undefined
                                    "
                                    :class="rowClass?.(row)"
                                    :style="rowStyle?.(row)"
                                    v-bind="rowProps?.(row)"
                                >
                                    <TableCell
                                        v-for="cell in row.getVisibleCells()"
                                        :key="cell.id"
                                        :data-column-id="cell.column.id"
                                        :class="[getPinningClass(cell.column.id), { 'border-r border-border last:border-r-0': bordered }]"
                                        :style="{ width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined }"
                                    >
                                        <!-- Cell slot: Use #cell-[columnId] to customize specific column cells -->
                                        <slot
                                            v-if="hasCellSlot(cell.column.id)"
                                            :name="`cell-${cell.column.id}`"
                                            v-bind="getCellSlotProps(cell, row)"
                                        />
                                        <FlexRender
                                            v-else
                                            :render="cell.column.columnDef.cell"
                                            :props="cell.getContext()"
                                        />
                                    </TableCell>
                                </TableRow>
                                <!-- Expanded row content -->
                                <TableRow
                                    v-if="enableRowExpansion && row.getIsExpanded()"
                                    class="expanded-row"
                                    :data-expanded="true"
                                >
                                    <TableCell :colspan="columns.length" class="p-0">
                                        <div class="expanded-row-content">
                                            <slot name="expanded-row" :row="row" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </slot>
                        </template>
                    </template>

                    <!-- Empty state slot -->
                    <TableRow v-else>
                        <TableCell :colspan="columns.length" class="p-0">
                            <slot
                                name="empty"
                                :message="emptyMessage"
                                :columns="columns.length"
                            >
                                <Empty class="border-0">
                                    <EmptyHeader>
                                        <EmptyTitle>{{
                                            emptyMessage
                                        }}</EmptyTitle>
                                        <EmptyDescription>
                                            Try adjusting your filters or search
                                            criteria.
                                        </EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                            </slot>
                        </TableCell>
                    </TableRow>
                </TableBody>

                <!-- Footer: Use #footer slot to completely replace, or use column footers -->
                <TableFooter v-if="hasFooterSlot || hasColumnFooters" class="table-footer">
                    <slot name="footer" v-bind="footerSlotProps">
                        <TableRow
                            v-for="footerGroup in table.getFooterGroups()"
                            :key="footerGroup.id"
                        >
                            <TableCell
                                v-for="header in footerGroup.headers"
                                :key="header.id"
                                :colSpan="header.colSpan"
                                :data-column-id="header.column.id"
                                :class="getPinningClass(header.column.id)"
                                :style="{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }"
                            >
                                <FlexRender
                                    v-if="!header.isPlaceholder && header.column.columnDef.footer"
                                    :render="header.column.columnDef.footer"
                                    :props="header.getContext()"
                                />
                            </TableCell>
                        </TableRow>
                    </slot>
                </TableFooter>
            </Table>
        </div>

        <!-- Bottom Pagination (when position is 'bottom' or 'both') -->
        <template v-if="showPagination && (paginationPosition === 'bottom' || paginationPosition === 'both')">
            <slot name="pagination" v-bind="paginationSlotProps">
                <DataTablePagination
                    :table="table"
                    :page-size-options="pageSizeOptions"
                    :show-selected-count="showSelectedCount"
                    :show-page-size-selector="showPageSizeSelector"
                    :show-page-numbers="showPageNumbers"
                    :sibling-count="siblingCount"
                />
            </slot>
        </template>
    </div>
</template>

<style scoped>
/*
 * DataTable Styles
 * CSS custom properties are defined in @meldui/vue/themes/default.css
 * Override --dt-* variables to customize appearance
 */

/* Table container */
.table-container {
    border-color: var(--dt-border-color);
    border-radius: var(--dt-border-radius);
}

/* Sticky header for vertical scroll */
:deep(thead th) {
    position: sticky;
    top: 0;
    z-index: var(--dt-z-header);
    background-color: var(--dt-header-bg);
    color: var(--dt-header-text);
    border-bottom: 1px solid var(--dt-header-border);
}

/* Base pinned column styles */
:deep(.pinned-left),
:deep(.pinned-right) {
    position: sticky;
    z-index: var(--dt-z-pinned);
}

:deep(.pinned-left) {
    left: var(--col-left-offset, 0);
}

:deep(.pinned-right) {
    right: var(--col-right-offset, 0);
}

/* Border separators for edge pinned columns */
:deep(.pinned-left-last) {
    border-right: 1px solid var(--dt-pinned-border);
}

:deep(.pinned-right-first) {
    border-left: 1px solid var(--dt-pinned-border);
}

/* Header pinned columns - elevated z-index */
:deep(thead .pinned-left),
:deep(thead .pinned-right) {
    z-index: var(--dt-z-header-pinned);
}

/* Ensure table and cells have solid backgrounds */
:deep(table) {
    background-color: var(--dt-row-bg);
    border-collapse: separate;
    border-spacing: 0;
}

:deep(thead),
:deep(th) {
    background-color: var(--dt-header-bg);
}

:deep(tbody tr) {
    background-color: var(--dt-row-bg);
    color: var(--dt-cell-text);
}

:deep(tbody tr:hover) {
    background-color: var(--dt-row-hover-bg);
}

:deep(tbody tr[data-state="selected"]) {
    background-color: var(--dt-row-selected-bg);
}

:deep(td) {
    background-color: inherit;
}

/* Loading state overlay effect */
.table-container[data-loading="true"] {
    opacity: var(--dt-loading-opacity);
    pointer-events: none;
}

/* Density styles are handled in default.css using [data-density] descendant selectors.
   This approach is necessary because Vue scoped styles don't properly inherit CSS custom
   properties that are set on ancestor elements via attribute selectors like [data-density="compact"].
   All other CSS variables used here are defined in :root, so they work fine with :deep(). */

/* Column resize handle */
.resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: var(--dt-resize-handle-width);
    cursor: col-resize;
    user-select: none;
    touch-action: none;
    background-color: var(--dt-resize-handle-bg);
    transition: background-color 0.15s ease;
}

.resize-handle:hover {
    background-color: var(--dt-resize-handle-hover-bg);
}

.resize-handle[data-resizing] {
    background-color: var(--dt-resize-handle-active-bg);
}

/* Expanded row styles */
:deep(.expanded-row) {
    background-color: var(--dt-expanded-row-bg);
}

:deep(.expanded-row td) {
    border-top: 1px solid var(--dt-expanded-row-border);
}

.expanded-row-content {
    padding: var(--dt-expanded-content-padding);
}

/* Footer styles */
:deep(.table-footer) {
    position: sticky;
    bottom: 0;
    z-index: var(--dt-z-footer);
}

:deep(.table-footer td) {
    background-color: var(--dt-footer-bg);
    border-top: 1px solid var(--dt-footer-border);
    color: var(--dt-footer-text);
    font-weight: var(--dt-footer-font-weight);
}

/* Footer pinned columns */
:deep(.table-footer .pinned-left),
:deep(.table-footer .pinned-right) {
    z-index: var(--dt-z-footer-pinned);
}
</style>
