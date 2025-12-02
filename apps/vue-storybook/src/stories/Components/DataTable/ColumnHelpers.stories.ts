/**
 * DataTable Column Helpers Examples
 *
 * Demonstrates DX improvements with column definition helpers:
 * - createColumnHelper for type-safe columns
 * - Selection column helper
 * - Actions column with inline and dropdown modes
 * - Cell renderers for common formats
 * - Expander column for row expansion
 */

import { IconCopy, IconEye, IconPencil, IconTrash } from '@meldui/tabler-vue'
import { aggregations, cellRenderers, createColumnHelper, DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { MOCK_USERS, simulateServerSide, type TableState, type User } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/ColumnHelpers',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Column helper examples for improved developer experience.

These examples demonstrate:
- \`createColumnHelper\` for type-safe column definitions
- Built-in selection column helper
- Actions column with inline and dropdown modes
- Cell renderers for dates, currency, badges, and more
- Expander column for row expansion
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Column Helper Usage
// ============================================================================

/**
 * Basic usage of createColumnHelper for type-safe columns.
 */
export const BasicColumnHelper: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.accessor('name', {
          title: 'Name',
          enableSorting: true,
        }),
        helper.accessor('email', {
          title: 'Email',
          enableSorting: true,
        }),
        helper.accessor('role', {
          title: 'Role',
          enableSorting: true,
        }),
        helper.accessor('status', {
          title: 'Status',
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Using <code>createColumnHelper</code> for type-safe, concise column definitions.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Selection Column
// ============================================================================

/**
 * Selection column helper creates a checkbox column.
 */
export const SelectionColumn: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.selection(),
        helper.accessor('name', {
          title: 'Name',
          enableSorting: true,
        }),
        helper.accessor('email', {
          title: 'Email',
        }),
        helper.accessor('role', {
          title: 'Role',
        }),
        helper.accessor('status', {
          title: 'Status',
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Using <code>helper.selection()</code> to add a checkbox column.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-row-selection
          show-selected-count
        />
      </div>
    `,
  }),
}

// ============================================================================
// Actions Column - Dropdown Mode
// ============================================================================

/**
 * Actions column with dropdown menu.
 */
