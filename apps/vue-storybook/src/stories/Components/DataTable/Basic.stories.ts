/**
 * Basic DataTable Examples
 *
 * Simple examples demonstrating core functionality:
 * - Minimal table setup
 * - Search functionality
 * - Pagination options
 * - Sorting columns
 * - Empty states
 */

import { DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { MOCK_USERS, minimalColumns, simulateServerSide, type TableState } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Basic',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Basic DataTable examples showing minimal setup and core features.

These examples demonstrate:
- Minimal table configuration
- Search input functionality
- Pagination with various options
- Column sorting
- Empty state handling
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Empty handler for stories that don't need change handling
function emptyChangeHandler() {}

/**
 * Minimal DataTable setup with just data and columns.
 * Shows basic pagination and sorting out of the box.
 */
export const Minimal: Story = {
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
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        :show-toolbar="false"
      />
    `,
  }),
}

/**
 * DataTable with search input for filtering by name.
 * The search column is specified to filter results.
 */
export const WithSearch: Story = {
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
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        search-column="name"
        search-placeholder="Search by name..."
      />
    `,
  }),
}

/**
 * Custom search placeholder text for better UX.
 */
export const CustomSearchPlaceholder: Story = {
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
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        search-column="name"
        search-placeholder="Type to find users..."
      />
    `,
  }),
}

/**
 * Table with custom default page size (20 items per page).
 */
export const CustomDefaultPageSize: Story = {
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

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        :default-per-page="20"
        :show-toolbar="false"
      />
    `,
  }),
}

/**
 * Custom page size options in the pagination dropdown.
 */
export const CustomPageSizeOptions: Story = {
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
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        :default-per-page="5"
        :page-size-options="[5, 15, 25, 50]"
        :show-toolbar="false"
      />
    `,
  }),
}

/**
 * Table without toolbar (no search or filter buttons).
 */
export const WithoutToolbar: Story = {
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
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        :show-toolbar="false"
      />
    `,
  }),
}

/**
 * Table without pagination controls.
 */
export const WithoutPagination: Story = {
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
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        :show-toolbar="false"
        :show-pagination="false"
      />
    `,
  }),
}

/**
 * Empty state when no data is available.
 */
export const EmptyState: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { handleChange: emptyChangeHandler, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :page-count="0"
        :on-server-side-change="handleChange"
      />
    `,
  }),
}

/**
 * Custom empty state message.
 */
export const CustomEmptyMessage: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { handleChange: emptyChangeHandler, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :page-count="0"
        :on-server-side-change="handleChange"
        empty-message="No users found. Try adjusting your search criteria."
      />
    `,
  }),
}

/**
 * Table with custom max height for vertical scrolling.
 */
export const WithMaxHeight: Story = {
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

      const handleChange = (state: TableState) => {
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="localData.data"
        :page-count="pageCount"
        :on-server-side-change="handleChange"
        :default-per-page="50"
        :show-toolbar="false"
        max-height="300px"
      />
    `,
  }),
}

/**
 * Complete basic setup with search and pagination.
 * This is the recommended minimal configuration.
 */
export const RecommendedSetup: Story = {
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
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Recommended basic setup with search, sorting, and pagination.
        </p>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          search-placeholder="Search users..."
          :default-per-page="10"
          :page-size-options="[10, 20, 50, 100]"
        />
      </div>
    `,
  }),
}
