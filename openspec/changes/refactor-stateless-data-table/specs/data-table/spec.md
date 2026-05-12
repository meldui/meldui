## ADDED Requirements

### Requirement: DataTable Stateless Data-Axis Contract

`<DataTable>` SHALL be a pure controlled component for sorting, filtering, and pagination. It MUST NOT hold internal reactive state for these three concerns. State for each concern SHALL flow into the component as a prop and out as a corresponding `update:*` emit. Visual concerns (row selection, row expansion, column visibility, column pinning, column sizing) are not subject to this requirement and MAY remain internally managed.

#### Scenario: Sort click forwards to parent emit without internal mutation

- **WHEN** a user clicks a column-header sort dropdown while `enableSorting: true` and `v-model:sorting` is bound to a parent ref
- **THEN** `<DataTable>` emits `update:sorting` with the next `SortingState`
- **AND** `<DataTable>` does not write to any internal ref for sort state
- **AND** the next render of the column header reflects the new value only after the parent updates the bound ref

#### Scenario: External mutation of bound ref reflects immediately

- **WHEN** the parent imperatively mutates the ref bound to `v-model:sorting` (or `:filters`, or `:pagination`)
- **THEN** `<DataTable>` re-renders with the new value on the next reactivity tick
- **AND** no `update:*` emit fires as a result of the parent's own mutation

#### Scenario: Visual concerns remain internally managed

- **WHEN** a user toggles row selection, expands a row, hides a column, pins a column, or resizes a column
- **THEN** the corresponding state is stored inside `<DataTable>` via `useDataTable`
- **AND** no parent v-model is required for those interactions to work

### Requirement: DataTable Per-Feature Render Toggles

`<DataTable>` SHALL accept three independent boolean props (`enableSorting`, `enableFilter`, `enablePagination`), each defaulting to `false`. Each prop SHALL gate the rendering of the corresponding UI (sort dropdown in column headers, `<Filters>` row in toolbar, `<Pagination>` below the table) and SHALL have no effect on the other two features.

#### Scenario: enableSorting false hides column-header dropdown

- **WHEN** `<DataTable :enable-sorting="false">` is rendered
- **THEN** column headers display title text only with no sort affordance
- **AND** clicking a header has no effect on the data

#### Scenario: enableSorting true renders dropdown bound to v-model

- **WHEN** `<DataTable :enable-sorting="true" v-model:sorting="sorting">` is rendered
- **THEN** column headers display the sort dropdown and reflect the bound `sorting` state
- **AND** sort clicks emit `update:sorting`

#### Scenario: Mixed enable flags render independently

- **WHEN** `<DataTable :enable-sorting="true" :enable-filter="false" :enable-pagination="true">` is rendered
- **THEN** column headers render the sort dropdown
- **AND** the toolbar does not render the `<Filters>` row
- **AND** the `<Pagination>` component renders below the table

### Requirement: DataTable V-Model Emits

`<DataTable>` SHALL emit `update:sorting`, `update:filters`, and `update:pagination` independently of each other. There SHALL be no combined `change` event. Each emit's payload SHALL match the corresponding v-model shape: `SortingState` (`Array<{ id: string; desc: boolean }>`), `DataTableFilterState` (`Record<string, FilterInstanceValue>`), and `PaginationState` (`{ pageIndex: number; pageSize: number }`).

#### Scenario: Sort click emits only update:sorting

- **WHEN** a user clicks a sort option
- **THEN** `update:sorting` fires with the new `SortingState`
- **AND** `update:filters` does not fire
- **AND** `update:pagination` does not fire

#### Scenario: Page-size change emits only update:pagination

- **WHEN** a user selects a new page size in `<Pagination>` (rendered internally via `enablePagination: true`)
- **THEN** `update:pagination` fires with the new `{ pageIndex, pageSize }`
- **AND** neither `update:sorting` nor `update:filters` fires

### Requirement: DataTable Page-Count and Total-Rows Inputs

When `enablePagination: true`, `<DataTable>` SHALL accept `pageCount: number` and optionally `totalRows: number` as display-only props. These props MUST NOT be carried inside `v-model:pagination` because they are server-derived and never mutated by user interaction. `<DataTable>` SHALL forward these to its internal `<Pagination>` instance.

#### Scenario: pageCount drives Next/Last button disabled state

- **WHEN** `pageCount` is `5` and `pagination.pageIndex` is `4`
- **THEN** the Next and Last buttons are disabled in the rendered `<Pagination>`

