/**
 * DataTable Initial Filters Examples
 *
 * Examples demonstrating URL state restoration with initialFilters:
 * - Simple mode with pre-applied filters
 * - Advanced mode with operator-based filters
 * - Multiple filter types combined
 *
 * Use `initialFilters` prop to initialize the table with pre-applied filters,
 * enabling URL state restoration when the page is refreshed.
 *
 * Note: Reset methods reset to true defaults (empty), not to initial values.
 */

import { CalendarDate } from '@internationalized/date'
import {
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconCurrencyDollar,
  IconHash,
  IconMail,
  IconMapPin,
  IconShield,
} from '@meldui/tabler-vue'
import { DataTable, type DataTableFilterField } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnFiltersState } from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import {
  departmentOptions,
  extendedColumns,
  locationOptions,
  MOCK_USERS,
  minimalColumns,
  roleOptions,
  simulateServerSide,
  statusOptions,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Initial Filters',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Initial filters enable URL state restoration. When a user applies filters and the page is refreshed,
use \`initialFilters\` to restore the filter state from URL parameters.

**Note:** Reset methods reset to true defaults (empty), not to initial values.

**Simple Mode Value Formats:**
- \`text\`: \`['value']\` (array of strings)
- \`number\`: \`[42]\` (array of numbers)
- \`select\`: \`'value'\` (single string)
- \`multiselect\`: \`['value1', 'value2']\` (array of strings)
- \`boolean\`: \`true\` or \`false\`
- \`range\`: \`[[min, max]]\` (array of tuples)

**Advanced Mode Value Format:**
All filters use \`[{ operator: 'operatorName', value: ... }]\` format.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Simple Mode Examples
// ============================================================================

/**
 * Simple mode with a pre-applied text filter.
 * The table loads with "john" already filtered.
 */
export const SimpleTextFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: email contains "john"
      const initialFilters: ColumnFiltersState = [{ id: 'email', value: ['john'] }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          placeholder: 'Filter by email...',
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Table loads with "john" text filter pre-applied. The filter chip shows the initial value.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
        />
      </div>
    `,
  }),
}

/**
 * Simple mode with a pre-applied select filter.
 * The table loads with role "admin" already selected.
 */
export const SimpleSelectFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: role is "admin"
      const initialFilters: ColumnFiltersState = [{ id: 'role', value: 'admin' }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          placeholder: 'Select role',
          options: roleOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Table loads with "admin" role filter pre-applied.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
        />
      </div>
    `,
  }),
}

/**
 * Simple mode with a pre-applied multiselect filter.
 * The table loads with multiple statuses already selected.
 */
export const SimpleMultiselectFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: status is "active" OR "inactive" (both selected)
      const initialFilters: ColumnFiltersState = [{ id: 'status', value: ['active'] }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          options: statusOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Table loads with "active" status pre-selected in multiselect filter.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
        />
      </div>
    `,
  }),
}

/**
 * Simple mode with a pre-applied boolean filter.
 * The table loads showing only verified users.
 */
