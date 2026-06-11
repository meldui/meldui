# @meldui/vue

## 0.3.4

### Patch Changes

- DocumentViewer: selected text can now be copied with Ctrl+C / Cmd+C. Also includes fixes for the Calendar, CircularProgress, and the button cursor.

## 0.3.3

### Patch Changes

- 46a849a: `AvatarGroup`: add an optional `size` prop (`sm` | `md` | `lg`) that uniformly sizes every avatar **and** the `+N` overflow badge, so the whole group scales together. When unset, avatars keep their own size and the badge uses the base avatar size (unchanged behavior).

## 0.3.2

### Patch Changes

- bug fixes on documentviewer

## 0.3.1

### Patch Changes

- 9e22618: fix(document-viewer): resolve `wasmUrl` against `document.baseURI` instead of `window.location.origin`, so consumers deployed under a subpath (e.g. GitHub Pages project sites) can fetch `pdfium.wasm` from the correct path.

## 0.3.0

### Minor Changes

- 00b972c: added document-viewer

## 0.2.0

### Minor Changes

- 9ce91ca: Extract the filter system from `<DataTable>` into a standalone `<Filters>` component and `useFilters` composable so the same structured filter UX can drive grid, card, list, or any other view of the same dataset. Filter state is owned by `useFilters` exclusively — TanStack Table's `columnFilters` is no longer touched by the data-table pipeline.

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

- 0ca50aa: Make `<DataTable>` a stateless, controlled component for sorting, filtering, and pagination. Parents now own all three state pieces via Vue `v-model:*` bindings and trigger data fetches when a merged state computed changes. A new `useDataTableController` composable bundles the three refs, applies the `flush: 'sync'` page-reset rule, and exposes a single merged `state` for fetch watchers. A new standalone `<DataPagination>` composite replaces `<DataTablePagination>` and can be rendered inside or outside the DataTable — same component, same prop shape.

  ### Breaking changes
  - **`onServerSideChange` callback prop is removed.** Migrate to three v-model emits (`update:sorting`, `update:filters`, `update:pagination`) or watch the merged state from `useDataTableController`.
  - **`initialFilters`, `initialSorting`, `initialPagination` props are removed.** Seed the parent's refs at construction time, typically via `useDataTableController({ initialSorting, initialFilters, initialPagination })`.
  - **`showPagination` prop is removed.** Replaced by `enablePagination` (default `false`, was always-on). Explicit opt-in.
  - **`searchColumn` and `searchPlaceholder` props are removed** from `<DataTable>`. Pass a `filterSearch` object instead (`{ id, placeholder?, debounceMs? }`), or configure search on a standalone `<Filters>` directly via its `searchField` prop.
  - **`DataTablePagination` is removed.** Replaced by a new standalone `<DataPagination>` composite at `@meldui/vue` package root that takes plain props (no TanStack `Table` instance dependency). Named with the `Data*` prefix to distinguish it from the existing Reka-based `<Pagination>` (page-number link bar), which it complements rather than replaces.
  - **`useDataTable.resetSorting`, `resetPagination`, `resetFilters`, `refresh` are removed.** Data-axis state lives in the parent now; reset via the parent (typically `controller.reset()`).
  - **`BulkActionOption.action` signature changes from `(selectedRows: TData[]) => void` to `(selectedIds: string[]) => void`.** TanStack only has row data for the current page in server-side mode, so the previous signature silently dropped off-page selections. The new signature passes IDs (per `getRowId`) for ALL selected rows across all pages — parents resolve to row data against their own source. Combine with a `getRowId` prop for stable identity.
  - **`<Filters>`'s `change` event is removed.** It duplicated `update:filterValues` exactly (same data, just wrapped in `{ filterValues: ... }`). Migrate `@change="handler"` to `@update:filter-values="handler"` and unwrap: payload changes from `{ filterValues: {...} }` to `{...}` directly. Or use `v-model:filterValues` for the standard Vue idiom.

  ### Behavioural change
  - Pagination now resets to page 0 on **sort change** in addition to filter change. Matches industry behaviour (MUI DataGrid, AG Grid, PrimeVue). Opt out via `useDataTableController({ resetPageOnSortChange: false })`.

  ### Additions
  - `enableSorting` prop on `<DataTable>` (default `false`). Renders column-header sort dropdown.
  - `enablePagination` prop on `<DataTable>` (default `false`). Renders the new `<DataPagination>` footer.
  - `sorting`, `filters`, `pagination` v-model targets on `<DataTable>`.
  - `pageCount` and `totalRows` display-only props on `<DataTable>`.
  - `useDataTableController` composable — parent-side helper for the three v-model refs and reset rules.
  - Standalone `<DataPagination>` composite — same v-model shape as `<DataTable>`'s `v-model:pagination`. Use it independently with grids, card lists, or any custom data view.
  - Controlled `filterValues` v-model on `<Filters>`; the component now reactively rebuilds chips when the parent replaces the bound ref.
  - Dev-mode warning when an `enable*` flag is true but the corresponding v-model prop is unbound.
  - `getRowId` prop on `<DataTable>` (forwarded to TanStack). Fixes a pre-existing latent bug where row selection state followed the row index across server-side page changes (selecting row 0 on page 1 visually selected row 0 on page 2). Provide `(row) => String(row.id)` when using `enable-row-selection` with server-side pagination.
  - `selectedIds` computed on the `useDataTable` return + exposed via `defineExpose` on `<DataTable>`. Gives the FULL set of selected row IDs across all pages (derived from `rowSelection` state). Companion to `selectedRows` which can only return rows whose data is currently loaded (= current page in server-side mode). Use `selectedIds` for cross-page bulk operations and resolve against your own data source for full row data.
  - Dev-mode warning when `enableRowSelection` is true but `getRowId` is not provided — explains the index-follows-page footgun and points at the fix.

  ### Migration — before

  ```vue
  <DataTable
    :data="data"
    :columns="columns"
    :page-count="pageCount"
    :on-server-side-change="handleChange"
    :initial-filters="initialFilters"
    :initial-sorting="initialSorting"
    enable-filter
    search-column="name"
    search-placeholder="Search..."
  />
  ```

  ### Migration — after (recommended)

  ```vue
  <script setup>
  import { DataTable, useDataTableController } from '@meldui/vue'

  const { sorting, filters, pagination, state } = useDataTableController({
    pageSize: 20,
    initialSorting,
    initialFilters,
  })

  watch(state, fetchPage, { deep: true })
  </script>

  <template>
    <DataTable
      :data="data"
      :columns="columns"
      :page-count="pageCount"
      :filter-search="{ id: 'name', placeholder: 'Search...' }"
      enable-sorting
      enable-filter
      enable-pagination
      v-model:sorting="sorting"
      v-model:filters="filters"
      v-model:pagination="pagination"
    />
  </template>
  ```

  ### Migration — without composable

  Replicate the page-reset rule yourself. `flush: 'sync'` is load-bearing — without it, every filter or sort change triggers two fetches.

  ```ts
  watch(filters, () => { pagination.value.pageIndex = 0 }, { deep: true, flush: 'sync' })
  watch(sorting, () => { pagination.value.pageIndex = 0 }, { deep: true, flush: 'sync' })
  watch([sorting, filters, pagination], () => fetchPage(...), { deep: true })
  ```

  See Storybook → Components / DataTable / Usage Examples for the eight canonical wiring scenarios covering every combination of internal vs external sort, filter, and pagination — including grid views without a DataTable at all.

