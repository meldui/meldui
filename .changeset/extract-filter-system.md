---
'@meldui/vue': major
---

Extract the filter system from `<DataTable>` into a standalone `<Filters>` component and `useFilters` composable so the same structured filter UX can drive grid, card, list, or any other view of the same dataset.

**New public API**

- `<Filters>` — standalone component rendering the search input, filter pills, add-filter command, and reset button. Accepts `fields`, `plugins`, `advancedMode`, `searchField`, `initialValues`, `loading`, optional pre-instantiated `state` from `useFilters`, and an optional `getColumn` resolver for plugin filters that need column-scoped state. Slots: `#start`, `#right`. Emits: `update:filterValues`, `change`, `reset`.
- `useFilters` — composable owning `filterInstances`, aggregated `filterValues`, debounced `searchValue`, and imperative `addFilter` / `removeInstance` / `setInstanceValue` / `resetAll` methods. Independent of TanStack Table; usable with any view.
- `<DataTable :enable-filter="true">` — opt-in filter UI in the toolbar.
- `DataTableFilterState` type — record-shaped filter values keyed by field id.

**Breaking changes**

- `<DataTable>`'s `enableFilter` prop now defaults to **`false`** (was implicitly true). To preserve the previous behavior, set `:enable-filter="true"` explicitly. Without it, the toolbar renders no search/filter UI; the parent owns filter state via a separate `<Filters>` instance and feeds pre-filtered `data`.
- `onServerSideChange.filters` is now a `Record<fieldId, FilterInstanceValue>` (was `ColumnFiltersState`, an array of `{id, value}`). Same for `<DataTable :initial-filters>` and the new `change` event payload on `<Filters>`. Migration: `Object.fromEntries(filters.map(f => [f.id, f.value]))` ↔ `Object.entries(filters).map(([id, value]) => ({ id, value }))`.
- `tableStateToServerParams` accepts the record shape as its `tableState.filters` input (no longer the TanStack array).
- `<Filters>` `change` event no longer emits a separate `searchValue` field. Search lives inside `filterValues` keyed by `searchField.id` (matching the DataTable convention).

**Refactors (internal)**

- Filter primitives (8 per-type components, plugin registry, operators, types) moved to `composites/filters/`. The `composites/data-table/` index no longer re-exports filter symbols — import them from `@meldui/vue` (the package barrel forwards everything from `composites/filters`).
- `MultiSelectFilter` decoupled from TanStack: now uses an `initialValue` prop and emits only `valueChange`. The unused facet-count UI (`getFacetedUniqueValues` badges) was removed; it was non-functional since `getFacetedRowModel` was never registered.
- `DataTableToolbar` composes `<Filters>` internally when `enableFilter` is true, with one-direction reactive sync into TanStack `columnFilters` so existing `setFilterValue`-based hooks still work.
- Internal cross-module imports use `@/composites/filters/...` aliases.

**Migration example**

```ts
// Before
const handleChange = ({ filters }) => {
  const role = filters.find(f => f.id === 'role')?.value
}
<DataTable :filter-fields="filterFields" />

// After
const handleChange = ({ filters }) => {
  const role = filters.role
}
<DataTable :filter-fields="filterFields" :enable-filter="true" />
```