#### Scenario: totalRows omitted does not render "X of Y" display

- **WHEN** `totalRows` is not provided and `showPageInfo` is true
- **THEN** the pagination footer omits the total-rows indicator (or substitutes a fallback per the `<Pagination>` spec)

### Requirement: DataTable Dev-Mode Missing-Binding Warning

When `enableSorting: true`, `enableFilter: true`, or `enablePagination: true`, and the corresponding prop (`sorting`, `filters`, `pagination`) is `undefined` (not bound), `<DataTable>` SHALL log a `console.warn` in development builds (`import.meta.env.DEV`). Production builds MUST NOT emit such warnings.

#### Scenario: Missing v-model on enableSorting

- **WHEN** `<DataTable :enable-sorting="true">` is mounted without `v-model:sorting` or `:sorting` bound
- **AND** the build is a development build
- **THEN** `console.warn` logs a message identifying the missing binding

#### Scenario: Production build is silent

- **WHEN** the same condition occurs in a production build
- **THEN** no warning is logged

### Requirement: useDataTableController Composable

A composable `useDataTableController` SHALL be exported from `@meldui/vue` that exposes `sorting`, `filters`, `pagination` refs, a merged `state` `ComputedRef`, and a `reset()` method. It SHALL accept options: `pageSize` (default 10), `initialSorting`, `initialFilters`, `initialPagination`, `resetPageOnFilterChange` (default true), `resetPageOnSortChange` (default true).

#### Scenario: Default options seed refs and apply both resets

- **WHEN** `useDataTableController({ pageSize: 20 })` is invoked
- **THEN** the returned `sorting` ref is `[]`, `filters` ref is `{}`, `pagination` ref is `{ pageIndex: 0, pageSize: 20 }`
- **AND** mutating `filters` resets `pagination.pageIndex` to `0` in the same microtask
- **AND** mutating `sorting` resets `pagination.pageIndex` to `0` in the same microtask

#### Scenario: Opt out of sort reset

- **WHEN** `useDataTableController({ resetPageOnSortChange: false })` is invoked
- **AND** the parent mutates the returned `sorting` ref
- **THEN** `pagination.pageIndex` is not reset

#### Scenario: Reset method returns refs to initial values

- **WHEN** the parent calls `controller.reset()` after user interactions have modified all three refs
- **THEN** `sorting`, `filters`, and `pagination` return to the initial values supplied in options (or defaults when none were supplied)

### Requirement: useDataTableController Single-Fetch Guarantee

`useDataTableController` SHALL guarantee that any single user action mutating a controlled ref produces exactly one observable change to the merged `state` `ComputedRef` per microtask, even when a side-effect (page reset) mutates another ref in the same tick. This is achieved internally via `flush: 'sync'` page-reset watchers.

#### Scenario: Filter change with internal page reset produces one fetch

- **GIVEN** the parent has `watch(state, fetchPage, { deep: true })`
- **WHEN** the user changes a filter while `pagination.pageIndex > 0`
- **THEN** `fetchPage` is invoked exactly once
- **AND** the payload it receives reflects both the new filter value and `pagination.pageIndex === 0`

#### Scenario: Sort change with internal page reset produces one fetch

- **GIVEN** the parent has `watch(state, fetchPage, { deep: true })`
- **WHEN** the user changes sort while `pagination.pageIndex > 0`
- **THEN** `fetchPage` is invoked exactly once
- **AND** the payload reflects both the new sort and `pagination.pageIndex === 0`

### Requirement: Removed DataTable Props

`<DataTable>` SHALL NOT accept the following props (removed in this change): `onServerSideChange`, `initialFilters`, `initialSorting`, `initialPagination`, `showPagination`, `searchColumn`, `searchPlaceholder`, `paginationPosition`, `defaultPerPage`, `pageSizeOptions`. Consumers migrating from prior versions MUST use `v-model:*` for state and configure search/page-size on `<Filters>` and `<Pagination>` directly.

#### Scenario: Old onServerSideChange callback prop is no longer recognised

- **WHEN** a consumer passes `:on-server-side-change="handler"` to `<DataTable>`
- **THEN** the prop is ignored (Vue runtime warning in dev)
- **AND** the handler is never invoked

#### Scenario: initialSorting hydration is the parent's responsibility

- **WHEN** a consumer wants to seed sort state from a URL query
- **THEN** they construct their `sorting` ref pre-populated, or pass `initialSorting` to `useDataTableController`
- **AND** they do not rely on a DataTable-level `initialSorting` prop