export const SimpleBooleanFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: is_verified is true
      const initialFilters: ColumnFiltersState = [{ id: 'is_verified', value: true }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'is_verified',
          label: 'Verified',
          type: 'boolean',
          icon: IconCheck,
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Table loads with boolean filter set to "true" - showing only verified users.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Simple mode with multiple filters pre-applied.
 * Demonstrates real-world URL state restoration scenario.
 */
export const SimpleMultipleFilters: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Multiple initial filters - simulating URL: ?role=user&department=Engineering&department=Design
      const initialFilters: ColumnFiltersState = [
        { id: 'role', value: 'user' },
        { id: 'department', value: ['Engineering', 'Design'] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
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
        {
          id: 'location',
          label: 'Location',
          type: 'multiselect',
          icon: IconMapPin,
          options: locationOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Multiple filters pre-applied: role=user, department=Engineering,Design.
          Simulates restoring state from URL like <code>?role=user&department=Engineering&department=Design</code>
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Advanced Mode Examples
// ============================================================================

/**
 * Advanced mode with a pre-applied text filter using "contains" operator.
 */
export const AdvancedTextFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: email contains "smith" (advanced mode format)
      const initialFilters: ColumnFiltersState = [
        { id: 'email', value: [{ operator: 'contains', value: 'smith' }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          placeholder: 'Filter by email...',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Advanced mode with "contains: smith" filter pre-applied.
          The operator dropdown shows "contains" and the value shows "smith".
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Advanced mode with a "startsWith" text operator.
 */
export const AdvancedTextStartsWith: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: email startsWith "john"
      const initialFilters: ColumnFiltersState = [
        { id: 'email', value: [{ operator: 'startsWith', value: 'john' }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          placeholder: 'Filter by email...',
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Advanced mode with "startsWith: john" filter pre-applied.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Advanced mode with a number filter using "greaterThan" operator.
 */
export const AdvancedNumberFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: age greaterThan 40
      const initialFilters: ColumnFiltersState = [
        { id: 'age', value: [{ operator: 'greaterThan', value: 40 }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'age',
          label: 'Age',
          type: 'number',
          icon: IconHash,
          placeholder: 'Enter age',
          unit: 'yrs',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Advanced mode with "greaterThan: 40" number filter pre-applied.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Advanced mode with a "between" number operator.
 */
export const AdvancedNumberBetween: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: salary between 50000 and 100000
      const initialFilters: ColumnFiltersState = [
        { id: 'salary', value: [{ operator: 'between', value: [50000, 100000] }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'salary',
          label: 'Salary',
          type: 'number',
          icon: IconCurrencyDollar,
          placeholder: 'Enter salary',
          unit: '$',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Advanced mode with "between: [50000, 100000]" salary filter pre-applied.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Advanced mode with select filter using "isAnyOf" operator (replaces multiselect).
 */
export const AdvancedSelectIsAnyOf: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: role isAnyOf ["admin", "user"]
      const initialFilters: ColumnFiltersState = [
        { id: 'role', value: [{ operator: 'isAnyOf', value: ['admin', 'user'] }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
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
          defaultOperator: 'isAnyOf',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Advanced mode with "isAnyOf: [admin, user]" select filter pre-applied.
          This replaces multiselect in advanced mode.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Advanced mode with multiple filters and different operators.
 * Real-world scenario with complex filter state from URL.
 */
export const AdvancedMultipleFilters: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Complex filter state: email startsWith "j" AND age > 30 AND role is admin or user
      const initialFilters: ColumnFiltersState = [
        { id: 'email', value: [{ operator: 'startsWith', value: 'j' }] },
        { id: 'age', value: [{ operator: 'greaterThan', value: 30 }] },
        { id: 'role', value: [{ operator: 'isAnyOf', value: ['admin', 'user'] }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          placeholder: 'Filter by email...',
        },
        {
          id: 'age',
          label: 'Age',
          type: 'number',
          icon: IconHash,
          unit: 'yrs',
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          options: roleOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Multiple advanced filters pre-applied: email startsWith "j", age > 30, role isAnyOf [admin, user].
          All filter chips show their respective operators and values.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

// ============================================================================
// URL State Restoration Example
// ============================================================================

/**
 * Complete URL state restoration example.
 * Demonstrates parsing URL parameters to restore filter state.
 */
export const URLStateRestoration: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Simulate parsing from URL: ?email=john&role=admin&verified=true
      // In real app, you would parse from useRoute().query
      const simulatedURLParams = {
        email: 'john',
        role: 'admin',
        verified: 'true',
      }

      // Build initialFilters from URL params
      const initialFilters: ColumnFiltersState = []

      if (simulatedURLParams.email) {
        initialFilters.push({ id: 'email', value: [simulatedURLParams.email] })
      }
      if (simulatedURLParams.role) {
        initialFilters.push({ id: 'role', value: simulatedURLParams.role })
      }
      if (simulatedURLParams.verified) {
        initialFilters.push({ id: 'is_verified', value: simulatedURLParams.verified === 'true' })
      }

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          placeholder: 'Filter by email...',
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          options: roleOptions,
        },
        {
          id: 'is_verified',
          label: 'Verified',
          type: 'boolean',
          icon: IconCheck,
        },
      ]

      const handleChange = (state: TableState) => {
        // In real app, you would sync filters back to URL here
        // router.push({ query: serializeFiltersToURL(state.filters) })
        console.log('Filters changed:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
        simulatedURLParams,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="rounded-md bg-muted p-4 text-sm">
          <p class="font-medium mb-2">Simulated URL Parameters:</p>
          <code class="text-xs">?email=john&role=admin&verified=true</code>
          <p class="mt-2 text-muted-foreground">
            In a real application, you would parse these from <code>useRoute().query</code>
            and pass them to <code>initialFilters</code>.
          </p>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Search Filter Examples
// ============================================================================

/**
 * Table with pre-applied search filter value.
 * The search input is populated from initialFilters when the searchColumn matches.
 */
export const InitialSearchFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter for the search column (name)
      // Note: search filter uses plain string value, not wrapped in array
      const initialFilters: ColumnFiltersState = [{ id: 'name', value: 'John' }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        console.log('Search filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Search input pre-populated with "John". The <code>searchColumn</code> prop ("name")
          matches the filter id, so the search input shows the initial value.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :initial-filters="initialFilters"
          search-column="name"
          search-placeholder="Search by name..."
        />
      </div>
    `,
  }),
}

/**
 * Combined search and other filters.
 * Shows search filter working together with other filter types.
 */
export const SearchWithOtherFilters: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // URL: ?search=John&role=admin&status=active
      const initialFilters: ColumnFiltersState = [
        { id: 'name', value: 'John' }, // Search filter (plain string)
        { id: 'role', value: 'admin' }, // Select filter
        { id: 'status', value: ['active'] }, // Multiselect filter
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
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
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          icon: IconCheck,
          options: statusOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Combined filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <div class="rounded-md bg-muted p-3 text-sm">
          <p class="font-medium">Simulated URL:</p>
          <code class="text-xs">?search=John&role=admin&status=active</code>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          search-column="name"
          search-placeholder="Search by name..."
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Date Filter Examples
// ============================================================================

/**
 * Simple mode with a pre-applied date filter.
 * The table loads with a specific date already filtered.
 */
export const SimpleDateFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: created_at is December 1, 2024
      // CalendarDate uses (year, month, day) format
      const initialDate = new CalendarDate(2024, 12, 1)
      const initialFilters: ColumnFiltersState = [{ id: 'created_at', value: [initialDate] }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'created_at',
          label: 'Created Date',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Select date...',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Date filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Simple date filter with December 1, 2024 pre-applied.
          Uses <code>CalendarDate</code> from <code>@internationalized/date</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Advanced mode with date filter using "isAfter" operator.
 * Shows dates after the specified date.
 */
export const AdvancedDateIsAfter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: created_at is after November 15, 2024
      const initialDate = new CalendarDate(2024, 11, 15)
      const initialFilters: ColumnFiltersState = [
        { id: 'created_at', value: [{ operator: 'isAfter', value: initialDate }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'created_at',
          label: 'Created Date',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Select date...',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced date filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Advanced mode with "isAfter: Nov 15, 2024" date filter pre-applied.
          The operator dropdown shows "is after".
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Advanced mode with date filter using "isBetween" operator.
 * Shows dates within a range.
 */
export const AdvancedDateIsBetween: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: created_at is between Nov 1 and Dec 15, 2024
      const startDate = new CalendarDate(2024, 11, 1)
      const endDate = new CalendarDate(2024, 12, 15)
      const initialFilters: ColumnFiltersState = [
        { id: 'created_at', value: [{ operator: 'isBetween', value: [startDate, endDate] }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'created_at',
          label: 'Created Date',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Select date...',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced date filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Advanced mode with "isBetween: [Nov 1, 2024 - Dec 15, 2024]" date filter pre-applied.
          The operator shows "is between" with a range calendar.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :advanced-mode="true"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

// ============================================================================
// DateRange Filter Examples
// ============================================================================

/**
 * Simple mode with a pre-applied date range filter.
 * The table loads with a date range already applied.
 */
export const SimpleDateRangeFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Initial filter: last_login_at range from Nov 1 to Dec 15, 2024
      const startDate = new CalendarDate(2024, 11, 1)
      const endDate = new CalendarDate(2024, 12, 15)
      const initialFilters: ColumnFiltersState = [
        { id: 'last_login_at', value: [{ start: startDate, end: endDate }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'last_login_at',
          label: 'Last Login',
          type: 'daterange',
          icon: IconCalendar,
          placeholder: 'Select date range...',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('DateRange filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          DateRange filter with Nov 1 - Dec 15, 2024 pre-applied.
          Value format: <code>{ start: CalendarDate, end: CalendarDate }</code>
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Combined date and daterange filters.
 * Shows multiple date-related filters applied together.
 */
export const CombinedDateFilters: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Multiple date filters combined
      const createdDate = new CalendarDate(2024, 10, 1)
      const loginStart = new CalendarDate(2024, 11, 1)
      const loginEnd = new CalendarDate(2024, 12, 31)

      const initialFilters: ColumnFiltersState = [
        { id: 'created_at', value: [createdDate] },
        { id: 'last_login_at', value: [{ start: loginStart, end: loginEnd }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: initialFilters,
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'created_at',
          label: 'Created Date',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Select date...',
        },
        {
          id: 'last_login_at',
          label: 'Last Login',
          type: 'daterange',
          icon: IconCalendar,
          placeholder: 'Select date range...',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Combined date filter state:', JSON.stringify(state.filters, null, 2))
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        initialFilters,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Multiple date filters combined: Created on Oct 1, 2024 AND last login between Nov 1 - Dec 31, 2024.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :initial-filters="initialFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}
