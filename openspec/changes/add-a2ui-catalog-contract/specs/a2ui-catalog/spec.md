## ADDED Requirements

### Requirement: Stable catalog identity and versioning

The MeldUI A2UI catalog SHALL be identified by a single stable, versioned `catalogId` URI defined in exactly one location and referenced everywhere it is needed. The `catalogId` SHALL include an explicit version segment so future incompatible catalog revisions receive a new id rather than mutating the existing one.

#### Scenario: Catalog declares a versioned id

- **WHEN** the generated `meldui-v1.catalog.json` is inspected
- **THEN** its top-level `catalogId` is a versioned URI (e.g. `https://meldui.dev/catalogs/vue/v1/catalog.json`)
- **AND** the same id value is sourced from a single shared constant, not duplicated literals

#### Scenario: New catalog version gets a new id

- **WHEN** a future change introduces incompatible component schema revisions
- **THEN** a new versioned `catalogId` (e.g. `.../v2/catalog.json`) is issued
- **AND** the `v1` id and artifact remain unchanged

### Requirement: Valid A2UI v0.9 catalog document

The catalog SHALL be a JSON document that validates against the A2UI v0.9 catalog meta-schema, containing at least `catalogId` and `components`, and optionally `functions` and `theme`. Component property schemas SHALL conform to A2UI v0.9 conventions: the flat `component` discriminator, plain-JSON data values, and JSON Pointer data binding (no v0.8 wrapped-key or adjacency-list shapes).

#### Scenario: Catalog validates against the meta-schema

- **WHEN** the generated catalog is validated against the A2UI v0.9 catalog meta-schema
- **THEN** validation passes with no errors
- **AND** every component entry parses as a well-formed JSON Schema

#### Scenario: Component schemas use v0.9 property conventions

- **WHEN** a component definition is inspected (e.g. `Button`, `Row`, `TextField`)
- **THEN** it uses v0.9 property names (e.g. `variant` not `primary`, `justify`/`align` not `distribution`/`alignment`, `value` not `text` for `TextField`, `min`/`max` for `Slider`)
- **AND** no v0.8-only constructs (wrapped `{"component":{"Type":...}}`, adjacency-list data) appear

### Requirement: Component coverage

The catalog SHALL define schemas for the agreed component set, organized as a single advertised catalog. It SHALL include the A2UI Basic primitives, MeldUI structural and display components, and the rich components, and SHALL NOT include `DataTable`.

The included components are:

- **Basic primitives:** `Row`, `Column`, `List`, `Card`, `Modal`, `Tabs`, `Text`, `Image`, `Icon`, `Divider`, `Button`, `TextField`, `CheckBox`, `Slider`, `ChoicePicker`, `DateTimeInput`.
- **Structural & display:** `Avatar`, `AvatarGroup`, `Kbd`, `Alert`, `Badge`, `Stepper`, `ButtonGroup`, `Carousel`, `ToggleGroup`, `Accordion`, `ScrollArea`, `Separator`, `Table`.
- **Rich:** `Markdown`, `Timeline`, `Sidebar`, `Combobox`, `MultiSelect`, `Chart`.

#### Scenario: All agreed components are present

- **WHEN** the catalog's `components` keys are listed
- **THEN** every component named in this requirement is present
- **AND** `DataTable` is absent

#### Scenario: Markdown is defined as the primary text path

- **WHEN** the `Markdown` component schema is inspected
- **THEN** it accepts streamed/partial markdown content (no requirement that input be complete/well-formed markdown)

### Requirement: Ecosystem interop via Basic primitive names

The catalog SHALL declare the A2UI Basic primitives under their exact A2UI spec names so an agent already targeting the A2UI "basic" catalog can render against the MeldUI catalog without renaming components. MeldUI-specific components SHALL extend the same catalog as a superset under the same `catalogId`.

#### Scenario: Basic primitive names match the spec

- **WHEN** an agent emits `createSurface`/`updateComponents` using A2UI basic component names (e.g. `Row`, `Column`, `Card`, `Text`, `Button`)
- **THEN** each name resolves to a defined component in the MeldUI catalog
- **AND** all components (basic and MeldUI-specific) are advertised under a single `catalogId`

### Requirement: Single-source-of-truth generation

The published `meldui-v1.catalog.json` SHALL be generated from co-located per-component schema definitions by a codegen script, and the committed artifact SHALL stay in sync with those definitions. A check SHALL fail if the committed catalog differs from a freshly generated one.

#### Scenario: Catalog is generated, not hand-maintained

- **WHEN** the codegen script is run
- **THEN** it assembles `meldui-v1.catalog.json` from the per-component definitions
- **AND** the result is byte-identical to the committed artifact (no diff)

#### Scenario: Drift is detected

- **WHEN** a component definition is edited but the catalog artifact is not regenerated
- **THEN** the sync check fails, reporting the catalog is out of date

### Requirement: Catalog documentation

The catalog SHALL be documented for human and agent/LLM consumers. A catalog reference SHALL be generated from the catalog definitions (single source of truth) so it cannot drift, and the documentation SHALL be discoverable in the project's docs site and surfaced to LLM consumers via `llms.txt`.

#### Scenario: Reference is generated from the contract

- **WHEN** the A2UI reference page is generated
- **THEN** it is derived from the same component definitions that produce `meldui-v1.catalog.json` (not hand-authored)
- **AND** it lists every catalog component with its props, required flags, and the available functions

#### Scenario: Docs are discoverable

- **WHEN** the documentation site is built
- **THEN** an A2UI section (overview + catalog reference) is present
- **AND** the A2UI pages appear in the generated `llms.txt`

### Requirement: Catalog published as a package export

`@meldui/a2ui` SHALL export the generated catalog so agents and tooling can fetch the contract directly, without depending on any renderer code.

#### Scenario: Catalog importable from the package

- **WHEN** a consumer imports `@meldui/a2ui/catalog`
- **THEN** they receive the generated `meldui-v1.catalog.json` contents
- **AND** the import pulls in no Vue rendering code
