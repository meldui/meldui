/**
 * DataTable Initial State Examples
 *
 * Examples demonstrating URL state restoration with:
 * - initialSorting: Restore sorting state from URL (e.g., ?sort_by=name&sort_order=desc)
 * - initialPagination: Restore pagination from URL (e.g., ?page=2&per_page=20)
 * - initialFilters: Restore filter state from URL
 *
 * URL format convention:
 * - Sorting: ?sort_by=column&sort_order=asc|desc
 * - Pagination: ?page=1&per_page=10 (page is 1-indexed)
 * - Filters: ?role=admin&status=active
 *
 * Note: Reset methods reset to true defaults (empty), not to initial values.
 */

import { IconBuilding, IconShield } from '@meldui/tabler-vue'
import { DataTable, type DataTableFilterField } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import {
  departmentOptions,
  extendedColumns,
  MOCK_USERS,
  minimalColumns,
  roleOptions,
  simulateServerSide,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Initial State',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Initial state props enable URL state restoration. When a user applies sorting, pagination, or filters
and the page is refreshed, use these props to restore the table state from URL parameters.

**Props:**
- \`initialSorting\`: Restore sorting state (e.g., from \`?sort_by=name&sort_order=desc\`)
- \`initialPagination\`: Restore pagination (e.g., from \`?page=2&per_page=20\`)
- \`initialFilters\`: Restore filter state (see Initial Filters stories for details)

**URL Format Convention:**
\`\`\`
?page=2&per_page=20&sort_by=name&sort_order=desc&role=admin
\`\`\`

**Important:** Reset methods reset to true defaults (empty), not to initial values.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// URL parsing helpers
function parseSortingFromURL(params: Record<string, string>): SortingState {
  if (!params.sort_by) return []
  return [
    {
      id: params.sort_by,
      desc: params.sort_order === 'desc',
    },
  ]
}

function parsePaginationFromURL(
  params: Record<string, string>,
  defaultPageSize = 10,
): Partial<PaginationState> {
  return {
    pageIndex: Math.max(0, Number(params.page || 1) - 1),
    pageSize: Number(params.per_page) || defaultPageSize,
  }
}

function serializeStateToURL(state: TableState): URLSearchParams {
  const params = new URLSearchParams()

  // Pagination (always include)
  params.set('page', String(state.pagination.pageIndex + 1))
  params.set('per_page', String(state.pagination.pageSize))

  // Sorting (only if applied)
  if (state.sorting.length > 0) {
    params.set('sort_by', state.sorting[0].id)
    params.set('sort_order', state.sorting[0].desc ? 'desc' : 'asc')
  }

  // Filters (simplified - extend as needed)
  for (const filter of state.filters) {
    if (Array.isArray(filter.value)) {
      for (const v of filter.value) {
        params.append(String(filter.id), String(v))
      }
    } else if (filter.value !== undefined && filter.value !== null) {
      params.set(String(filter.id), String(filter.value))
    }
  }

  return params
}

// ============================================================================
// Initial Sorting Examples
// ============================================================================

/**
 * Table loads with name column sorted ascending.
 * Simulates URL: ?sort_by=name&sort_order=asc
 */
export const InitialSortingAsc: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial sorting: name ascending
      // Simulates parsing from URL: ?sort_by=name&sort_order=asc
      const initialSorting: SortingState = [{ id: 'name', desc: false }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: initialSorting,
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        initialSorting,
      }
    },
    template: `
      <div class="space-y-2">
        <div class="rounded-md bg-muted p-3 text-sm">
          <p class="font-medium">Simulated URL:</p>
          <code class="text-xs">?sort_by=name&sort_order=asc</code>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :initial-sorting="initialSorting"
        />
      </div>
    `,
  }),
}

/**
 * Table loads with email column sorted descending.
 * Simulates URL: ?sort_by=email&sort_order=desc
 */
export const InitialSortingDesc: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial sorting: email descending
      const initialSorting: SortingState = [{ id: 'email', desc: true }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: initialSorting,
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        initialSorting,
      }
    },
    template: `
      <div class="space-y-2">
        <div class="rounded-md bg-muted p-3 text-sm">
          <p class="font-medium">Simulated URL:</p>
          <code class="text-xs">?sort_by=email&sort_order=desc</code>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :initial-sorting="initialSorting"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Initial Pagination Examples
// ============================================================================

/**
 * Table loads on page 3.
 * Simulates URL: ?page=3&per_page=10
 */
export const InitialPaginationPage: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial pagination: page 3 (0-indexed internally, so pageIndex=2)
      // Simulates parsing from URL: ?page=3&per_page=10
      const initialPagination: Partial<PaginationState> = {
        pageIndex: 2, // Page 3 (1-indexed in URL becomes 2 in 0-indexed)
        pageSize: 10,
      }

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 2, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        initialPagination,
      }
    },
    template: `
      <div class="space-y-2">
        <div class="rounded-md bg-muted p-3 text-sm">
          <p class="font-medium">Simulated URL:</p>
          <code class="text-xs">?page=3&per_page=10</code>
          <p class="mt-1 text-muted-foreground text-xs">
            Note: URL uses 1-indexed pages, internally converted to 0-indexed (pageIndex=2)
          </p>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :initial-pagination="initialPagination"
        />
      </div>
    `,
  }),
}

