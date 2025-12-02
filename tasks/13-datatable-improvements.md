# Task 13: DataTable Improvements

> **Status:** Complete (Phase 1-12, 14 Complete, Phase 13 Skipped, Storybook Updated)
> **Priority:** High
> **Depends on:** Task 03 (Vue Package Setup - Complete)

## Overview

Enhance the existing DataTable component with improved customizability, better UX states, and additional features while maintaining the "works by default, customizable when needed" philosophy. This task focuses on adding escape hatches for customization without breaking the existing simple API.

**Key Principles:**
- Reuse existing MeldUI components wherever possible (Skeleton, Alert, Empty, Pagination)
- Add slots for customization while providing sensible defaults
- Maintain backward compatibility with existing DataTable usage
- Follow compound component patterns for maximum flexibility

---

## Components to Reuse

| Need | Existing Component | Location |
|------|-------------------|----------|
| Loading | `Skeleton` | `ui/skeleton/` |
| Error | `Alert` | `ui/alert/` |
| Empty State | `Empty`, `EmptyHeader`, `EmptyTitle`, etc. | `ui/empty/` |
| Pagination | `Pagination`, `PaginationContent`, etc. | `ui/pagination/` |
| Buttons | `Button` | `ui/button/` |
| Dropdowns | `DropdownMenu` | `ui/dropdown-menu/` |

---

## Implementation Tasks (Ordered by Impact)

### Phase 1: Core Customization Slots (Very High Impact)

Add named slots to `DataTable.vue` for customization while maintaining defaults.

- [x] **1.1 Toolbar Slots**
  - Add `#toolbar-start` slot (before search input)
  - Add `#toolbar-end` slot (after view options)
  - Add `#toolbar` slot to completely replace toolbar (with slot props for table instance)

- [x] **1.2 Empty State Slot**
  - Add `#empty` slot with default using `Empty` component
  - Slot props: `{ message: string, columns: number }`
  - Default renders current empty message with `Empty` component styling

- [x] **1.3 Pagination Slot**
  - Add `#pagination` slot to replace/customize pagination
  - Slot props: `{ table, pageCount, currentPage, pageSize, canPrevious, canNext }`
  - Default uses refactored pagination (see Phase 3)

- [x] **1.4 Row Slot**
  - Add `#row` scoped slot for custom row rendering
  - Slot props: `{ row, cells, isSelected, index }`
  - Default renders standard row

- [x] **1.5 Cell Slot**
  - Add `#cell-[columnId]` dynamic slots for specific column cells
  - Slot props: `{ cell, row, value }`
  - Allows custom rendering per column without render functions

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`

**Acceptance Criteria:**
- All slots work with sensible defaults when not provided
- Slot props provide sufficient context for custom implementations
- Backward compatible - existing usage unchanged

---

### Phase 2: Loading & Error States (High Impact)

Add proper loading and error states using existing MeldUI components.

- [x] **2.1 Loading State**
  - Add `loading: boolean` prop to `DataTable.vue`
  - When `loading=true`, render table skeleton using `Skeleton` component
  - Show skeleton rows matching current `pageSize`
  - Keep header visible, only skeleton body cells
  - Add optional `loadingMessage?: string` prop

- [x] **2.2 Error State**
  - Add `error?: string | Error` prop to `DataTable.vue`
  - When `error` is set, show `Alert` component with error message
  - Add `@retry` emit for retry button
  - Add `#error` slot for custom error rendering
  - Slot props: `{ error, retry: () => void }`

