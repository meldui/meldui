/**
 * DataTable Advanced Filters Examples
 *
 * Examples demonstrating advanced filter mode with operators:
 * - Text operators (contains, equals, startsWith, etc.)
 * - Number operators (equals, greaterThan, between, etc.)
 * - Date operators (is, isBefore, isAfter, isBetween)
 * - Select operators (is, isAnyOf, isNot)
 * - Boolean operators (is, isEmpty, isNotEmpty)
 *
 * NOTE: Advanced mode only supports base filter types:
 * text, number, date, select, boolean
 *
 * Complex types (multiselect, range, daterange) are NOT allowed
 * in advanced mode. Use:
 * - multiselect -> select with isAnyOf operator
 * - range -> number with between operator
 * - daterange -> date with isBetween operator
 */

import {
  IconCalendar,
  IconCheck,
  IconCurrencyDollar,
  IconHash,
  IconMail,
  IconShield,
} from '@meldui/tabler-vue'
import { DataTable, type DataTableFilterField } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import {
  extendedColumns,
  MOCK_USERS,
  roleOptions,
  simulateServerSide,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Advanced Filters',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Advanced filter mode enables operator selection for each filter.

Instead of simple value matching, users can choose operators like:
- **Text**: contains, equals, startsWith, endsWith, notContains, isEmpty, isNotEmpty
- **Number**: equals, greaterThan, lessThan, between, isEmpty, isNotEmpty
- **Date**: is, isBefore, isAfter, isBetween, isEmpty, isNotEmpty
- **Select**: is, isAnyOf, isNot, isEmpty, isNotEmpty
- **Boolean**: is, isEmpty, isNotEmpty

Enable with \`advanced-mode="true"\` prop.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Text filter with operators.
 * Choose from: contains, equals, startsWith, endsWith, etc.
 */
export const TextOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
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
          defaultOperator: 'contains',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Text filter with operator dropdown. Try "contains", "startsWith", "equals", etc.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Number filter with operators.
 * Choose from: equals, greaterThan, lessThan, between, etc.
 */
export const NumberOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
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
          defaultOperator: 'greaterThan',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Number filter with operators. Default is "greaterThan". Try "between" for range filtering.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Number filter with "between" operator as default.
 * Replaces range slider in advanced mode.
 */
export const NumberBetweenOperator: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
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
          defaultOperator: 'between',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Number filter with "between" as default. Enter min and max values for range filtering.
          This replaces the range slider in advanced mode.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Select filter with operators.
 * Choose from: is, isAnyOf, isNot, isEmpty, isNotEmpty.
 */
export const SelectOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
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
          defaultOperator: 'is',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Select filter with operators. Use "isAnyOf" to select multiple values (replaces multiselect in advanced mode).
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Boolean filter with operators.
 * Choose from: is, isEmpty, isNotEmpty.
 */
export const BooleanOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
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
        console.log('Filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Boolean filter with operators. Includes "isEmpty" and "isNotEmpty" for null checks.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Date filter with operators.
 * Choose from: is, isBefore, isAfter, isBetween, isEmpty, isNotEmpty.
 */
export const DateOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'last_login_at',
          label: 'Last Login',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Pick a date',
          defaultOperator: 'is',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Date filter with operators. Try "isBefore", "isAfter", or "isBetween" for date range.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * Date filter with "isBetween" operator as default.
 * Replaces daterange filter in advanced mode.
 */
export const DateBetweenOperator: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
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
          placeholder: 'Pick date range',
          defaultOperator: 'isBetween',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Date filter with "isBetween" as default. Select start and end dates for range filtering.
          This replaces the daterange filter in advanced mode.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />
      </div>
    `,
  }),
}

/**
 * All base filter types with operators.
 * Complete advanced mode example.
 */
export const AllAdvancedFilters: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
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
          placeholder: 'Filter email...',
          defaultOperator: 'contains',
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          placeholder: 'Select role',
          options: roleOptions,
          defaultOperator: 'is',
        },
        {
          id: 'age',
          label: 'Age',
          type: 'number',
          icon: IconHash,
          placeholder: 'Enter age',
          unit: 'yrs',
          defaultOperator: 'greaterThan',
        },
        {
          id: 'salary',
          label: 'Salary',
          type: 'number',
          icon: IconCurrencyDollar,
          placeholder: 'Enter salary',
          unit: '$',
          defaultOperator: 'between',
        },
        {
          id: 'is_verified',
          label: 'Verified',
          type: 'boolean',
          icon: IconCheck,
        },
        {
          id: 'last_login_at',
          label: 'Last Login',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Pick date',
          defaultOperator: 'is',
        },
        {
          id: 'created_at',
          label: 'Created',
          type: 'date',
          icon: IconCalendar,
          placeholder: 'Date range',
          defaultOperator: 'isBetween',
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          All base filter types in advanced mode. Each filter has an operator selector.
          Note: multiselect, range, and daterange are not available - use their base equivalents with operators.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
          search-column="name"
          search-placeholder="Search users..."
        />
      </div>
    `,
  }),
}

/**
 * Console logging to show filter value format.
 * Open browser console to see the emitted filter values.
 */
export const FilterValueFormat: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )
      const filterLog = ref<string>('')

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          placeholder: 'Filter email...',
          defaultOperator: 'contains',
        },
        {
          id: 'age',
          label: 'Age',
          type: 'number',
          icon: IconHash,
          placeholder: 'Enter age',
          defaultOperator: 'greaterThan',
        },
      ]

      const handleChange = (state: TableState) => {
        // Log the filter format
        if (state.filters.length > 0) {
          filterLog.value = JSON.stringify(state.filters, null, 2)
        } else {
          filterLog.value = 'No filters applied'
        }
        console.log('Advanced mode filter values:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        filterLog,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Apply filters and see the value format below. Also check browser console.
        </p>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :advanced-mode="true"
        />

        <div class="p-4 bg-muted rounded-lg">
          <h4 class="text-sm font-medium mb-2">Filter Value Format:</h4>
          <pre class="text-xs overflow-auto">{{ filterLog }}</pre>
        </div>
      </div>
    `,
  }),
}
