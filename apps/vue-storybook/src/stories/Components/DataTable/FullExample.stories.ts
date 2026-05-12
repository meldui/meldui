/**
 * DataTable Full Examples
 *
 * Production-grade kitchen-sink scenarios combining every feature.
 */

import {
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconCoin,
  IconDownload,
  IconEdit,
  IconHash,
  IconMail,
  IconMapPin,
  IconShield,
  IconTrash,
  IconUserPlus,
} from '@meldui/tabler-vue'
import {
  type BulkActionOption,
  DataTable,
  type DataTableFilterField,
  aggregations,
  cellRenderers,
  createColumnHelper,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnDef, ColumnPinningState } from '@tanstack/vue-table'
import { h } from 'vue'
import {
  type User,
  departmentOptions,
  locationOptions,
  roleOptions,
  statusOptions,
  useStoryData,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/FullExample',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Production kitchen-sink examples — every feature wired together: sorting, filtering, pagination, selection, bulk actions, pinning, expansion, column hiding, custom cells, aggregations.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const helper = createColumnHelper<User>()

const richColumns: ColumnDef<User>[] = [
  helper.selection(),
  helper.expander(),
  helper.accessor('name', {
    title: 'Name',
    enableSorting: true,
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('name')),
    footer: aggregations.count({ format: '{count} users' }),
  }),
  helper.accessor('email', { title: 'Email', enableSorting: true }),
  helper.accessor('role', {
    title: 'Role',
    cell: cellRenderers.badge<User, string>({
      variantMap: { admin: 'default', user: 'secondary', guest: 'outline' },
    }),
  }),
  helper.accessor('status', {
    title: 'Status',
    cell: cellRenderers.badge<User, string>({
      variantMap: { active: 'default', inactive: 'destructive' },
    }),
  }),
  helper.accessor('department', { title: 'Department' }),
  helper.accessor('age', {
    title: 'Age',
    enableSorting: true,
    cell: cellRenderers.number(),
    footer: aggregations.average({ decimals: 1, suffix: ' avg' }),
  }),
  helper.accessor('salary', {
    title: 'Salary',
    enableSorting: true,
    cell: cellRenderers.currency({ currency: 'USD' }),
    footer: aggregations.sum({ format: 'currency', currency: 'USD' }),
  }),
  helper.accessor('is_verified', {
    title: 'Verified',
    cell: cellRenderers.boolean({ asBadge: true }),
  }),
  helper.accessor('created_at', {
    title: 'Joined',
    cell: cellRenderers.date({ format: 'short' }),
  }),
  helper.actions({
    display: 'dropdown',
    actions: [
      { label: 'Edit', icon: IconEdit, onClick: (r) => alert(`Edit ${r.original.name}`) },
      {
        label: 'Delete',
        icon: IconTrash,
        variant: 'destructive',
        onClick: (r) => alert(`Delete ${r.original.name}`),
      },
    ],
  }),
]

const filterFields: DataTableFilterField<User>[] = [
  { id: 'email', label: 'Email', type: 'text', icon: IconMail },
  { id: 'role', label: 'Role', type: 'select', icon: IconShield, options: roleOptions },
  { id: 'status', label: 'Status', type: 'multiselect', icon: IconCheck, options: statusOptions },
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
  { id: 'age', label: 'Age', type: 'number', icon: IconHash, min: 18, max: 100 },
  {
    id: 'salary',
    label: 'Salary',
    type: 'range',
    icon: IconCoin,
    range: [30000, 150000],
    step: 1000,
  },
  { id: 'is_verified', label: 'Verified', type: 'boolean', icon: IconCheck },
  { id: 'created_at', label: 'Created', type: 'date', icon: IconCalendar },
]

const bulkSelectOptions: BulkActionOption<User>[] = [
  { label: 'Invite', icon: IconUserPlus, action: (ids) => alert(`Invite ${ids.length}`) },
  { label: 'Export', icon: IconDownload, action: (ids) => alert(`Export ${ids.length}`) },
  {
    label: 'Delete',
    icon: IconTrash,
    variant: 'destructive',
    action: (ids) => alert(`Delete ${ids.length}`),
  },
]