- [x] **2.3 Expose Loading State to Toolbar**
  - Disable filter interactions when loading
  - Show loading indicator near search (optional)

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`
- `packages/vue/src/composites/data-table/useDataTable.ts` (if needed)

**New Dependencies:**
```typescript
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
```

**Acceptance Criteria:**
- Loading skeleton matches table structure
- Error state is clearly visible with retry option
- States don't break table layout

---

### Phase 3: Refactor Pagination (High Impact)

Refactor `DataTablePagination.vue` to use the existing `Pagination` component from `ui/pagination/`.

- [x] **3.1 Integrate Existing Pagination Component**
  - Replace custom button-based pagination with `Pagination` compound components
  - Use `PaginationContent`, `PaginationItem`, `PaginationPrevious`, `PaginationNext`, `PaginationFirst`, `PaginationLast`, `PaginationEllipsis`
  - Maintain current functionality (page size selector, selected count)

- [x] **3.2 Add Pagination Customization Props**
  - `showPageSizeSelector?: boolean` (default: true)
  - `showSelectedCount?: boolean` (existing)
  - `showPageNumbers?: boolean` (default: true) - show clickable page numbers
  - `siblingCount?: number` - pages to show around current page

- [x] **3.3 Pagination Layout Options**
  - `paginationPosition?: 'bottom' | 'top' | 'both'` (default: 'bottom')

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTablePagination.vue`
- `packages/vue/src/composites/data-table/DataTable.vue`

**Acceptance Criteria:**
- Uses existing Pagination component internally
- All existing functionality preserved
- Page numbers clickable for direct navigation

---

### Phase 4: CSS Custom Properties API (High Impact)

Create a documented CSS custom properties API for theming.

- [x] **4.1 Define CSS Custom Properties**
  ```css
  .data-table {
    /* Header */
    --dt-header-bg: var(--muted);
    --dt-header-text: var(--foreground);
    --dt-header-border: var(--border);

    /* Body */
    --dt-row-bg: var(--background);
    --dt-row-hover-bg: var(--accent);
    --dt-row-selected-bg: var(--muted);
    --dt-cell-padding: 0.75rem;

    /* Borders */
    --dt-border-color: var(--border);
    --dt-border-radius: var(--radius);

    /* Pinning */
    --dt-pinned-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    --dt-pinned-border: var(--border);

    /* States */
    --dt-loading-opacity: 0.6;
    --dt-empty-text: var(--muted-foreground);
  }
  ```

- [x] **4.2 Refactor Existing Styles**
  - Replace hardcoded values with CSS custom properties
  - Remove `:deep()` selectors where possible
  - Use data attributes for state-based styling

