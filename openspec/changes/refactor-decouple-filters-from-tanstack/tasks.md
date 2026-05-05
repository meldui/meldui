# Tasks: Decouple Filter State from TanStack `columnFilters`

## 1. Hoist `useFilters` from Toolbar to DataTable

- [x] 1.1 In `packages/vue/src/composites/data-table/DataTable.vue`, instantiate `useFilters` in setup when `enableFilter: true`. Seed with `props.initialFilters` as `initialValues` and `{ id: props.searchColumn, placeholder: props.searchPlaceholder }` as `searchField` when `searchColumn` is provided.
- [x] 1.2 Add `filtersState` to the value returned by `defineExpose` so consumers can imperatively reach in.
- [x] 1.3 Pass `:filters-state="filtersState"` to `<DataTableToolbar>`.
- [x] 1.4 Add `filtersState?: UseFiltersReturn<TData>` prop on `DataTableToolbar.vue`.
- [x] 1.5 In the toolbar template, when `enableFilter && filtersState`, render `<Filters :state="filtersState" :fields="filterFields" :plugins="filterPlugins" :advanced-mode="advancedMode" :search-field="filtersState.searchField" :loading="loading">` (no more local state).

## 2. Decouple `useDataTable` from filter state

- [x] 2.1 In `packages/vue/src/composites/data-table/useDataTable.ts`, add optional option `filters?: () => DataTableFilterState` to `UseDataTableProps`.
- [x] 2.2 Remove `columnFilters` ref, `onColumnFiltersChange` handler, `columnFiltersAsRecord` helper, and the `columnFilters` getter in TanStack state config.
- [x] 2.3 Remove the `initialFilters` array conversion. Drop the prop from `UseDataTableProps`.
- [x] 2.4 Update the `[sorting, columnFilters, pagination]` watcher to `[sorting, pagination, () => readFilters()]`. Inside, emit `onServerSideChange({ sorting: sorting.value, filters: readFilters(), pagination: pagination.value })`. (Watching the filter getter is needed so changes to `useFilters.filterValues` trigger the emit even when `pagination` does not change.)
- [x] 2.5 Remove `resetFilters` from the return. `resetAll` no longer calls it.
- [x] 2.6 Update `refresh()` to source filters from `readFilters()`.
- [x] 2.7 In `DataTable.vue`, pass `filters: () => filtersState.filterValues.value` into `useDataTable` (only when `filtersState` exists; otherwise omit and `useDataTable` defaults to `{}`).

## 3. Explicit pagination reset on filter change

- [x] 3.1 In `DataTable.vue`, when `filtersState` exists, add `watch(() => filtersState.filterValues.value, () => { tableState.pagination.value.pageIndex = 0 }, { deep: true, flush: 'sync' })`. `flush: 'sync'` is required so the pageIndex mutation lands before useDataTable's pre-flush `[sorting, pagination, filters]` watcher fires in the same microtask — otherwise W_emit would fire once with old pageIndex + new filters, then again after pageIndex resets.
- [ ] 3.2 Verify that the sorting/pagination watcher in `useDataTable` fires once per user action (Vue microtask batching). Defer to Phase 7 manual verification with a console.log inside the onServerSideChange handler.

## 4. Remove TanStack write watchers from toolbar

- [x] 4.1 ~Mount-time `initialSeed` IIFE and `searchFieldConfig` computed~ — already removed in Phase 1 when local `useFilters` was deleted.
- [x] 4.2 Delete both BC-bridge watchers that wrote to TanStack columns via `setFilterValue` (lines 56–82 of the post-Phase-1 file). Drop `watch` import.
- [x] 4.3 ~Local `useFilters` instantiation~ — already removed in Phase 1.
- [x] 4.4 Delete the `getColumn` helper and the `:get-column="getColumn"` prop forwarding to `<Filters>`.
- [x] 4.5 (cleanup) Drop now-unused `searchColumn` and `searchPlaceholder` props from `DataTableToolbar`'s Props (they only fed the deleted watchers / Phase 1 `searchFieldConfig`). Drop them from `DataTable.vue`'s `<DataTableToolbar>` invocation. The DataTable still owns these props at its own level — they still configure the hoisted `useFilters`'s `searchField`.

## 5. Drop `<Filters>` `getColumn` prop

- [x] 5.1 In `packages/vue/src/composites/filters/Filters.vue`, remove the `getColumn?: (fieldId: string) => Column<TData, unknown> | undefined` prop, the `:column="getColumn?.(instance.fieldId)"` template line, and the now-unused `Column` import from `@tanstack/vue-table`.
- [x] 5.2 Updated `.changeset/extract-filter-system.md` to (a) drop the stale `getColumn` mention from the new public API list, (b) drop the round-trip mention from the architecture section, (c) add explicit breaking-change entries for `getColumn` removal, `useDataTable.resetFilters` / `initialFilters` / `columnFilters` removal, and TanStack column accessors returning undefined, (d) include a plugin-filter migration snippet showing `initialValue` + `valueChange`.

## 6. Stories & documentation

