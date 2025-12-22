/**
 * Exported Props interfaces for generic DataTable components.
 * These are exported separately to fix TS4082 errors in declaration generation.
 */

import type { DateValue } from '@internationalized/date'
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
  Row,
  SortingState,
  Table,
} from '@tanstack/vue-table'
import type { Component, CSSProperties, HTMLAttributes } from 'vue'
import type { RegisteredFilterPlugin } from './filterPlugins'
import type {
  BooleanOperator,
  BulkActionOption,
  DateOperator,
  NumberOperator,
  SelectOperator,
  TextOperator,
} from './types'
import type { DataTableFilterField, FilterOption } from './useDataTable'

// ============================================================================
// Shared Types
// ============================================================================

/**
 * Action definition for row actions (shared between dropdown and inline)
 */
export interface ActionDefinition<TData> {
  label: string
  icon?: Component
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  onClick: (row: Row<TData>) => void
  show?: (row: Row<TData>) => boolean
  disabled?: (row: Row<TData>) => boolean
}

/**
 * Date range type for range calendar
 */
export interface DateRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * Props for ActionsCellDropdown component
 */
export interface ActionsCellDropdownProps<TData> {
  row: Row<TData>
  actions: ActionDefinition<TData>[]
  dropdownLabel?: string
}

/**
 * Props for ActionsCellInline component
 */
export interface ActionsCellInlineProps<TData> {
  row: Row<TData>
  actions: ActionDefinition<TData>[]
}

/**
 * Props for DataTableBulkActions component
 */
export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
  options: BulkActionOption<TData>[]
}

/**
 * Props for DataTableColumnHeader component
 */
export interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  table?: Table<TData>
  title: string
  class?: string
}

/**
 * Props for DataTableFilterCommand component
 */
export interface DataTableFilterCommandProps<TData> {
  filterFields: DataTableFilterField<TData>[]
  activeFilterCount: number
  disabled?: boolean
}

/**
 * Props for DataTablePagination component
 */
export interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
  showSelectedCount?: boolean
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
}

/**
 * Props for DataTableSelectHeader component
 */
export interface DataTableSelectHeaderProps<TData> {
  table: Table<TData>
  class?: string
}

/**
 * Props for DataTableToolbar component
 */
export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
  filterPlugins?: RegisteredFilterPlugin[]
  searchPlaceholder?: string
  searchColumn?: string
  bulkSelectOptions?: BulkActionOption<TData>[]
  advancedMode?: boolean
  loading?: boolean
  showRefreshButton?: boolean
  enableColumnHiding?: boolean
}

/**
 * Props for DataTableViewOptions component
 */
export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

// ============================================================================
// Filter Initial Value Types
// ============================================================================

/**
 * Initial value type for TextFilter
 */
export type TextFilterInitialValue = string | { operator: TextOperator; value: string }

/**
 * Initial value type for NumberFilter
 */
export type NumberFilterInitialValue =
  | number
  | [number, number]
  | { operator: NumberOperator; value: number | [number, number] }

/**
 * Initial value type for DateFilter
 */
export type DateFilterInitialValue =
  | DateValue
  | [DateValue, DateValue]
  | { operator: DateOperator; value: DateValue | [DateValue, DateValue] | null }

/**
 * Initial value type for SelectFilter
 */
export type SelectFilterInitialValue =
  | string
  | string[]
  | { operator: SelectOperator; value: string | string[] }

/**
 * Initial value type for BooleanFilter
 */
export type BooleanFilterInitialValue = boolean | { operator: BooleanOperator; value: boolean }

/**
 * Initial value type for RangeFilter
 */
export type RangeFilterInitialValue = [number, number]

/**
 * Initial value type for DateRangeFilter
 */
export type DateRangeFilterInitialValue = DateRange

// ============================================================================
// Filter Component Props
// ============================================================================

/**
 * Props for BooleanFilter component
 */
export interface BooleanFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number
  advancedMode?: boolean
  defaultOperator?: BooleanOperator
  availableOperators?: BooleanOperator[]
  initialValue?: BooleanFilterInitialValue
}

/**
 * Props for DateFilter component
 */
export interface DateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number
  advancedMode?: boolean
  defaultOperator?: DateOperator
  availableOperators?: DateOperator[]
  initialValue?: DateFilterInitialValue
}

/**
 * Props for DateRangeFilter component
 */
export interface DateRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  icon?: Component
  defaultOpen?: boolean
  initialValue?: DateRangeFilterInitialValue
}

/**
 * Props for MultiSelectFilter component
 */
export interface MultiSelectFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: FilterOption[]
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number
}

/**
 * Props for NumberFilter component
 */
export interface NumberFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  unit?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number
  advancedMode?: boolean
  defaultOperator?: NumberOperator
  availableOperators?: NumberOperator[]
  initialValue?: NumberFilterInitialValue
}

/**
 * Props for RangeFilter component
 */
export interface RangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  range?: [number, number]
  step?: number
  unit?: string
  icon?: Component
  defaultOpen?: boolean
  initialValue?: RangeFilterInitialValue
}

/**
 * Props for SelectFilter component
 */
export interface SelectFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: FilterOption[]
  placeholder?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number
  advancedMode?: boolean
  defaultOperator?: SelectOperator
  availableOperators?: SelectOperator[]
  initialValue?: SelectFilterInitialValue
}

/**
 * Props for TextFilter component
 */
export interface TextFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  placeholder?: string
  icon?: Component
  defaultOpen?: boolean
  openTrigger?: number
  advancedMode?: boolean
  defaultOperator?: TextOperator
  availableOperators?: TextOperator[]
  initialValue?: TextFilterInitialValue
}

// ============================================================================
// Main DataTable Props
// ============================================================================

/**
 * Props for DataTable component
 */
export interface DataTableProps<TData> {
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
  showPageInfo?: boolean
  paginationPosition?: 'bottom' | 'top' | 'both'
  // Toolbar options
  filterFields?: DataTableFilterField<TData>[]
  searchPlaceholder?: string
  searchColumn?: string
  showToolbar?: boolean
  showPagination?: boolean
  showSelectedCount?: boolean
  bulkSelectOptions?: BulkActionOption<TData>[]
  // Column hiding
  enableColumnHiding?: boolean
  // Empty state
  emptyMessage?: string
  // Loading state
  loading?: boolean
  loadingMessage?: string
  // Error state
  error?: string | Error
  // Advanced filter mode (static - never changes)
  advancedMode?: boolean
  // Initial state for URL state restoration
  initialFilters?: ColumnFiltersState
  initialSorting?: SortingState
  initialPagination?: Partial<PaginationState>
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
