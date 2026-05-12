# Tasks: Stateless DataTable with controlled v-model state

## 1. Standalone `<Pagination>` composite

- [ ] 1.1 Create `packages/vue/src/composites/pagination/Pagination.vue`. Props: `pagination: PaginationState` (v-model target), `pageCount: number`, `totalRows?: number`, `pageSizeOptions?: number[]` (default `[10, 20, 30, 40, 50]`), `showPageSizeSelector?: boolean` (default true), `showPageInfo?: boolean` (default true), `showSelectedCount?: boolean` (default false). Emits `update:pagination`.
- [ ] 1.2 Port styling, icons, first/last/prev/next button logic, and page-size `<Select>` from `composites/data-table/DataTablePagination.vue`. Drop the TanStack `Table` instance dependency — derive button-disabled state from `pageCount` and `pagination.pageIndex` directly.
- [ ] 1.3 Create `packages/vue/src/composites/pagination/index.ts` exporting `Pagination` and re-exporting `PaginationState` type.
- [ ] 1.4 Add `export * from './composites/pagination'` to `packages/vue/src/index.ts`.

## 2. Controlled `filterValues` v-model on `<Filters>`

- [ ] 2.1 In `packages/vue/src/composites/filters/useFilters.ts`, add a `setValues(next: DataTableFilterState)` method that rebuilds `filterInstances` and `instanceValues` from the supplied record (reuses the same logic as `seedFromInitialValues`).
- [ ] 2.2 In `packages/vue/src/composites/filters/Filters.vue`, add `filterValues?: DataTableFilterState` prop and `update:filterValues` emit (already declared). When the prop is provided and changes via watcher, call `state.value.setValues(newValue)` — but only if the new value is not the same as what the component itself just emitted (compare against last-emitted reference to avoid feedback loops).
- [ ] 2.3 Verify `apps/vue-storybook/src/stories/Components/Filters/Standalone.stories.ts:ExternalComposable` and `DataTableExternalFilters` still work; add a new story demonstrating bidirectional v-model with a "Reset" button mutating the parent ref.

## 3. `useDataTableController` composable

- [ ] 3.1 Create `packages/vue/src/composites/data-table/useDataTableController.ts` with the documented interface (options: `pageSize`, `initialSorting`, `initialFilters`, `initialPagination`, `resetPageOnFilterChange`, `resetPageOnSortChange`; returns `sorting`, `filters`, `pagination`, `state`, `reset`).
- [ ] 3.2 Implement `state` as `computed(() => ({ sorting, filters, pagination }))`. Implement `reset()` to set all three refs back to their initial values.
- [ ] 3.3 Implement the `flush: 'sync'` page-reset watchers, each gated on its corresponding option (default `true`).
- [ ] 3.4 Export `useDataTableController` and its option / return types from `composites/data-table/index.ts`.

## 4. Strip internal state from `useDataTable`

