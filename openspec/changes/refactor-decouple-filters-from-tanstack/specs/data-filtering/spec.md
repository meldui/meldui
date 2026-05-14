# Spec Delta: data-filtering

## MODIFIED Requirements

### Requirement: DataTable Filter Integration via enableFilter Prop

The `<DataTable>` component SHALL accept an `enableFilter` prop that controls whether filter UI is rendered internally. When `true`, the component SHALL own a `useFilters` instance (hoisted from the toolbar) and forward its aggregated values to `onServerSideChange.filters`. When `false`, the component SHALL not track filter state at all; the parent owns filter state externally and merges it into its own data fetch logic. The component SHALL NOT mirror filter state into TanStack Table's `columnFilters` array under either mode.

#### Scenario: Toolbar mode emits aggregated filter values

- **WHEN** a consumer renders `<DataTable :filter-fields="..." :search-column="q" :enable-filter="true" :on-server-side-change="..."/>` and the user changes a filter
- **THEN** `onServerSideChange` fires once per user action with `filters` reflecting the aggregated `useFilters.filterValues` record (no spurious writes for unchanged fields)
- **AND** `pagination.pageIndex` is reset to `0`
- **AND** TanStack `column.getFilterValue(fieldId)` returns `undefined` for every column (no mirroring)

#### Scenario: External filter mode

- **WHEN** a consumer renders `<DataTable :enable-filter="false" :data="filteredData" :on-server-side-change="..."/>` and provides a separate `<Filters>` component in the parent
- **THEN** DataTable does not instantiate `useFilters` internally
- **AND** `onServerSideChange.filters` is `{}` regardless of any external filter state
- **AND** sorting and pagination changes still trigger `onServerSideChange`
- **AND** the parent is responsible for resetting pagination on filter change via `dataTableRef.value.resetPagination()`

#### Scenario: Initial filters seed the internal composable directly

- **WHEN** a consumer renders `<DataTable :enable-filter="true" :initial-filters="parsedFromUrl" :filter-fields="...">` after a page refresh
- **THEN** the hoisted `useFilters` instance is constructed with `initialValues: parsedFromUrl`
- **AND** filter pills render from those values without any intermediate TanStack hydration step
- **AND** the first `onServerSideChange` carries those values in `filters`

#### Scenario: Filter state is exposed to advanced consumers

- **WHEN** `<DataTable :enable-filter="true">` is mounted
- **THEN** the component's `defineExpose` value includes `filtersState` (the `useFilters` return object)
- **AND** consumers MAY call `dataTableRef.value.filtersState.addFilter('...')`, `resetAll()`, etc., to drive filters imperatively

### Requirement: Filter Plugin Compatibility

The `defineFilter` plugin API SHALL continue to register custom filter types usable in both `<Filters>` standalone and `<DataTable>` (any `enableFilter` mode). The `FilterPluginComponentProps` contract SHALL exclude `column` — plugin filters MUST receive their state via `initialValue` and emit changes via `valueChange`, identical to built-in filters. Plugin filters SHALL NOT rely on TanStack `column.getFilterValue()` or `column.getIsFiltered()` for filter state, because filter state is no longer mirrored to TanStack columns.

#### Scenario: Plugin filter receives custom field props without a column resolver

- **WHEN** a custom filter is registered via `defineFilter({ type: 'currency', component, ... })` and a field declares `{ id: 'price', type: 'currency', currency: 'USD' }`
- **THEN** the rendered plugin component receives `currency: 'USD'` along with the standard `title`, `placeholder`, `icon`, `defaultOpen`, `openTrigger`, `advancedMode`, `defaultOperator`, `availableOperators`, and `initialValue` props
- **AND** the props do NOT include a `column` reference
- **AND** value changes flow through the same `valueChange` event and aggregation pipeline as built-in filters

## REMOVED Requirements

### Requirement: `<Filters>` getColumn Prop

**Reason**: With filter state owned solely by `useFilters` and never mirrored to TanStack `columnFilters`, the `getColumn` resolver returns columns whose filter accessors always return undefined. Keeping the prop would actively mislead plugin authors. Plugins MUST use the `initialValue` + `valueChange` pattern (which built-in filters already use exclusively).

**Migration**: Plugin filters that previously read `column.getFilterValue()` MUST switch to accepting an `initialValue` prop and emitting `valueChange`. No in-repo plugin uses `getColumn`; impact is bounded to third-party plugins.