- [x] **4.3 Document Theming**
  - Add theming section to Storybook documentation
  - Provide examples of custom themes

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue` (styles section)
- `apps/vue-storybook/src/stories/Components/DataTable/Overview.mdx`

**Acceptance Criteria:**
- All visual aspects customizable via CSS properties
- Dark mode works without `:global(.dark)` hacks
- Documentation includes theming guide

---

### Phase 5: Column Definition Helpers (High Impact)

Create helpers to reduce column definition boilerplate.

- [x] **5.1 Enhanced `createColumnHelper`**
  ```typescript
  import { createColumnHelper } from '@meldui/vue'

  const helper = createColumnHelper<User>()

  // Auto-generates header with DataTableColumnHeader
  helper.accessor('name', {
    title: 'Name',
    enableSorting: true,
    enablePinning: true,
  })

  // Display column (no accessor)
  helper.display({
    id: 'actions',
    title: 'Actions',
    cell: ({ row }) => ...
  })
  ```

- [x] **5.2 Selection Column Helper**
  ```typescript
  // Creates checkbox column with proper header/cell
  helper.selection()
  ```

- [x] **5.3 Actions Column Helper**
  ```typescript
  helper.actions({
    display: 'inline' | 'dropdown', // Built-in options
    actions: [
      {
        label: 'Edit',
        icon: IconEdit,
        onClick: (row) => editUser(row.original)
      },
      {
        label: 'Delete',
        icon: IconTrash,
        variant: 'destructive',
        onClick: (row) => deleteUser(row.original)
      },
    ],
    dropdownLabel: 'Actions', // For dropdown mode
  })
  ```

- [x] **5.4 Common Cell Renderers**
  ```typescript
  import { cellRenderers } from '@meldui/vue'

  helper.accessor('status', {
    title: 'Status',
    cell: cellRenderers.badge({
      colorMap: { active: 'green', inactive: 'gray' }
    })
  })

  helper.accessor('createdAt', {
    title: 'Created',
    cell: cellRenderers.date({ format: 'PP' }) // Uses date-fns
  })

  helper.accessor('amount', {
    title: 'Amount',
    cell: cellRenderers.currency({ currency: 'USD' })
  })
  ```

**Files to create:**
- `packages/vue/src/composites/data-table/columnHelpers.ts`
- `packages/vue/src/composites/data-table/cellRenderers.ts`
- `packages/vue/src/composites/data-table/ActionsCell.vue`
- `packages/vue/src/composites/data-table/ActionsCellDropdown.vue`
- `packages/vue/src/composites/data-table/ActionsCellInline.vue`

**Files to modify:**
- `packages/vue/src/composites/data-table/index.ts` (exports)

**Acceptance Criteria:**
- Column definitions are significantly less verbose
- Actions column works in both inline and dropdown modes
- Type safety preserved throughout

---

### Phase 6: Table Density (Medium Impact)

Add density/spacing variants.

- [x] **6.1 Add Density Prop**
  ```typescript
  interface Props {
    density?: 'compact' | 'comfortable' | 'spacious' // default: 'comfortable'
  }
  ```

- [x] **6.2 Implement Density Styles**
  | Density | Cell Padding | Font Size | Row Height |
  |---------|--------------|-----------|------------|
  | compact | 0.25rem 0.5rem | 0.75rem | ~32px |
  | comfortable | 0.5rem 0.75rem | 0.875rem | ~44px |
  | spacious | 0.75rem 1rem | 0.875rem | ~56px |

- [x] **6.3 Use CSS Custom Properties**
  ```css
  .data-table[data-density="compact"] {
    --dt-cell-padding-y: 0.25rem;
    --dt-cell-padding-x: 0.5rem;
    --dt-font-size: 0.75rem;
  }
  ```

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`

**Acceptance Criteria:**
- Three density options work correctly
- Density doesn't break pinning or other features
- Easy to customize via CSS properties

---

### Phase 7: Conditional Row Styling (Medium Impact)

Allow dynamic row styling based on data.

- [x] **7.1 Add Row Class Prop**
  ```typescript
  interface Props {
    rowClass?: (row: Row<TData>) => string | Record<string, boolean> | undefined
  }
  ```

  Usage:
  ```vue
  <DataTable
    :row-class="(row) => ({
      'bg-red-50': row.original.isOverdue,
      'bg-green-50': row.original.isCompleted,
    })"
  />
  ```

- [x] **7.2 Add Row Style Prop (Optional)**
  ```typescript
  interface Props {
    rowStyle?: (row: Row<TData>) => CSSProperties | undefined
  }
  ```

- [x] **7.3 Add Row Props Prop**
  ```typescript
  interface Props {
    rowProps?: (row: Row<TData>) => HTMLAttributes | undefined
  }
  ```

  Allows custom data attributes, event handlers, etc.

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`

**Acceptance Criteria:**
- Row classes applied correctly
- Works with selection and hover states
- TypeScript types are correct

---

### Phase 8: Column Resizing (Medium Impact)

Enable TanStack Table's column resizing feature.

- [x] **8.1 Add Column Resizing Props**
  ```typescript
  interface Props {
    enableColumnResizing?: boolean // default: false
    columnResizeMode?: 'onChange' | 'onEnd' // default: 'onChange'
  }
  ```

- [x] **8.2 Implement Resize Handle UI**
  - Add resize handle to column headers
  - Visual feedback during drag
  - Cursor changes on hover

- [x] **8.3 Style the Resize Handle**
  ```css
  .resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 4px;
    cursor: col-resize;
    user-select: none;
    touch-action: none;
  }

  .resize-handle:hover,
  .resize-handle[data-resizing] {
    background-color: var(--primary);
  }
  ```

- [x] **8.4 Integrate with Column Pinning**
  - Ensure resizing works with pinned columns
  - Update pinning offsets on resize

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`
- `packages/vue/src/composites/data-table/DataTableColumnHeader.vue`
- `packages/vue/src/composites/data-table/useDataTable.ts`
- `packages/vue/src/composites/data-table/usePinnedColumns.ts`

