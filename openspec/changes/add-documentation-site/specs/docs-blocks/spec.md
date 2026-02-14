## ADDED Requirements

### Requirement: Block Preview Component

The system SHALL provide a `BlockPreview` MDC component that renders copy-paste-ready UI patterns with a responsive preview toolbar and source code display.

#### Scenario: Block preview rendering

- **WHEN** a Markdown file contains `::block-preview{name="LoginForm"}`
- **THEN** the `BlockPreview` component renders the `LoginForm.vue` block example as a live interactive component with Preview/Code tabs

#### Scenario: Responsive preview toolbar

- **WHEN** a user views a block preview
- **THEN** a toolbar with desktop, tablet (768px), and mobile (375px) width toggle buttons is available to preview the block at different viewport sizes

#### Scenario: Block source code copy

- **WHEN** a user clicks the copy button on a block preview
- **THEN** the complete `.vue` source code of the block is copied to the clipboard, ready for pasting into a project

### Requirement: Authentication Block Patterns

The system SHALL provide copy-paste-ready authentication UI patterns: login form, registration form, and forgot password form.

#### Scenario: Login form block

- **WHEN** a user views the Authentication blocks page
- **THEN** a login form block is displayed with email/password inputs, forgot password link, sign-in button, social login options (Google, GitHub), and a separator, all built with MeldUI components

### Requirement: Dashboard Block Patterns

The system SHALL provide copy-paste-ready dashboard UI patterns: header, stat cards, and recent activity sections.

#### Scenario: Dashboard stat cards block

- **WHEN** a user views the Dashboard blocks page
- **THEN** a stat cards block is displayed showing metric cards with titles, values, and trend indicators, built with MeldUI Card, Badge, and icon components

### Requirement: Settings Block Patterns

The system SHALL provide copy-paste-ready settings page UI patterns: general settings, profile settings, and notification settings.

#### Scenario: Settings profile block

- **WHEN** a user views the Settings blocks page
- **THEN** a profile settings block is displayed with avatar upload, form fields, and save button, built with MeldUI components

### Requirement: Marketing Block Patterns

The system SHALL provide copy-paste-ready marketing UI patterns: hero section, pricing cards, and feature grid.

#### Scenario: Hero section block

- **WHEN** a user views the Marketing blocks page
- **THEN** a hero section block is displayed with headline, description, CTA buttons, and optional visual, built with MeldUI components
