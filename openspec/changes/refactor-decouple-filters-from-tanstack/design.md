# Design: Decouple Filter State from TanStack `columnFilters`

## Context

`refactor-extract-filters` introduced `<Filters>` and `useFilters` as a standalone composite, but kept a one-direction sync from `useFilters` into TanStack's `columnFilters` (Decision 4 of that change's design). The reason given at the time was BC: rather than rewire `useDataTable`, the refactor punted state through TanStack so the existing `useDataTable → onServerSideChange` watcher pipeline kept working unchanged.

Now that the extraction has settled and the system has been validated end-to-end, the round-trip is the right next thing to remove. It causes spurious writes (every aggregation produces new array references, so the toolbar's reference-equality check trips on every field), splits the source of truth, and forces `useDataTable` to know about filters when it shouldn't.

The codebase uses **server-side filtering only**: `useDataTable.ts:200` sets `manualFiltering: true`. TanStack's `columnFilters` does not drive any row filtering — it is purely a state container that triggers `onColumnFiltersChange`. Removing the round-trip leaves TanStack's filter state permanently empty, which is fine because nothing reads it.

## Goals / Non-Goals

**Goals**

- `useFilters` is the single source of truth for filter state.
- TanStack `columnFilters` is never written to or read from in the data-table pipeline.
- `useDataTable` becomes filter-agnostic.
- Public API surface (`onServerSideChange.filters` shape, `initialFilters` shape, `enableFilter` semantics) is preserved.
- Pagination reset on filter change is preserved.

**Non-Goals**

- No new filter capability or operator.
- No change to the `<Filters>`/`useFilters` public surface (props, emits, return shape) beyond removing `getColumn`.
- No client-side filtering. We commit to server-side-only and remove all coupling that existed to support a hypothetical client-side mode.
- No re-export shims for the prior refactor's moved files (separate concern).

## Decisions

### Decision 1: Hoist `useFilters` from `DataTableToolbar` to `DataTable`

**What:** `<DataTable>` instantiates `useFilters` directly in its own setup when `enableFilter: true`. The toolbar receives the state via a `:filtersState` prop and forwards it to `<Filters :state>`.

**Why:** DataTable owns the source of truth for `onServerSideChange` already (sorting, pagination). With filter state needing to flow into the same callback, it's cleanest to hoist it to the same level. The toolbar becomes a pure renderer that doesn't own any filter state of its own.

**Alternatives considered:**

- Toolbar continues to own `useFilters`, exposes via `defineExpose`, DataTable reaches in. Rejected — fragile timing, less clear ownership.
- DataTable doesn't own it; instead a custom event bubbles up from toolbar. Rejected — adds an event surface for what's just a state share.

### Decision 2: Pagination reset moves from implicit (TanStack side-effect) to explicit (DataTable watcher)

**What:** When `enableFilter: true`, DataTable adds a watcher on `filtersState.filterValues`. On change, sets `pagination.pageIndex = 0` (via the existing `useDataTable` mutator).

**Why:** Today this is implicit in `useDataTable.ts:121` inside `onColumnFiltersChange`. With `columnFilters` going away, the reset has to happen explicitly. A single watcher in DataTable.vue is the right place.

**Behavior trade-off:** When `enableFilter: false`, the parent must reset pagination themselves on filter change (via `dataTableRef.value.resetPagination()`). This is a small migration burden but matches the "DataTable knows nothing about external filters" model. Documented in the `DataTableExternalFilters` story.

### Decision 3: `useDataTable` becomes filter-agnostic with an optional `filters` getter

**What:** `useDataTable` accepts an optional `filters?: () => DataTableFilterState` option. The `onServerSideChange` watcher invokes it (or returns `{}` if absent) when emitting. `columnFilters`, `onColumnFiltersChange`, `columnFiltersAsRecord`, and the `initialFilters` array conversion all go away.

**Why:** Keeps `useDataTable` focused on table-instance state (sorting, pagination, selection, pinning, sizing, expansion). Filters are injected from outside, by reference. The getter form avoids the watcher needing direct knowledge of the filter type.

**Alternatives considered:**

- Pass a `Ref<DataTableFilterState>` instead of a getter. Equivalent functionally; the getter is one fewer indirection at the call site since the caller can pass `() => filtersState.filterValues.value`.
- Subscribe via callback (parent calls `useDataTable.notifyFiltersChanged()`). Rejected as more imperative than the reactive Vue idiom.

### Decision 4: Drop `<Filters>`'s `getColumn` prop

**What:** Remove the `getColumn?: (fieldId: string) => Column<TData, unknown> | undefined` prop. This is a breaking change for third-party plugin filters that read column-scoped TanStack state.

**Why:** With `columnFilters` permanently empty, the resolver returns a column object whose filter accessors (`getFilterValue`, `getIsFiltered`) always return undefined. Keeping the prop would actively mislead plugin authors. Built-in filters already use `initialValue` + `valueChange` exclusively, so the migration path is clear: plugins should accept `initialValue` and emit `valueChange` like every built-in filter.

**Alternatives considered:**

- Keep the prop and have `getColumn` return a column-shaped wrapper that reads from `useFilters.filterValues`. Rejected — papers over the architecture change with a fake TanStack column.
- Replace with a `getInstanceValue: (fieldId: string) => FilterValue | undefined` resolver. Rejected — `useFilters` already exposes this; plugins should use `initialValue` instead.

### Decision 5: `enableFilter: false` keeps the existing two-event-surfaces pattern

**What:** When `enableFilter: false`, DataTable does not emit filter changes through `onServerSideChange`. The parent's external `<Filters>` (or `useFilters`) is the filter event surface. Parent merges filter values into its own data fetch and calls `dataTableRef.value.resetPagination()` if needed.

**Why:** This is what the `DataTableExternalFilters` story already does (`Standalone.stories.ts:518-524`). DataTable should not need to know about external filter state to fire its callback. Adding a `:filterState` prop that DataTable would subscribe to was considered as a convenience — rejected because it leaks DataTable awareness into the external case and adds API surface for what amounts to a one-line merge in the parent.

## Risks / Trade-offs

| Risk                                                                               | Mitigation                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plugin filters using `getColumn` to read TanStack column-scoped filter state break | Documented breaking change; migration is one-line (accept `initialValue`, emit `valueChange`). No in-repo plugin uses this; impact bounded to third-party.                                                          |
| Pagination reset behavior diverges between `enableFilter: true/false`              | Document explicitly in the `DataTableExternalFilters` story. `enableFilter: true` resets automatically (preserving today's behavior); `false` requires the parent to call `resetPagination()`.                      |
| Hoisting `useFilters` to DataTable changes setup ordering                          | Vue setup is synchronous and DataTable setup runs before its template (which contains the toolbar). The hoist is strictly safer than the previous mount-time IIFE in the toolbar.                                   |
| `initialFilters` URL-state restoration breaks                                      | The new path (`initialFilters` → `useFilters.initialValues` → `seedFromInitialValues()`) is shorter and uses the same `seedFromInitialValues` already shipped. Verify against existing `InitialFilters.stories.ts`. |
| `defineExpose` shape of `<DataTable>` changes (adds `filtersState`)                | Additive only. Existing exposed members (`tableState`, `keyboardState`) unchanged.                                                                                                                                  |

## Migration Plan

1. **Phase 1 — Hoist:** Move `useFilters` instantiation from `DataTableToolbar.vue` into `DataTable.vue`. Add `:filtersState` prop on the toolbar. Verify all existing toolbar stories pass before continuing.
2. **Phase 2 — Decouple `useDataTable`:** Add the optional `filters: () => DataTableFilterState` option. Remove `columnFilters` ref, `onColumnFiltersChange`, `columnFiltersAsRecord`, and the `initialFilters` array conversion. `<DataTable>` passes `() => filtersState?.filterValues.value ?? {}` as the getter.
3. **Phase 3 — Pagination reset watcher:** Add the `filterValues` watcher in DataTable.vue (when `enableFilter: true`) that sets `pagination.pageIndex = 0`.
4. **Phase 4 — Remove TanStack writes:** Delete the toolbar watchers that called `setFilterValue`. Delete the mount-time IIFE that read `columnFilters`. The `initialFilters` prop now flows straight to `useFilters.initialValues`.
5. **Phase 5 — Drop `getColumn`:** Remove the prop from `<Filters>` and the resolver wiring in the toolbar.
6. **Phase 6 — Stories:** Simplify the `DataTableExternalFilters` story to demonstrate the cleaner two-event-surfaces pattern (call `resetPagination()` explicitly on filter change). Verify URL-state restoration via `InitialFilters` stories. Verify `WithPluginFilter` story.
7. **Phase 7 — Verification:** Build, typecheck, manual UI checks, changeset (minor bump — public API additions and the `getColumn` removal).

**Rollback:** Each phase is a separate commit. Phase 1 and 2 are the load-bearing rewires; phases 3–6 are independently reversible. If a regression appears, revert phase 2 to restore the round-trip while keeping the hoist.

## Open Questions

None at planning time. The user explicitly chose "server-side-only with `enableFilter` toolbar opt-in" before scaffolding this proposal.