**Acceptance Criteria:**
- Columns can be resized by dragging
- Minimum column width respected
- Works with pinned columns
- Resize state can be persisted if needed

---

### Phase 9: Keyboard Navigation (Medium Impact)

Add comprehensive keyboard support for accessibility.

- [x] **9.1 Focus Management**
  - Table container receives focus
  - `tabindex="0"` on table
  - Focus visible styles

- [x] **9.2 Arrow Key Navigation**
  - `↑/↓` - Move between rows
  - `Home/End` - First/last row

- [x] **9.3 Action Keys**
  - `Space` - Toggle row selection (if enabled)
  - `Enter` - Activate row (emit event for handling)
  - `Escape` - Clear selection / close dropdowns

- [x] **9.4 Pagination Shortcuts**
  - `PageUp/PageDown` - Previous/next page
  - `Ctrl+PageUp/Down` - First/last page

- [x] **9.5 Create `useTableKeyboard` Composable**
  ```typescript
  export function useTableKeyboard(options: {
    table: Table<TData>
    tableRef: Ref<HTMLElement | null>
    enableSelection?: boolean
    onRowActivate?: (row: Row<TData>) => void
  })
  ```

**Files to create:**
- `packages/vue/src/composites/data-table/useTableKeyboard.ts`

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`

**Acceptance Criteria:**
- Full keyboard navigation without mouse
- Focus is clearly visible
- Works with screen readers
- Doesn't interfere with filter inputs

---

### Phase 10: Refresh Method (Low-Medium Impact)

Add ability to refresh data without changing parameters.

- [x] **10.1 Add Refresh Method**
  ```typescript
  // In useDataTable.ts
  const refresh = () => {
    props.onServerSideChange({
      sorting: sorting.value,
      filters: columnFilters.value,
      pagination: pagination.value,
    })
  }
  ```

- [x] **10.2 Expose via defineExpose**
  ```typescript
  defineExpose({
    ...tableState,
    refresh,
  })
  ```

- [x] **10.3 Add Refresh Toolbar Button (Optional)**
  - Add `showRefreshButton?: boolean` prop
  - Renders refresh button in toolbar when true

**Files to modify:**
- `packages/vue/src/composites/data-table/useDataTable.ts`
- `packages/vue/src/composites/data-table/DataTable.vue`
- `packages/vue/src/composites/data-table/DataTableToolbar.vue` (optional)

**Acceptance Criteria:**
- `tableRef.value.refresh()` triggers data reload
- Works correctly with all current state

---

### Phase 11: Row Expansion (Medium Impact, Lower Priority)

Add expandable rows for master-detail patterns.

- [x] **11.1 Add Expansion Props**
  ```typescript
  interface Props {
    enableRowExpansion?: boolean
    getRowCanExpand?: (row: Row<TData>) => boolean
  }
  ```

- [x] **11.2 Add Expansion UI**
  - Expand/collapse toggle in first column (or dedicated column)
  - Expanded content spans full row width
  - CSS custom properties for styling

- [x] **11.3 Add Expansion Slot**
  ```vue
  <template #expanded-row="{ row }">
    <OrderDetails :order="row.original" />
  </template>
  ```

- [x] **11.4 Create Expansion Column Helper**
  ```typescript
  helper.expander({
    getCanExpand: (row) => row.original.hasDetails
  })
  ```

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`
- `packages/vue/src/composites/data-table/useDataTable.ts`
- `packages/vue/src/composites/data-table/columnHelpers.ts`