export const ActionsDropdown: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.accessor('name', {
          title: 'Name',
          enableSorting: true,
        }),
        helper.accessor('email', {
          title: 'Email',
        }),
        helper.accessor('role', {
          title: 'Role',
        }),
        helper.accessor('status', {
          title: 'Status',
        }),
        helper.actions({
          display: 'dropdown',
          dropdownLabel: 'Open menu',
          actions: [
            {
              label: 'View details',
              icon: IconEye,
              onClick: (row) => {
                console.log('View:', row.original)
                alert(`Viewing: ${row.original.name}`)
              },
            },
            {
              label: 'Edit',
              icon: IconPencil,
              onClick: (row) => {
                console.log('Edit:', row.original)
                alert(`Editing: ${row.original.name}`)
              },
            },
            {
              label: 'Copy ID',
              icon: IconCopy,
              onClick: (row) => {
                navigator.clipboard.writeText(row.original.id)
                alert(`Copied ID: ${row.original.id}`)
              },
            },
            {
              label: 'Delete',
              icon: IconTrash,
              variant: 'destructive',
              onClick: (row) => {
                console.log('Delete:', row.original)
                alert(`Deleting: ${row.original.name}`)
              },
            },
          ],
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Actions column with dropdown menu using <code>helper.actions({ display: 'dropdown' })</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Actions Column - Inline Mode
// ============================================================================

/**
 * Actions column with inline buttons.
 */
export const ActionsInline: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.accessor('name', {
          title: 'Name',
          enableSorting: true,
        }),
        helper.accessor('email', {
          title: 'Email',
        }),
        helper.accessor('role', {
          title: 'Role',
        }),
        helper.actions({
          display: 'inline',
          actions: [
            {
              label: 'Edit',
              icon: IconPencil,
              onClick: (row) => {
                alert(`Editing: ${row.original.name}`)
              },
            },
            {
              label: 'Delete',
              icon: IconTrash,
              variant: 'destructive',
              onClick: (row) => {
                alert(`Deleting: ${row.original.name}`)
              },
            },
          ],
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Actions column with inline buttons using <code>helper.actions({ display: 'inline' })</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

/**
 * Actions with conditional visibility and disabled state.
 */
export const ActionsConditional: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.accessor('name', {
          title: 'Name',
        }),
        helper.accessor('email', {
          title: 'Email',
        }),
        helper.accessor('role', {
          title: 'Role',
        }),
        helper.accessor('status', {
          title: 'Status',
        }),
        helper.actions({
          display: 'dropdown',
          actions: [
            {
              label: 'Edit',
              icon: IconPencil,
              onClick: (row) => alert(`Editing: ${row.original.name}`),
            },
            {
              label: 'Activate',
              show: (row) => row.original.status === 'inactive',
              onClick: (row) => alert(`Activating: ${row.original.name}`),
            },
            {
              label: 'Deactivate',
              show: (row) => row.original.status === 'active',
              onClick: (row) => alert(`Deactivating: ${row.original.name}`),
            },
            {
              label: 'Delete',
              icon: IconTrash,
              variant: 'destructive',
              disabled: (row) => row.original.role === 'admin',
              onClick: (row) => alert(`Deleting: ${row.original.name}`),
            },
          ],
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Actions with conditional visibility (<code>show</code>) and disabled state (<code>disabled</code>).
          Notice: "Activate" only shows for inactive users, "Deactivate" for active users, and "Delete" is disabled for admins.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Cell Renderers
// ============================================================================

/**
 * Badge cell renderer with variant mapping.
 */
export const CellRendererBadge: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.accessor('name', {
          title: 'Name',
        }),
        helper.accessor('role', {
          title: 'Role',
          cell: cellRenderers.badge({
            variantMap: {
              admin: 'default',
              user: 'secondary',
              guest: 'outline',
            },
          }),
        }),
        helper.accessor('status', {
          title: 'Status',
          cell: cellRenderers.badge({
            variantMap: {
              active: 'default',
              inactive: 'destructive',
            },
          }),
        }),
        helper.accessor('is_verified', {
          title: 'Verified',
          cell: cellRenderers.boolean({
            asBadge: true,
            trueText: 'Verified',
            falseText: 'Pending',
          }),
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Using <code>cellRenderers.badge()</code> with variant mapping for role and status.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

/**
 * Date and currency cell renderers.
 */
export const CellRendererFormats: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.accessor('name', {
          title: 'Name',
        }),
        helper.accessor('salary', {
          title: 'Salary',
          cell: cellRenderers.currency({
            currency: 'USD',
            minimumFractionDigits: 0,
          }),
        }),
        helper.accessor('age', {
          title: 'Age',
          cell: cellRenderers.number({
            suffix: ' years',
          }),
        }),
        helper.accessor('created_at', {
          title: 'Created',
          cell: cellRenderers.date({
            format: 'medium',
          }),
        }),
        helper.accessor('last_login_at', {
          title: 'Last Login',
          cell: cellRenderers.date({
            format: 'relative',
          }),
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Using <code>cellRenderers.currency()</code>, <code>cellRenderers.number()</code>, and <code>cellRenderers.date()</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Footer Aggregations
// ============================================================================

/**
 * Footer with aggregation helpers.
 */
export const FooterAggregations: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.accessor('name', {
          title: 'Name',
          footer: aggregations.count({ format: '{count} users' }),
        }),
        helper.accessor('department', {
          title: 'Department',
        }),
        helper.accessor('age', {
          title: 'Age',
          footer: aggregations.average({ decimals: 1, suffix: ' avg' }),
        }),
        helper.accessor('salary', {
          title: 'Salary',
          cell: cellRenderers.currency({ currency: 'USD', minimumFractionDigits: 0 }),
          footer: aggregations.sum({ format: 'currency', currency: 'USD' }),
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Footer rows using <code>aggregations.count()</code>, <code>aggregations.average()</code>, and <code>aggregations.sum()</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Expander Column
// ============================================================================

/**
 * Expander column for row expansion.
 */
export const ExpanderColumn: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.expander(),
        helper.accessor('name', {
          title: 'Name',
        }),
        helper.accessor('email', {
          title: 'Email',
        }),
        helper.accessor('department', {
          title: 'Department',
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Using <code>helper.expander()</code> to add expandable rows.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-row-expansion
        >
          <template #expanded-row="{ row }">
            <div class="p-4 bg-muted/50">
              <h4 class="font-medium mb-2">User Details</h4>
              <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt class="text-muted-foreground">ID:</dt>
                <dd>{{ row.original.id }}</dd>
                <dt class="text-muted-foreground">Role:</dt>
                <dd class="capitalize">{{ row.original.role }}</dd>
                <dt class="text-muted-foreground">Status:</dt>
                <dd class="capitalize">{{ row.original.status }}</dd>
                <dt class="text-muted-foreground">Location:</dt>
                <dd>{{ row.original.location }}</dd>
                <dt class="text-muted-foreground">Salary:</dt>
                <dd>{{ new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.salary) }}</dd>
                <dt class="text-muted-foreground">Verified:</dt>
                <dd>{{ row.original.is_verified ? 'Yes' : 'No' }}</dd>
              </dl>
            </div>
          </template>
        </DataTable>
      </div>
    `,
  }),
}

// ============================================================================
// Complete Example
// ============================================================================

/**
 * Complete example with all column helper features.
 */
export const CompleteExample: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const helper = createColumnHelper<User>()

      const columns = [
        helper.selection(),
        helper.expander(),
        helper.accessor('name', {
          title: 'Name',
          enableSorting: true,
        }),
        helper.accessor('email', {
          title: 'Email',
          enableSorting: true,
        }),
        helper.accessor('role', {
          title: 'Role',
          cell: cellRenderers.badge({
            variantMap: {
              admin: 'default',
              user: 'secondary',
              guest: 'outline',
            },
          }),
        }),
        helper.accessor('status', {
          title: 'Status',
          cell: cellRenderers.badge({
            variantMap: {
              active: 'default',
              inactive: 'destructive',
            },
          }),
        }),
        helper.accessor('salary', {
          title: 'Salary',
          cell: cellRenderers.currency({ currency: 'USD', minimumFractionDigits: 0 }),
          footer: aggregations.sum({ format: 'currency', currency: 'USD' }),
        }),
        helper.accessor('created_at', {
          title: 'Created',
          cell: cellRenderers.date({ format: 'medium' }),
        }),
        helper.actions({
          display: 'dropdown',
          actions: [
            {
              label: 'View',
              icon: IconEye,
              onClick: (row) => alert(`View: ${row.original.name}`),
            },
            {
              label: 'Edit',
              icon: IconPencil,
              onClick: (row) => alert(`Edit: ${row.original.name}`),
            },
            {
              label: 'Delete',
              icon: IconTrash,
              variant: 'destructive',
              disabled: (row) => row.original.role === 'admin',
              onClick: (row) => alert(`Delete: ${row.original.name}`),
            },
          ],
        }),
      ]

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

      return { columns, localData, pageCount, handleChange }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Complete example combining selection, expansion, cell renderers, aggregations, and actions.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          enable-row-selection
          enable-row-expansion
          show-selected-count
        >
          <template #expanded-row="{ row }">
            <div class="p-4 bg-muted/50">
              <h4 class="font-medium mb-2">{{ row.original.name }}'s Details</h4>
              <p class="text-sm text-muted-foreground">
                Located in {{ row.original.location }}, working in {{ row.original.department }}.
                Last login: {{ new Date(row.original.last_login_at).toLocaleDateString() }}
              </p>
            </div>
          </template>
        </DataTable>
      </div>
    `,
  }),
}
