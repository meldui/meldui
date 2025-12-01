import type { DateValue } from '@internationalized/date'
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/vue-table'
import type { ServerFilterValue, ServerSideTableParams, ServerSideTableResponse } from './types'

/**
 * Filter field type for transformation
 */
export interface FilterFieldType {
  id: string
  type?: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'range' | 'boolean'
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper to create column definitions with proper typing
 */
export function createColumns<T>(columns: ColumnDef<T, unknown>[]): ColumnDef<T, unknown>[] {
  return columns
}

/**
 * Helper to transform TanStack table state to server params
 * Converts filter values to arrays for multi-filter support (except select and boolean)
 *
 * @param tableState - TanStack table state containing sorting, filters, and pagination
 * @param filterFields - Filter field definitions to determine transformation rules
 * @param searchColumn - Optional search column name (will be kept as string, not transformed to array)
 */
export function tableStateToServerParams(
  tableState: {
    sorting: SortingState
    filters: ColumnFiltersState
    pagination: { pageIndex: number; pageSize: number }
  },
  filterFields?: FilterFieldType[],
  searchColumn?: string,
): ServerSideTableParams {
  const params: ServerSideTableParams = {
    page: tableState.pagination.pageIndex + 1, // Convert 0-based to 1-based
    per_page: tableState.pagination.pageSize,
  }

  // Handle sorting
  if (tableState.sorting.length > 0) {
    const sort = tableState.sorting[0]
    params.sort_by = sort.id
    params.sort_order = sort.desc ? 'desc' : 'asc'
  }

  // Handle filters with type-based transformation
  if (tableState.filters.length > 0) {
    params.filters = {}

    tableState.filters.forEach((filter) => {
      // Check if this is the search column filter - keep as string
      if (searchColumn && filter.id === searchColumn) {
        params.filters![filter.id] = filter.value as string
        return
      }

      const fieldDef = filterFields?.find((f) => String(f.id) === filter.id)
      const filterType = fieldDef?.type || 'multiselect' // Default to multiselect
      let transformedValue: ServerFilterValue = filter.value as ServerFilterValue

      // Transform based on filter type
      switch (filterType) {
        case 'text':
          // Text filters: wrap string in array
          transformedValue = (
            Array.isArray(filter.value) ? filter.value : [filter.value]
          ) as string[]
          break

        case 'number':
          // Number filters: wrap number in array
          transformedValue = (
            Array.isArray(filter.value) ? filter.value : [filter.value]
          ) as number[]
          break

        case 'range': {
          // Range filters: convert to array of {start, end} objects
          const rangeValue = filter.value as [number, number] | [number, number][]
          if (Array.isArray(rangeValue)) {
            if (Array.isArray(rangeValue[0])) {
              // Multi-instance: [[min, max], [min2, max2]] -> [{start, end}, {start2, end2}]
              transformedValue = (rangeValue as [number, number][]).map((range) => ({
                start: range[0],
                end: range[1],
              }))
            } else {
              // Single instance: [min, max] -> [{start, end}]
              transformedValue = [
                {
                  start: (rangeValue as [number, number])[0],
                  end: (rangeValue as [number, number])[1],
                },
              ]
            }
          }
          break
        }

        case 'date':
          // Date filters: wrap DateValue in array (supports multi-instance)
          transformedValue = (
            Array.isArray(filter.value) ? filter.value : [filter.value]
          ) as DateValue[]
          break

        case 'daterange':
          // Date range filters: wrap object in array
          if (filter.value && typeof filter.value === 'object' && !Array.isArray(filter.value)) {
            transformedValue = [filter.value as { start: DateValue; end: DateValue }]
          }
          break

        case 'select':
          // Select filters: keep as single value
          transformedValue = filter.value as string
          break

        case 'boolean':
          // Boolean filters: keep as single value
          transformedValue = filter.value as boolean
          break

        case 'multiselect':
          // Multiselect filters: already an array, keep as is
          transformedValue = filter.value as string[]
          break

        default:
          // Default: keep original value
          transformedValue = filter.value as ServerFilterValue
      }

      params.filters![filter.id] = transformedValue
    })
  }

  return params
}

/**
 * Helper to convert server response to table format
 */
export function serverResponseToTableData<T>(response: ServerSideTableResponse<T>): {
  data: T[]
  pageCount: number
} {
  return {
    data: response.data,
    pageCount: response.meta.total_pages,
  }
}
