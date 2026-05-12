<script setup lang="ts" generic="TData">
import { IconAlertCircle, IconRefresh } from '@meldui/tabler-vue'
import {
  type Cell,
  type ColumnDef,
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
  onMounted,
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
import type { RegisteredFilterPlugin } from '@/composites/filters/filterPlugins'
import type { DataTableFilterField } from '@/composites/filters/types'
import { Pagination } from '@/composites/pagination'
import type { BulkActionOption, DataTableFilterState } from './types'
import DataTableToolbar from './DataTableToolbar.vue'
import { useDataTable } from './useDataTable'
import { usePinnedColumns } from './usePinnedColumns'
import { useTableKeyboard } from './useTableKeyboard'

const slots = useSlots()

interface Props {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]

  // Per-feature UI toggles (default false — explicit opt-in)
  enableSorting?: boolean
  enableFilter?: boolean
  enablePagination?: boolean

  // Controlled state — v-model targets. Required (in practice) when the
  // corresponding enable* is true.
  sorting?: SortingState
  filters?: DataTableFilterState
  pagination?: PaginationState

  // Pagination server-derived display props (required when enablePagination)
  pageCount?: number
  totalRows?: number
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
  showSelectedCount?: boolean
  paginationPosition?: 'bottom' | 'top' | 'both'

  // Filter configuration (used by internal <Filters> when enableFilter is true)
  filterFields?: DataTableFilterField<TData>[]
  filterPlugins?: RegisteredFilterPlugin[]
  advancedMode?: boolean
  filterSearch?: { id: string; placeholder?: string; debounceMs?: number }

  // Row selection / bulk actions
  enableRowSelection?: boolean
  bulkSelectOptions?: BulkActionOption<TData>[]

  // Toolbar visibility
  showToolbar?: boolean

  // Column hiding
  enableColumnHiding?: boolean

  // Column pinning
  defaultPinning?: ColumnPinningState
  enableColumnPinning?: boolean

  // Column resizing
  enableColumnResizing?: boolean
  columnResizeMode?: 'onChange' | 'onEnd'

  // Container styling
  maxHeight?: string
  density?: 'compact' | 'comfortable' | 'spacious'
  bordered?: boolean

  // Row styling
  rowClass?: (row: Row<TData>) => string | Record<string, boolean> | undefined
  rowStyle?: (row: Row<TData>) => CSSProperties | undefined
  rowProps?: (row: Row<TData>) => HTMLAttributes | undefined
  headerClass?: HTMLAttributes['class']

  // Empty / loading / error
  emptyMessage?: string
  loading?: boolean
  loadingMessage?: string
  error?: string | Error

  // Keyboard navigation
  enableKeyboardNavigation?: boolean

  // Refresh button (parent-driven via @refresh)
  showRefreshButton?: boolean

  // Row expansion
  enableRowExpansion?: boolean
  getRowCanExpand?: (row: Row<TData>) => boolean

  /**
   * Stable per-row identifier. Strongly recommended when `enable-row-selection`
   * is true and the data is server-side paginated — without it, TanStack uses
   * the row index, so selection state "follows" the index across pages.
   * Typical implementation: `(row) => String(row.id)`.
   */
  getRowId?: (row: TData, index: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  enableSorting: false,
  enableFilter: false,
  enablePagination: false,
  enableRowSelection: false,
  pageSizeOptions: () => [10, 20, 30, 40, 50],
  showPageSizeSelector: true,
  showPageInfo: true,
  showSelectedCount: false,
  paginationPosition: 'bottom',
  filterFields: () => [],
  filterPlugins: () => [],
  advancedMode: false,
  showToolbar: true,
  enableColumnHiding: false,
  emptyMessage: 'No results found.',
  loading: false,
  loadingMessage: 'Loading data...',
  enableColumnPinning: false,
  enableColumnResizing: false,
  columnResizeMode: 'onChange',
  maxHeight: '600px',
  density: 'comfortable',
  bordered: false,
  enableKeyboardNavigation: false,
  showRefreshButton: false,
  enableRowExpansion: false,
})

