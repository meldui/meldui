## ADDED Requirements

### Requirement: Global Search Dialog

The system SHALL provide a global search dialog accessible via Cmd+K (macOS) / Ctrl+K (Windows/Linux) keyboard shortcut, built using MeldUI's `CommandDialog` component.

#### Scenario: Keyboard shortcut activation

- **WHEN** a user presses Cmd+K or Ctrl+K anywhere on the site
- **THEN** a search dialog opens with an input field focused and ready for typing

#### Scenario: Search button activation

- **WHEN** a user clicks the search button in the header (which displays "Search..." and the Kbd shortcut)
- **THEN** the search dialog opens

#### Scenario: Search results

- **WHEN** a user types a query in the search dialog
- **THEN** results are displayed grouped by section (Getting Started, Components, Data Table, Charts, Blocks) using MeldUI `CommandGroup` and `CommandItem` components

#### Scenario: Result navigation

- **WHEN** a user selects a search result (via click or Enter key)
- **THEN** the search dialog closes and the user navigates to the selected documentation page

#### Scenario: Empty state

- **WHEN** a search query returns no results
- **THEN** a "No results found." message is displayed using MeldUI `CommandEmpty`

### Requirement: Full-Text Search Data

The system SHALL use @nuxt/content v3's `queryCollectionSearchSections` to provide full-text search across all documentation content for the SSG build.

#### Scenario: Search data generation

- **WHEN** the site is built with SSG
- **THEN** search index data is pre-generated from all documentation pages and embedded in the static output

#### Scenario: Client-side filtering

- **WHEN** a user types a search query
- **THEN** results are filtered client-side from the pre-generated search data without requiring a server
