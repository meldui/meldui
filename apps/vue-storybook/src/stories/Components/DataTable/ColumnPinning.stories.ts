/**
 * DataTable Column Pinning Examples
 *
 * Examples demonstrating column pinning functionality:
 * - Pin columns to left
 * - Pin columns to right
 * - Pin columns on both sides
 * - Programmatic pinning control
 */

import { DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnPinningState } from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import {
  extendedColumns,
  fullColumns,
  MOCK_USERS,
  simulateServerSide,
  type TableState,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Column Pinning',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Column pinning keeps important columns visible while scrolling horizontally.

Features:
- Pin columns to left or right edge
- Visual separator between pinned and scrollable columns
- Sticky headers work with pinned columns
- Configure default pinning state
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Pin selection and name columns to the left.
 * These columns stay visible while scrolling.
 */
export const PinLeft: Story = {
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

      const defaultPinning: ColumnPinningState = {
        left: ['select', 'name'],
        right: [],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: fullColumns, defaultPinning }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Selection and Name columns are pinned to the left. Scroll horizontally to see the effect.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          max-height="400px"
        />
      </div>
    `,
  }),
}

/**
 * Pin actions column to the right.
 * Keeps action buttons always accessible.
 */
export const PinRight: Story = {
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

      const defaultPinning: ColumnPinningState = {
        left: [],
        right: ['actions'],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: fullColumns, defaultPinning }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Actions column is pinned to the right. Always accessible while scrolling.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          max-height="400px"
        />
      </div>
    `,
  }),
}

/**
 * Pin columns on both sides.
 * Common pattern: selection + name on left, actions on right.
 */
export const PinBothSides: Story = {
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

      const defaultPinning: ColumnPinningState = {
        left: ['select', 'name'],
        right: ['actions'],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: fullColumns, defaultPinning }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Selection and Name pinned left, Actions pinned right. The most common configuration.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          max-height="400px"
        />
      </div>
    `,
  }),
}

/**
 * Pin multiple columns on the left.
 */
export const PinMultipleLeft: Story = {
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

      const defaultPinning: ColumnPinningState = {
        left: ['select', 'name', 'email'],
        right: [],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: fullColumns, defaultPinning }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Three columns pinned left: Selection, Name, and Email.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          max-height="400px"
        />
      </div>
    `,
  }),
}

/**
 * Constrained height to demonstrate vertical scrolling with pinned columns.
 */
export const WithVerticalScroll: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 50 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const defaultPinning: ColumnPinningState = {
        left: ['select', 'name'],
        right: ['actions'],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: fullColumns, defaultPinning }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          50 rows with 300px max height. Demonstrates both vertical and horizontal scrolling with pinned columns.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          :default-per-page="50"
          max-height="300px"
        />
      </div>
    `,
  }),
}

/**
 * Programmatic control of column pinning.
 * Demonstrates how to change pinning state via ref.
 */
export const ProgrammaticPinning: Story = {
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

      const defaultPinning: ColumnPinningState = {
        left: ['select'],
        right: [],
      }

      const pinNameLeft = () => {
        dataTableRef.value?.pinColumn('name', 'left')
      }

      const pinActionsRight = () => {
        dataTableRef.value?.pinColumn('actions', 'right')
      }

      const unpinName = () => {
        dataTableRef.value?.unpinColumn('name')
      }

      const resetPinning = () => {
        dataTableRef.value?.resetPinning()
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
        defaultPinning,
        pinNameLeft,
        pinActionsRight,
        unpinName,
        resetPinning,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Control pinning programmatically using exposed methods.
        </p>

        <div class="flex flex-wrap gap-2">
          <button
            @click="pinNameLeft"
            class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Pin Name Left
          </button>
          <button
            @click="pinActionsRight"
            class="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Pin Actions Right
          </button>
          <button
            @click="unpinName"
            class="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Unpin Name
          </button>
          <button
            @click="resetPinning"
            class="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
          >
            Reset Pinning
          </button>
        </div>

        <DataTable
          ref="dataTableRef"
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          max-height="400px"
        />
      </div>
    `,
  }),
}

/**
 * Column pinning without selection column.
 * Pin data columns only.
 */
export const DataColumnsOnly: Story = {
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

      const defaultPinning: ColumnPinningState = {
        left: ['name', 'email'],
        right: [],
      }

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: extendedColumns, defaultPinning }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Name and Email columns pinned without selection checkbox.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :enable-row-selection="true"
          :enable-column-pinning="true"
          :default-pinning="defaultPinning"
          max-height="400px"
        />
      </div>
    `,
  }),
}
