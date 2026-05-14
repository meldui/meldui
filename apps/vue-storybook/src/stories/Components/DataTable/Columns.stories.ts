/**
 * DataTable Column Examples
 *
 * Everything about column definition and column-level behaviour:
 * helpers, pinning, hiding, resizing, and footer aggregations.
 */

import { IconCopy, IconEdit, IconEye, IconLock, IconTrash } from '@meldui/tabler-vue'
import { DataTable, aggregations, cellRenderers, createColumnHelper } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnDef, ColumnPinningState } from '@tanstack/vue-table'
import { h, ref } from 'vue'
import { type User, columnsWithSelection, extendedColumns, useStoryData } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Columns',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Comprehensive column-level configuration: helpers (\`accessor\`, \`display\`,
\`selection\`, \`expander\`, \`actions\`), pinning (\`defaultPinning\` and the
imperative \`pinColumn\`/\`unpinColumn\`/\`resetPinning\` methods), hiding
(\`enableColumnHiding\` + per-column \`enableHiding: false\`), resizing
(\`enableColumnResizing\` + \`columnResizeMode\`), and footer aggregations
(\`aggregations.count/sum/average/min/max/range/custom\`).
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const helper = createColumnHelper<User>()

// ============================================================================
// COLUMN HELPERS
// ============================================================================

/**
 * `helper.accessor()` — type-safe accessor columns.
 */
export const Accessor: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', {
          title: 'Name',
          enableSorting: true,
          cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('name')),
        }),
        helper.accessor('email', { title: 'Email', enableSorting: true }),
        helper.accessor('role', { title: 'Role' }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * `helper.display()` — non-accessor columns (e.g., row index, computed values).
 */
export const Display: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.display({
          id: 'index',
          title: '#',
          cell: ({ row }) => h('span', { class: 'text-muted-foreground' }, row.index + 1),
          size: 50,
        }),
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('email', { title: 'Email' }),
        helper.display({
          id: 'fullLabel',
          title: 'Computed Label',
          cell: ({ row }) =>
            h('span', { class: 'italic' }, `${row.original.name} (${row.original.role})`),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * `helper.selection()` — adds the checkbox column.
 */
export const Selection: Story = {
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
        enable-row-selection enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * `helper.expander()` — adds the expand-chevron column.
 */
export const Expander: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 5 })
      const columns: ColumnDef<User>[] = [
        helper.expander(),
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('email', { title: 'Email' }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-row-expansion enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #expanded-row="{ row }">
          <p class="text-sm">{{ row.original.role }} · {{ row.original.department }}</p>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * `helper.actions({ display: 'dropdown', ... })` — actions menu per row.
 */
export const ActionsDropdown: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('role', { title: 'Role' }),
        helper.actions({
          display: 'dropdown',
          actions: [
            { label: 'View', icon: IconEye, onClick: (r) => alert(`View ${r.original.name}`) },
            { label: 'Edit', icon: IconEdit, onClick: (r) => alert(`Edit ${r.original.name}`) },
            {
              label: 'Copy ID',
              icon: IconCopy,
              onClick: (r) => navigator.clipboard?.writeText(r.original.id),
            },
            {
              label: 'Delete',
              icon: IconTrash,
              variant: 'destructive',
              onClick: (r) => alert(`Delete ${r.original.name}`),
            },
          ],
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * `helper.actions({ display: 'inline', ... })` — buttons rendered directly in the cell.
 */
export const ActionsInline: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('email', { title: 'Email' }),
        helper.actions({
          display: 'inline',
          actions: [
            {
              label: 'Edit',
              icon: IconEdit,
              variant: 'outline',
              onClick: (r) => alert(`Edit ${r.original.name}`),
            },
            {
              label: 'Delete',
              icon: IconTrash,
              variant: 'destructive',
              onClick: (r) => alert(`Delete ${r.original.name}`),
            },
          ],
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Actions with `show` and `disabled` predicates — context-aware action visibility.
 */
export const ActionsConditional: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('role', { title: 'Role' }),
        helper.accessor('status', { title: 'Status' }),
        helper.actions({
          display: 'dropdown',
          actions: [
            {
              label: 'Activate',
              icon: IconEye,
              onClick: (r) => alert(`Activate ${r.original.name}`),
              show: (r) => r.original.status === 'inactive',
            },
            {
              label: 'Deactivate',
              icon: IconLock,
              onClick: (r) => alert(`Deactivate ${r.original.name}`),
              show: (r) => r.original.status === 'active',
            },
            {
              label: 'Delete',
              icon: IconTrash,
              variant: 'destructive',
              onClick: (r) => alert(`Delete ${r.original.name}`),
              disabled: (r) => r.original.role === 'admin',
            },
          ],
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Activate/Deactivate swap based on row status; Delete is disabled for admins.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

// ============================================================================
// COLUMN PINNING
// ============================================================================

/**
 * Pin columns to the left edge. Stays visible during horizontal scroll.
 */
export const PinLeft: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const defaultPinning: ColumnPinningState = { left: ['select', 'name'], right: [] }
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
        defaultPinning,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :default-pinning="defaultPinning"
        :get-row-id="getRowId"
        enable-row-selection enable-column-pinning enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        max-height="350px"
      />
    `,
  }),
}

