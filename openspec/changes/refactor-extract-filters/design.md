# Design: Extract Filter System from DataTable

## Context

The filter system in `packages/vue/src/composites/data-table/` powers a feature-rich filter UX (8 built-in types, advanced-mode operator support, multi-instance per field, plugin extensibility, URL state restoration). It is currently bound to TanStack Table's `Column` API in three places:

1. `DataTableToolbar.vue` calls `props.table.getColumn(fieldId)?.setFilterValue(...)` to write aggregated values.
2. `DataTableToolbar.vue` calls `props.table.getState().columnFilters` on mount to seed UI cards from URL state.
3. `MultiSelectFilter.vue` reads `column.getFilterValue()` / `column.getFacetedUniqueValues()` and writes via `column.setFilterValue()` directly.

7 of 8 per-type filter components are already pure value-in/value-out (they emit `valueChange` and never read the column). The plugin protocol is also already value-in/value-out.

Stakeholders want the same filter UX usable from grid/card/list views over the same dataset, without breaking the existing DataTable API.

## Goals / Non-Goals

**Goals**

- Single filter implementation usable from any view via a standalone `<Filters>` component and a `useFilters` composable.
- Full backwards compatibility for existing `<DataTable>` consumers.
- Decouple `MultiSelectFilter` from TanStack so all 8 built-in filters share one shape.
- Preserve current toolbar layout and slot semantics (`toolbar-end` → `#right`).
- Search input is part of `<Filters>` (single event surface for parents).
- Plugin API (`defineFilter`, `FilterPluginComponentProps`) unchanged.

**Non-Goals**

- No client-side filter evaluator. Parent applies filter values to data (typically server-side).
- No new filter types or operators.
- No grid/card/list view component is shipped here — only the filter that any view can consume.
- No changes to operator semantics, advanced-mode rules, or per-type value shapes.

## Decisions

### Decision 1: Composable + component, not a single component with v-model

**What:** Introduce both `useFilters` (state owner) and `<Filters>` (renderer). `<Filters>` instantiates `useFilters` internally when used standalone, or accepts an external `state` prop for advanced wiring.

**Why:** The composable mirrors the existing `usePinnedColumns.ts` pattern. It lets parents read/imperatively manipulate filter state (e.g., for URL persistence, bulk programmatic resets) without subclassing the component. The component remains ergonomic for the simple case.

**Alternatives considered:**

- Single component with `v-model:filters`: simpler API, but parents needing imperative access (`addFilter('status')` from a button outside `<Filters>`) cannot reach in.
- Renderless / slot-based: maximum flexibility but high boilerplate at every call site; rejected as over-engineered.

### Decision 2: New top-level composite `composites/filters/`, not a sub-export of `data-table/`

**What:** Move all filter primitives, plugin registry, types, and operator helpers to a new `composites/filters/` directory. Keep re-exports at original paths for BC.

**Why:** The filter system is conceptually independent of the table now. Co-locating it under `data-table/` would advertise it as table-internal and confuse consumers building grid/card views. A separate npm package was rejected (heavier process; cross-package versioning friction).

### Decision 3: `enableFilter` prop with default `true`

**What:** Add a new boolean prop to `<DataTable>` and `useDataTable` that gates internal filter UI. Default `true` preserves all existing behavior. `false` lets parents own filter state externally and feed pre-filtered `data`.

**Why:** The existing `showToolbar` prop is too coarse — it kills bulk actions and view-options too. `enableFilter` is the right granularity for the bring-your-own-filter pattern.

**Alternatives considered:**

- Auto-detect via filter slot presence: brittle and surprising.
- Always require external filter: clean break, rejected for BC.

### Decision 4: One-direction sync between `<Filters>` and TanStack `columnFilters` in BC mode

**What:** When `enableFilter: true`, the toolbar's internal `useFilters` writes aggregated values to TanStack via `setFilterValue()` whenever a filter changes. The reverse direction (TanStack → `useFilters`) happens only once on mount, to seed UI cards from `initialFilters` for URL state restoration.

**Why:** Bidirectional reactive sync would create feedback loops (a filter change writes to TanStack, which would re-trigger the seeder, which would replace state). The one-mount-only seed mirrors the existing `initializeFiltersFromTableState` (`DataTableToolbar.vue:99`) behavior and is the safest port.

### Decision 5: Decouple, don't build parallel

**What:** Refactor the existing implementation in place rather than building a second, independent filter system.

**Why:** A parallel implementation duplicates ~1500 LOC of filter components and operator logic, requires plugin authors to register twice, and inevitably drifts in UX over time. Filter bugs would have to be fixed twice. The risks of in-place refactoring (BC sync correctness, MultiSelect surgery) are bounded and testable; the risks of a parallel system compound forever.

## Risks / Trade-offs

| Risk                                                                                                      | Mitigation                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Two-way sync feedback loop between `<Filters>` and TanStack `columnFilters` in BC mode                    | Strict one-direction reactive sync (Filters → TanStack). Mount-time seed is a single non-reactive read.                                                                                                    |
| `initialFilters` URL restoration breaks during refactor                                                   | Preserve current path verbatim: parent → `useDataTable` → seed → on-mount read into instances. Verify against existing Filters.stories.ts URL-state test cases.                                            |
| Plugin filter `v-bind="instance.field"` spread (`DataTableToolbar.vue:637`) breaks during component split | Port the spread verbatim into `<Filters>`; add a Storybook story with a custom plugin filter that exercises a custom prop.                                                                                 |
| MultiSelectFilter behavior diverges after read/write decoupling                                           | Refactor in two steps: drop facet UI first (no behavior change in practice), then swap read/write in a separate commit. Manual verification of select/deselect/clear in both simple and advanced contexts. |
| Existing imports break across consumer apps                                                               | Keep all old import paths working via re-export shims at the original file paths.                                                                                                                          |
| Storybook stories flake on the refactor                                                                   | Run the existing Filters/Selection/Customization stories before merging; no story should require modification for the BC path.                                                                             |

## Migration Plan

1. **Phase 1 — Move (no behavior change):** Move filter primitives, plugins, operators, icons, and filter-related types to `composites/filters/`. Add re-exports at old paths. All existing imports continue to work.
2. **Phase 2 — MultiSelectFilter refactor:** Drop facet count UI. Replace column reads/writes with `initialValue` prop and `valueChange` emit. Update toolbar to pass `initialValue` like the other 7 filters.
3. **Phase 3 — Build composable + component:** Create `useFilters` (port toolbar logic) and `<Filters>` (port toolbar render block). Both use the moved filter primitives.
4. **Phase 4 — Wire DataTable:** Add `enableFilter` prop. Replace inline filter render in `DataTableToolbar.vue` with `<Filters>` when `enableFilter: true`. Verify all existing stories pass.
5. **Phase 5 — Public exports + Storybook:** Add `Filters`, `useFilters` to `packages/vue/src/index.ts`. Create `Standalone.stories.ts` showing use without DataTable.
6. **Phase 6 — Verification + changeset:** Build, lint, manual UI verification, changeset (minor bump).

**Rollback:** Each phase is a separate commit. Phases 1, 2, 3, 5, 6 are independently reversible. Phase 4 (DataTable wiring) is the only one that changes runtime behavior of existing consumers; if a regression appears, revert Phase 4 to restore the inline toolbar render path while keeping the new standalone `<Filters>` exposed.

## Open Questions

None at planning time. Layout, BC strategy, search placement, and MultiSelectFilter fate were resolved with the requesting user before scaffolding this proposal.
