---
'@meldui/vue': major
---

Make `<DataTable>` a stateless, controlled component for sorting, filtering, and pagination. Parents now own all three state pieces via Vue `v-model:*` bindings and trigger data fetches when a merged state computed changes. A new `useDataTableController` composable bundles the three refs, applies the `flush: 'sync'` page-reset rule, and exposes a single merged `state` for fetch watchers. A new standalone `<Pagination>` composite replaces `<DataTablePagination>` and can be rendered inside or outside the DataTable — same component, same prop shape.

### Breaking changes

- **`onServerSideChange` callback prop is removed.** Migrate to three v-model emits (`update:sorting`, `update:filters`, `update:pagination`) or watch the merged state from `useDataTableController`.
- **`initialFilters`, `initialSorting`, `initialPagination` props are removed.** Seed the parent's refs at construction time, typically via `useDataTableController({ initialSorting, initialFilters, initialPagination })`.
- **`showPagination` prop is removed.** Replaced by `enablePagination` (default `false`, was always-on). Explicit opt-in.
- **`searchColumn` and `searchPlaceholder` props are removed** from `<DataTable>`. Pass a `filterSearch` object instead (`{ id, placeholder?, debounceMs? }`), or configure search on a standalone `<Filters>` directly via its `searchField` prop.
- **`DataTablePagination` is removed.** Replaced by a new standalone `<Pagination>` composite at `@meldui/vue` package root that takes plain props (no TanStack `Table` instance dependency).
- **`useDataTable.resetSorting`, `resetPagination`, `resetFilters`, `refresh` are removed.** Data-axis state lives in the parent now; reset via the parent (typically `controller.reset()`).
- **`ui/Pagination` Reka primitive export renamed to `PaginationRoot`** to free up the `Pagination` name for the new composite.
- **`BulkActionOption.action` signature changes from `(selectedRows: TData[]) => void` to `(selectedIds: string[]) => void`.** TanStack only has row data for the current page in server-side mode, so the previous signature silently dropped off-page selections. The new signature passes IDs (per `getRowId`) for ALL selected rows across all pages — parents resolve to row data against their own source. Combine with a `getRowId` prop for stable identity.
- **`<Filters>`'s `change` event is removed.** It duplicated `update:filterValues` exactly (same data, just wrapped in `{ filterValues: ... }`). Migrate `@change="handler"` to `@update:filter-values="handler"` and unwrap: payload changes from `{ filterValues: {...} }` to `{...}` directly. Or use `v-model:filterValues` for the standard Vue idiom.

### Behavioural change

- Pagination now resets to page 0 on **sort change** in addition to filter change. Matches industry behaviour (MUI DataGrid, AG Grid, PrimeVue). Opt out via `useDataTableController({ resetPageOnSortChange: false })`.

### Additions

- `enableSorting` prop on `<DataTable>` (default `false`). Renders column-header sort dropdown.
- `enablePagination` prop on `<DataTable>` (default `false`). Renders the new `<Pagination>` footer.
- `sorting`, `filters`, `pagination` v-model targets on `<DataTable>`.
- `pageCount` and `totalRows` display-only props on `<DataTable>`.
- `useDataTableController` composable — parent-side helper for the three v-model refs and reset rules.
- Standalone `<Pagination>` composite — same v-model shape as `<DataTable>`'s `v-model:pagination`.
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
