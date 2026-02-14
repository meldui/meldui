## ADDED Requirements

### Requirement: Marketing Landing Page

The system SHALL provide a marketing-style landing page at the root URL (`/`) that showcases MeldUI and drives users to the documentation, built entirely with MeldUI components.

#### Scenario: Hero section

- **WHEN** a user visits the root URL
- **THEN** a hero section is displayed with the MeldUI name, a tagline describing the component library (e.g., "70+ Vue components for building enterprise applications"), and primary CTA buttons ("Get Started" linking to the introduction page, "View Components" linking to the components overview)

#### Scenario: Feature highlights

- **WHEN** a user scrolls past the hero section
- **THEN** a feature grid is displayed highlighting key selling points: number of components (70+), dark mode support, Tailwind CSS v4, tree-shakeable icons, composite components, and copy-paste blocks

#### Scenario: Component showcase grid

- **WHEN** a user scrolls to the component showcase section
- **THEN** a grid of component category cards is displayed (Data Display, Data Entry, Feedback, Interactive, Layout, Navigation, Overlay, Utility), each linking to the corresponding docs section with a component count badge

#### Scenario: Quick start section

- **WHEN** a user scrolls to the quick start section
- **THEN** a code snippet showing the installation command (`pnpm add @meldui/vue @meldui/tabler-vue`) and a basic usage example is displayed with copy-to-clipboard functionality

### Requirement: Landing Page Layout

The landing page SHALL use a separate blank layout (no sidebar or TOC) with only the header and footer, providing a full-width canvas for the marketing content.

#### Scenario: Blank layout rendering

- **WHEN** the landing page renders at `/`
- **THEN** it uses the `blank` layout with full-width content area, the same header as documentation pages, and no sidebar or TOC columns
