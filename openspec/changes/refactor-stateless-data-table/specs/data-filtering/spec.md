## ADDED Requirements

### Requirement: Filters Controlled FilterValues V-Model

`<Filters>` SHALL accept a `filterValues?: DataTableFilterState` prop as a controlled v-model target. When this prop is provided and its value changes from outside the component, the internal `useFilters` instance MUST reactively rebuild `filterInstances` and `instanceValues` to match the supplied record. The component SHALL continue to emit `update:filterValues` whenever user interaction changes the aggregated value, completing the v-model contract.

When the parent supplies the existing `state` prop (a pre-instantiated `UseFiltersReturn` for advanced wiring) the `filterValues` prop SHALL be ignored — explicit state ownership takes precedence over controlled v-model.

#### Scenario: Parent mutates ref, chips update to match

- **GIVEN** `<Filters v-model:filterValues="filters" :fields="fields">` is rendered with two active filter chips
- **WHEN** the parent imperatively sets `filters.value = {}`
- **THEN** both chips are removed from the rendered UI on the next reactivity tick
- **AND** the component does not emit `update:filterValues` as a result of the parent's mutation

#### Scenario: User edits chip, parent ref receives update

- **GIVEN** the parent has bound `v-model:filterValues` to a ref
- **WHEN** the user changes a filter chip value
- **THEN** the component emits `update:filterValues` with the new aggregated `DataTableFilterState`
- **AND** Vue's v-model machinery updates the parent's ref to match

#### Scenario: External `state` prop overrides controlled binding

- **GIVEN** a parent passes both `:state="myUseFiltersInstance"` and `v-model:filterValues="filters"`
- **THEN** the component uses `myUseFiltersInstance` exclusively as its source of truth
- **AND** mutations to the `filters` ref are not reflected in the rendered UI

#### Scenario: No feedback loop when emitted value is echoed back

- **GIVEN** the parent has bound `v-model:filterValues="filters"`
- **WHEN** the user changes a chip, the component emits `update:filterValues`, and the parent updates the ref to that new value
- **THEN** the component does not rebuild instances from its own just-emitted value (no chip flicker or infinite loop)