- [x] 6.1 Simplified `Standalone.stories.ts:DataTableExternalFilters`. Replaced `refresh()` workaround with `dataTableRef.value?.resetPagination()` on `<Filters @change>` — single fetch per filter change because `resetPagination()` reassigns `pagination.value = {...}` (new object reference), which always triggers DataTable's internal watcher even when pageIndex/pageSize haven't changed. The merged-filters pattern in `handleChange` is preserved (DataTable's `onServerSideChange.filters` is `{}` when `enableFilter: false`).
- [x] 6.2 InitialFilters stories — no code change required. The hydration path (`initialFilters` → `useFilters.initialValues` → `seedFromInitialValues`) is shorter and uses the same composable function already shipping. Storybook build passes.
- [x] 6.3 Events.stories.ts:FilterEvents — no code change required. The handler reads `state.filters` from `onServerSideChange`; with Phase 2's getter-based watcher in `useDataTable`, the payload still carries the aggregated filter values when `enableFilter: true`. Storybook build passes.
- [x] 6.4 Standalone.stories.ts:WithPluginFilter — no code change required. The rating plugin filter never read `column` (it accepts `initialValue` and emits `valueChange`), so dropping `:get-column` is invisible to it. Storybook build passes.
- [x] 6.5 Documentation cleanup:
  - `apps/docs/src/content/docs/data-table/basic.mdx`: replaced the `resetFilters()` table row with a `filtersState?.resetAll()` row (with the toolbar-vs-external usage note); updated `resetAll()` description to clarify it no longer touches filter state.
  - `apps/vue-storybook/src/stories/Components/DataTable/Overview.mdx`: replaced `tableRef.value.resetFilters()` with `tableRef.value.filtersState?.resetAll()` in the imperative-methods example; added an `enableFilter` row to the props table documenting the `false` default and the toolbar-vs-external semantics.
  - `apps/docs/src/content/docs/data-table/server-side.mdx`: already uses the record-shape `DataTableFilterState` (updated in a prior turn); no further changes needed.
- [x] 6.6 (note) `enableFilter: false` remains the default in `DataTable.vue:155`. All stories that need toolbar filters opt in explicitly via `:enable-filter="true"` (verified by grep — every match in the stories tree is an explicit opt-in).

## 7. Verification

- [x] 7.1 `pnpm --filter @meldui/vue build` — clean ✓
- [x] 7.2 `pnpm --filter @meldui/vue typecheck` — 21 total errors, same as baseline; zero in refactor-touched files (`composites/filters/*`, `composites/data-table/{DataTable.vue,DataTableToolbar.vue,useDataTable.ts}`). Remaining errors are pre-existing in `Carousel`, `ChartTooltipContent`, `Drawer`, `ToggleGroupItem`, `DataTableColumnHeader`, `cellRenderers`, `columnHelpers`, `mention/*`.
- [x] 7.3 `pnpm --filter vue-storybook build-storybook` — clean ✓
- [x] 7.4 `pnpm --filter task-manager build` — `Tasks.vue` (the only DataTable consumer in this app) typechecks clean. Pre-existing unrelated `toSorted` errors in `RecentActivity.vue` block the full build but predate this change set.
- [ ] 7.5 **(deferred to user)** Manual storybook walkthrough — see "Manual verification handoff" below.
- [ ] 7.6 **(deferred to user)** Spurious-write check — see "Manual verification handoff" below.
- [x] 7.7 Changeset updated in Phase 5.2 (`.changeset/extract-filter-system.md` rewritten to describe the unified post-decoupling architecture, with explicit breaking-change entries for `getColumn` removal, `useDataTable.resetFilters/initialFilters/columnFilters` removal, and TanStack column-filter accessors returning undefined; added a plugin-filter migration snippet).

### Manual verification handoff

Run `pnpm storybook:vue` and walk through these stories with the browser DevTools console open:

1. **Components/DataTable/Filters/AllFilterTypes** — apply each filter type one by one (text, select, multiselect, number, range, boolean, date, daterange). Confirm each updates `onServerSideChange.filters` correctly (add a temporary `console.log` to the story's handler if helpful).
2. **Components/DataTable/Filters/CombinedFilters** — apply text + select + multiselect simultaneously. Spurious-write check: each new filter addition should fire `onServerSideChange` exactly **once** (post-rewire). Pre-rewire, adding a second filter caused TanStack to also re-write the unchanged first filter's column.
3. **Components/DataTable/Initial Filters/SimpleMultipleFilters** — refresh the page; chips populate from `initialFilters`; data is filtered correctly on first render.
4. **Components/DataTable/Initial Filters/URLStateRestoration** — same; filter chips appear from the simulated URL params.
5. **Components/DataTable/Events/FilterEvents** — apply filters; the "Filter State:" panel must update live.
6. **Components/Filters/Standalone/DataTableExternalFilters** — external `<Filters>` drives the table. Apply a filter; the table data updates and the page resets to 1. Single fetch per filter change.
7. **Components/Filters/Standalone/WithPluginFilter** — the rating slider plugin filter still works (slide it; filterValues panel updates).
8. **Components/DataTable/Filters/CombinedFilters with searchColumn** — type in the search input; confirm the search value appears under `searchColumn` key in `onServerSideChange.filters` and the toolbar displays the search input.

If any story misbehaves, the most likely culprit is the `flush: 'sync'` watcher in `DataTable.vue` (Phase 3) — it's the unusual piece in the new architecture.
