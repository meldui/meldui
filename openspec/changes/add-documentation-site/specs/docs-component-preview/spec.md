## ADDED Requirements

### Requirement: Live Component Preview

The system SHALL render live Vue component examples inline within documentation pages, showing both a rendered preview and the component's source code.

#### Scenario: Preview rendering via MDC syntax

- **WHEN** a Markdown file contains `::component-preview{name="ButtonVariants"}`
- **THEN** the `ComponentPreview` MDC component renders the `ButtonVariants.vue` example file as a live interactive Vue component

#### Scenario: Source code display

- **WHEN** a user switches to the "Code" tab of a component preview
- **THEN** the raw `.vue` source code of the example file is displayed with Shiki syntax highlighting

#### Scenario: Copy source code

- **WHEN** a user clicks the copy button on a component preview
- **THEN** the raw source code of the example file is copied to the clipboard

### Requirement: Example Component Registry

The system SHALL maintain a registry of example Vue components using `import.meta.glob` for dynamic resolution by name.

#### Scenario: Dynamic component resolution

- **WHEN** a `ComponentPreview` receives `name="ButtonVariants"`
- **THEN** the registry resolves the component from `app/components/examples/button/ButtonVariants.vue` and renders it as an async component

#### Scenario: Raw source loading

- **WHEN** a `ComponentPreview` needs to display source code for `ButtonVariants`
- **THEN** `useComponentSource('ButtonVariants')` returns the raw `.vue` file content loaded via `import.meta.glob('...', { query: '?raw', import: 'default', eager: true })`

### Requirement: Example File Convention

Each component example SHALL be a self-contained `.vue` file in `app/components/examples/{component-name}/` that imports MeldUI components and demonstrates a specific usage pattern.

#### Scenario: Example file structure

- **WHEN** documenting the Button component
- **THEN** example files exist at `app/components/examples/button/ButtonBasic.vue`, `ButtonVariants.vue`, `ButtonSizes.vue`, etc., each containing a complete `<script setup>` + `<template>` block with explicit MeldUI imports

#### Scenario: Example file count

- **WHEN** a component is documented
- **THEN** it has 3-5 example files covering basic usage, variants, sizes, and notable features

### Requirement: Props Table MDC Component

The system SHALL provide a `PropsTable` MDC component that renders a structured API reference table for component props from YAML data in Markdown.

#### Scenario: Props table rendering

- **WHEN** a Markdown file contains a `::props-table` block with YAML-defined props (name, type, default, description)
- **THEN** a styled table renders using MeldUI `Table` component showing columns for Prop, Type, Default, and Description

### Requirement: Events Table MDC Component

The system SHALL provide an `EventsTable` MDC component for documenting component events.

#### Scenario: Events table rendering

- **WHEN** a Markdown file contains an `::events-table` block with YAML-defined events (name, payload, description)
- **THEN** a styled table renders showing columns for Event, Payload, and Description

### Requirement: Slots Table MDC Component

The system SHALL provide a `SlotsTable` MDC component for documenting component slots.

#### Scenario: Slots table rendering

- **WHEN** a Markdown file contains a `::slots-table` block with YAML-defined slots (name, props, description)
- **THEN** a styled table renders showing columns for Slot, Props, and Description

### Requirement: Utility MDC Components

The system SHALL provide utility MDC components for documentation authoring: Callout (info/warning/danger), Steps (numbered instructions), LinkCard (card-style links), and ComponentGrid (grid of component links).

#### Scenario: Callout rendering

- **WHEN** a Markdown file contains `::callout{type="warning"}` with content
- **THEN** a styled callout box renders with the appropriate icon and color for the warning type

#### Scenario: Steps rendering

- **WHEN** a Markdown file contains `::steps` with numbered child items
- **THEN** a styled step-by-step guide renders with numbered indicators and content for each step
