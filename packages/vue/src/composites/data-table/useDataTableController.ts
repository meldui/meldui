import type { PaginationState, SortingState } from '@tanstack/vue-table'
import { type ComputedRef, computed, type Ref, ref, watch } from 'vue'
import type { DataTableFilterState } from './types'

export interface UseDataTableControllerOptions {
  /**
   * Initial `pageSize` for the pagination ref. Ignored if `initialPagination`
   * is also provided (initialPagination wins). Defaults to 10.
   */
  pageSize?: number
  initialSorting?: SortingState
  initialFilters?: DataTableFilterState
  /**
   * Overrides `pageSize` when both are provided. Defaults to
   * `{ pageIndex: 0, pageSize: options.pageSize ?? 10 }`.
   */
  initialPagination?: PaginationState
  /**
   * Reset `pagination.pageIndex` to 0 whenever the filters ref changes.
   * Defaults to true. Matches MUI DataGrid / AG Grid / PrimeVue behaviour.
   */
  resetPageOnFilterChange?: boolean
  /**
   * Reset `pagination.pageIndex` to 0 whenever the sorting ref changes.
   * Defaults to true.
   */
  resetPageOnSortChange?: boolean
}

export interface UseDataTableControllerReturn {
  sorting: Ref<SortingState>
  filters: Ref<DataTableFilterState>
  pagination: Ref<PaginationState>
  /**
   * Merged read-only state. Watch this with `deep: true` to trigger a data
   * fetch whenever any of the three refs change.
   */
  state: ComputedRef<{
    sorting: SortingState
    filters: DataTableFilterState
    pagination: PaginationState
  }>
  /**
   * Resets all three refs to their initial values (or defaults when no
   * initial values were supplied).
   */
  reset: () => void
}

/**
 * Parent-side helper for `<DataTable>` and standalone `<Filters>` / `<Pagination>`
 * compositions. Owns the three v-model refs (sorting, filters, pagination),
 * applies the filter→page and sort→page reset rule with `flush: 'sync'`, and
 * exposes a single merged `state` computed for the parent's fetch watcher.
 *
 * `flush: 'sync'` on the reset watchers is load-bearing: it lands the pageIndex
 * reset before the parent's `watch(state, fetchPage)` runs in the same
 * microtask, so a single user action (filter or sort change) produces exactly
 * one fetch — not two.
 *
 * Has zero coupling to `<DataTable>`; use it equally for grid views and other
 * custom list layouts.
 */
export function useDataTableController(
  options: UseDataTableControllerOptions = {},
): UseDataTableControllerReturn {
  const initialSortingValue: SortingState = options.initialSorting ?? []
  const initialFiltersValue: DataTableFilterState = options.initialFilters ?? {}
  const initialPaginationValue: PaginationState = options.initialPagination ?? {
    pageIndex: 0,
    pageSize: options.pageSize ?? 10,
  }

  const sorting = ref<SortingState>(cloneSorting(initialSortingValue)) as Ref<SortingState>
  const filters = ref<DataTableFilterState>(
    cloneFilters(initialFiltersValue),
  ) as Ref<DataTableFilterState>
  const pagination = ref<PaginationState>({ ...initialPaginationValue })

  if (options.resetPageOnFilterChange ?? true) {
    watch(
      filters,
      () => {
        if (pagination.value.pageIndex !== 0) {
          pagination.value = { ...pagination.value, pageIndex: 0 }
        }
      },
      { deep: true, flush: 'sync' },
    )
  }

  if (options.resetPageOnSortChange ?? true) {
    watch(
      sorting,
      () => {
        if (pagination.value.pageIndex !== 0) {
          pagination.value = { ...pagination.value, pageIndex: 0 }
        }
      },
      { deep: true, flush: 'sync' },
    )
  }

  const state = computed(() => ({
    sorting: sorting.value,
    filters: filters.value,
    pagination: pagination.value,
  }))

  const reset = () => {
    sorting.value = cloneSorting(initialSortingValue)
    filters.value = cloneFilters(initialFiltersValue)
    pagination.value = { ...initialPaginationValue }
  }

  return { sorting, filters, pagination, state, reset }
}

function cloneSorting(value: SortingState): SortingState {
  return value.map((entry) => ({ ...entry }))
}

function cloneFilters(value: DataTableFilterState): DataTableFilterState {
  return { ...value }
}