/**
 * Pin the actions column to the right edge.
 */
export const PinRight: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const defaultPinning: ColumnPinningState = { left: [], right: ['actions'] }
      const columns: ColumnDef<User>[] = [
        ...extendedColumns,
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
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns,
        defaultPinning,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :default-pinning="defaultPinning"
        enable-column-pinning enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        max-height="350px"
      />
    `,
  }),
}

/**
 * Pin columns on both sides — common production pattern.
 */
export const PinBothSides: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const defaultPinning: ColumnPinningState = {
        left: ['select', 'name'],
        right: ['actions'],
      }
      const columns: ColumnDef<User>[] = [
        ...columnsWithSelection,
        helper.accessor('department', { title: 'Department' }),
        helper.accessor('location', { title: 'Location' }),
        helper.accessor('age', { title: 'Age' }),
        helper.accessor('salary', { title: 'Salary' }),
        helper.actions({
          display: 'dropdown',
          actions: [
            { label: 'Edit', icon: IconEdit, onClick: () => {} },
            { label: 'Delete', icon: IconTrash, variant: 'destructive', onClick: () => {} },
          ],
        }),
      ]
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns,
        defaultPinning,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :default-pinning="defaultPinning"
        :get-row-id="getRowId"
        enable-row-selection enable-column-pinning enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        max-height="350px"
      />
    `,
  }),
}

/**
 * Multiple left-pinned columns — demonstrates stacking order.
 */
export const PinMultipleLeft: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const defaultPinning: ColumnPinningState = {
        left: ['select', 'name', 'email'],
        right: [],
      }
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
        defaultPinning,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :default-pinning="defaultPinning"
        :get-row-id="getRowId"
        enable-row-selection enable-column-pinning enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        max-height="350px"
      />
    `,
  }),
}

/**
 * Imperatively pin / unpin / reset via the table ref.
 */
export const ProgrammaticPinning: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const tableRef = ref<{
        pinColumn: (id: string, side: 'left' | 'right') => void
        unpinColumn: (id: string) => void
        resetPinning: () => void
      } | null>(null)
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return {
        tableRef,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
      }
    },
    template: `
      <div class="space-y-3">
        <div class="flex flex-wrap gap-2">
          <button class="rounded-md border px-3 py-1 text-sm" @click="tableRef?.pinColumn('name', 'left')">Pin name left</button>
          <button class="rounded-md border px-3 py-1 text-sm" @click="tableRef?.pinColumn('age', 'right')">Pin age right</button>
          <button class="rounded-md border px-3 py-1 text-sm" @click="tableRef?.unpinColumn('name')">Unpin name</button>
          <button class="rounded-md border px-3 py-1 text-sm" @click="tableRef?.resetPinning()">Reset</button>
        </div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-column-pinning enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
          max-height="350px"
        />
      </div>
    `,
  }),
}

/**
 * Columns in `defaultPinning` are protected — they cannot be unpinned by the user.
 */
export const ProtectedDefaultPinning: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const defaultPinning: ColumnPinningState = { left: ['name'], right: [] }
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
        defaultPinning,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          The "Name" column is in <code>defaultPinning</code>. The column header dropdown
          will not offer Unpin / Pin Right for this column.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :default-pinning="defaultPinning"
          enable-column-pinning enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
          max-height="350px"
        />
      </div>
    `,
  }),
}

// ============================================================================
// COLUMN HIDING
// ============================================================================

/**
 * Enable column hiding — the toolbar grows a "View" dropdown, and the column
 * header dropdown gains a "Hide" option.
 */
export const EnableHiding: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, data, pageCount, totalRows, columns: extendedColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-column-hiding enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Columns with `enableHiding: false` are excluded from the View dropdown.
 */
