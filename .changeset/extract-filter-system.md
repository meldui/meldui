---
'@meldui/vue': major
---

Extract the filter system from `<DataTable>` into a standalone `<Filters>` component and `useFilters` composable so the same structured filter UX can drive grid, card, list, or any other view of the same dataset. Filter state is owned by `useFilters` exclusively — TanStack Table's `columnFilters` is no longer touched by the data-table pipeline.

**New public API**

- `<Filters>` — standalone component rendering the search input, filter pills, add-filter command, and reset button. Accepts `fields`, `plugins`, `advancedMode`, `searchField`, `initialValues`, `loading`, and an optional pre-instantiated `state` from `useFilters`. Slots: `#start`, `#right`. Emits: `update:filterValues`, `change`, `reset`.
- `useFilters` — composable owning `filterInstances`, aggregated `filterValues`, debounced `searchValue`, and imperative `addFilter` / `removeInstance` / `setInstanceValue` / `resetAll` methods. Independent of TanStack Table; usable with any view.
- `<DataTable :enable-filter="true">` — opt-in filter UI in the toolbar; the DataTable hoists `useFilters` internally and exposes `filtersState` via `defineExpose`.
- `DataTableFilterState` type — record-shaped filter values keyed by field id.

**Breaking changes**

- `<DataTable>`'s `enableFilter` prop now defaults to **`false`** (was implicitly true). To preserve the previous behavior, set `:enable-filter="true"` explicitly. Without it, the toolbar renders no search/filter UI; the parent owns filter state via a separate `<Filters>` instance and feeds pre-filtered `data`.
- `onServerSideChange.filters` is now a `Record<fieldId, FilterInstanceValue>` (was `ColumnFiltersState`, an array of `{id, value}`). Same for `<DataTable :initial-filters>` and the new `change` event payload on `<Filters>`. Migration: `Object.fromEntries(filters.map(f => [f.id, f.value]))` ↔ `Object.entries(filters).map(([id, value]) => ({ id, value }))`.
- `tableStateToServerParams` accepts the record shape as its `tableState.filters` input (no longer the TanStack array).
- `<Filters>` `change` event no longer emits a separate `searchValue` field. Search lives inside `filterValues` keyed by `searchField.id` (matching the DataTable convention).
- `<Filters>` no longer accepts a `getColumn` prop. With filter state owned solely by `useFilters` and never mirrored to TanStack `columnFilters`, the resolver returned columns whose filter accessors always returned undefined. Plugin filters MUST receive their state via the `initialValue` prop and emit changes via `valueChange` (which is what built-in filters already do). Plugins that previously read `column.getFilterValue()` should switch to consuming `initialValue` directly.
- `useDataTable` no longer accepts `initialFilters` or returns `columnFilters` / `resetFilters`. Filter state is owned by `useFilters` (in `<DataTable>` when `enableFilter: true`, or by the parent app otherwise). Top-level reset for filters is `dataTableRef.value.filtersState?.resetAll()` (toolbar mode) or the parent's own `useFilters.resetAll()` (external mode).
- TanStack `column.getFilterValue()` and `column.getIsFiltered()` always return `undefined` / `false`; filter state is no longer mirrored to TanStack columns. Any third-party code (custom column headers, plugin filters) consulting these accessors should source filter state from `useFilters` instead.

**Internal architecture**

- Filter primitives (8 per-type components, plugin registry, operators, types) moved to `composites/filters/`. The `composites/data-table/` index no longer re-exports filter symbols — import them from `@meldui/vue` (the package barrel forwards everything from `composites/filters`).
- `MultiSelectFilter` decoupled from TanStack: now uses an `initialValue` prop and emits only `valueChange`. The unused facet-count UI (`getFacetedUniqueValues` badges) was removed; it was non-functional since `getFacetedRowModel` was never registered.
- `<DataTable>` instantiates `useFilters` directly when `enableFilter: true` and passes it down to `<DataTableToolbar>` via prop. The toolbar is a pure renderer with no filter state of its own.
- `useDataTable` is filter-agnostic: it accepts an optional `filters: () => DataTableFilterState` getter and forwards its return into `onServerSideChange.filters`.
- Pagination reset on filter change is now an explicit `flush: 'sync'` watcher in `<DataTable>` (was an implicit side-effect of TanStack's `onColumnFiltersChange`).

**Migration example**

```ts
// Before — filter state was an array; toolbar filtering was on by default
const handleChange = ({ filters }) => {
  const role = filters.find(f => f.id === 'role')?.value
}
<DataTable :filter-fields="filterFields" />

// After — record shape; opt in to toolbar filters
const handleChange = ({ filters }) => {
  const role = filters.role
}
<DataTable :filter-fields="filterFields" :enable-filter="true" />
```

```ts
// Plugin filter migration: drop column reads, accept initialValue + emit valueChange
// Before
defineFilter({
  type: 'currency',
  component: defineComponent({
    props: ['column', 'title'],
    setup({ column }) {
      const value = column.getFilterValue()
      // ...
    },
  }),
})

// After
defineFilter({
  type: 'currency',
  component: defineComponent({
    props: ['initialValue', 'title'],
    emits: ['valueChange'],
    setup(props, { emit }) {
      const value = ref(props.initialValue)
      // ... emit('valueChange', newValue) on change
    },
  }),
})
```
