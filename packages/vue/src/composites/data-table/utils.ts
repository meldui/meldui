import type { DateValue } from '@internationalized/date'
import type { ColumnDef, SortingState } from '@tanstack/vue-table'
import type {
  DataTableFilterState,
  ServerFilterValue,
  ServerSideTableParams,
  ServerSideTableResponse,
} from './types'

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
 * Helper to transform DataTable state into the server-params shape.
 *
 * `filters` is the record passed to `onServerSideChange.filters` (keyed by
 * field id). This helper applies per-type transformations expected by typical
 * REST APIs (e.g., wrapping single text values in arrays, converting range
 * tuples to `{start, end}` objects, etc.).
 *
 * @param tableState - sorting, filters (record), pagination
 * @param filterFields - filter field definitions used to determine type-based transformations
 * @param searchColumn - optional id of the search field (kept as a plain string)
 */
export function tableStateToServerParams(
  tableState: {
    sorting: SortingState
    filters: DataTableFilterState
    pagination: { pageIndex: number; pageSize: number }
  },
  filterFields?: FilterFieldType[],
  searchColumn?: string,
): ServerSideTableParams {
  const params: ServerSideTableParams = {
    page: tableState.pagination.pageIndex + 1, // Convert 0-based to 1-based
    per_page: tableState.pagination.pageSize,
  }

  // Sorting
  if (tableState.sorting.length > 0) {
    const sort = tableState.sorting[0]
    params.sort_by = sort.id
    params.sort_order = sort.desc ? 'desc' : 'asc'
  }

  // Filters
  const entries = Object.entries(tableState.filters)
  if (entries.length > 0) {
    params.filters = {}

    for (const [id, rawValue] of entries) {
      // Search column → keep as string
      if (searchColumn && id === searchColumn) {
        params.filters[id] = rawValue as string
        continue
      }

      const fieldDef = filterFields?.find((f) => String(f.id) === id)
      const filterType = fieldDef?.type || 'multiselect' // Default to multiselect
      let transformedValue: ServerFilterValue = rawValue as ServerFilterValue

      switch (filterType) {
        case 'text':
          transformedValue = (Array.isArray(rawValue) ? rawValue : [rawValue]) as string[]
          break

        case 'number':
          transformedValue = (Array.isArray(rawValue) ? rawValue : [rawValue]) as number[]
          break

        case 'range': {
          const rangeValue = rawValue as [number, number] | [number, number][]
          if (Array.isArray(rangeValue)) {
            if (Array.isArray(rangeValue[0])) {
              transformedValue = (rangeValue as [number, number][]).map((range) => ({
                start: range[0],
                end: range[1],
              }))
            } else {
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
          transformedValue = (Array.isArray(rawValue) ? rawValue : [rawValue]) as DateValue[]
          break

        case 'daterange':
          if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
            transformedValue = [rawValue as { start: DateValue; end: DateValue }]
          }
          break

        case 'select':
          transformedValue = rawValue as string
          break

        case 'boolean':
          transformedValue = rawValue as boolean
          break

        case 'multiselect':
          transformedValue = rawValue as string[]
          break

        default:
          transformedValue = rawValue as ServerFilterValue
      }

      params.filters[id] = transformedValue
    }
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
