/**
 * DataTable Initial Filters Examples
 *
 * Examples demonstrating URL state restoration with defaultFilters:
 * - Simple mode with pre-applied filters
 * - Advanced mode with operator-based filters
 * - Multiple filter types combined
 *
 * Use `defaultFilters` prop to initialize the table with pre-applied filters,
 * enabling URL state restoration when the page is refreshed.
 */

import {
  IconBuilding,
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
use \`defaultFilters\` to restore the filter state from URL parameters.

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
      const defaultFilters: ColumnFiltersState = [{ id: 'email', value: ['john'] }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [{ id: 'role', value: 'admin' }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [{ id: 'status', value: ['active'] }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [{ id: 'is_verified', value: true }]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [
        { id: 'role', value: 'user' },
        { id: 'department', value: ['Engineering', 'Design'] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [
        { id: 'email', value: [{ operator: 'contains', value: 'smith' }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [
        { id: 'email', value: [{ operator: 'startsWith', value: 'john' }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [
        { id: 'age', value: [{ operator: 'greaterThan', value: 40 }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [
        { id: 'salary', value: [{ operator: 'between', value: [50000, 100000] }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [
        { id: 'role', value: [{ operator: 'isAnyOf', value: ['admin', 'user'] }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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
      const defaultFilters: ColumnFiltersState = [
        { id: 'email', value: [{ operator: 'startsWith', value: 'j' }] },
        { id: 'age', value: [{ operator: 'greaterThan', value: 30 }] },
        { id: 'role', value: [{ operator: 'isAnyOf', value: ['admin', 'user'] }] },
      ]

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
          :default-filters="defaultFilters"
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

      // Build defaultFilters from URL params
      const defaultFilters: ColumnFiltersState = []

      if (simulatedURLParams.email) {
        defaultFilters.push({ id: 'email', value: [simulatedURLParams.email] })
      }
      if (simulatedURLParams.role) {
        defaultFilters.push({ id: 'role', value: simulatedURLParams.role })
      }
      if (simulatedURLParams.verified) {
        defaultFilters.push({ id: 'is_verified', value: simulatedURLParams.verified === 'true' })
      }

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: defaultFilters,
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
        defaultFilters,
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
            and pass them to <code>defaultFilters</code>.
          </p>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :default-filters="defaultFilters"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}