**Acceptance Criteria:**
- Rows can be expanded/collapsed
- Expansion state manageable externally
- Animated transitions

---

### Phase 12: Footer/Summary Rows (Low Priority)

Add support for footer rows with aggregations.

- [x] **12.1 Enable Footer Rendering**
  - Check if any column has `footer` defined
  - Render `<tfoot>` when footers exist

- [x] **12.2 Footer Cell Rendering**
  - Use column's `footer` property from TanStack Table
  - Support render functions and static values

- [x] **12.3 Add Footer Slot**
  ```vue
  <template #footer="{ table }">
    <tr>
      <td colspan="3">Total</td>
      <td>{{ calculateTotal(table) }}</td>
    </tr>
  </template>
  ```

- [x] **12.4 Common Aggregation Helpers**
  ```typescript
  import { aggregations } from '@meldui/vue'

  helper.accessor('amount', {
    footer: aggregations.sum({ format: 'currency' })
  })
  ```

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTable.vue`

**Files to create:**
- `packages/vue/src/composites/data-table/aggregations.ts`

**Acceptance Criteria:**
- Footer renders when columns have footer definitions
- Slot allows complete customization
- Aggregation helpers work correctly

---

### Phase 13: Headless Compound Components (Very High Impact, Future) - SKIPPED

> **Status:** Skipped - May revisit in the future if needed

Create a headless version for maximum customization. **This is a long-term architectural enhancement.**

- [ ] ~~**13.1 Create Root Context Provider**~~
  ```vue
  <DataTableRoot :data="data" :columns="columns" v-slot="{ table }">
    <!-- Full control -->
  </DataTableRoot>
  ```

- [ ] ~~**13.2 Create Individual Components**~~
  - `DataTableSearch`
  - `DataTableFilters`
  - `DataTableContent`
  - `DataTableHeader`
  - `DataTableBody`
  - `DataTableRow`
  - `DataTableCell`
  - `DataTablePagination` (refactored)

- [ ] ~~**13.3 Maintain Current API as Convenience Wrapper**~~
  - Current `DataTable` becomes a composed version of headless parts
  - Full backward compatibility

**Files to create:**
- `packages/vue/src/composites/data-table/headless/` (new directory)
- Multiple component files

**Acceptance Criteria:**
- Headless components work independently
- Can compose custom table layouts
- Current DataTable API unchanged

---

### Phase 14: Filter Plugin System (High Impact, Future)

Allow registration of custom filter types.

- [x] **14.1 Define Filter Plugin Interface**
  ```typescript
  interface FilterPlugin<TValue = unknown> {
    type: string
    component: Component
    operators?: FilterOperator[]
    defaultOperator?: FilterOperator
    serialize?: (value: TValue) => ServerFilterValue
    deserialize?: (value: ServerFilterValue) => TValue
  }
  ```

- [x] **14.2 Create Plugin Registration**
  ```typescript
  const currencyFilter = defineFilter({
    type: 'currency',
    component: CurrencyFilterComponent,
    operators: ['equals', 'greaterThan', 'lessThan', 'between'],
    serialize: (value) => ({ amount: value.amount, currency: value.currency })
  })

  <DataTable :filter-plugins="[currencyFilter]" />
  ```

- [x] **14.3 Integrate with Toolbar**
  - Toolbar renders plugin components for custom filter types
  - Type detection in `DataTableFilterCommand`

**Files to create:**
- `packages/vue/src/composites/data-table/filterPlugins.ts`

**Files to modify:**
- `packages/vue/src/composites/data-table/DataTableToolbar.vue`
- `packages/vue/src/composites/data-table/DataTableFilterCommand.vue`

**Acceptance Criteria:**
- Custom filters can be registered
- Plugin filters work like built-in filters
- Type safety maintained

---

## File Structure (After All Phases)

```
packages/vue/src/composites/data-table/
├── index.ts                      # Exports
├── types.ts                      # TypeScript interfaces
├── DataTable.vue                 # Main component (enhanced)
├── DataTableToolbar.vue          # Toolbar (enhanced)
├── DataTablePagination.vue       # Pagination (refactored)
├── DataTableColumnHeader.vue     # Column header (enhanced)
├── DataTableBulkActions.vue      # Bulk actions
├── DataTableFilterCommand.vue    # Filter picker
├── DataTableSelectHeader.vue     # Select all checkbox
├── DataTableViewOptions.vue      # View options
├── useDataTable.ts               # Main composable (enhanced)
├── usePinnedColumns.ts           # Pinning composable
├── useTableKeyboard.ts           # Keyboard navigation (new)
├── columnHelpers.ts              # Column definition helpers (new)
├── cellRenderers.ts              # Common cell renderers (new)
├── aggregations.ts               # Footer aggregations (new)
├── filterPlugins.ts              # Filter plugin system (new)
├── ActionsCell.vue               # Actions cell wrapper (new)
├── ActionsCellDropdown.vue       # Dropdown actions (new)
├── ActionsCellInline.vue         # Inline actions (new)
├── utils.ts                      # Utility functions
├── filters/                      # Filter components
│   ├── index.ts
│   ├── operators.ts
│   ├── filter-icons.ts
│   ├── TextFilter.vue
│   ├── NumberFilter.vue
│   ├── DateFilter.vue
│   ├── SelectFilter.vue
│   ├── BooleanFilter.vue
│   ├── MultiSelectFilter.vue
│   ├── RangeFilter.vue
│   └── DateRangeFilter.vue
└── headless/                     # Future: Headless components
    ├── index.ts
    ├── DataTableRoot.vue
    ├── DataTableSearch.vue
    └── ...
