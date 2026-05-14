# Tasks: Extract Filter System from DataTable

## 1. Move Filter Primitives to composites/filters/

- [ ] 1.1 Create `packages/vue/src/composites/filters/filters/` directory.
- [ ] 1.2 Move `BooleanFilter.vue`, `DateFilter.vue`, `DateRangeFilter.vue`, `MultiSelectFilter.vue`, `NumberFilter.vue`, `RangeFilter.vue`, `SelectFilter.vue`, `TextFilter.vue` from `composites/data-table/filters/` to `composites/filters/filters/`.
- [ ] 1.3 Move `filter-icons.ts`, `operators.ts`, `index.ts` from `composites/data-table/filters/` to `composites/filters/filters/`.
- [ ] 1.4 Move `filterPlugins.ts` from `composites/data-table/` to `composites/filters/`.
- [ ] 1.5 Split `composites/data-table/types.ts`: filter-related types (FilterType, FilterOperator unions, FilterWithOperator, SimpleFilterValue, AdvancedFilterValue, FilterInstanceValue, FilterValue, type guards/maps) move to `composites/filters/types.ts`. Table-only types (BulkActionOption, ColumnPinningState re-export, DataTablePinningConfig, ServerFilterValue, ServerSideTableParams, ServerSideTableResponse) stay in `data-table/types.ts`.
- [ ] 1.6 Update all internal imports inside the moved files to use relative paths within `composites/filters/`.
- [ ] 1.7 Add re-export shims at the original paths in `composites/data-table/` so all existing import specifiers (e.g. `from './filters/TextFilter.vue'`) keep working.
- [ ] 1.8 Run `pnpm --filter @meldui/vue build` to confirm no broken imports.

## 2. Refactor MultiSelectFilter to Pure Value-In/Value-Out

- [ ] 2.1 Remove `facets` computed and the `<span v-if="facets?.get(option.value)">` count badge from `MultiSelectFilter.vue`.
- [ ] 2.2 Add `initialValue?: string[]` prop.
- [ ] 2.3 Replace `column.getFilterValue()` reads with an `appliedValue` ref seeded from `initialValue`, mirroring `SelectFilter.vue`.
- [ ] 2.4 Replace `column.setFilterValue(...)` writes with `emit('valueChange', ...)` only.
- [ ] 2.5 Update `DataTableToolbar.vue` to pass `:initial-value="instanceValues.get(instance.instanceId)"` to `<MultiSelectFilter>` like the other 7 filters.
- [ ] 2.6 Verify in Storybook: select/deselect, badge rendering, clear-all, and no count numbers visible.

## 3. Build useFilters Composable

- [ ] 3.1 Create `packages/vue/src/composites/filters/useFilters.ts`.
- [ ] 3.2 Port `filterInstances` ref + `instanceValues` Map (toolbar lines 89-91).
- [ ] 3.3 Port `addFilter`, `removeFilterInstance`, `handleInstanceValueChange`, `handleInstanceClose` (toolbar lines 257-301).
- [ ] 3.4 Port `aggregateAndSetColumnFilter` logic (toolbar lines 308-371) but expose the aggregated value through a `filterValues` computed instead of writing to a TanStack column.
- [ ] 3.5 Port `supportsMultiInstance` (toolbar lines 234-254).
- [ ] 3.6 Port `searchInputValue` + 300ms debounce (toolbar lines 200-229) into the composable; expose `searchValue: Ref<string | undefined>` and accept `searchField?: { id, placeholder?, debounceMs? }` option.
- [ ] 3.7 Port `initializeFiltersFromTableState` (toolbar lines 99-190) as `seedFromInitialValues(values: Record<string, FilterInstanceValue>)`. Call once on composable initialization if `initialValues` is provided.
- [ ] 3.8 Expose `isFiltered` computed and `resetAll()` method.
- [ ] 3.9 Add `getFacetCounts?: (fieldId: string) => Map<string, number> | undefined` option (forward-looking; not consumed by built-in filters today).

## 4. Build Standalone Filters Component

- [ ] 4.1 Create `packages/vue/src/composites/filters/Filters.vue`.
- [ ] 4.2 Define props: `fields: DataTableFilterField[]`, `plugins?: RegisteredFilterPlugin[]`, `advancedMode?: boolean`, `searchField?: { id, placeholder?, debounceMs? }`, `initialValues?: Record<string, FilterInstanceValue>`, `loading?: boolean`, `state?: ReturnType<typeof useFilters>`.
- [ ] 4.3 If `state` prop omitted, instantiate `useFilters` internally with prop values.
- [ ] 4.4 Render search input, dynamic filter pills (port toolbar render block lines 432-668 — built-in switch + plugin component path), `DataTableFilterCommand` for the add-filter picker, reset button.
- [ ] 4.5 Expose `#right` slot rendered after filter content (mirrors today's `toolbar-end` slot).
- [ ] 4.6 Define emits: `update:filterValues`, `update:searchValue`, `change [{ filterValues, searchValue }]`, `reset`.
- [ ] 4.7 Ensure the plugin path preserves `v-bind="instance.field"` semantics so custom field props propagate.

## 5. Wire enableFilter into DataTable

- [ ] 5.1 Add `enableFilter?: boolean` prop (default `true`) to `DataTable.vue` and `useDataTable.ts`.
- [ ] 5.2 In `DataTableToolbar.vue`, when `enableFilter: true`, replace the inline filter render (lines 458-645) with `<Filters>`. Subscribe to the composable's filter changes and write aggregated values to TanStack `columnFilters` via `table.getColumn(fieldId)?.setFilterValue(...)` to preserve the existing `onServerSideChange` callback contract.
- [ ] 5.3 When `enableFilter: false`, render only `toolbar-start` slot, search (if provided), bulk-actions, refresh, view-options, and `toolbar-end` — no filter UI.
- [ ] 5.4 Preserve `initialFilters` URL restoration: pass DataTable's seed to the internal composable as `initialValues` derived from `table.getState().columnFilters`.
- [ ] 5.5 Verify all existing DataTable Storybook stories (Filters, Selection, Customization) behave identically.

## 6. Public Exports + Storybook

- [ ] 6.1 Add `Filters`, `useFilters` exports to `packages/vue/src/index.ts`.
- [ ] 6.2 Add `apps/vue-storybook/src/stories/Components/Filters/Standalone.stories.ts` covering simple mode, advanced mode, with/without search, with a plugin filter, multi-instance, and reset.
- [ ] 6.3 Add a story showing `<DataTable :enable-filter="false">` with external `<Filters>` driving `data` (parent owns state).

## 7. Verification

- [ ] 7.1 `pnpm --filter @meldui/vue build` (clean type check + bundle).
- [ ] 7.2 `pnpm check:fix` (Biome lint + format).
- [ ] 7.3 `pnpm storybook:vue` and exercise: existing DataTable filter stories, new standalone Filters story, `enableFilter:false` story, URL state restoration via `initialFilters`, MultiSelectFilter without count badges, plugin filter prop spread.
- [ ] 7.4 `pnpm changeset` — minor bump for `@meldui/vue` describing public API additions and the `MultiSelectFilter` facet UI removal (BC-safe internal refactor).