/**
 * Table loads with 20 items per page.
 * Simulates URL: ?page=1&per_page=20
 */
export const InitialPaginationPageSize: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial pagination: 20 items per page
      const initialPagination: Partial<PaginationState> = {
        pageIndex: 0,
        pageSize: 20,
      }

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 20 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        initialPagination,
      }
    },
    template: `
      <div class="space-y-2">
        <div class="rounded-md bg-muted p-3 text-sm">
          <p class="font-medium">Simulated URL:</p>
          <code class="text-xs">?page=1&per_page=20</code>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :initial-pagination="initialPagination"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Combined Examples
// ============================================================================

/**
 * Table loads with sorting and pagination from URL.
 * Simulates URL: ?page=2&per_page=20&sort_by=name&sort_order=asc
 */
export const SortingAndPagination: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Combined: page 2, 20 per page, sorted by name ascending
      const initialSorting: SortingState = [{ id: 'name', desc: false }]
      const initialPagination: Partial<PaginationState> = {
        pageIndex: 1, // Page 2
        pageSize: 20,
      }

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: initialSorting,
          filters: [],
          pagination: { pageIndex: 1, pageSize: 20 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        initialSorting,
        initialPagination,
      }
    },
    template: `
      <div class="space-y-2">
        <div class="rounded-md bg-muted p-3 text-sm">
          <p class="font-medium">Simulated URL:</p>
          <code class="text-xs">?page=2&per_page=20&sort_by=name&sort_order=asc</code>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :initial-sorting="initialSorting"
          :initial-pagination="initialPagination"
        />
      </div>
    `,
  }),
}

/**
 * Complete URL state restoration example with filters, sorting, and pagination.
 * Simulates URL: ?page=2&per_page=10&sort_by=name&sort_order=desc&role=admin&department=Engineering
 */
export const FullURLStateRestoration: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Simulate parsing from URL:
      // ?page=2&per_page=10&sort_by=name&sort_order=desc&role=admin&department=Engineering
      const simulatedURLParams = {
        page: '2',
        per_page: '10',
        sort_by: 'name',
        sort_order: 'desc',
        role: 'admin',
        department: 'Engineering',
      }

      // Parse URL params into initial state
      const initialSorting: SortingState = simulatedURLParams.sort_by
        ? [{ id: simulatedURLParams.sort_by, desc: simulatedURLParams.sort_order === 'desc' }]
        : []

      const initialPagination: Partial<PaginationState> = {
        pageIndex: Number(simulatedURLParams.page || 1) - 1, // Convert 1-indexed to 0-indexed
        pageSize: Number(simulatedURLParams.per_page || 10),
      }

      const initialFilters: ColumnFiltersState = []
      if (simulatedURLParams.role) {
        initialFilters.push({ id: 'role', value: simulatedURLParams.role })
      }
      if (simulatedURLParams.department) {
        initialFilters.push({ id: 'department', value: [simulatedURLParams.department] })
      }

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: initialSorting,
          filters: initialFilters,
          pagination: {
            pageIndex: initialPagination.pageIndex ?? 0,
            pageSize: initialPagination.pageSize ?? 10,
          },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          options: roleOptions,
        },
        {
          id: 'department',
          label: 'Department',
          type: 'multiselect',
          icon: IconBuilding,
          options: departmentOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        // In a real app, you would sync state back to URL here:
        // const params = new URLSearchParams()
        // params.set('page', String(state.pagination.pageIndex + 1))
        // params.set('per_page', String(state.pagination.pageSize))
        // if (state.sorting[0]) {
        //   params.set('sort_by', state.sorting[0].id)
        //   params.set('sort_order', state.sorting[0].desc ? 'desc' : 'asc')
        // }
        // router.push({ query: Object.fromEntries(params) })

        console.log('State changed:', {
          page: state.pagination.pageIndex + 1,
          per_page: state.pagination.pageSize,
          sort_by: state.sorting[0]?.id,
          sort_order: state.sorting[0]?.desc ? 'desc' : 'asc',
          filters: state.filters,
        })
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialSorting,
        initialPagination,
        initialFilters,
        simulatedURLParams,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="rounded-md bg-muted p-4 text-sm">
          <p class="font-medium mb-2">Simulated URL:</p>
          <code class="text-xs block mb-3">?page=2&per_page=10&sort_by=name&sort_order=desc&role=admin&department=Engineering</code>
          <p class="text-muted-foreground text-xs">
            This example shows complete URL state restoration. In a real app, you would:
          </p>
          <ol class="text-xs text-muted-foreground mt-2 list-decimal list-inside space-y-1">
            <li>Parse URL params on page load (e.g., using <code>useRoute().query</code>)</li>
            <li>Convert to initial state props</li>
            <li>Perform initial data fetch with same params</li>
            <li>Sync state changes back to URL in <code>onServerSideChange</code></li>
          </ol>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-sorting="initialSorting"
          :initial-pagination="initialPagination"
          :initial-filters="initialFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

// ============================================================================
// URL Parsing Utility Example
// ============================================================================

/**
 * Example showing a reusable URL parsing pattern.
 * Demonstrates how to create utility functions for URL state management.
 */
export const URLParsingPattern: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // ========================================
      // URL Parsing Utilities (copy to your app)
      // ========================================

      // ========================================
      // Usage
      // ========================================

      // Simulate URL: ?page=2&per_page=20&sort_by=email&sort_order=asc
      const urlParams = {
        page: '2',
        per_page: '20',
        sort_by: 'email',
        sort_order: 'asc',
      }

      const initialSorting = parseSortingFromURL(urlParams)
      const initialPagination = parsePaginationFromURL(urlParams)

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: initialSorting,
          filters: [],
          pagination: {
            pageIndex: initialPagination.pageIndex ?? 0,
            pageSize: initialPagination.pageSize ?? 10,
          },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        const newParams = serializeStateToURL(state)
        console.log('New URL would be:', `?${newParams.toString()}`)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        initialSorting,
        initialPagination,
        urlParams,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="rounded-md bg-muted p-4 text-sm">
          <p class="font-medium mb-2">URL Parsing Pattern</p>
          <p class="text-muted-foreground text-xs mb-3">
            This example demonstrates reusable utility functions for URL state management.
            Check the story source code for the implementation.
          </p>
          <p class="font-medium mt-3">Current URL:</p>
          <code class="text-xs">?page=2&per_page=20&sort_by=email&sort_order=asc</code>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :initial-sorting="initialSorting"
          :initial-pagination="initialPagination"
        />
      </div>
    `,
  }),
}
