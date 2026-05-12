# Design: Stateless DataTable with controlled v-model state

## Context

`<DataTable>` runs TanStack Table in fully manual mode today (`manualPagination`, `manualSorting`, `manualFiltering: true`), so the parent already owns the data fetch. But the _UI_ and _state ownership_ for the three features are wired asymmetrically:

- Filters can be externalised (`enableFilter: false`) — already extracted as a standalone `<Filters>` in the in-progress `refactor-extract-filters` and `refactor-decouple-filters-from-tanstack` proposals.
- Sorting and pagination are always internal in `<DataTable>`. There is no path for an external sibling component to drive them.
- All three flow through one combined `onServerSideChange` callback, forcing parents to merge regardless of which features are external.
- `<DataTable>` holds internal Refs for sorting / pagination / filter values that mirror what the parent ultimately fetches with — duplicated state.

The goal is symmetry: each of the three features must support being either internal-UI (rendered inside DataTable) or external-UI (rendered by the parent elsewhere using the same components), and in both cases the parent owns state and triggers the data fetch via server calls.

## Goals / Non-Goals

### Goals

- DataTable is a pure controlled component for sorting, filtering, pagination. No internal state for these three.
- Vue idiom: `v-model:sorting`, `v-model:filters`, `v-model:pagination`.
- The same `<Filters>` and `<Pagination>` components are usable inside DataTable's toolbar/footer or rendered standalone by the parent. Single source of truth for each UI piece.
- Mixed modes work without special cases (e.g., external filter + internal pagination + internal sort).
- A `useDataTableController` composable removes the page-reset footgun for typical consumers.

### Non-Goals

- Client-side data ops. TanStack stays in fully manual mode; the table never sorts / filters / paginates.
- Backwards compatibility with `onServerSideChange`. This is a clean break.
- Uncontrolled fallback when `enableX: true` but the prop is unbound. We intentionally fail loud (dev-mode warning) rather than silently manage state internally.
- Refactoring visual concerns (selection, expansion, column visibility / pinning / sizing). They stay internal — they do not affect data flow.

## Decisions

### Decision: Controlled-only state, no uncontrolled fallback

- **What**: When `enableSorting: true` (likewise for filter/pagination), the parent **must** bind `v-model:sorting`. The table does not manage sort state internally.
- **Why**: A "controlled OR uncontrolled" mode (MUI DataGrid style) creates a duplicated-state class of bugs and ambiguous ownership. The user's explicit ask is "stateless components." We pay the cost of stricter wiring in exchange for unambiguous data flow.
- **Alternatives considered**:
  - _MUI-style mixed mode (controlled if bound, uncontrolled otherwise)_. Rejected: invites the bugs we are trying to eliminate.
  - _TanStack-style "state from prop OR internal Ref"_. Rejected for the same reason.
- **Mitigation for missing binding**: dev-mode `console.warn` when `enableX: true` and the corresponding prop is `undefined`. Silent in production.

### Decision: Three v-models, no unified `change` event

- **What**: `<DataTable>` emits `update:sorting`, `update:filters`, `update:pagination`. No combined `change` event.
- **Why**: With three v-models bound, the parent already owns all three refs. They can write `watch([sorting, filters, pagination], fetcher)` themselves; a unified `change` event would be redundant API surface.
- **Alternatives considered**:
  - _Keep `onServerSideChange` as a unified change callback_. Rejected: forces parent to special-case which axis changed, blocks per-axis v-model semantics.
  - _Per-feature events + a unified `change` event_. Rejected: API surface inflation for marginal convenience.

### Decision: `PaginationState = { pageIndex, pageSize }`; `pageCount` is a separate prop

- **What**: v-model:pagination carries only user-mutable state (`pageIndex`, `pageSize`). Display-only server-derived info (`pageCount`, `totalRows`) flows as separate props.
- **Why**: Matches TanStack Table, MUI DataGrid, AG Grid conventions. v-model implies bidirectional mutation; mixing display-only data into the v-model muddles semantics.
- **Alternatives considered**:
  - _Bundle everything into one v-model object_. Rejected: would imply the table can mutate `pageCount`, which it can't.

### Decision: Page-reset on filter AND sort change, owned by the composable