const emit = defineEmits<{
  'update:sorting': [next: SortingState]
  'update:filters': [next: DataTableFilterState]
  'update:pagination': [next: PaginationState]
  retry: []
  refresh: []
  rowActivate: [row: Row<TData>]
}>()

// Dev-mode warning when a feature is enabled but the corresponding v-model
// prop is unbound. Silent in production builds.
if (import.meta.env.DEV) {
  onMounted(() => {
    if (props.enableSorting && props.sorting === undefined) {
      console.warn(
        '[DataTable] `enableSorting` is true but `:sorting` is not bound. ' +
          'Sort clicks will be lost. Did you forget `v-model:sorting`?',
      )
    }
    if (props.enableFilter && props.filters === undefined) {
      console.warn(
        '[DataTable] `enableFilter` is true but `:filters` is not bound. ' +
          'Filter changes will be lost. Did you forget `v-model:filters`?',
      )
    }
    if (props.enablePagination && props.pagination === undefined) {
      console.warn(
        '[DataTable] `enablePagination` is true but `:pagination` is not bound. ' +
          'Pagination changes will be lost. Did you forget `v-model:pagination`?',
      )
    }
    if (props.enableRowSelection && props.getRowId === undefined) {
      console.warn(
        '[DataTable] `enableRowSelection` is true but `:get-row-id` is not provided. ' +
          'TanStack defaults to the row index for row identity, which causes selection ' +
          'state to "follow" the index across server-side page changes (selecting row 0 ' +
          'on page 1 will also appear selected on page 2). Pass ' +
          '`:get-row-id="(row) => String(row.id)"` (or any stable identifier) to fix this.',
      )
    }
  })
}

const handleRetry = () => emit('retry')

const errorMessage = computed(() => {
  if (!props.error) return ''
  return props.error instanceof Error ? props.error.message : props.error
})

const tableState = useDataTable<TData>({
  data: () => props.data,
  columns: () => props.columns,
  pageCount: () => props.pageCount ?? 0,
  enableSorting: props.enableSorting,
  sorting: () => props.sorting,
  pagination: () => props.pagination,
  onSortingChange: (next) => emit('update:sorting', next),
  onPaginationChange: (next) => emit('update:pagination', next),
  enableRowSelection: props.enableRowSelection,
  filterFields: props.filterFields,
  defaultPinning: props.defaultPinning,
  enableColumnPinning: props.enableColumnPinning,
  enableColumnHiding: props.enableColumnHiding,
  enableColumnResizing: props.enableColumnResizing,
  columnResizeMode: props.columnResizeMode,
  enableRowExpansion: props.enableRowExpansion,
  getRowCanExpand: props.getRowCanExpand,
  getRowId: props.getRowId,
})

const { table } = tableState

const tableInstanceRef = computed(() => table)

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

const tableContainerRef = ref<HTMLElement | null>(null)

const setTableContainerRef = (el: Element | ComponentPublicInstance | null) => {
  const element = el instanceof Element ? el : null
  tableContainerRef.value = element as HTMLElement | null
  if (element && pinnedTableRef) {
    pinnedTableRef.value = element as HTMLElement
  }
}

const keyboardState = props.enableKeyboardNavigation
  ? useTableKeyboard({
      table,
      tableContainerRef,
      enableSelection: props.enableRowSelection,
      enablePagination: props.enablePagination,
      onRowActivate: (row) => emit('rowActivate', row),
    })
  : {
      focusedRowIndex: ref(-1),
      isFocused: ref(false),
      focusTable: () => {},
      blurTable: () => {},
    }

const getPinningClass = (columnId: string) => {
  if (!props.enableColumnPinning) return ''
  const { left = [], right = [] } = table.getState().columnPinning
  if (left.includes(columnId)) {
    const isLastLeftPinned = left[left.length - 1] === columnId
    return isLastLeftPinned ? 'pinned-left pinned-left-last' : 'pinned-left'
  }
  if (right.includes(columnId)) {
    const isFirstRightPinned = right[0] === columnId
    return isFirstRightPinned ? 'pinned-right pinned-right-first' : 'pinned-right'
  }
  return ''
}

