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
import { computed, type Ref, ref, watch } from 'vue'
import { valueUpdater } from '@/components/ui/table/utils'
import type { DataTableFilterField } from '@/composites/filters/types'
import { isComplexFilterType } from '@/composites/filters/types'
import type { DataTableFilterState } from './types'

export interface UseDataTableProps<TData> {
  data: TData[] | (() => TData[])
  columns: ColumnDef<TData, unknown>[] | (() => ColumnDef<TData, unknown>[])
  pageCount: number | (() => number) // Required for server-side pagination
  defaultPerPage?: number
  enableRowSelection?: boolean
  filterFields?: DataTableFilterField<TData>[]
  /**
   * Optional getter for filter state. When provided, its return value is forwarded
   * to `onServerSideChange.filters` and changes to it trigger the watcher. When
   * omitted, `onServerSideChange.filters` fires as `{}`.
   *
   * Filter state is owned by `useFilters` (in `<DataTable>` when `enableFilter: true`,
   * or by the parent app when `enableFilter: false`); `useDataTable` does not store it.
   */
  filters?: () => DataTableFilterState
  /**
   * Server-side change callback. Fires whenever sorting, filters, or pagination change.
   * `filters` is a record keyed by field id; values follow the same per-type shape
   * documented on `ServerSideTableParams.filters`.
   */
  onServerSideChange: (params: {
    sorting: SortingState
    filters: DataTableFilterState
    pagination: PaginationState
  }) => void

  // Advanced mode configuration (static - never changes after init)
  advancedMode?: boolean // Static mode - true for advanced, false for simple

  // Initial state for URL state restoration (e.g., page refresh with applied filters/sorting)
  // Note: Reset methods reset to true defaults (empty), not to initial values.
  // `initialFilters` is consumed directly by `useFilters` (in `<DataTable>`); this
  // composable does not need to know about it.
  initialSorting?: SortingState
  initialPagination?: Partial<PaginationState>

  // Column pinning configuration
  defaultPinning?: ColumnPinningState
  enableColumnPinning?: boolean

  // Column hiding configuration
  enableColumnHiding?: boolean

  // Column resizing configuration
  enableColumnResizing?: boolean
  columnResizeMode?: ColumnResizeMode

  // Row expansion configuration
  enableRowExpansion?: boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
}

/**
 * Helper to resolve getter or value
 * Moved to module scope for better reusability
 */
