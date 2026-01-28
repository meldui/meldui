/**
 * DataTable Customization Examples
 *
 * Demonstrates visual customization capabilities:
 * - Slot usage (toolbar, row, cell)
 * - Density variants (compact, comfortable, spacious)
 * - Conditional row styling
 * - CSS custom property theming
 */

import { IconDownload, IconPlus, IconRefresh } from '@meldui/tabler-vue'
import { Badge, Button, DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import {
  MOCK_USERS,
  minimalColumns,
  simulateServerSide,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Customization',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
DataTable customization examples.

These examples demonstrate:
- Toolbar slots for adding custom controls
- Row and cell slots for custom rendering
- Density options for different use cases
- Conditional row styling based on data
- CSS custom properties for theming
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Helper functions for row customization
function refreshCustomAction() {
  alert('Custom refresh action!')
}

function getRowClassByStatus(row: { original: User }) {
  return {
    'bg-red-50 dark:bg-red-950/30': row.original.status === 'inactive',
    'bg-green-50 dark:bg-green-950/30': row.original.role === 'admin',
  }
}

function getRowStyleByStatus(row: { original: User }) {
  return {
    opacity: row.original.status === 'inactive' ? 0.5 : 1,
    fontWeight: row.original.role === 'admin' ? 600 : 400,
  }
}

function getRowPropsWithHandlers(row: { original: User }) {
  return {
    'data-user-id': row.original.id,
    'data-status': row.original.status,
    onClick: () => console.log('Clicked:', row.original.name),
    class: 'cursor-pointer',
  }
}

function getStripedRowClass(row: { index: number }) {
  return {
    'bg-muted/50': row.index % 2 === 1,
  }
}

// ============================================================================
// Slot Examples
// ============================================================================

/**
 * Adding custom content to the toolbar using slots.
 */
export const ToolbarSlots: Story = {
  render: () => ({
    components: { DataTable, Button, IconPlus, IconDownload, IconRefresh },
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

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Use <code>#toolbar-start</code> and <code>#toolbar-end</code> slots to add custom buttons.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
        >
          <template #toolbar-start>
            <Button size="sm">
              <IconPlus class="mr-2 h-4 w-4" />
              Add User
            </Button>
          </template>
          <template #toolbar-end>
            <div class="flex gap-2">
              <Button variant="outline" size="sm">
                <IconDownload class="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="ghost" size="icon-sm">
                <IconRefresh class="h-4 w-4" />
              </Button>
            </div>
          </template>
        </DataTable>
      </div>
    `,
  }),
}

/**
 * Custom cell rendering using dynamic slot.
 */
export const CustomCellSlot: Story = {
  render: () => ({
    components: { DataTable, Badge },
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

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Use <code>#cell-[columnId]</code> slots for custom cell rendering.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
        >
          <template #cell-status="{ value }">
            <div class="flex items-center gap-2">
              <span
                class="h-2 w-2 rounded-full"
                :class="value === 'active' ? 'bg-green-500' : 'bg-gray-400'"
              />
              <span class="capitalize">{{ value }}</span>
            </div>
          </template>
          <template #cell-role="{ value }">
            <Badge :variant="value === 'admin' ? 'default' : 'secondary'">
              {{ value }}
            </Badge>
          </template>
        </DataTable>
      </div>
    `,
  }),
}

/**
 * Complete toolbar replacement using #toolbar slot.
 */
export const CustomToolbarSlot: Story = {
  render: () => ({
    components: { DataTable, Button, IconRefresh },
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

      return {
        localData,
        pageCount,
        handleChange,
        refresh: refreshCustomAction,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Use <code>#toolbar</code> slot to completely replace the default toolbar.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
        >
          <template #toolbar="{ table, loading }">
            <div class="flex items-center justify-between p-4 bg-muted/50 rounded-t-lg">
              <h3 class="text-lg font-semibold">User Management</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">
                  {{ table.getFilteredRowModel().rows.length }} users
                </span>
                <Button variant="outline" size="sm" @click="refresh" :disabled="loading">
                  <IconRefresh class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </template>
        </DataTable>
      </div>
    `,
  }),
}

// ============================================================================
// Density Examples
// ============================================================================

/**
 * Compact density - minimal padding, smaller text.
 * Best for dense data displays.
 */
export const DensityCompact: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 15 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Compact density with minimal cell padding (0.25rem vertical, 0.5rem horizontal).
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :default-per-page="15"
          density="compact"
        />
      </div>
    `,
  }),
}

/**
 * Comfortable density - balanced padding (default).
 * Best for general use.
 */
export const DensityComfortable: Story = {
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

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Comfortable density (default) with balanced cell padding.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          density="comfortable"
        />
      </div>
    `,
  }),
}

/**
 * Spacious density - generous padding.
 * Best for touch interfaces or accessibility.
 */
export const DensitySpacious: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 5 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Spacious density with generous cell padding (0.75rem vertical, 1rem horizontal).
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :default-per-page="5"
          density="spacious"
        />
      </div>
    `,
  }),
}

/**
 * Compare all density options side by side.
 */
export const DensityComparison: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const density = ref<'compact' | 'comfortable' | 'spacious'>('comfortable')
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 5 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { density, localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <div class="flex gap-2">
          <Button
            v-for="d in ['compact', 'comfortable', 'spacious']"
            :key="d"
            :variant="density === d ? 'default' : 'outline'"
            size="sm"
            @click="density = d"
          >
            {{ d }}
          </Button>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :default-per-page="5"
          :density="density"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Conditional Row Styling
// ============================================================================

/**
 * Conditional row classes based on data.
 */
export const ConditionalRowClass: Story = {
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

      return {
        localData,
        pageCount,
        handleChange,
        getRowClass: getRowClassByStatus,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Rows are highlighted based on status and role:
          <span class="inline-block px-2 bg-green-50 dark:bg-green-950/30 rounded ml-1">Admin</span>
          <span class="inline-block px-2 bg-red-50 dark:bg-red-950/30 rounded ml-1">Inactive</span>
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :row-class="getRowClass"
        />
      </div>
    `,
  }),
}

/**
 * Conditional row styles using inline styles.
 */
export const ConditionalRowStyle: Story = {
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

      return {
        localData,
        pageCount,
        handleChange,
        getRowStyle: getRowStyleByStatus,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Inactive users are dimmed (50% opacity), admins are bold.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :row-style="getRowStyle"
        />
      </div>
    `,
  }),
}

/**
 * Custom row attributes and event handlers.
 */
export const ConditionalRowProps: Story = {
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

      return {
        localData,
        pageCount,
        handleChange,
        getRowProps: getRowPropsWithHandlers,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Each row has custom data attributes and click handlers. Check the console when clicking a row.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :row-props="getRowProps"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Header & Theme Customization
// ============================================================================

/**
 * Custom header styling using Tailwind classes via headerClass prop.
 */
export const CustomHeaderTheme: Story = {
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

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Custom header with blue accent using <code>header-class</code> prop.
        </p>
        <DataTable
          header-class="bg-blue-500 text-white"
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
 * Striped rows using row-class prop.
 */
export const StripedRows: Story = {
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

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        getRowClass: getStripedRowClass,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Alternating row colors (zebra striping) using the <code>row-class</code> prop with <code>row.index</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :row-class="getRowClass"
        />
      </div>
    `,
  }),
}

/**
 * Bordered cells for a spreadsheet-like appearance.
 * Use the `bordered` prop to add vertical cell dividers.
 */
export const BorderedCells: Story = {
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

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Spreadsheet-style vertical borders using the <code>bordered</code> prop.
        </p>
        <DataTable
          bordered
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
// Column Hiding Examples
// ============================================================================

/**
 * Default behavior - column hiding disabled.
 * No "View" button in toolbar and no "Hide" option in column header dropdowns.
 */
export const ColumnHidingDisabled: Story = {
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

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Default behavior: <code>enableColumnHiding</code> is <code>false</code> by default.
          Notice there is no "View" button in the toolbar, and column header dropdowns do not have a "Hide" option.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          search-placeholder="Search users..."
        />
      </div>
    `,
  }),
}

/**
 * Column hiding enabled - shows "View" button and "Hide" options.
 * Users can hide/show columns via the View button or column header dropdown.
 */
export const ColumnHidingEnabled: Story = {
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

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Column hiding enabled with <code>enable-column-hiding</code> prop.
          Click the "View" button to toggle column visibility, or click a column header and select "Hide".
        </p>
        <DataTable
          enable-column-hiding
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          search-placeholder="Search users..."
        />
      </div>
    `,
  }),
}

/**
 * Column hiding with specific columns locked.
 * Some columns can be prevented from hiding using enableHiding: false in column definition.
 */
export const ColumnHidingWithLockedColumns: Story = {
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

      // Columns with enableHiding set to false for specific columns
      const columnsWithLockedHiding = [
        {
          accessorKey: 'name',
          header: 'Name',
          enableHiding: false, // Cannot be hidden
        },
        {
          accessorKey: 'email',
          header: 'Email',
          // enableHiding defaults to true, can be hidden
        },
        {
          accessorKey: 'role',
          header: 'Role',
          // enableHiding defaults to true, can be hidden
        },
        {
          accessorKey: 'status',
          header: 'Status',
          enableHiding: false, // Cannot be hidden
        },
      ]

      return {
        localData,
        pageCount,
        handleChange,
        columns: columnsWithLockedHiding,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Column hiding enabled, but "Name" and "Status" columns have <code>enableHiding: false</code>.
          These columns won't appear in the View menu and won't have a "Hide" option in their dropdown.
          Try clicking on column headers - only "Email" and "Role" have the "Hide" option.
        </p>
        <DataTable
          enable-column-hiding
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          search-placeholder="Search users..."
        />
      </div>
    `,
  }),
}