## 0.1.15

### Patch Changes

- 6936474: Chore: version update
- Updated dependencies [6936474]
  - @meldui/tabler-vue@0.1.6

## 0.1.14

### Patch Changes

- theme upgrades for outline button and sidebar active menu

## 0.1.13

### Patch Changes

- b552608: Oxc integration and some bug fixes.

## 0.1.12

### Patch Changes

- 3de10a0: Add changeset for bundle optimization
- Updated dependencies [3de10a0]
  - @meldui/tabler-vue@0.1.5

## 0.1.11

### Patch Changes

- 4b285bd: Added fixes to datatable. Initial filters, sorting and pagination.
- 9cffcec: Fixes in datatable - initial filters, pagination and sorting.

## 0.1.10

### Patch Changes

- fc6051b: Fixed issues in datatable component

## 0.1.9

### Patch Changes

- ce8f48a: Fixed the sonner component to display it properly.

## 0.1.8

### Patch Changes

- 0cab55f: Added DateRangePicker.

## 0.1.7

### Patch Changes

- fb2cea7: Added Datatables

## 0.1.6

### Patch Changes

- eb8b29b: Modified the build of the css and the theming of the package.
- Updated dependencies [eb8b29b]
  - @meldui/tabler-vue@0.1.4

## 0.1.5

### Patch Changes

- 664d40c: Fix peer dependency warnings

## 0.1.4

### Patch Changes

- Updated dependencies [b93cc92]
  - @meldui/tabler-vue@0.1.3

## 0.1.3

### Patch Changes

- c669843: Added Timeline component

## 0.1.2

### Patch Changes

- 4aa7815: Added more components
- Updated dependencies [4aa7815]
  - @meldui/tabler-vue@0.1.2

## 0.1.1

### Patch Changes

- 943b42d: Initial release with Vue 3 components and Tabler icon system
- Updated dependencies [943b42d]
  - @meldui/tabler-vue@0.1.1