function resolveValue<T>(value: T | (() => T)): T {
  return typeof value === 'function' ? (value as () => T)() : value
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  // Validate: No complex types in advanced mode
  if (props.advancedMode && props.filterFields) {
    const invalidFields = props.filterFields.filter((field) => isComplexFilterType(field.type))

    if (invalidFields.length > 0) {
      throw new Error(
        `[DataTable] Complex filter types (multiselect, range, daterange) are not allowed in advanced mode.\n` +
          `Use base types with operators instead:\n` +
          `  - multiselect → select with defaultOperator: "isAnyOf"\n` +
          `  - range → number with defaultOperator: "between"\n` +
          `  - daterange → date with defaultOperator: "isBetween"\n` +
          `Invalid fields: ${invalidFields.map((f) => String(f.id)).join(', ')}`,
      )
    }
  }

  // State management
  // Initial values are used for URL state restoration (e.g., page refresh)
  // Reset methods reset to true defaults (empty), not to initial values
  const sorting = ref<SortingState>(props.initialSorting || [])
  const columnVisibility = ref<VisibilityState>({})
  const rowSelection = ref<RowSelectionState>({})
  const pagination = ref<PaginationState>({
    pageIndex: props.initialPagination?.pageIndex ?? 0,
    pageSize: props.initialPagination?.pageSize ?? props.defaultPerPage ?? 10,
  })
  const columnPinning = ref<ColumnPinningState>(props.defaultPinning || { left: [], right: [] })
  const columnSizing = ref<ColumnSizingState>({})
  const expanded = ref<ExpandedState>({})

  // Handle state changes
  const onSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, sorting as Ref<SortingState>)
  }

  const onColumnVisibilityChange: OnChangeFn<VisibilityState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, columnVisibility as Ref<VisibilityState>)
  }

  const onRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, rowSelection as Ref<RowSelectionState>)
  }

  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, pagination as Ref<PaginationState>)
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

  // Create table instance (server-side only).
  // Note: TanStack's `columnFilters` state is intentionally not registered. Filter
  // state is owned by `useFilters`; `manualFiltering: true` keeps TanStack from
  // attempting any client-side filter row model regardless.
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
        return sorting.value
      },
      get columnVisibility() {
        return columnVisibility.value
      },
      get rowSelection() {
        return rowSelection.value
      },
      get pagination() {
        return pagination.value
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
    enableRowSelection: props.enableRowSelection ?? false,
    enableExpanding: props.enableRowExpansion ?? false,
    enableColumnPinning: props.enableColumnPinning ?? false,
    enableColumnResizing: props.enableColumnResizing ?? false,
    columnResizeMode: props.columnResizeMode ?? 'onChange',
    // Add meta with configuration accessible to all columns
    meta: {
      defaultPinning: props.defaultPinning || { left: [], right: [] },
      enableColumnPinning: props.enableColumnPinning ?? false,
      enableColumnHiding: props.enableColumnHiding ?? false,
      enableColumnResizing: props.enableColumnResizing ?? false,
    },
    // Server-side mode: all operations handled by server
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: props.enableRowExpansion ? getExpandedRowModel() : undefined,
    // Default to allowing all rows to expand when enableRowExpansion is true
    getRowCanExpand: props.enableRowExpansion ? (props.getRowCanExpand ?? (() => true)) : undefined,
    // State change handlers
    onSortingChange,
    onColumnVisibilityChange,
    onRowSelectionChange,
    onPaginationChange,
    onColumnPinningChange,
    onColumnSizingChange,
    onExpandedChange,
  })

  // Read filters from the optional getter; tracked reactively because the getter
  // accesses `useFilters.filterValues.value` (a Vue computed) inside.
  const readFilters = (): DataTableFilterState => props.filters?.() ?? {}

  // Watch for server-side changes. Sorting, pagination, and the filter getter
  // are all watched; any change emits one `onServerSideChange` per microtask
  // (Vue batches synchronous reactive updates).
  watch(
    [sorting, pagination, () => readFilters()],
    () => {
      props.onServerSideChange({
        sorting: sorting.value,
        filters: readFilters(),
        pagination: pagination.value,
      })
    },
    { deep: true },
  )

  // Helper methods
  // Reset methods reset to true defaults (empty), not to initial values.
  // Filter reset lives on `filtersState` (the `useFilters` instance), not here.
  const resetSorting = () => {
    sorting.value = []
  }

  const resetSelection = () => {
    rowSelection.value = {}
  }

  const resetPagination = () => {
    pagination.value = {
      pageIndex: 0,
      pageSize: props.defaultPerPage || 10,
    }
  }

  const resetAll = () => {
    resetSorting()
    resetSelection()
    resetPagination()
  }

  // Column pinning helpers
  const pinColumn = (columnId: string, position: 'left' | 'right') => {
    const current = { ...columnPinning.value }

    // Remove from opposite side if exists
    if (position === 'left' && current.right) {
      current.right = current.right.filter((id) => id !== columnId)
    } else if (position === 'right' && current.left) {
      current.left = current.left.filter((id) => id !== columnId)
    }

    // Add to new position if not already there
    const side = current[position] || []
    if (!side.includes(columnId)) {
      if (position === 'left') {
        // Left: Add to end (stack to the right, toward separator)
        current[position] = [...side, columnId]
      } else {
        // Right: Add to start (stack to the left, toward separator)
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

  const resetPinning = () => {
    columnPinning.value = props.defaultPinning || { left: [], right: [] }
  }

  const resetColumnSizing = () => {
    columnSizing.value = {}
  }

  const resetExpanded = () => {
    expanded.value = {}
  }

  const toggleAllRowsExpanded = (isExpanded?: boolean) => {
    table.toggleAllRowsExpanded(isExpanded)
  }

  // Computed properties
  const isFiltered = computed(() => Object.keys(readFilters()).length > 0)
  const selectedRowCount = computed(() => Object.keys(rowSelection.value).length)
  const hasSelection = computed(() => selectedRowCount.value > 0)

  // Selected rows data
  const selectedRows = computed(() => {
    return table.getSelectedRowModel().rows.map((row) => row.original)
  })

  // Refresh method - triggers server-side change with current state
  const refresh = () => {
    props.onServerSideChange({
      sorting: sorting.value,
      filters: readFilters(),
      pagination: pagination.value,
    })
  }

  return {
    table,
    sorting,
    columnVisibility,
    rowSelection,
    pagination,
    columnPinning,
    columnSizing,
    resetSorting,
    resetSelection,
    resetPagination,
    resetPinning,
    resetColumnSizing,
    resetAll,
    isFiltered,
    selectedRowCount,
    hasSelection,
    selectedRows,
    pinColumn,
    unpinColumn,
    refresh,
    expanded,
    resetExpanded,
    toggleAllRowsExpanded,
  }
}
