# Change: Stateless DataTable with controlled v-model state

## Why

`<DataTable>` currently owns sorting / filtering / pagination state in internal refs and emits a single combined `onServerSideChange({ sorting, filters, pagination })` callback. This couples three orthogonal features and prevents selective externalisation:

- Sorting UI lives in column headers with no way to render headers in a stateless mode.
- Pagination UI is always rendered with no way to hand pagination control to a sibling component.
- Filter UI has an opt-out (`enableFilter: false`) but cannot be controlled bidirectionally from the parent.

This makes the table inflexible for mixed scenarios (e.g., external filter + internal pagination), forces a duplicated-state model (parent ref + table internal ref), and prevents reusing the same `<Filters>` / `<Pagination>` components inside and outside the table.

The redesign makes DataTable a **pure controlled component** for these three features — state flows down from the parent via `v-model:sorting` / `v-model:filters` / `v-model:pagination`, events flow up via the matching `update:*` emits — and extracts a standalone `<Pagination>` composite so the same component is rendered whether internal or external. A parent-side `useDataTableController` composable hides the load-bearing `flush: 'sync'` page-reset rule that would otherwise be a per-consumer footgun.

Visual concerns that do not affect data (row selection, expansion, column visibility / pinning / sizing) remain owned internally by DataTable.

## What Changes

### Breaking

- **BREAKING** Remove `onServerSideChange` callback prop. Replaced by three Vue v-model emits: `update:sorting`, `update:filters`, `update:pagination`.
- **BREAKING** Remove `initialFilters`, `initialSorting`, `initialPagination` props. Parents provide values via v-model from the start (use `useDataTableController` options to seed).
- **BREAKING** Rename `showPagination` → `enablePagination`. New default is `false` (was always-on). Explicit opt-in.
- **BREAKING** Remove `searchColumn` and `searchPlaceholder` props from `<DataTable>`. Configure search on `<Filters>` directly via its `searchField` prop.
- **BREAKING** Delete `DataTablePagination.vue`. Replaced by a new standalone `<Pagination>` composite at `composites/pagination/Pagination.vue` that takes plain props instead of a TanStack `Table` instance.
- **BREAKING** Pagination now resets to page 0 on sort change in addition to filter change. Matches MUI DataGrid / AG Grid / PrimeVue. Opt-out via `useDataTableController({ resetPageOnSortChange: false })`.

### Additions

- Add `enableSorting` prop on `<DataTable>` (default `false`).
- Add `enablePagination` prop on `<DataTable>` (default `false`).
- Add `sorting`, `filters`, `pagination` props on `<DataTable>` (v-model targets). Each is required when the corresponding `enableX` is `true`.
- Add `pageCount` and `totalRows` props on `<DataTable>` (display-only; required when `enablePagination` is `true`).
- Add `useDataTableController` composable at `composites/data-table/useDataTableController.ts`. Exposes `sorting`, `filters`, `pagination` refs plus a merged `state` computed. Encapsulates the filter→page and sort→page reset with `flush: 'sync'`.
- Add new `<Pagination>` composite at `composites/pagination/Pagination.vue`. Takes a single `:pagination` v-model (`{ pageIndex, pageSize }`) plus display props `pageCount`, `totalRows`, `pageSizeOptions`, and visibility toggles. Same shape as DataTable's `v-model:pagination` so the same ref can be bound to either.
- Add controlled `filterValues` prop + `update:filterValues` emit on `<Filters>` so parents can two-way-bind aggregated filter values (today's `initialValues` is one-shot seed only).
- Add dev-mode console warnings when `enableX` is `true` but the corresponding v-model prop is unbound (silent in production builds).

### Behavioural changes

- `<DataTable>` no longer holds internal Refs for sorting / filtering / pagination. State is sourced from props; TanStack onChange handlers forward to the corresponding `update:*` emits.
- The page-reset rule on filter change moves out of `<DataTable>` into `useDataTableController` (still uses `flush: 'sync'` to avoid double-fetch).

### Internal-only changes

- `useDataTable` (the lower-level composable) drops sorting / filter / pagination refs and their reset methods. Selection, expansion, column visibility / pinning / sizing remain internal as today.
- `valueUpdater` usage in `useDataTable` continues for the visual-concern Refs only.

## Impact

- **Affected specs**: `data-table` (NEW capability), `pagination` (NEW capability), `data-filtering` (ADDED requirement covering controlled v-model on `<Filters>`).
- **Affected code**:
  - `packages/vue/src/composites/data-table/DataTable.vue` — strip internal sort/filter/pagination state; add v-model props and `enableSorting` / `enablePagination`; remove deprecated props; wire dev-mode warnings.
  - `packages/vue/src/composites/data-table/useDataTable.ts` — accept sorting / filters / pagination as prop getters; drop internal Refs and reset methods for these three; forward TanStack onChange to parent emits.
  - `packages/vue/src/composites/data-table/useDataTableController.ts` — NEW.
  - `packages/vue/src/composites/data-table/DataTablePagination.vue` — DELETED.
  - `packages/vue/src/composites/pagination/Pagination.vue` — NEW.
  - `packages/vue/src/composites/pagination/index.ts` — NEW.
  - `packages/vue/src/composites/filters/Filters.vue` — accept controlled `filterValues` prop and reactively reflect external mutations.
  - `packages/vue/src/composites/filters/useFilters.ts` — support external value updates.
  - `packages/vue/src/composites/data-table/DataTableColumnHeader.vue` — verify dropdown gating on `column.getCanSort()` (TanStack reflects per-table `enableSorting`).
  - `packages/vue/src/composites/data-table/DataTableToolbar.vue` — render `<Filters>` only when `enableFilter: true` (mostly already correct; cleanup pass).
  - `packages/vue/src/composites/data-table/index.ts` — re-export `<Pagination>`, `useDataTableController`; remove `DataTablePagination` export.
  - `apps/vue-storybook/src/stories/Components/DataTable/*.stories.ts` — migrate all stories to v-model + per-feature emits; add one story per Example 1–8 in the design doc.
  - `apps/vue-storybook/src/stories/Components/Pagination/Standalone.stories.ts` — NEW.
  - `apps/docs/src/content/docs/data-table/*.mdx` — update API tables and snippets.
  - Changeset describing the breaking change and migration paths (composable and manual).
- **Breaking changes (consumer-facing)**:
  - `onServerSideChange` prop removed; consumers must migrate to v-model + watchers.
  - `initialFilters` / `initialSorting` / `initialPagination` removed; seed via `useDataTableController` options or initialise the parent's refs directly.
  - `showPagination` → `enablePagination` (and default changes from always-on to off).
  - `DataTablePagination` import path changes (now `Pagination` from `@meldui/vue`).
  - Sort-change pagination reset is a new behaviour; consumers that depended on the old behaviour must opt out via the composable option.
