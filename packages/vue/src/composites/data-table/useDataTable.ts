import {
  type ColumnDef,
  type ColumnFiltersState,
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
import { type Component, computed, type Ref, ref, watch } from 'vue'
import { valueUpdater } from '@/components/ui/table/utils'
import type { FilterOperator, FilterType } from './types'
import { isComplexFilterType } from './types'

export interface FilterOption {
  label: string
  value: string
  icon?: Component
}

export interface DataTableFilterField<TData> {
  id: keyof TData
  label: string
  placeholder?: string
  /**
   * Filter type
   * Built-in types: text, number, date, select, boolean, multiselect, range, daterange
   */
  type: FilterType
  options?: FilterOption[] // For select/multiselect
  icon?: Component

  // Number-specific
  min?: number
  max?: number
  step?: number
  unit?: string

  // Range-specific (for range and daterange types)
  range?: [number, number] // Min/max bounds for range slider

  // Advanced mode configuration
  defaultOperator?: FilterOperator // Override default operator
  availableOperators?: FilterOperator[] // Limit available operators
}

export interface UseDataTableProps<TData> {
  data: TData[] | (() => TData[])
  columns: ColumnDef<TData, unknown>[] | (() => ColumnDef<TData, unknown>[])
  pageCount: number | (() => number) // Required for server-side pagination
  defaultPerPage?: number
  enableRowSelection?: boolean
  filterFields?: DataTableFilterField<TData>[]
  onServerSideChange: (params: {
    sorting: SortingState
    filters: ColumnFiltersState
    pagination: PaginationState
  }) => void // Required for server-side mode

  // Advanced mode configuration (static - never changes after init)
  advancedMode?: boolean // Static mode - true for advanced, false for simple

  // Initial state for URL state restoration (e.g., page refresh with applied filters/sorting)
  // Note: Reset methods reset to true defaults (empty), not to initial values
  initialFilters?: ColumnFiltersState
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
  const columnFilters = ref<ColumnFiltersState>(props.initialFilters || [])
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

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updaterOrValue) => {
    valueUpdater(updaterOrValue, columnFilters as Ref<ColumnFiltersState>)
    // Reset to first page when filters change
    pagination.value.pageIndex = 0
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

  // Helper to resolve getter or value
  const resolveValue = <T>(value: T | (() => T)): T => {
    return typeof value === 'function' ? (value as () => T)() : value
  }

  // Create table instance (server-side only)
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
      get columnFilters() {
        return columnFilters.value
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
    onColumnFiltersChange,
    onColumnVisibilityChange,
    onRowSelectionChange,
    onPaginationChange,
    onColumnPinningChange,
    onColumnSizingChange,
    onExpandedChange,
  })

  // Watch for server-side changes
  watch(
    [sorting, columnFilters, pagination],
    () => {
      props.onServerSideChange({
        sorting: sorting.value,
        filters: columnFilters.value,
        pagination: pagination.value,
      })
    },
    { deep: true },
  )

  // Helper methods
  // Reset methods reset to true defaults (empty), not to initial values
  const resetFilters = () => {
    columnFilters.value = []
  }

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
    resetFilters()
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
  const isFiltered = computed(() => columnFilters.value.length > 0)
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
      filters: columnFilters.value,
      pagination: pagination.value,
    })
  }

  return {
    table,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    pagination,
    columnPinning,
    columnSizing,
    resetFilters,
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
