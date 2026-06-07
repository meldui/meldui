## ADDED Requirements

### Requirement: Render A2UI v0.9 surfaces as MeldUI components

The renderer SHALL consume A2UI v0.9 messages (`createSurface`, `updateComponents`, `updateDataModel`, `deleteSurface`) via `@a2ui/web_core`'s v0.9 `MessageProcessor` and render each surface's components as the mapped `@meldui/vue` components. It SHALL render the component whose id is `root` as the surface root and resolve child components recursively by id from the flat component model.

#### Scenario: A surface renders from a message sequence

- **WHEN** a `createSurface` (MeldUI `catalogId`) followed by `updateComponents` defining `root` and its children is processed
- **THEN** `<A2UISurface>` renders the `root` component and its descendants using the mapped `@meldui/vue` components

#### Scenario: Unknown component degrades gracefully

- **WHEN** a component references a `type` not present in the MeldUI catalog
- **THEN** the renderer shows a non-fatal fallback (placeholder) and continues rendering the rest of the surface

### Requirement: Fine-grained reactivity bridged from web_core signals

The renderer SHALL bridge `@a2ui/web_core`'s Preact signals into Vue reactivity such that a data-model change re-renders only the components bound to the changed data, not the whole surface. Bridged signal effects SHALL be disposed when their owning scope unmounts.

#### Scenario: Only the affected node updates

- **WHEN** an `updateDataModel` patches a path bound by a single component
- **THEN** only that component re-renders
- **AND** sibling components bound to unchanged paths do not re-render

#### Scenario: No subscription leaks on unmount

- **WHEN** a component or surface is removed (`deleteSurface` or a component delete)
- **THEN** its data-model subscriptions and bridged signal effects are disposed
- **AND** no further re-render is triggered for the removed node

### Requirement: Per-component prop resolution via GenericBinder

The renderer SHALL resolve each component's properties using `@a2ui/web_core`'s `GenericBinder`, supporting literal values, `{path}` data bindings, and `{call,args}` function calls, and SHALL pass the catalog component its resolved property values (not raw Preact signals).

#### Scenario: Bound and function-call props resolve

- **WHEN** a component declares a `{path}`-bound prop and a `{call,args}` function-call prop
- **THEN** the rendered MeldUI component receives the concrete resolved values
- **AND** no Preact signal object is exposed to the catalog component

### Requirement: Catalog maps contract components to @meldui/vue

The renderer SHALL provide a `MELDUI_CATALOG` mapping every component defined by the `a2ui-catalog` contract to a `@meldui/vue` component (or a thin adapter), with prop adapters translating A2UI v0.9 property names to MeldUI prop names. Components absent from the contract SHALL NOT be mapped.

#### Scenario: Catalog covers the contract

- **WHEN** the renderer catalog is compared against the `a2ui-catalog` contract component set
- **THEN** every contract component resolves to a `@meldui/vue` component or adapter
- **AND** `Markdown` resolves to the incremental markdown renderer (`MarkdownViewer`)

### Requirement: Interactive components dispatch client actions

Interactive components (e.g. `Button`, inputs) SHALL send user actions back through the processor as a v0.9 client-action envelope (`{ version: 'v0.9', action }`) that the consuming app can forward to the agent, and SHALL write input changes back to the data model at the bound path.

#### Scenario: Button click dispatches an action

- **WHEN** a mapped `Button` with an `action` is clicked
- **THEN** a `{ version: 'v0.9', action }` envelope is dispatched with the source component id and surface id
- **AND** the envelope's shape matches the A2UI v0.9 client-action contract

#### Scenario: Input writes back to the data model

- **WHEN** a user edits a `{path}`-bound `TextField`
- **THEN** the renderer writes the new value to the data model at that path

### Requirement: Catalog negotiation advertises the MeldUI catalogId

The renderer SHALL advertise the stable MeldUI `catalogId` (from the `a2ui-catalog` contract) so an agent can negotiate and target the MeldUI catalog. `provideA2UI` SHALL accept `catalog`, `theme`, and `catalogId` and make them available to descendant rendered components.

#### Scenario: Client advertises supported catalog

- **WHEN** the renderer is configured via `provideA2UI`
- **THEN** the MeldUI `catalogId` is advertised in `supportedCatalogIds`
- **AND** surfaces created against that `catalogId` render with the MeldUI catalog

### Requirement: MeldUI theming applied to surfaces

The renderer SHALL provide a default A2UI `theme` that binds A2UI theme tokens onto MeldUI's existing OKLCH CSS variables, so rendered surfaces inherit MeldUI light/dark styling without redefining colors.

#### Scenario: Surface inherits MeldUI theme

- **WHEN** a surface renders under the default MeldUI theme
- **THEN** components use MeldUI's OKLCH design tokens
- **AND** toggling light/dark mode restyles the surface accordingly
