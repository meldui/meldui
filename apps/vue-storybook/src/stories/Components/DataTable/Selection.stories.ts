/**
 * DataTable Selection Examples
 *
 * Examples demonstrating row selection and bulk actions:
 * - Basic row selection
 * - Select all functionality
 * - Selected count display
 * - Bulk action buttons
 * - Accessing selected data
 */

import { IconDownload, IconMail, IconTrash, IconUser, IconUserPlus } from '@meldui/tabler-vue'
import { type BulkActionOption, DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import {
  columnsWithSelection,
  extendedColumns,
  MOCK_USERS,
  simulateServerSide,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Selection',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Row selection examples with bulk actions.

Features:
- Select individual rows or all rows on the page
- Display selected count
- Bulk action buttons for batch operations
- Access selected row data via ref
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic row selection with checkboxes.
 * Select individual rows using the checkbox column.
 */
export const BasicSelection: Story = {
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

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: columnsWithSelection }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Click checkboxes to select rows. Use the header checkbox to select all visible rows.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

/**
 * Row selection with selected count display.
 * Shows "X of Y row(s) selected" in the pagination area.
 */
export const WithSelectedCount: Story = {
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

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: columnsWithSelection }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Selection count is displayed at the bottom left of the table.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :show-selected-count="true"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

/**
 * Bulk actions with single action button.
 * Delete selected rows.
 */
export const SingleBulkAction: Story = {
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

      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Delete Selected',
          icon: IconTrash,
          variant: 'destructive',
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            const count = selectedRows?.length || 0
            alert(`Would delete ${count} user(s):\n${selectedRows?.map((u) => u.name).join(', ')}`)
            dataTableRef.value?.resetSelection()
          },
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        dataTableRef,
        localData,
        pageCount,
        handleChange,
        columns: columnsWithSelection,
        bulkSelectOptions,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Select rows and click "Delete Selected" to see the action. Button appears when rows are selected.
        </p>
        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :show-selected-count="true"
          :bulk-select-options="bulkSelectOptions"
        />
      </div>
    `,
  }),
}

/**
 * Multiple bulk actions.
 * Several action buttons for different operations.
 */
export const MultipleBulkActions: Story = {
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

      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            alert(`Delete ${selectedRows?.length} user(s)`)
            dataTableRef.value?.resetSelection()
          },
        },
        {
          label: 'Export',
          icon: IconDownload,
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            const data = JSON.stringify(selectedRows, null, 2)
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'users.json'
            a.click()
            URL.revokeObjectURL(url)
          },
        },
        {
          label: 'Send Email',
          icon: IconMail,
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            const emails = selectedRows?.map((u) => u.email).join(', ')
            alert(`Would send email to:\n${emails}`)
          },
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        dataTableRef,
        localData,
        pageCount,
        handleChange,
        columns: columnsWithSelection,
        bulkSelectOptions,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Multiple bulk actions: Delete, Export, and Send Email. Select rows to see the action buttons.
        </p>
        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :show-selected-count="true"
          :bulk-select-options="bulkSelectOptions"
          search-column="name"
          search-placeholder="Search users..."
        />
      </div>
    `,
  }),
}

/**
 * Bulk actions with different button variants.
 * Shows how to style action buttons differently.
 */
export const BulkActionVariants: Story = {
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

      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Destructive',
          icon: IconTrash,
          variant: 'destructive',
          action: () => alert('Destructive action'),
        },
        {
          label: 'Default',
          icon: IconUser,
          // No variant = default
          action: () => alert('Default action'),
        },
        {
          label: 'Secondary',
          icon: IconUserPlus,
          variant: 'secondary',
          action: () => alert('Secondary action'),
        },
        {
          label: 'Outline',
          icon: IconDownload,
          variant: 'outline',
          action: () => alert('Outline action'),
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        dataTableRef,
        localData,
        pageCount,
        handleChange,
        columns: columnsWithSelection,
        bulkSelectOptions,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Different button variants: destructive, default, secondary, and outline.
        </p>
        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :show-selected-count="true"
          :bulk-select-options="bulkSelectOptions"
        />
      </div>
    `,
  }),
}

/**
 * Accessing selected rows programmatically.
 * Demonstrates how to read selection state via ref.
 */
export const AccessSelectedRows: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const dataTableRef = ref()
      const selectedInfo = ref('')
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const checkSelection = () => {
        const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
        const hasSelection = dataTableRef.value?.hasSelection
        const count = dataTableRef.value?.selectedRowCount

        if (hasSelection) {
          selectedInfo.value = `Selected ${count} user(s):\n${selectedRows?.map((u) => `- ${u.name} (${u.email})`).join('\n')}`
        } else {
          selectedInfo.value = 'No rows selected'
        }
      }

      const clearSelection = () => {
        dataTableRef.value?.resetSelection()
        selectedInfo.value = 'Selection cleared'
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        dataTableRef,
        selectedInfo,
        localData,
        pageCount,
        handleChange,
        columns: columnsWithSelection,
        checkSelection,
        clearSelection,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Access selected rows via ref. Click buttons below to interact with selection state.
        </p>

        <div class="flex gap-2">
          <button
            @click="checkSelection"
            class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Check Selection
          </button>
          <button
            @click="clearSelection"
            class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Clear Selection
          </button>
        </div>

        <pre v-if="selectedInfo" class="p-3 bg-muted rounded text-sm whitespace-pre-wrap">{{ selectedInfo }}</pre>

        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :show-selected-count="true"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

/**
 * Complete selection example with search and filters.
 */
export const CompleteSelectionExample: Story = {
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

      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            if (confirm(`Delete ${selectedRows?.length} user(s)?`)) {
              alert('Deleted!')
              dataTableRef.value?.resetSelection()
            }
          },
        },
        {
          label: 'Export JSON',
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
          label: 'Export CSV',
          icon: IconDownload,
          variant: 'outline',
          action: () => {
            const selectedRows = dataTableRef.value?.selectedRows as User[] | undefined
            if (!selectedRows?.length) return

            const headers = ['id', 'name', 'email', 'role', 'status']
            const csv = [
              headers.join(','),
              ...selectedRows.map((row) =>
                headers.map((h) => JSON.stringify(row[h as keyof User])).join(','),
              ),
            ].join('\\n')

            const blob = new Blob([csv], { type: 'text/csv' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`
            a.click()
            URL.revokeObjectURL(url)
          },
        },
      ]

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        dataTableRef,
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        bulkSelectOptions,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Complete example with search, bulk actions (Delete, Export JSON, Export CSV).
        </p>
        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :show-selected-count="true"
          :bulk-select-options="bulkSelectOptions"
          search-column="name"
          search-placeholder="Search users..."
        />
      </div>
    `,
  }),
}