```

---

## Storybook Documentation Updates

Consolidated stories that demonstrate multiple capabilities together:

- [x] **States.stories.ts** - Loading skeleton, error with retry, empty with custom slot (demonstrates all table states in one story with controls to toggle between them)

- [x] **Customization.stories.ts** - Slots usage, density variants, conditional row styling, CSS theming (demonstrates visual customization capabilities)

- [x] **ColumnHelpers.stories.ts** - `createColumnHelper` usage, selection column, actions column with both inline and dropdown modes (demonstrates DX improvements)

- [x] **InteractiveFeatures.stories.ts** - Column resizing, keyboard navigation (demonstrates advanced interaction patterns)

- [x] Update **Overview.mdx**:
  - Add theming section with CSS custom properties reference
  - Update props table with new props
  - Add keyboard shortcuts reference
  - Update navigation to new consolidated stories

---

## Migration Notes

All changes are **backward compatible**. Existing DataTable usage will continue to work without modifications. New features are opt-in via props or slots.

**Deprecations (if any):**
- None planned

---

## Success Criteria

1. **Slots** - All customization slots work with sensible defaults
2. **Loading** - Skeleton state displays correctly during data fetches
3. **Error** - Error state with retry functionality using Alert component
4. **Empty** - Empty state uses Empty component with slot override
5. **Pagination** - Refactored to use existing Pagination component
6. **CSS Properties** - All visual aspects customizable via CSS custom properties
7. **Column Helpers** - Significantly reduced column definition boilerplate
8. **Actions Column** - Both inline and dropdown modes work correctly
9. **Density** - Three density options with correct sizing
10. **Row Styling** - Conditional styling works without breaking other features
11. **Resizing** - Columns can be resized by dragging
12. **Keyboard** - Full keyboard navigation for accessibility
13. **Refresh** - Data can be refreshed programmatically
14. **Backward Compatible** - Existing usage unchanged

---

## References

- [TanStack Table Docs](https://tanstack.com/table/latest)
- [TanStack Table Column Resizing](https://tanstack.com/table/latest/docs/guide/column-sizing)
- [WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [shadcn/ui Data Table](https://ui.shadcn.com/docs/components/data-table)