/**
 * The full ecosystem: sorting, filtering, pagination, selection, bulk actions,
 * column pinning, row expansion, column hiding, refresh button, density,
 * footer aggregations, cell renderers, and an actions column.
 */
export const CompleteUserManagement: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const defaultPinning: ColumnPinningState = {
        left: ['select', 'expander', 'name'],
        right: ['actions'],
      }
      return {
        getRowId,
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: richColumns,
        filterFields,
        bulkSelectOptions,
        defaultPinning,
        filterSearch: { id: 'name', placeholder: 'Search users...' },
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-fields="filterFields"
        :bulk-select-options="bulkSelectOptions"
        :default-pinning="defaultPinning"
        :filter-search="filterSearch"
        :page-size-options="[10, 25, 50, 100]"
        enable-sorting enable-filter enable-pagination
        :get-row-id="getRowId"
        enable-row-selection enable-row-expansion enable-column-pinning enable-column-hiding
        show-selected-count show-refresh-button
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
        max-height="500px"
      >
        <template #expanded-row="{ row }">
          <div class="space-y-1 text-sm">
            <div><span class="text-muted-foreground">Email:</span> {{ row.original.email }}</div>
            <div><span class="text-muted-foreground">Location:</span> {{ row.original.location }}</div>
            <div><span class="text-muted-foreground">Last login:</span> {{ row.original.last_login_at.slice(0, 10) }}</div>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Production layout in advanced filter mode (every filter has operator selection).
 */
export const AdvancedFilterProduction: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const advancedFilterFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', icon: IconMail, defaultOperator: 'contains' },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          options: roleOptions,
          defaultOperator: 'isAnyOf',
        },
        { id: 'age', label: 'Age', type: 'number', icon: IconHash, defaultOperator: 'greaterThan' },
        {
          id: 'salary',
          label: 'Salary',
          type: 'number',
          icon: IconCoin,
          defaultOperator: 'between',
        },
        {
          id: 'created_at',
          label: 'Created',
          type: 'date',
          icon: IconCalendar,
          defaultOperator: 'isAfter',
        },
        {
          id: 'is_verified',
          label: 'Verified',
          type: 'boolean',
          icon: IconCheck,
          defaultOperator: 'is',
        },
      ]
      const defaultPinning: ColumnPinningState = { left: ['select', 'name'], right: ['actions'] }
      return {
        getRowId,
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: richColumns.filter((c) => c.id !== 'expander'),
        filterFields: advancedFilterFields,
        bulkSelectOptions,
        defaultPinning,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-fields="filterFields"
        :bulk-select-options="bulkSelectOptions"
        :default-pinning="defaultPinning"
        advanced-mode
        enable-sorting enable-filter enable-pagination
        :get-row-id="getRowId"
        enable-row-selection enable-column-pinning enable-column-hiding
        show-selected-count
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
        max-height="500px"
      />
    `,
  }),
}

/**
 * Read-only table — no selection, no actions, no toolbar add buttons.
 * Sorting / filtering / pagination only.
 */
export const ReadOnlyTable: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 20,
      })
      const readOnlyColumns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('role', {
          title: 'Role',
          cell: cellRenderers.badge<User, string>({
            variantMap: { admin: 'default', user: 'secondary', guest: 'outline' },
          }),
        }),
        helper.accessor('department', { title: 'Department' }),
        helper.accessor('age', { title: 'Age', cell: cellRenderers.number() }),
        helper.accessor('created_at', {
          title: 'Joined',
          cell: cellRenderers.date({ format: 'short' }),
        }),
      ]
      const readOnlyFilters: DataTableFilterField<User>[] = [
        { id: 'role', label: 'Role', type: 'select', options: roleOptions },
        { id: 'department', label: 'Department', type: 'multiselect', options: departmentOptions },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: readOnlyColumns,
        filterFields: readOnlyFilters,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-fields="filterFields"
        :page-size-options="[20, 50, 100]"
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}
