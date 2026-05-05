# Change: Decouple Filter State from TanStack `columnFilters`

## Why

The `refactor-extract-filters` change extracted `<Filters>` and `useFilters` as a standalone composite, but kept a backwards-compatibility bridge: when `enableFilter: true`, the toolbar's `useFilters` instance writes aggregated values into TanStack's `columnFilters` array via `setFilterValue`, and `useDataTable` reads them back out via `columnFiltersAsRecord` to forward into `onServerSideChange`. Since this codebase is server-side filtering only (`manualFiltering: true`), TanStack's `columnFilters` is structurally inert — nothing in the library reads it for row filtering. The round-trip causes:

- **Spurious writes** — `useFilters.filterValues` re-aggregates into a new object on every change, so the toolbar's reference-equality watcher trips on every field even when only one changed, calling `setFilterValue` for unchanged columns.
- **Dual source of truth** — both `useFilters.filterValues` and `table.getState().columnFilters` hold the same data.
- **Two reactivity layers** — composable → setFilterValue → TanStack reactivity → `onColumnFiltersChange` → `useDataTable` watcher → `onServerSideChange`.
- **`useDataTable` knows about filters** — it shouldn't, in the new model.

`useFilters` should be the single source of truth.

## What Changes

### Modifications

- `<DataTable>` instantiates `useFilters` directly when `enableFilter: true`, hoisting the state from `DataTableToolbar` to `DataTable`. The toolbar receives the state via prop and renders `<Filters :state>`.
- `useDataTable` becomes filter-agnostic: drops the `columnFilters` ref, `onColumnFiltersChange` handler, `columnFiltersAsRecord` helper, and the `initialFilters` array conversion. Accepts an optional `filters: () => DataTableFilterState` getter to forward to `onServerSideChange`.
- Pagination reset on filter change becomes an explicit watcher in `<DataTable>` (was implicit via `onColumnFiltersChange`'s side-effect).
- `initialFilters` flows straight into `useFilters.initialValues` — no TanStack hydration step.

### Removals

- `<Filters>`'s `getColumn` prop. With TanStack `columnFilters` permanently empty, the resolver returns columns whose `getFilterValue()` always returns undefined. **BREAKING for plugin filters that read column-scoped state**; plugins must use the `initialValue` prop and `valueChange` emit pattern (which is already what built-in filters do).
- `useDataTable.resetFilters()` — filters are no longer owned here. Top-level reset is now `dataTableRef.value.filtersState?.resetAll()` for `enableFilter: true`, or the parent's own `useFilters.resetAll()` for `enableFilter: false`.

### Additions

- `<DataTable :enable-filter="true">` exposes its internal `filtersState` via `defineExpose` so advanced consumers can imperatively reach in (mirrors how `tableState` and `keyboardState` are already exposed).

### Backwards Compatibility

- `<DataTable :on-server-side-change>` callback signature — **unchanged** (`{ sorting, filters: DataTableFilterState, pagination }`).
- `<DataTable :initial-filters>` prop shape — **unchanged** (record).
- `<DataTable :enable-filter>` user-visible semantics — **unchanged** (true = filter UI in toolbar; false = parent owns filters externally).
- `<Filters>` props/emits — unchanged except `getColumn` removed.
- `useFilters` API — unchanged.
- `tableStateToServerParams` — unchanged.

### Behavior in `enableFilter: false`

The DataTable does not emit filter changes through `onServerSideChange`. The parent owns the filter event surface entirely via `<Filters @change>` (or `v-model:filterValues`) and merges filter values into its own data fetch. DataTable's `onServerSideChange.filters` is `{}`. Pagination reset on filter change is the parent's responsibility (use `dataTableRef.value.resetPagination()`).

This matches the existing `DataTableExternalFilters` story pattern — only the toolbar-internal path is rewired.

## Impact

- **Affected specs**: `data-filtering` (modifies the DataTable Filter Integration and Filter Plugin Compatibility requirements).
- **Affected code**:
  - `packages/vue/src/composites/data-table/useDataTable.ts` — drop filter state and conversion.
  - `packages/vue/src/composites/data-table/DataTable.vue` — hoist `useFilters` from toolbar; add filter-change watcher resetting pagination.
  - `packages/vue/src/composites/data-table/DataTableToolbar.vue` — remove internal `useFilters`, mount-time seed IIFE, and TanStack write watchers; receive `filtersState` via prop.
  - `packages/vue/src/composites/filters/Filters.vue` — remove `getColumn` prop.
  - `apps/vue-storybook/src/stories/Components/Filters/Standalone.stories.ts` — simplify the `DataTableExternalFilters` story to match the cleaner two-event-surfaces pattern.
- **Breaking changes**:
  - Plugin filters that read `column.getFilterValue()` / `column.getIsFiltered()` from the resolver passed via `getColumn` no longer receive meaningful column state. Migration: accept `initialValue` prop and emit `valueChange`.
  - `useDataTable.resetFilters()` removed.
- **Internal-only changes**:
  - Filter state is no longer mirrored to TanStack `columnFilters`. Any third-party code reading `column.getFilterValue()` outside of plugin filters would observe undefined values.
