import {
  type ColumnDef,
  type ColumnPinningState,
  type ColumnResizeMode,
  type ColumnSizingState,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  useVueTable,
  type VisibilityState,
} from '@tanstack/vue-table'
import { computed, type Ref, ref } from 'vue'
import { valueUpdater } from '@/components/ui/table/utils'
import type { DataTableFilterField } from '@/composites/filters/types'

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }
const EMPTY_SORTING: SortingState = []

export interface UseDataTableProps<TData> {
  data: TData[] | (() => TData[])
  columns: ColumnDef<TData, unknown>[] | (() => ColumnDef<TData, unknown>[])
  pageCount: number | (() => number)

  enableRowSelection?: boolean
  filterFields?: DataTableFilterField<TData>[]

  /**
   * Controlled sorting state from the parent. Required (in practice) when
   * `enableSorting: true` because TanStack's column header dropdown calls
   * `onSortingChange` synchronously and we forward to the parent via emit.
   * When omitted the table reads an empty `SortingState`.
   */
  sorting?: () => SortingState | undefined
  onSortingChange?: (next: SortingState) => void

  /**
   * Controlled pagination state from the parent. When omitted the table reads
   * `{ pageIndex: 0, pageSize: 10 }`. `pageCount` remains a separate prop.
   */
  pagination?: () => PaginationState | undefined
  onPaginationChange?: (next: PaginationState) => void

  /**
   * Whether TanStack should treat columns as sortable at the table level.
   * When false, column-header sort affordances are suppressed regardless of
   * per-column defaults.
   */
  enableSorting?: boolean

  // Column pinning
  defaultPinning?: ColumnPinningState
  enableColumnPinning?: boolean

  // Column hiding
  enableColumnHiding?: boolean

  // Column resizing
  enableColumnResizing?: boolean
  columnResizeMode?: ColumnResizeMode

  // Row expansion
  enableRowExpansion?: boolean
  getRowCanExpand?: (row: Row<TData>) => boolean

  /**
   * Stable per-row identifier for TanStack's internal row tracking.
   * Required for correct row-selection behaviour across server-side
   * pagination — without it, TanStack uses the row index, so selection
   * state "follows" the index when a new page of rows replaces the
   * current page. Typical implementation: `(row) => String(row.id)`.
   */
  getRowId?: (row: TData, index: number) => string
}

function resolveValue<T>(value: T | (() => T)): T {
  return typeof value === 'function' ? (value as () => T)() : value
}

/**
 * Sets up a TanStack Table instance configured for fully server-side ops
 * (manual sorting / filtering / pagination). Sorting and pagination state is
 * sourced from prop getters — the parent owns them via `v-model:*` on
 * `<DataTable>`. Visual concerns (selection, expansion, column visibility /
 * pinning / sizing) remain internally managed in this composable.
 */