const hasCellSlot = (columnId: string) => !!slots[`cell-${columnId}`]

const getCellSlotProps = (cell: Cell<TData, unknown>, row: Row<TData>) => ({
  cell,
  row,
  value: cell.getValue(),
})

const getRowSlotProps = (row: Row<TData>, index: number) => ({
  row,
  cells: row.getVisibleCells(),
  isSelected: row.getIsSelected(),
  index,
})

const paginationSlotProps = computed(() => ({
  pagination: props.pagination,
  pageCount: props.pageCount ?? 0,
  totalRows: props.totalRows,
}))

const footerSlotProps = computed(() => ({
  table,
  footerGroups: table.getFooterGroups(),
}))

const hasColumnFooters = computed(() => {
  return table
    .getFooterGroups()
    .some((group) => group.headers.some((header) => header.column.columnDef.footer))
})

const hasFooterSlot = computed(() => !!slots.footer)

defineExpose({
  ...tableState,
  ...keyboardState,
})
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Toolbar -->
    <template v-if="showToolbar">
      <slot name="toolbar" :table="table" :loading="loading">
        <DataTableToolbar
          :table="table"
          :filter-fields="filterFields"
          :filter-plugins="filterPlugins"
          :bulk-select-options="bulkSelectOptions"
          :advanced-mode="advancedMode"
          :loading="loading"
          :show-refresh-button="showRefreshButton"
          :enable-column-hiding="enableColumnHiding"
          :enable-filter="enableFilter"
          :filter-values="filters"
          :search-field="filterSearch"
          @update:filter-values="(next) => emit('update:filters', next)"
          @refresh="emit('refresh')"
        >
          <template #toolbar-start="slotProps">
            <slot name="toolbar-start" v-bind="slotProps" />
          </template>
          <template #toolbar-end="slotProps">
            <slot name="toolbar-end" v-bind="slotProps" />
          </template>
        </DataTableToolbar>
      </slot>
    </template>

    <!-- Top pagination -->
    <template
      v-if="enablePagination && (paginationPosition === 'top' || paginationPosition === 'both')"
    >
      <slot name="pagination" v-bind="paginationSlotProps">
        <Pagination
          v-if="pagination"
          :pagination="pagination"
          :page-count="pageCount ?? 0"
          :total-rows="totalRows"
          :page-size-options="pageSizeOptions"
          :show-page-size-selector="showPageSizeSelector"
          :show-page-info="showPageInfo"
          :show-selected-count="showSelectedCount"
          :selected-count="tableState.selectedRowCount.value"
          @update:pagination="(next) => emit('update:pagination', next)"
        />
      </slot>
    </template>

    <!-- Table container -->
    <div
      :ref="setTableContainerRef"
      class="rounded-md border table-container overflow-auto custom-scrollbar"
      :class="{
        'is-scrolled': isScrolled,
        'has-right-scroll': hasRightScroll,
      }"
      :data-loading="loading"
      :data-density="density"
      :data-column-resizing="enableColumnResizing || undefined"
      :tabindex="enableKeyboardNavigation ? 0 : undefined"
      :data-keyboard-navigation="enableKeyboardNavigation || undefined"
    >
      <Table :style="{ maxHeight: maxHeight }">
        <TableHeader :class="headerClass ?? 'bg-muted'">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              :data-column-id="header.column.id"
              :class="[
                getPinningClass(header.column.id),
                {
                  relative: enableColumnResizing,
                  'border-r border-border last:border-r-0': bordered,
                },
              ]"
              :style="{
                minWidth: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
                width: enableColumnResizing ? `${header.getSize()}px` : undefined,
              }"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
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
          <template v-if="error">
            <TableRow>
              <TableCell :colspan="columns.length" class="p-0">
                <slot name="error" :error="error" :retry="handleRetry">
                  <Alert variant="destructive" class="m-4">
                    <IconAlertCircle class="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription class="flex items-center justify-between">
                      <span>{{ errorMessage }}</span>
                      <Button variant="outline" size="sm" @click="handleRetry">
                        <IconRefresh class="mr-1 size-4" />
                        Retry
                      </Button>
                    </AlertDescription>
                  </Alert>
                </slot>
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="loading">
            <TableRow
              v-for="rowIndex in pagination?.pageSize ?? 10"
              :key="`skeleton-row-${rowIndex}`"
            >
              <TableCell
                v-for="(_column, colIndex) in columns"
                :key="`skeleton-cell-${rowIndex}-${colIndex}`"
                :class="{
                  'border-r border-border last:border-r-0': bordered,
                }"
              >
                <Skeleton class="h-5 w-full" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="table.getRowModel().rows?.length">
            <template v-for="(row, index) in table.getRowModel().rows" :key="row.id">
              <slot name="row" v-bind="getRowSlotProps(row, index)">
                <TableRow
                  :data-state="row.getIsSelected() ? 'selected' : undefined"
                  :class="rowClass?.(row)"
                  :style="rowStyle?.(row)"
                  v-bind="rowProps?.(row)"
                >
                  <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    :data-column-id="cell.column.id"
                    :class="[
                      getPinningClass(cell.column.id),
                      {
                        'border-r border-border last:border-r-0': bordered,
                      },
                    ]"
                    :style="{
                      minWidth:
                        cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined,
                      width: enableColumnResizing ? `${cell.column.getSize()}px` : undefined,
                    }"
                  >
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

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="p-0">
              <slot name="empty" :message="emptyMessage" :columns="columns.length">
                <Empty class="border-0">
                  <EmptyHeader>
                    <EmptyTitle>{{ emptyMessage }}</EmptyTitle>
                    <EmptyDescription>
                      Try adjusting your filters or search criteria.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </slot>
            </TableCell>
          </TableRow>
        </TableBody>

        <TableFooter v-if="hasFooterSlot || hasColumnFooters" class="table-footer">
          <slot name="footer" v-bind="footerSlotProps">
            <TableRow v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id">
              <TableCell
                v-for="header in footerGroup.headers"
                :key="header.id"
                :colSpan="header.colSpan"
                :data-column-id="header.column.id"
                :class="getPinningClass(header.column.id)"
                :style="{
                  minWidth: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
                  width: enableColumnResizing ? `${header.getSize()}px` : undefined,
                }"
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

    <!-- Bottom pagination -->
    <template
      v-if="enablePagination && (paginationPosition === 'bottom' || paginationPosition === 'both')"
    >
      <slot name="pagination" v-bind="paginationSlotProps">
        <Pagination
          v-if="pagination"
          :pagination="pagination"
          :page-count="pageCount ?? 0"
          :total-rows="totalRows"
          :page-size-options="pageSizeOptions"
          :show-page-size-selector="showPageSizeSelector"
          :show-page-info="showPageInfo"
          :show-selected-count="showSelectedCount"
          :selected-count="tableState.selectedRowCount.value"
          @update:pagination="(next) => emit('update:pagination', next)"
        />
      </slot>
    </template>
  </div>
</template>

<style scoped>
:deep([data-slot='table-container']) {
  overflow: visible !important;
}

.table-container[data-loading='true'] {
  opacity: 0.6;
  pointer-events: none;
}

:deep(.expanded-row) {
  background-color: var(--muted);
}

:deep(.expanded-row td) {
  border-top: 1px solid var(--border);
}

.expanded-row-content {
  padding: 1rem;
}

:deep(.table-footer) {
  position: sticky;
  bottom: 0;
  z-index: 14;
}

:deep(.table-footer td) {
  background-color: var(--muted);
  border-top: 1px solid var(--border);
  color: var(--foreground);
  font-weight: 500;
}

.table-container[data-column-resizing] :deep(table) {
  table-layout: fixed;
  width: 100%;
}

.table-container[data-column-resizing] :deep(th),
.table-container[data-column-resizing] :deep(td) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-container[data-column-resizing] :deep(th) {
  padding-right: calc(var(--dt-cell-padding-x) + 8px);
}

.table-container[data-column-resizing] :deep(td > *) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style>
