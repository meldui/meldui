/**
 * DataTable Selection Examples
 *
 * Row selection (checkbox column) + bulk actions.
 */

import { IconDownload, IconMail, IconTrash, IconUserPlus } from '@meldui/tabler-vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  type BulkActionOption,
  Button,
  DataTable,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { columnsWithSelection, MOCK_USERS, type User, useStoryData } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Selection',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Row selection is enabled via \`enable-row-selection\` plus a selection column
(\`helper.selection()\`). Bulk actions appear in the toolbar when at least one
row is selected.

**Stable IDs:** when data is server-paginated, pass \`:get-row-id="(row) =>
row.id"\` so selection tracks row identity (not row index) across pages.

**Reading the selection across pages:** TanStack only has row data for the
current page, so the table ref's \`selectedRows\` returns current-page rows
only. For the FULL set of selected rows, read \`selectedIds\` from the table
ref and resolve them against your own data source (store, server fetch).
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic per-row + select-all checkbox.
 */
export const BasicSelection: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :get-row-id="getRowId"
        enable-row-selection
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Show selected count in the pagination footer.
 */
export const SelectedCount: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :get-row-id="getRowId"
        enable-row-selection
        enable-pagination
        show-selected-count
        v-model:pagination="pagination"
        v-model:sorting="sorting"
        enable-sorting
      />
    `,
  }),
}

/**
 * Single destructive bulk action.
 */
export const SingleBulkAction: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          // Resolve IDs to user data from the source. In a real app this
          // would be a server DELETE call with the ids.
          action: (ids) => {
            const users = MOCK_USERS.filter((u) => ids.includes(u.id))
            alert(`Delete ${ids.length} user(s): ${users.map((u) => u.name).join(', ')}`)
          },
        },
      ]
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
        bulkSelectOptions,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :bulk-select-options="bulkSelectOptions"
        :get-row-id="getRowId"
        enable-row-selection
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Multiple bulk actions with mixed variants.
 */
export const MultipleBulkActions: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Send email',
          icon: IconMail,
          action: (ids) => alert(`Email ${ids.length} user(s)`),
        },
        {
          label: 'Export JSON',
          icon: IconDownload,
          action: (ids) => {
            // Resolve IDs to user records before export. In a real app this
            // would fetch the records from the server by ID.
            const users = MOCK_USERS.filter((u) => ids.includes(u.id))
            const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'users.json'
            a.click()
            URL.revokeObjectURL(url)
          },
        },
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          action: (ids) => alert(`Delete ${ids.length} user(s)`),
        },
      ]
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
        bulkSelectOptions,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :bulk-select-options="bulkSelectOptions"
        :get-row-id="getRowId"
        enable-row-selection
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Imperatively read selected rows from the template ref.
 */
export const AccessSelectedRowsImperatively: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const getRowId = (row: User) => row.id
      // defineExpose-d refs are auto-unwrapped when accessed through a
      // template ref, so the types here are the unwrapped values (not Refs).
      const tableRef = ref<{
        selectedIds: string[]
        selectedRowCount: number
        hasSelection: boolean
        resetSelection: () => void
      } | null>(null)
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })

      const log = () => {
        const ids = tableRef.value?.selectedIds ?? []
        // Resolve IDs to user data using the parent's own source. In a real
        // app this might be a Pinia/Vuex store or a server fetch by ID; here
        // we look up against the mock dataset.
        const selected = MOCK_USERS.filter((u) => ids.includes(u.id))
        alert(
          `Selected ${ids.length} across all pages:\n` +
            selected.map((u) => `- ${u.name}`).join('\n'),
        )
      }
      const clear = () => tableRef.value?.resetSelection()

      return {
        getRowId,
        tableRef,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
        log,
        clear,
      }
    },
    template: `
      <div class="space-y-3">
        <div class="flex gap-2">
          <Button size="sm" variant="outline" @click="log">Log selected rows</Button>
          <Button size="sm" variant="outline" @click="clear">Clear selection</Button>
        </div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :get-row-id="getRowId"
        enable-row-selection
          enable-sorting
          enable-pagination
          show-selected-count
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Bulk action wired to an AlertDialog confirmation flow.
 * Demonstrates embedding MeldUI dialog components alongside DataTable selection.
 */
export const BulkActionsWithDialog: Story = {
  render: () => ({
    components: {
      DataTable,
      Button,
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    },
    setup() {
      const getRowId = (row: User) => row.id
      // defineExpose-d refs are auto-unwrapped when accessed through a
      // template ref, so the types here are the unwrapped values (not Refs).
      const tableRef = ref<{
        selectedIds: string[]
        selectedRowCount: number
        resetSelection: () => void
      } | null>(null)
      const dialogOpen = ref(false)
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })

      const bulkSelectOptions: BulkActionOption<User>[] = [
        {
          label: 'Invite again',
          icon: IconUserPlus,
          action: (ids) => alert(`Re-invited ${ids.length} user(s)`),
        },
        {
          label: 'Delete',
          icon: IconTrash,
          variant: 'destructive',
          action: () => {
            dialogOpen.value = true
          },
        },
      ]
      const confirmDelete = () => {
        // In a real app this would be `DELETE /users?ids=...` to the server.
        const ids = tableRef.value?.selectedIds ?? []
        alert(`Confirmed delete of ${ids.length} user(s) by ID:\n${ids.join(', ')}`)
        tableRef.value?.resetSelection()
        dialogOpen.value = false
      }

      return {
        getRowId,
        tableRef,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        bulkSelectOptions,
        dialogOpen,
        confirmDelete,
        columns: columnsWithSelection,
      }
    },
    template: `
      <div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :bulk-select-options="bulkSelectOptions"
          :get-row-id="getRowId"
        enable-row-selection
          enable-sorting
          enable-pagination
          show-selected-count
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
        <AlertDialog v-model:open="dialogOpen">
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete selected users?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="confirmDelete">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    `,
  }),
}
