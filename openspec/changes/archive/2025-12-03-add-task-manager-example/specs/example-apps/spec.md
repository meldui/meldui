## ADDED Requirements

### Requirement: Task Manager Example Application

The MeldUI project SHALL provide a task-manager example application in `apps/task-manager/` that demonstrates comprehensive usage of @meldui/vue, @meldui/tabler-vue, and @meldui/charts-vue packages in a real-world scenario.

#### Scenario: Application runs successfully

- **WHEN** a developer clones the repository and runs `pnpm install && pnpm --filter task-manager dev`
- **THEN** the task manager application starts on a local development server
- **AND** all MeldUI components render correctly with proper styling

#### Scenario: Multi-page navigation works

- **WHEN** a user navigates between Dashboard, Tasks, Projects, and Settings pages
- **THEN** Vue Router handles navigation without full page reloads
- **AND** the sidebar reflects the current active page

#### Scenario: Task CRUD operations persist

- **WHEN** a user creates, updates, or deletes a task
- **THEN** the change is persisted to LocalStorage
- **AND** the data survives browser refresh

#### Scenario: Form validation provides feedback

- **WHEN** a user submits an invalid task form (e.g., empty title)
- **THEN** validation errors display using MeldUI form components
- **AND** the form prevents submission until valid

### Requirement: Component Coverage Documentation

The example application SHALL demonstrate usage of at least 80% of exported MeldUI components with realistic use cases, providing developers with copy-paste patterns.

#### Scenario: DataTable with full features

- **WHEN** viewing the Tasks page
- **THEN** the DataTable component displays with sorting, filtering, pagination, and row selection
- **AND** the implementation can be referenced as a pattern for data-heavy views

#### Scenario: Form components with validation

- **WHEN** viewing the task creation form
- **THEN** multiple form components (Input, Select, Combobox, Calendar, TagsInput) work together
- **AND** vee-validate + zod validation is demonstrated

#### Scenario: Charts integration

- **WHEN** viewing the Dashboard page
- **THEN** at least two chart types from @meldui/charts-vue display task analytics
- **AND** charts respond to data changes reactively

#### Scenario: Icons used contextually

- **WHEN** exploring any page in the application
- **THEN** @meldui/tabler-vue icons appear in appropriate contexts (navigation, actions, status indicators)
- **AND** icon sizing and coloring follows MeldUI conventions

### Requirement: Example App Build Verification

The task-manager application SHALL be included in CI builds to ensure it remains functional as the component library evolves.

#### Scenario: CI catches breaking changes

- **WHEN** a change to @meldui/vue breaks the example app
- **THEN** the CI build fails
- **AND** developers are alerted before merging