export const LockedColumns: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.selection(),
        helper.accessor('name', { title: 'Name', enableHiding: false }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('role', { title: 'Role' }),
        helper.accessor('department', { title: 'Department' }),
        helper.actions({
          display: 'dropdown',
          enableHiding: false,
          actions: [{ label: 'Edit', onClick: () => {} }],
        }),
      ]
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Selection, Name, and Actions are locked — they never appear in the View dropdown.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :get-row-id="getRowId"
        enable-row-selection enable-column-hiding enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Imperatively toggle column visibility via the ref.
 */
export const ProgrammaticVisibility: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const tableRef = ref<{ columnVisibility: { value: Record<string, boolean> } } | null>(null)
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const toggle = (id: string) => {
        if (!tableRef.value) return
        const current = tableRef.value.columnVisibility.value
        tableRef.value.columnVisibility.value = { ...current, [id]: current[id] === false }
      }
      return {
        tableRef,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
        toggle,
      }
    },
    template: `
      <div class="space-y-3">
        <div class="flex gap-2">
          <button class="rounded-md border px-3 py-1 text-sm" @click="toggle('email')">Toggle email</button>
          <button class="rounded-md border px-3 py-1 text-sm" @click="toggle('department')">Toggle department</button>
          <button class="rounded-md border px-3 py-1 text-sm" @click="toggle('location')">Toggle location</button>
        </div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

// ============================================================================
// COLUMN RESIZING
// ============================================================================

/**
 * Live resizing — width updates as you drag.
 */
export const ResizeOnChange: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, data, pageCount, totalRows, columns: extendedColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-column-resizing
        column-resize-mode="onChange"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Commit-on-end — width only updates after mouse-up. Better perf for very wide tables.
 */
export const ResizeOnEnd: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, data, pageCount, totalRows, columns: extendedColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-column-resizing
        column-resize-mode="onEnd"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Resizing + pinning combined.
 */
export const ResizingWithPinning: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const defaultPinning: ColumnPinningState = { left: ['select', 'name'], right: [] }
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
        defaultPinning,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :default-pinning="defaultPinning"
        :get-row-id="getRowId"
        enable-row-selection enable-column-pinning enable-column-resizing
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        max-height="350px"
      />
    `,
  }),
}

// ============================================================================
// FOOTER AGGREGATIONS
// ============================================================================

/**
 * Count footer — total rows on the current page.
 */
export const CountFooter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', {
          title: 'Name',
          enableSorting: true,
          footer: aggregations.count({ format: '{count} users' }),
        }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('role', { title: 'Role' }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Sum + average for numeric columns.
 */
export const SumAndAverage: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', {
          title: 'Name',
          footer: aggregations.count({ format: '{count} users' }),
        }),
        helper.accessor('age', {
          title: 'Age',
          enableSorting: true,
          footer: aggregations.average({ decimals: 1, suffix: ' avg' }),
        }),
        helper.accessor('salary', {
          title: 'Salary',
          enableSorting: true,
          cell: cellRenderers.currency({ currency: 'USD' }),
          footer: aggregations.sum({ format: 'currency', currency: 'USD' }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Min / max / range across multiple columns.
 */
export const MinMaxRange: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('age', {
          title: 'Age',
          enableSorting: true,
          footer: aggregations.range({ suffix: ' yrs' }),
        }),
        helper.accessor('salary', {
          title: 'Salary',
          enableSorting: true,
          cell: cellRenderers.currency({ currency: 'USD' }),
          footer: aggregations.range({ format: 'currency', currency: 'USD' }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Custom aggregation — arbitrary computation in the footer cell.
 */
export const CustomAggregation: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('role', {
          title: 'Role',
          footer: aggregations.custom((ctx) => {
            const rows = ctx.table.getRowModel().rows
            const counts = rows.reduce<Record<string, number>>((acc, r) => {
              const role = (r.original as User).role
              acc[role] = (acc[role] ?? 0) + 1
              return acc
            }, {})
            return Object.entries(counts)
              .map(([k, v]) => `${k}: ${v}`)
              .join(' · ')
          }),
        }),
        helper.accessor('is_verified', {
          title: 'Verified',
          cell: cellRenderers.boolean({ asBadge: true }),
          footer: aggregations.custom((ctx) => {
            const rows = ctx.table.getRowModel().rows
            const verified = rows.filter((r) => (r.original as User).is_verified).length
            const pct = rows.length === 0 ? 0 : Math.round((verified / rows.length) * 100)
            return `${pct}% verified`
          }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}
