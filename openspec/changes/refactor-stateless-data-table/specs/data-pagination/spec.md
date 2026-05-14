## ADDED Requirements

### Requirement: Standalone DataPagination Composite

A composite component `<DataPagination>` SHALL be exported from `@meldui/vue` at the package root and from `composites/pagination/`. It MUST be usable independently of `<DataTable>` and MUST NOT depend on a TanStack `Table` instance or any other table-specific construct. The `Data*` prefix distinguishes it from the Reka-based `<Pagination>` (page-number link bar), which it complements rather than replaces.

#### Scenario: Rendered as a sibling to a card grid

- **WHEN** a parent renders `<DataPagination v-model:pagination="pagination" :page-count="5" :total-rows="48" />` alongside a custom card grid
- **THEN** the component renders the page-size selector, page info, and prev/next/first/last buttons
- **AND** user interactions emit `update:pagination` with the new `{ pageIndex, pageSize }`

#### Scenario: Rendered inside DataTable via enablePagination

- **WHEN** `<DataTable :enable-pagination="true" v-model:pagination="pagination" :page-count="5">` is rendered
- **THEN** `<DataTable>` internally renders the same `<DataPagination>` component with the same prop shapes
- **AND** binding the same `pagination` ref to both DataTable and a sibling `<DataPagination>` keeps them in sync via Vue reactivity

### Requirement: DataPagination V-Model Shape

`<DataPagination>` SHALL accept a `pagination: PaginationState` prop as its v-model target, where `PaginationState = { pageIndex: number; pageSize: number }`. It SHALL emit `update:pagination` with a new `PaginationState` value whenever the user interacts with a page button or the page-size selector. The component MUST NOT mutate the bound ref directly; mutations flow exclusively through the emit.

#### Scenario: Next button emits new pageIndex

- **GIVEN** `pagination` is `{ pageIndex: 2, pageSize: 20 }` and `pageCount` is `5`
- **WHEN** the user clicks the Next button
- **THEN** `update:pagination` fires with `{ pageIndex: 3, pageSize: 20 }`

#### Scenario: Page-size selector emits new pageSize

- **GIVEN** `pagination` is `{ pageIndex: 2, pageSize: 20 }`
- **WHEN** the user selects `50` from the page-size dropdown
- **THEN** `update:pagination` fires with `{ pageIndex: 2, pageSize: 50 }`

#### Scenario: First button emits pageIndex 0

- **GIVEN** `pagination` is `{ pageIndex: 4, pageSize: 20 }`
- **WHEN** the user clicks the First button
- **THEN** `update:pagination` fires with `{ pageIndex: 0, pageSize: 20 }`

### Requirement: DataPagination Display Props

`<DataPagination>` SHALL accept the following display-only props which it does not mutate: `pageCount: number` (required), `totalRows?: number`, `pageSizeOptions?: number[]` (default `[10, 20, 30, 40, 50]`), `showPageSizeSelector?: boolean` (default `true`), `showPageInfo?: boolean` (default `true`), `showSelectedCount?: boolean` (default `false`).

#### Scenario: showPageSizeSelector false hides the dropdown

- **WHEN** `<DataPagination :show-page-size-selector="false">` is rendered
- **THEN** the page-size `<Select>` is not present in the DOM

#### Scenario: pageSizeOptions populates the dropdown

- **WHEN** `<DataPagination :page-size-options="[5, 25, 100]">` is rendered
- **THEN** the page-size dropdown lists exactly `5`, `25`, `100` as options

### Requirement: DataPagination Button Disabled State

`<DataPagination>` SHALL derive Prev/First button disabled state from `pagination.pageIndex === 0` and Next/Last button disabled state from `pagination.pageIndex >= pageCount - 1`. Disabled buttons MUST NOT emit `update:pagination` on click.

#### Scenario: On the first page, Prev and First are disabled

- **GIVEN** `pagination.pageIndex` is `0`
- **THEN** Prev and First buttons are disabled
- **AND** clicking them has no effect

#### Scenario: On the last page, Next and Last are disabled

- **GIVEN** `pagination.pageIndex` is `pageCount - 1`
- **THEN** Next and Last buttons are disabled
- **AND** clicking them has no effect

#### Scenario: pageCount of zero disables all navigation

- **WHEN** `pageCount` is `0` (no results)
- **THEN** all four navigation buttons are disabled
