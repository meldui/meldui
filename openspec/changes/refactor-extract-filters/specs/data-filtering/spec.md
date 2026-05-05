# Spec Delta: data-filtering

## ADDED Requirements

### Requirement: Standalone Filter State Composable

The system SHALL provide a `useFilters` composable that manages filter UI state (instances, aggregated values, search) independently of any view component, with no dependency on the TanStack Table `Column` API.

#### Scenario: Composable owns filter state without a table

- **WHEN** a consumer calls `useFilters({ filterFields, filterPlugins, advancedMode })` outside of any `<DataTable>` context
- **THEN** the composable returns reactive `filterInstances`, `filterValues` (a `Record<fieldId, FilterInstanceValue>`), `searchValue`, `isFiltered`, and imperative methods `addFilter`, `removeInstance`, `setInstanceValue`, `resetAll`
- **AND** mutating filters via the imperative methods updates `filterValues` reactively

#### Scenario: Multi-instance aggregation per field

- **WHEN** the consumer adds two text filter instances for field `name` with values `"john"` and `"jane"`
- **THEN** `filterValues.name` equals `["john", "jane"]` in simple mode
- **AND** equals `[{ operator: "contains", value: "john" }, { operator: "contains", value: "jane" }]` in advanced mode

#### Scenario: Initial values seed instances

- **WHEN** `useFilters` is called with `initialValues: { status: "active", name: ["john"] }`
- **THEN** the composable creates one filter instance for `status` with value `"active"`
- **AND** one filter instance for `name` with value `"john"`
- **AND** `filterValues` reflects the seeded values immediately on initialization

### Requirement: Standalone Filters Component

The system SHALL provide a `<Filters>` component that renders the filter UI (search input, filter pills, add-filter command, reset button) and is usable without any `<DataTable>` instance.

#### Scenario: Standalone usage with internal state

- **WHEN** a consumer renders `<Filters :fields="filterFields" />` without a `state` prop
- **THEN** the component instantiates its own `useFilters` internally
- **AND** emits `change [{ filterValues, searchValue }]` whenever a filter is added, removed, or modified

#### Scenario: External composable wiring

- **WHEN** a consumer instantiates `useFilters(...)` in the parent and passes the result as `<Filters :state="filtersState" />`
- **THEN** the component renders against the parent's composable state
- **AND** the parent retains imperative access to `addFilter`, `removeInstance`, etc.

#### Scenario: Right slot for host content

- **WHEN** a consumer provides a `#right` slot to `<Filters>`
- **THEN** the slot content renders after the filter pills, in the position equivalent to today's DataTable toolbar `toolbar-end` slot

### Requirement: Per-Type Filter Components Are Pure

All built-in per-type filter components (`TextFilter`, `NumberFilter`, `DateFilter`, `SelectFilter`, `BooleanFilter`, `MultiSelectFilter`, `RangeFilter`, `DateRangeFilter`) SHALL receive their state via `initialValue` prop and emit changes via `valueChange`. They SHALL NOT read from or write to a TanStack Table `Column` instance directly.

#### Scenario: Filter emits changes without touching table state

- **WHEN** any built-in filter component is rendered with an `initialValue` and the user changes its value
- **THEN** the component emits `valueChange` with the new value
- **AND** does not call `column.setFilterValue` or `column.getFilterValue` on any prop-supplied column

#### Scenario: MultiSelectFilter no longer renders facet counts

- **WHEN** `MultiSelectFilter` is rendered with options
- **THEN** option rows show only icon, checkbox, and label
- **AND** no count badge or numeric annotation derived from `getFacetedUniqueValues` is shown

### Requirement: DataTable Filter Integration via enableFilter Prop

The `<DataTable>` component SHALL accept an `enableFilter` prop (default `true`) that controls whether filter UI is rendered internally. When `true`, the component SHALL preserve all pre-existing filter behavior including `filterFields`, `filterPlugins`, `searchColumn`, `initialFilters`, `advancedMode`, and the `onServerSideChange({ filters, sorting, pagination })` callback contract.

#### Scenario: Default behavior is unchanged

- **WHEN** an existing consumer renders `<DataTable :filter-fields="..." :search-column="q" :on-server-side-change="..."/>` without specifying `enableFilter`
- **THEN** the toolbar renders search, filter pills, add-filter, reset, and the `toolbar-end` slot exactly as before
- **AND** `onServerSideChange` fires with `filters` reflecting the aggregated `columnFilters` whenever a filter changes

#### Scenario: External filter mode

- **WHEN** a consumer renders `<DataTable :enable-filter="false" :data="filteredData"/>` and provides a separate `<Filters>` component in the parent
- **THEN** DataTable renders no search or filter pills inside its toolbar
- **AND** sorting and pagination changes still emit through `onServerSideChange`
- **AND** the parent is responsible for applying the filter values to produce `filteredData`

### Requirement: Filter Plugin Compatibility

The `defineFilter` plugin API SHALL continue to register custom filter types usable in both `<Filters>` standalone and `<DataTable>` (any `enableFilter` mode), with no changes to the `FilterPluginComponentProps` contract.

#### Scenario: Plugin filter receives custom field props

- **WHEN** a custom filter is registered via `defineFilter({ type: 'currency', component, ... })` and a field declares `{ id: 'price', type: 'currency', currency: 'USD' }`
- **THEN** the rendered plugin component receives `currency: 'USD'` along with the standard `column`, `title`, `placeholder`, `icon`, `defaultOpen`, `openTrigger`, `advancedMode`, `defaultOperator`, `availableOperators`, and `initialValue` props
- **AND** value changes flow through the same `valueChange` event and aggregation pipeline as built-in filters

### Requirement: Search Input as Part of Filters

The `<Filters>` component SHALL render an optional debounced search input when a `searchField` prop is provided. The search value SHALL flow through the same change event surface as filter values.

#### Scenario: Search input renders and debounces

- **WHEN** `<Filters :search-field="{ id: 'q', placeholder: 'Search...' }" />` is rendered and the user types
- **THEN** the input renders to the left of the filter pills
- **AND** `change` emits at most once per 300 ms (or the configured `debounceMs`) with the latest `searchValue`

### Requirement: Filter State Restoration

The `useFilters` composable SHALL accept `initialValues` and `initialSearch` to restore filter state on mount, supporting URL-driven state restoration.

#### Scenario: URL state restoration via DataTable

- **WHEN** a consumer renders `<DataTable :initial-filters="parsedFromUrl" />` after a page refresh
- **THEN** the toolbar's internal `useFilters` seeds filter instances from the parsed values on mount
- **AND** the rendered filter pills reflect those values without requiring user interaction