- **What**: `useDataTableController` watches `filters` and `sorting` and resets `pagination.pageIndex = 0` on either change, using `flush: 'sync'`. Both opt-out via options.
- **Why for sort reset**: Industry-aligned (MUI, AG Grid, PrimeVue). UX argument: after a sort change, page 5 contains arbitrary rows with no continuity for the user.
- **Why `flush: 'sync'`**: Without it, the parent's `watch([sorting, filters, pagination], fetcher)` fires twice per filter/sort change — once with the new filter and old pageIndex, then again after the reset watcher runs. `flush: 'sync'` lands the reset before the next microtask flush so the parent observes a single coherent state and fires one fetch.
- **Alternatives considered**:
  - _Auto-reset inside `<DataTable>` instead of the composable_. Rejected: cannot fire when filters are external (DataTable doesn't see them); puts an implicit mutation in a "stateless" component.
  - _Document `flush: 'sync'` as a parent contract_. Rejected as primary path: too easy to forget; silent failure mode (double fetch). Available as the manual-wiring fallback (Example 8 in the design plan).

### Decision: Standalone `<Pagination>` composite

- **What**: Move `DataTablePagination.vue` to `composites/pagination/Pagination.vue`. Take a single `:pagination` v-model plus display props. No TanStack `Table` instance dependency.
- **Why**: The existing `ui/Pagination` is a Reka primitive without page-size selector, first/last, or page info. Building external pagination on it would require duplicating those features. A richer standalone composite with the same shape as DataTable's `v-model:pagination` lets parents bind one ref to either rendering path.
- **Alternatives considered**:
  - _Keep `DataTablePagination` coupled to TanStack `Table` and have external consumers re-build their own_. Rejected: bad ergonomics; duplicates work.

### Decision: Controlled `:filterValues` v-model on `<Filters>`

- **What**: `<Filters>` accepts a controlled `filterValues` prop and reactively rebuilds chip instances when the prop changes externally. Emits `update:filterValues` as before.
- **Why**: Without true two-way binding, `controller.reset()` would clear the parent's ref but leave the chip UI showing stale state. Required for the composable's `reset()` to behave intuitively.
- **Alternatives considered**:
  - _Document that parents must re-mount `<Filters>` to reset its UI_. Rejected: poor ergonomics; bypasses Vue's reactivity model.
  - _Keep the existing `:state` (full composable handoff) as the only path_. Rejected: forces parents to import `useFilters` even for simple cases.

## Risks / Trade-offs

- **Risk: Consumer skips `useDataTableController` and forgets `flush: 'sync'`** → silent double-fetch on every filter/sort change.
  - Mitigation: prominent docs in CHANGELOG and Storybook (Example 2 and Example 8 in the design plan call this out explicitly). Recommended path is the composable.
- **Risk: Consumer forgets v-model when setting `enableSorting: true`** → sort clicks emit but appear broken.
  - Mitigation: dev-mode `console.warn` when `enableX: true` and corresponding prop is `undefined`.
- **Trade-off: API surface increases** (three new v-model props + `enableSorting` + `enablePagination` + composable) but removes one prop (`onServerSideChange`) and three legacy props (`initialFilters` etc.). Net wash; clarity gain.
- **Trade-off: Breaking change with no deprecation period**. Acceptable because the package is internal-only (per CLAUDE.md) and downstream consumers are limited.

## Migration Plan

Two paths documented:

### Recommended — use the composable

```ts
import { useDataTableController } from '@meldui/vue'

const { sorting, filters, pagination, state } = useDataTableController({
  pageSize: 20,
  initialSorting,
  initialFilters,
})
watch(state, fetchPage, { deep: true })
```

```vue
<DataTable
  :data="data"
  :columns="columns"
  :page-count="pageCount"
  :filter-fields="filterFields"
  enable-sorting
  enable-filter
  enable-pagination
  v-model:sorting="sorting"
  v-model:filters="filters"
  v-model:pagination="pagination"
/>
```

### Manual — no composable

Replicate the page-reset rule yourself. `flush: 'sync'` is load-bearing.

```ts
watch(filters, () => { pagination.value.pageIndex = 0 }, { deep: true, flush: 'sync' })
watch(sorting, () => { pagination.value.pageIndex = 0 }, { deep: true, flush: 'sync' })
watch([sorting, filters, pagination], () => fetchPage(...), { deep: true })
```

### Rollback

Revert this change set as a single PR. The internal-only nature of the package means no downstream coordination is required.

## Open Questions

- **Composable naming**: `useDataTableController` lives under `composites/data-table/` for discoverability, but it has zero coupling to DataTable (Examples 3, 5, 7 in the design plan use it without rendering a DataTable). If consumer feedback suggests the name discourages non-DataTable usage, a future change could re-export it as `useTableController` or `useListController`. Not in scope for this change.
- **Sort UI for grid views**: `SortingState` (`Array<{ id, desc }>`) accommodates dropdown-style sort selectors fine, but we don't ship a `<SortSelect>` composite. Consumers wire a plain `<Select>` themselves (Example 5). Whether to ship one is out of scope.