- [ ] 4.1 In `packages/vue/src/composites/data-table/useDataTable.ts`, replace the internal `sorting`, `pagination` refs with prop-sourced getters. The existing `filters` getter pattern stays; replicate it for sorting and pagination.
- [ ] 4.2 Drop `onSortingChange`, `onPaginationChange` handlers that write to internal refs. Replace with handlers that compute the next state (resolving TanStack's updater fn) and call the parent's emit via a callback.
- [ ] 4.3 Add `onSortingChange?: (next: SortingState) => void` and `onPaginationChange?: (next: PaginationState) => void` options to `UseDataTableProps`. `<DataTable>` will pass these so TanStack onChange events flow to its `update:*` emits.
- [ ] 4.4 Drop `resetSorting`, `resetPagination`, `resetAll` (the latter no longer touches data-axis state). Keep `resetSelection`, `resetPinning`, `resetColumnSizing`, `resetExpanded`. `resetAll` can stay as a convenience for visual concerns.
- [ ] 4.5 Drop the `[sorting, pagination, () => readFilters()]` watcher and the `onServerSideChange` callback option. Each axis now emits independently via the handlers from 4.3.
- [ ] 4.6 Drop `refresh()` (was a parent-facing helper to re-fire `onServerSideChange`). Parents call their own fetcher directly.

## 5. Rewrite `<DataTable>`

- [ ] 5.1 In `packages/vue/src/composites/data-table/DataTable.vue`, replace `onServerSideChange` callback prop with three v-model props (`sorting`, `filters`, `pagination`) and three update emits.
- [ ] 5.2 Add `enableSorting?: boolean` (default `false`) and `enablePagination?: boolean` (default `false`). Change `enableFilter` default to remain `false`.
- [ ] 5.3 Remove `initialFilters`, `initialSorting`, `initialPagination`, `searchColumn`, `searchPlaceholder`, `showPagination`, `paginationPosition`, `defaultPerPage`, `pageSizeOptions` props that are now moved/removed. (`pageSizeOptions` moves to `<Pagination>` directly.)
- [ ] 5.4 Drop the internal `useFilters` instantiation. Toolbar receives `filterValues` from the parent via v-model:filters and renders `<Filters v-model:filterValues="filtersFromProp" :fields="filterFields" ...>`. The toolbar's `<Filters>` is uncontrolled-style (internal `useFilters`) with the controlled `:filterValues` prop bridging external updates.
- [ ] 5.5 Drop the internal `flush: 'sync'` filter→page reset watcher. Now lives in `useDataTableController`.
- [ ] 5.6 Replace `<DataTablePagination>` import and usage with `<Pagination>`. Gate on `enablePagination`. Pass `:pagination="pagination"` (v-model from prop) and `:page-count`, `:total-rows` from props.
- [ ] 5.7 Add dev-mode warnings (`if (import.meta.env.DEV && props.enableX && props.X === undefined) console.warn(...)`) for sorting, filters, pagination.
- [ ] 5.8 Verify `defineExpose` still exposes table state, keyboard state, and (when relevant) `filtersState` for advanced consumers.

## 6. Toolbar and column header cleanups

- [ ] 6.1 In `packages/vue/src/composites/data-table/DataTableToolbar.vue`, remove the `filtersState` prop and internal `<Filters :state>` wiring. Replace with the controlled `:filterValues` flow — when `enableFilter: true`, render `<Filters v-model:filterValues="filterValuesFromProp" ...>`. (`<DataTable>` passes its `filters` prop down.)
- [ ] 6.2 Drop `searchColumn` / `searchPlaceholder` from the toolbar's Props (they only fed the removed search bridge). Parent configures search on its own `<Filters>` via `searchField`.
- [ ] 6.3 In `packages/vue/src/composites/data-table/DataTableColumnHeader.vue`, verify the sort dropdown branch is only rendered when `column.getCanSort()` returns true. When `<DataTable :enable-sorting="false">`, TanStack receives no `enableSorting` flag on the table — column-level sortability defaults still apply, but in stateless mode the table never receives `state.sorting`. Confirm dropdown still hides correctly.
- [ ] 6.4 Audit `DataTableViewOptions.vue` and `DataTableBulkActions.vue` — they should still work unchanged (visual concerns remain internal).

## 7. Index and type exports

- [ ] 7.1 In `packages/vue/src/composites/data-table/index.ts`, remove `DataTablePagination` export. Re-export `Pagination` from `../pagination`. Add `useDataTableController` export and type re-exports.
- [ ] 7.2 In `packages/vue/src/composites/data-table/types.ts`, document `DataTableFilterState`, `PaginationState`, `SortingState` as the canonical v-model shapes. Drop `ServerSideTableParams` / `ServerSideTableResponse` if no longer load-bearing (verify with grep).
- [ ] 7.3 Verify `packages/vue/src/index.ts` re-exports everything consumers need (`Pagination`, `useDataTableController`, types).

## 8. Storybook migration

- [ ] 8.1 Migrate `apps/vue-storybook/src/stories/Components/DataTable/Events.stories.ts` from `onServerSideChange` to `update:sorting` / `update:filters` / `update:pagination`.
- [ ] 8.2 Add Storybook examples mirroring the design plan's Examples 1–8 (recommended internal, manual internal, all external, mixed external filter, grid view with composable, URL state restoration, switchable view, grid view manual).
- [ ] 8.3 Create `apps/vue-storybook/src/stories/Components/Pagination/Standalone.stories.ts` mirroring the existing standalone Filters story.
- [ ] 8.4 Create `apps/vue-storybook/src/stories/Components/DataTable/UseDataTableController.stories.ts` walking through composable options.
- [ ] 8.5 Migrate every other DataTable story (Selection, Pinning, Resizing, Expansion, Hiding) to the new v-model API. They were using `onServerSideChange` for data-fetch wiring — convert each.

## 9. Documentation

- [ ] 9.1 Update `apps/docs/src/content/docs/data-table/basic.mdx` props table and snippets.
- [ ] 9.2 Update `apps/docs/src/content/docs/data-table/server-side.mdx` to show the v-model + composable pattern instead of `onServerSideChange`.
- [ ] 9.3 Add a "Stateless contract" subsection explaining the controlled-component principle and the `flush: 'sync'` rationale for manual wiring.

## 10. Changeset

- [ ] 10.1 Run `pnpm changeset` and add an entry for `@meldui/vue` (major version bump — breaking changes). Include before/after migration snippets for both the composable and manual paths.

## 11. Validation

- [ ] 11.1 `pnpm --filter @meldui/vue build` — succeeds; v-model types resolve correctly in consumer code.
- [ ] 11.2 `pnpm check:fix` — clean.
- [ ] 11.3 `pnpm storybook:vue` — smoke walk-through Examples 1–8 plus the migrated existing stories.
- [ ] 11.4 `openspec validate refactor-stateless-data-table --strict` — passes.
