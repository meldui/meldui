/**
 * DataTable Events Examples
 *
 * Examples demonstrating event handling and callbacks:
 * - Server-side change callback
 * - Sorting events
 * - Filter events
 * - Pagination events
 * - Converting state to server params
 */

import { IconCheck, IconHash, IconMail } from '@meldui/tabler-vue'
import { DataTable, type DataTableFilterField, tableStateToServerParams } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import {
  extendedColumns,
  MOCK_USERS,
  minimalColumns,
  roleOptions,
  simulateServerSide,
  statusOptions,
  type TableState,
  type User,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Events',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Event handling examples showing how to capture and process table state changes.

The \`onServerSideChange\` callback receives:
- \`sorting\`: Current sort state
- \`filters\`: Current filter state
- \`pagination\`: Current page index and size

Use \`tableStateToServerParams\` utility to convert state to API-friendly format.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic event logging.
 * Shows the raw state object received in the callback.
 */
export const BasicEventLogging: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const eventLog = ref<string[]>([])
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        const timestamp = new Date().toLocaleTimeString()
        const logEntry = `[${timestamp}] State changed:\n${JSON.stringify(state, null, 2)}`
        eventLog.value = [logEntry, ...eventLog.value.slice(0, 4)]

        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      const clearLog = () => {
        eventLog.value = []
      }

      return { localData, pageCount, handleChange, columns: minimalColumns, eventLog, clearLog }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Sort columns, change pages, or search to see events logged below.
        </p>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          search-placeholder="Search users..."
        />

        <div class="p-4 bg-muted rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium">Event Log (last 5):</h4>
            <button
              @click="clearLog"
              class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80"
            >
              Clear
            </button>
          </div>
          <div v-if="eventLog.length" class="space-y-2">
            <pre v-for="(log, i) in eventLog" :key="i" class="text-xs p-2 bg-background rounded overflow-auto">{{ log }}</pre>
          </div>
          <p v-else class="text-xs text-muted-foreground">No events yet. Interact with the table.</p>
        </div>
      </div>
    `,
  }),
}

/**
 * Sorting events.
 * Shows how sorting state changes as you click column headers.
 */
export const SortingEvents: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const sortState = ref<string>('No sorting')
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        if (state.sorting.length > 0) {
          const { id, desc } = state.sorting[0]
          sortState.value = `Column: ${id}, Direction: ${desc ? 'Descending' : 'Ascending'}`
        } else {
          sortState.value = 'No sorting'
        }

        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns, sortState }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Click column headers to sort. The current sort state is displayed below.
        </p>

        <div class="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
          <span class="text-sm font-medium">Current Sort:</span>
          <span class="text-sm ml-2">{{ sortState }}</span>
        </div>

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
 * Filter events.
 * Shows how filter state changes as you apply filters.
 */
export const FilterEvents: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const filterState = ref<string>('No filters')
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
          placeholder: 'Filter email...',
        },
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
        if (state.filters.length > 0) {
          filterState.value = JSON.stringify(state.filters, null, 2)
        } else {
          filterState.value = 'No filters'
        }

        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        filterFields,
        filterState,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Apply filters to see the filter state structure.
        </p>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :filter-fields="filterFields"
          search-column="name"
          search-placeholder="Search..."
        />

        <div class="p-4 bg-muted rounded-lg">
          <h4 class="text-sm font-medium mb-2">Filter State:</h4>
          <pre class="text-xs overflow-auto">{{ filterState }}</pre>
        </div>
      </div>
    `,
  }),
}

/**
 * Pagination events.
 * Shows page changes as you navigate.
 */
export const PaginationEvents: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const pageInfo = ref({ pageIndex: 0, pageSize: 10, totalPages: 10 })
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (state: TableState) => {
        pageInfo.value = {
          pageIndex: state.pagination.pageIndex,
          pageSize: state.pagination.pageSize,
          totalPages: localData.value.meta.total_pages,
        }

        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return { localData, pageCount, handleChange, columns: minimalColumns, pageInfo }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Navigate pages or change page size to see pagination state.
        </p>

        <div class="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded flex gap-4">
          <div>
            <span class="text-xs text-muted-foreground">Page:</span>
            <span class="text-sm font-medium ml-1">{{ pageInfo.pageIndex + 1 }} of {{ pageInfo.totalPages }}</span>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">Page Size:</span>
            <span class="text-sm font-medium ml-1">{{ pageInfo.pageSize }}</span>
          </div>
        </div>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :page-size-options="[5, 10, 20, 50]"
          :default-per-page="10"
          :show-toolbar="false"
        />
      </div>
    `,
  }),
}

