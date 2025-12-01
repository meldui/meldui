/**
 * DataTable Full Examples
 *
 * Complete, production-ready examples:
 * - Full featured table with all options
 * - User management dashboard
 * - Advanced filtering with all features
 */

import {
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconCurrencyDollar,
  IconDownload,
  IconHash,
  IconMail,
  IconMapPin,
  IconShield,
  IconTrash,
  IconUserPlus,
} from '@meldui/tabler-vue'
import { type BulkActionOption, DataTable, type DataTableFilterField } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnPinningState } from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import {
  departmentOptions,
  fullColumns,
  locationOptions,
  MOCK_USERS,
  roleOptions,
  simulateServerSide,
  statusOptions,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Full Example',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Complete, production-ready examples demonstrating all DataTable features together.

These examples show how to combine:
- Sorting and pagination
- Multiple filter types
- Row selection with bulk actions
- Column pinning
- Search functionality

Use these as starting points for your own implementations.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Complete user management table.
 * This is a production-ready example with all features enabled.
 */
export const UserManagement: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const dataTableRef = ref()
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
          icon: IconShield,
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
        {
          id: 'location',
          label: 'Location',
          type: 'multiselect',
          icon: IconMapPin,
          options: locationOptions,
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
      ]

      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            if (confirm(`Delete ${selectedRows?.length} user(s)?`)) {
              console.log(
                'Deleting users:',
                selectedRows?.map((u) => u.id),
              )
              alert(`Deleted ${selectedRows?.length} user(s)`)
              dataTableRef.value?.resetSelection()
            }
          },
        },
        {
          label: 'Export',
          icon: IconDownload,
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows
            const data = JSON.stringify(selectedRows, null, 2)
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `users-${new Date().toISOString().slice(0, 10)}.json`
            a.click()
            URL.revokeObjectURL(url)
          },
        },
        {
          label: 'Send Email',
          icon: IconMail,
          variant: 'outline',
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            const emails = selectedRows?.map((u) => u.email).join(', ')
            alert(`Would send email to:\n${emails}`)
          },
        },
        {
          label: 'Assign Role',
          icon: IconUserPlus,
          variant: 'secondary',
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            alert(`Would assign role to ${selectedRows?.length} user(s)`)
          },
        },
      ]

      const defaultPinning: ColumnPinningState = {
        left: ['select', 'name'],
        right: ['actions'],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        dataTableRef,
        localData,
        pageCount,
        handleChange,
        columns: fullColumns,
        filterFields,
        bulkSelectOptions,
        defaultPinning,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold">User Management</h2>
            <p class="text-sm text-muted-foreground">
              Manage users with full filtering, sorting, and bulk actions.
            </p>
          </div>
        </div>

        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :show-selected-count="true"
          :bulk-select-options="bulkSelectOptions"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          :default-per-page="10"
          :page-size-options="[10, 20, 50, 100]"
          search-column="name"
          search-placeholder="Search users..."
          max-height="500px"
        />
      </div>
    `,
  }),
}

/**
 * Minimal production setup.
 * Shows the minimum configuration for a production-ready table.
 */
export const MinimalProduction: Story = {
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
          options: roleOptions,
        },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          options: statusOptions,
        },
      ]

      const handleChange = (state: TableState) => {
        // In production, this would be an API call:
        // const response = await fetch('/api/users', {
        //   method: 'POST',
        //   body: JSON.stringify(tableStateToServerParams(state, filterFields, 'name'))
        // })
        // localData.value = await response.json()

        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: fullColumns, filterFields }
    },
    template: `
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Users</h2>
          <p class="text-sm text-muted-foreground">
            Minimal setup with search and basic filters.
          </p>
        </div>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          search-column="name"
          search-placeholder="Search..."
        />
      </div>
    `,
  }),
}

/**
 * Advanced filtering example.
 * Uses advanced mode with operators for complex queries.
 */
export const AdvancedFiltering: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const dataTableRef = ref()
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      // Advanced mode only uses base filter types
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

      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          action: () => {
            const count = dataTableRef.value?.selectedRowCount || 0
            alert(`Would delete ${count} user(s)`)
            dataTableRef.value?.resetSelection()
          },
        },
        {
          label: 'Export',
          icon: IconDownload,
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows
            console.log('Exporting:', selectedRows)
            alert(`Would export ${selectedRows?.length} user(s)`)
          },
        },
      ]

      const handleChange = (state: TableState) => {
        console.log('Advanced filter state:', state.filters)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        dataTableRef,
        localData,
        pageCount,
        handleChange,
        columns: fullColumns,
        filterFields,
        bulkSelectOptions,
      }
    },
    template: `
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Advanced User Search</h2>
          <p class="text-sm text-muted-foreground">
            Each filter has an operator selector for precise queries.
            Use "contains", "equals", "greater than", "between", etc.
          </p>
        </div>

        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :enable-row-selection="true"
          :show-selected-count="true"
          :bulk-select-options="bulkSelectOptions"
          :advanced-mode="true"
          search-column="name"
          search-placeholder="Search by name..."
        />
      </div>
    `,
  }),
}

/**
 * Read-only table without selection.
 * For display-only data without interactive selection.
 */
export const ReadOnlyTable: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 20 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          options: roleOptions,
        },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          options: statusOptions,
        },
      ]

      // Remove selection column for read-only view
      const readOnlyColumns = fullColumns.filter((col) => col.id !== 'select')

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: readOnlyColumns, filterFields }
    },
    template: `
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">User Directory</h2>
          <p class="text-sm text-muted-foreground">
            View-only table with filtering and sorting, no selection.
          </p>
        </div>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          :default-per-page="20"
          search-column="name"
          search-placeholder="Find user..."
        />
      </div>
    `,
  }),
}

/**
 * Compact table for dense data display.
 * More rows visible with less padding.
 */
export const CompactDisplay: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 25 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const defaultPinning: ColumnPinningState = {
        left: ['name'],
        right: ['actions'],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      // Remove selection column for compact view
      const compactColumns = fullColumns.filter((col) => col.id !== 'select')

      return { localData, pageCount, handleChange, columns: compactColumns, defaultPinning }
    },
    template: `
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold">Compact View</h2>
          <p class="text-sm text-muted-foreground">
            25 rows with 350px height. Pinned columns for navigation.
          </p>
        </div>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          :default-per-page="25"
          :page-size-options="[25, 50, 100]"
          :show-toolbar="false"
          max-height="350px"
        />
      </div>
    `,
  }),
}
