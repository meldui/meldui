/**
 * DataTable Filter Examples
 *
 * Comprehensive examples of all filter types:
 * - Text filter
 * - Select filter (single choice)
 * - Multiselect filter (multiple choices)
 * - Number filter
 * - Range filter (slider)
 * - Boolean filter (toggle)
 * - Date filter
 * - Date range filter
 * - Combined filters
 */

import {
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconCurrencyDollar,
  IconHash,
  IconMail,
  IconMapPin,
} from '@meldui/tabler-vue'
import { DataTable, type DataTableFilterField } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
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
  title: 'Components/DataTable/Filters',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Filter examples showcasing all available filter types.

In simple mode, filters provide straightforward value selection.
Multi-instance filters (text, number, date) support adding multiple filter values with OR logic.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Text filter for string columns.
 * Supports partial matching (contains).
 * Can add multiple filter instances with OR logic.
 */
export const TextFilter: Story = {
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
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Text filter with partial matching. Click the filter button to search by email.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
        />
      </div>
    `,
  }),
}

/**
 * Select filter for single choice selection.
 * Only one value can be selected at a time.
 */
export const SelectFilter: Story = {
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
          placeholder: 'Select a role',
          options: roleOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Single select dropdown. Choose one role to filter.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
        />
      </div>
    `,
  }),
}

/**
 * Multiselect filter for choosing multiple values.
 * Results match any of the selected values (OR logic).
 */
export const MultiSelectFilter: Story = {
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
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          options: statusOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Multiselect filter with checkboxes. Select multiple statuses.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
        />
      </div>
    `,
  }),
}

/**
 * Multiple multiselect filters working together.
 */
export const MultipleMultiSelectFilters: Story = {
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
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          options: statusOptions,
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

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Multiple multiselect filters. Filters work together with AND logic between different filters.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Number filter for numeric columns.
 * Filter by exact number values.
 */
export const NumberFilter: Story = {
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
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Number filter for exact value matching. Enter an age to filter.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Number filter with min/max constraints.
 */
export const NumberFilterWithConstraints: Story = {
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
          placeholder: 'Age (22-65)',
          unit: 'yrs',
          min: 22,
          max: 65,
          step: 1,
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Number filter with min (22) and max (65) constraints.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Range filter with a slider for selecting value ranges.
 * Perfect for salary, price, or other continuous values.
 */
export const RangeFilter: Story = {
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
          type: 'range',
          icon: IconCurrencyDollar,
          range: [30000, 150000],
          step: 5000,
          unit: '$',
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Range slider filter for salary. Drag the handles to set min and max values.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Boolean filter with toggle switch.
 * Filter by true/false values.
 */
export const BooleanFilter: Story = {
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
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Boolean toggle filter. Switch on to show only verified users.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Date filter for single date selection.
 * Uses a calendar picker.
 */
export const DateFilter: Story = {
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
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Date filter with calendar picker. Select a date to filter by last login.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Date range filter for selecting a date range.
 * Both start and end dates are required for filtering.
 */
export const DateRangeFilter: Story = {
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
          type: 'daterange',
          icon: IconCalendar,
          placeholder: 'Pick date range',
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Date range filter. Select start and end dates to filter records.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
        />
      </div>
    `,
  }),
}

/**
 * Combined filters with multiple filter types.
 * Demonstrates how different filters work together.
 */
export const CombinedFilters: Story = {
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
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          placeholder: 'Select role',
          options: roleOptions,
        },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          options: statusOptions,
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
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Multiple filter types working together. Filters combine with AND logic.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          search-column="name"
          search-placeholder="Search by name..."
        />
      </div>
    `,
  }),
}

/**
 * All filter types in one table.
 * Comprehensive example showing every filter type.
 */
export const AllFilterTypes: Story = {
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
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          placeholder: 'Select role',
          options: roleOptions,
        },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          options: statusOptions,
        },
        {
          id: 'age',
          label: 'Age',
          type: 'number',
          icon: IconHash,
          placeholder: 'Enter age',
          unit: 'yrs',
        },
        {
          id: 'salary',
          label: 'Salary',
          type: 'range',
          icon: IconCurrencyDollar,
          range: [30000, 150000],
          step: 5000,
          unit: '$',
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
          placeholder: 'Pick a date',
        },
        {
          id: 'created_at',
          label: 'Created',
          type: 'daterange',
          icon: IconCalendar,
          placeholder: 'Date range',
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, filterFields }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          All 8 filter types: text, select, multiselect, number, range, boolean, date, and daterange.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          search-column="name"
          search-placeholder="Search users..."
        />
      </div>
    `,
  }),
}