/**
 * Converting state to server params.
 * Uses tableStateToServerParams utility.
 */
export const ServerParamsConversion: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const serverParams = ref<string>('Apply filters to see server params')
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
          placeholder: 'Filter email...',
        },
        {
          id: 'age',
          label: 'Age',
          type: 'number',
          icon: IconHash,
          placeholder: 'Enter age',
        },
        {
          id: 'is_verified',
          label: 'Verified',
          type: 'boolean',
          icon: IconCheck,
        },
      ]

      const handleChange = (state: TableState) => {
        // Convert to server-friendly format
        const params = tableStateToServerParams(state, filterFields, 'name')
        serverParams.value = JSON.stringify(params, null, 2)

        console.log('Server params:', params)
        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: extendedColumns,
        filterFields,
        serverParams,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          The <code>tableStateToServerParams</code> utility converts table state to an API-friendly format.
          Apply filters, sort, or change pages to see the output.
        </p>

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

        <div class="p-4 bg-muted rounded-lg">
          <h4 class="text-sm font-medium mb-2">Server Params (API-ready format):</h4>
          <pre class="text-xs overflow-auto max-h-64">{{ serverParams }}</pre>
        </div>
      </div>
    `,
  }),
}

/**
 * Simulating API request.
 * Shows loading state during data fetch.
 */
export const SimulatedAPIRequest: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const isLoading = ref(false)
      const requestLog = ref<string[]>([])
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = async (state: TableState) => {
        isLoading.value = true
        const timestamp = new Date().toLocaleTimeString()

        // Log the request
        requestLog.value = [`[${timestamp}] Fetching data...`, ...requestLog.value.slice(0, 4)]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        localData.value = simulateServerSide(MOCK_USERS, state)

        // Log completion
        requestLog.value = [
          `[${timestamp}] Received ${localData.value.data.length} rows (total: ${localData.value.meta.total})`,
          ...requestLog.value.slice(0, 4),
        ]

        isLoading.value = false
      }

      return { localData, pageCount, handleChange, columns: minimalColumns, isLoading, requestLog }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Simulates API request with 500ms delay. In real apps, you'd make actual fetch calls here.
        </p>

        <div v-if="isLoading" class="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-center">
          <span class="text-sm">Loading data...</span>
        </div>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          search-placeholder="Search users..."
        />

        <div class="p-4 bg-muted rounded-lg">
          <h4 class="text-sm font-medium mb-2">Request Log:</h4>
          <div class="space-y-1">
            <p v-for="(log, i) in requestLog" :key="i" class="text-xs font-mono">{{ log }}</p>
            <p v-if="!requestLog.length" class="text-xs text-muted-foreground">No requests yet.</p>
          </div>
        </div>
      </div>
    `,
  }),
}

/**
 * Debounced search.
 * Demonstrates how to debounce search input for better UX.
 */
export const DebouncedSearch: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const searchCount = ref(0)
      const lastSearch = ref('')
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      // Note: The DataTable component already handles input changes efficiently.
      // This example shows how to track search requests.
      const handleChange = (state: TableState) => {
        const searchFilter = state.filters.find((f) => f.id === 'name')
        if (searchFilter) {
          searchCount.value++
          lastSearch.value = String(searchFilter.value)
        }

        localData.value = simulateServerSide(MOCK_USERS, state)
      }

      return {
        localData,
        pageCount,
        handleChange,
        columns: minimalColumns,
        searchCount,
        lastSearch,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Type in the search box. Each keystroke triggers a state change.
          Consider debouncing in your API handler for performance.
        </p>

        <div class="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded flex gap-4">
          <div>
            <span class="text-xs text-muted-foreground">Search requests:</span>
            <span class="text-sm font-medium ml-1">{{ searchCount }}</span>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">Last search:</span>
            <span class="text-sm font-medium ml-1">"{{ lastSearch || '(empty)' }}"</span>
          </div>
        </div>

        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          search-column="name"
          search-placeholder="Type to search..."
          :show-toolbar="true"
        />
      </div>
    `,
  }),
}