export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  // Visual-concern state (internally owned)
  const columnVisibility = ref<VisibilityState>({})
  const rowSelection = ref<RowSelectionState>({})
  const columnPinning = ref<ColumnPinningState>(props.defaultPinning || { left: [], right: [] })
  const columnSizing = ref<ColumnSizingState>({})
  const expanded = ref<ExpandedState>({})

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, columnVisibility as Ref<VisibilityState>)
  }

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, rowSelection as Ref<RowSelectionState>)
  }

  const onColumnPinningChange: OnChangeFn<ColumnPinningState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, columnPinning as Ref<ColumnPinningState>)
  }

  const onColumnSizingChange: OnChangeFn<ColumnSizingState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, columnSizing as Ref<ColumnSizingState>)
  }

  const onExpandedChange: OnChangeFn<ExpandedState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, expanded as Ref<ExpandedState>)
  }

  // Data-axis state (parent-owned). We read current values via getters so we
  // can resolve TanStack's updater-function-style onChange payloads, then
  // forward the next value to the parent via the supplied callbacks.
  const readSorting = (): SortingState => props.sorting?.() ?? EMPTY_SORTING
  const readPagination = (): PaginationState => props.pagination?.() ?? DEFAULT_PAGINATION

  const onSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const current = readSorting()
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue
    props.onSortingChange?.(next)
  }

  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    const current = readPagination()
    const next = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue
    props.onPaginationChange?.(next)
  }

  const table = useVueTable({
    get data() {
      return resolveValue(props.data)
    },
    get columns() {
      return resolveValue(props.columns)
    },
    get pageCount() {
      return resolveValue(props.pageCount)
    },
    state: {
      get sorting() {
        return readSorting()
      },
      get columnVisibility() {
        return columnVisibility.value
      },
      get rowSelection() {
        return rowSelection.value
      },
      get pagination() {
        return readPagination()
      },
      get columnPinning() {
        return columnPinning.value
      },
      get columnSizing() {
        return columnSizing.value
      },
      get expanded() {
        return expanded.value
      },
    },
    enableSorting: props.enableSorting ?? false,
    enableRowSelection: props.enableRowSelection ?? false,
    enableExpanding: props.enableRowExpansion ?? false,
    enableColumnPinning: props.enableColumnPinning ?? false,
    enableColumnResizing: props.enableColumnResizing ?? false,
    columnResizeMode: props.columnResizeMode ?? 'onChange',
    meta: {
      defaultPinning: props.defaultPinning || { left: [], right: [] },
      enableColumnPinning: props.enableColumnPinning ?? false,
      enableColumnHiding: props.enableColumnHiding ?? false,
      enableColumnResizing: props.enableColumnResizing ?? false,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: props.enableRowExpansion ? getExpandedRowModel() : undefined,
    getRowCanExpand: props.enableRowExpansion ? (props.getRowCanExpand ?? (() => true)) : undefined,
    getRowId: props.getRowId,
    onSortingChange,
    onColumnVisibilityChange,
    onRowSelectionChange,
    onPaginationChange,
    onColumnPinningChange,
    onColumnSizingChange,
    onExpandedChange,
  })

  // Helpers for visual concerns only. Sort/filter/pagination resets live on the
  // parent (typically via `useDataTableController.reset()`).
  const resetSelection = () => {
    rowSelection.value = {}
  }

  const resetPinning = () => {
    columnPinning.value = props.defaultPinning || { left: [], right: [] }
  }

  const resetColumnSizing = () => {
    columnSizing.value = {}
  }

  const resetExpanded = () => {
    expanded.value = {}
  }

  const resetAll = () => {
    resetSelection()
    resetPinning()
    resetColumnSizing()
    resetExpanded()
    columnVisibility.value = {}
  }

  const pinColumn = (columnId: string, position: 'left' | 'right') => {
    const current = { ...columnPinning.value }
    if (position === 'left' && current.right) {
      current.right = current.right.filter((id) => id !== columnId)
    } else if (position === 'right' && current.left) {
      current.left = current.left.filter((id) => id !== columnId)
    }
    const side = current[position] || []
    if (!side.includes(columnId)) {
      if (position === 'left') {
        current[position] = [...side, columnId]
      } else {
        current[position] = [columnId, ...side]
      }
    }
    columnPinning.value = current
  }

  const unpinColumn = (columnId: string) => {
    const current = { ...columnPinning.value }
    if (current.left) {
      current.left = current.left.filter((id) => id !== columnId)
    }
    if (current.right) {
      current.right = current.right.filter((id) => id !== columnId)
    }
    columnPinning.value = current
  }

  const toggleAllRowsExpanded = (isExpanded?: boolean) => {
    table.toggleAllRowsExpanded(isExpanded)
  }

  /**
   * IDs (per `getRowId`) of every row currently selected. Stable across page
   * changes because it's derived directly from `rowSelection` state.
   *
   * Use this for bulk actions on server-paginated data — the parent
   * resolves IDs against their own data source (store, server fetch, etc.).
   */
  const selectedIds = computed(() =>
    Object.keys(rowSelection.value).filter((k) => rowSelection.value[k]),
  )
  const selectedRowCount = computed(() => selectedIds.value.length)
  const hasSelection = computed(() => selectedRowCount.value > 0)

  /**
   * Selected rows whose data is currently loaded. In server-side mode this
   * only includes rows on the current page — TanStack doesn't have row data
   * for rows on other pages. For the FULL set of selected rows across pages,
   * use `selectedIds` + your own data source.
   */
  const selectedRows = computed(() => table.getSelectedRowModel().rows.map((row) => row.original))

  return {
    table,
    columnVisibility,
    rowSelection,
    columnPinning,
    columnSizing,
    expanded,
    resetSelection,
    resetPinning,
    resetColumnSizing,
    resetExpanded,
    resetAll,
    selectedIds,
    selectedRowCount,
    hasSelection,
    selectedRows,
    pinColumn,
    unpinColumn,
    toggleAllRowsExpanded,
  }
}
