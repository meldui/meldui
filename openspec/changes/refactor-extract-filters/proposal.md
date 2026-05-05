# Change: Extract Filter System from DataTable into Standalone Composite

## Why

Today the filter system in `packages/vue/src/composites/data-table/` is tightly coupled to TanStack Table's `Column` API. Consumers who want to display the same dataset in alternate representations (grid, card list, kanban) cannot reuse the existing structured filter UX without rebuilding it. We need a single filter implementation that drives any view, while preserving the existing `<DataTable>` API for current consumers.

## What Changes

### Additions

- New `useFilters` composable that owns filter state (instances, aggregated values, search) independently of any view.
- New standalone `<Filters>` component that renders the inline filter pills, add-filter command, search input, and reset button.
- New `enableFilter` prop on `<DataTable>` (default `true`). When `false`, DataTable renders no filter UI and the parent owns `<Filters>` externally and feeds pre-filtered `data`.
- `<Filters>` exposes a `#right` slot for hosts to inject bulk-actions, view-options, refresh, etc. (mirrors today's `toolbar-end` semantics).
- `<Filters>` accepts an optional `searchField` prop to render a debounced search input as part of the same component (single event surface).

### Modifications

- All per-type filter components (`TextFilter`, `NumberFilter`, `DateFilter`, `SelectFilter`, `BooleanFilter`, `MultiSelectFilter`, `RangeFilter`, `DateRangeFilter`) move from `composites/data-table/filters/` to `composites/filters/filters/`. The old paths re-export for backwards compatibility.
- `MultiSelectFilter` is refactored to value-in/value-out: drops `column.getFilterValue()` / `column.setFilterValue()` reads/writes; adds `initialValue` prop; emits only `valueChange`.
- `MultiSelectFilter` removes the unused facet-count UI (`getFacetedUniqueValues`-based count badges next to options).
- `filterPlugins.ts`, `filters/operators.ts`, `filters/filter-icons.ts`, and filter-related types in `types.ts` move to `composites/filters/`. Old paths re-export for BC.
- `DataTableToolbar.vue` is reduced: when `enableFilter: true`, it composes `<Filters>` internally; when `false`, it renders no filter UI.

### Removals

- Facet count badges in `MultiSelectFilter` (UI-only; the feature was non-functional today since `getFacetedRowModel` is not registered in `useDataTable.ts`).

### Backwards Compatibility

- Default DataTable behavior is unchanged for existing consumers. `filterFields`, `filterPlugins`, `searchColumn`, `initialFilters`, `advancedMode`, and `onServerSideChange({ filters, sorting, pagination })` all behave as before.
- All existing filter-related imports from `@meldui/vue` continue to work via re-exports.

## Impact

- **Affected specs**: new `data-filtering` capability.
- **Affected code**:
  - New: `packages/vue/src/composites/filters/{Filters.vue,useFilters.ts,index.ts,filterPlugins.ts,types.ts}`, `packages/vue/src/composites/filters/filters/*.vue` (8 components moved), `composites/filters/filters/{operators,filter-icons,index}.ts`.
  - Modified: `packages/vue/src/composites/data-table/{DataTable.vue,DataTableToolbar.vue,useDataTable.ts}`, `packages/vue/src/composites/data-table/filters/MultiSelectFilter.vue` (decoupling refactor), `packages/vue/src/index.ts` (new exports).
  - Re-export shims: `packages/vue/src/composites/data-table/{filterPlugins.ts,types.ts,filters/*.{ts,vue}}` become thin re-exports from the new location.
  - Storybook: new `apps/vue-storybook/src/stories/Components/Filters/Standalone.stories.ts`.
- **Breaking changes**: None for default DataTable usage. Facet count rendering in `MultiSelectFilter` is removed (non-functional today).
- **Consumer migration**: opt-in. Consumers who want to drive a non-table view import `<Filters>` and `useFilters` directly and pass `enable-filter="false"` to DataTable when applicable.
