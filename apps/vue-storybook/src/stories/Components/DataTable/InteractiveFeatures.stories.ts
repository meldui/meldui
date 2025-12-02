/**
 * DataTable Interactive Features Examples
 *
 * Demonstrates advanced interaction patterns:
 * - Column resizing with drag handles
 * - Keyboard navigation for accessibility
 * - Refresh button in toolbar
 * - Row activation events
 */

import { Button, createColumnHelper, DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Row } from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import {
  extendedColumns,
  MOCK_USERS,
  minimalColumns,
  simulateServerSide,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/InteractiveFeatures',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Interactive feature examples for advanced table interactions.

These examples demonstrate:
- Column resizing with drag handles
- Keyboard navigation for accessibility
- Refresh button functionality
- Row activation via keyboard
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Column Resizing
// ============================================================================

/**
 * Basic column resizing.
 * Drag the edge of column headers to resize.
 */
export const ColumnResizing: Story = {
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

      return { localData, pageCount, handleChange, columns: extendedColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Hover over the right edge of column headers to see the resize handle.
          Drag to resize columns.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-column-resizing
        />
      </div>
    `,
  }),
}

/**
 * Column resizing with onEnd mode.
 * Column width updates only after drag ends.
 */
export const ColumnResizingOnEnd: Story = {
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

      return { localData, pageCount, handleChange, columns: extendedColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Using <code>columnResizeMode="onEnd"</code> - column width updates only when drag ends
          (better performance for complex tables).
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-column-resizing
          column-resize-mode="onEnd"
        />
      </div>
    `,
  }),
}

/**
 * Column resizing with pinning.
 * Both features work together seamlessly.
 */
export const ColumnResizingWithPinning: Story = {
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

      const defaultPinning = {
        left: ['select', 'name'],
        right: ['actions'],
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, defaultPinning }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Column resizing works with pinned columns. Name is pinned left, actions pinned right.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-column-resizing
          enable-column-pinning
          :default-pinning="defaultPinning"
          enable-row-selection
        />
      </div>
    `,
  }),
}

// ============================================================================
// Keyboard Navigation
// ============================================================================

/**
 * Basic keyboard navigation.
 * Click the table and use arrow keys to navigate.
 */
export const KeyboardNavigation: Story = {
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
        <div class="text-sm text-muted-foreground space-y-2">
          <p>Click the table to focus, then use:</p>
          <ul class="list-disc list-inside space-y-1">
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">↑</kbd> / <kbd class="px-1 py-0.5 bg-muted rounded text-xs">↓</kbd> - Navigate rows</li>
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">Home</kbd> / <kbd class="px-1 py-0.5 bg-muted rounded text-xs">End</kbd> - First/last row</li>
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">PageUp</kbd> / <kbd class="px-1 py-0.5 bg-muted rounded text-xs">PageDown</kbd> - Previous/next page</li>
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">Escape</kbd> - Clear focus</li>
          </ul>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-keyboard-navigation
        />
      </div>
    `,
  }),
}

/**
 * Keyboard navigation with row selection.
 * Press Space to toggle row selection.
 */
export const KeyboardWithSelection: Story = {
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

      const helper = createColumnHelper<User>()
      const columns = [
        helper.selection(),
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('role', { title: 'Role' }),
        helper.accessor('status', { title: 'Status' }),
      ]

      return { localData, pageCount, handleChange, columns }
    },
    template: `
      <div class="space-y-4">
        <div class="text-sm text-muted-foreground space-y-2">
          <p>Additional keyboard controls with selection:</p>
          <ul class="list-disc list-inside space-y-1">
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> - Toggle row selection</li>
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">Escape</kbd> - Clear selection and focus</li>
          </ul>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-keyboard-navigation
          enable-row-selection
          show-selected-count
        />
      </div>
    `,
  }),
}

/**
 * Row activation with Enter key.
 * Press Enter to activate a row and handle the event.
 */
export const KeyboardRowActivation: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const activatedUser = ref<User | null>(null)

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

      const handleRowActivate = (row: Row<User>) => {
        activatedUser.value = row.original
      }

      return {
        localData,
        pageCount,
        handleChange,
        handleRowActivate,
        activatedUser,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="text-sm text-muted-foreground">
          <p>Press <kbd class="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> on a focused row to activate it.</p>
        </div>
        <div v-if="activatedUser" class="p-4 bg-muted rounded-lg">
          <p class="font-medium">Activated User:</p>
          <p class="text-sm">{{ activatedUser.name }} ({{ activatedUser.email }})</p>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-keyboard-navigation
          @row-activate="handleRowActivate"
        />
      </div>
    `,
  }),
}

/**
 * Page navigation shortcuts.
 * Use Ctrl+PageUp/PageDown for first/last page.
 */
export const KeyboardPageNavigation: Story = {
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
        <div class="text-sm text-muted-foreground space-y-2">
          <p>Page navigation shortcuts:</p>
          <ul class="list-disc list-inside space-y-1">
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">PageUp</kbd> - Previous page</li>
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">PageDown</kbd> - Next page</li>
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> + <kbd class="px-1 py-0.5 bg-muted rounded text-xs">PageUp</kbd> - First page</li>
            <li><kbd class="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> + <kbd class="px-1 py-0.5 bg-muted rounded text-xs">PageDown</kbd> - Last page</li>
          </ul>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          :default-per-page="5"
          enable-keyboard-navigation
        />
      </div>
    `,
  }),
}

// ============================================================================
// Refresh Button
// ============================================================================

/**
 * Refresh button in toolbar.
 * Click to re-trigger data fetch.
 */
export const RefreshButton: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const refreshCount = ref(0)
      const loading = ref(false)

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        loading.value = true
        refreshCount.value++
        setTimeout(() => {
          localData.value = simulateServerSide(MOCK_USERS, state)
          loading.value = false
        }, 500)
      }

      return { localData, pageCount, handleChange, refreshCount, loading, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <p class="text-sm text-muted-foreground">
            Click the refresh button in the toolbar to reload data.
          </p>
          <span class="text-sm font-medium">Refreshes: {{ refreshCount }}</span>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :loading="loading"
          show-refresh-button
          search-column="name"
        />
      </div>
    `,
  }),
}

// ============================================================================
// Programmatic Control
// ============================================================================

/**
 * Programmatic focus and blur control.
 * Use exposed methods to control table focus.
 */
export const ProgrammaticFocus: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const tableRef = ref()

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

      const focusTable = () => {
        tableRef.value?.focusTable()
      }

      const blurTable = () => {
        tableRef.value?.blurTable()
      }

      return {
        tableRef,
        localData,
        pageCount,
        handleChange,
        focusTable,
        blurTable,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="flex gap-2">
          <Button size="sm" @click="focusTable">Focus Table</Button>
          <Button size="sm" variant="outline" @click="blurTable">Blur Table</Button>
        </div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :show-toolbar="false"
          enable-keyboard-navigation
        />
      </div>
    `,
  }),
}

// ============================================================================
// Combined Interactive Features
// ============================================================================

/**
 * All interactive features combined.
 * Resizing, keyboard navigation, selection, and more.
 */
export const AllFeaturesCombined: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const tableRef = ref()
      const activatedUser = ref<User | null>(null)
      const loading = ref(false)

      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        loading.value = true
        setTimeout(() => {
          localData.value = simulateServerSide(MOCK_USERS, state)
          loading.value = false
        }, 300)
      }

      const handleRowActivate = (row: Row<User>) => {
        activatedUser.value = row.original
      }

      const helper = createColumnHelper<User>()
      const columns = [
        helper.selection(),
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('email', { title: 'Email', enableSorting: true }),
        helper.accessor('department', { title: 'Department' }),
        helper.accessor('location', { title: 'Location' }),
        helper.accessor('role', { title: 'Role' }),
        helper.accessor('status', { title: 'Status' }),
      ]

      const defaultPinning = {
        left: ['select', 'name'],
        right: [],
      }

      return {
        tableRef,
        localData,
        pageCount,
        handleChange,
        handleRowActivate,
        activatedUser,
        loading,
        columns,
        defaultPinning,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="text-sm text-muted-foreground">
          <p class="font-medium mb-2">All interactive features enabled:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Column resizing (drag column edges)</li>
            <li>Keyboard navigation (↑↓, Home/End, PageUp/Down)</li>
            <li>Row selection (Space to toggle)</li>
            <li>Row activation (Enter to activate)</li>
            <li>Column pinning (Name pinned left)</li>
            <li>Refresh button</li>
          </ul>
        </div>
        <div v-if="activatedUser" class="p-3 bg-primary/10 rounded-lg text-sm">
          <span class="font-medium">Last activated:</span> {{ activatedUser.name }}
        </div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :loading="loading"
          :default-pinning="defaultPinning"
          search-column="name"
          enable-column-resizing
          enable-column-pinning
          enable-keyboard-navigation
          enable-row-selection
          show-selected-count
          show-refresh-button
          @row-activate="handleRowActivate"
        />
      </div>
    `,
  }),
}
