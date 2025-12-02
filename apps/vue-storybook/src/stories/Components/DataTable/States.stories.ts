/**
 * DataTable State Examples
 *
 * Demonstrates all table states in one consolidated story:
 * - Loading skeleton state
 * - Error state with retry functionality
 * - Empty state with custom slot
 * - Custom loading and error slots
 */

import { Button, DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { MOCK_USERS, minimalColumns, simulateServerSide, type TableState } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/States',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
DataTable state management examples.

These examples demonstrate:
- Loading skeleton during data fetches
- Error state with retry button
- Empty state with customization
- Custom slots for all states
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Loading state with skeleton animation.
 * When loading is true, the table displays skeleton rows matching the page size.
 */
export const Loading: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const handleChange = () => {}
      return { handleChange, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          The table shows skeleton rows while loading. Headers remain visible.
        </p>
        <DataTable
          :columns="columns"
          :data="[]"
          :page-count="5"
          :on-server-side-change="handleChange"
          :loading="true"
          loading-message="Fetching users from server..."
        />
      </div>
    `,
  }),
}

/**
 * Toggle loading state to see the transition between loading and data.
 */
export const LoadingToggle: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
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
        // Simulate network delay
        setTimeout(() => {
          localData.value = simulateServerSide(MOCK_USERS, state)
          loading.value = false
        }, 1500)
      }

      const simulateRefresh = () => {
        loading.value = true
        setTimeout(() => {
          loading.value = false
        }, 1500)
      }

      return {
        loading,
        localData,
        pageCount,
        handleChange,
        simulateRefresh,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <Button @click="simulateRefresh" :disabled="loading">
            {{ loading ? 'Loading...' : 'Simulate Refresh' }}
          </Button>
          <span class="text-sm text-muted-foreground">
            Click to toggle loading state, or try changing pages/sorting
          </span>
        </div>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="pageCount"
          :on-server-side-change="handleChange"
          :loading="loading"
          search-column="name"
        />
      </div>
    `,
  }),
}

/**
 * Error state with retry button.
 * Pass an error prop to display the error state.
 */
export const ErrorState: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const handleChange = () => {}
      const handleRetry = () => {
        console.log('Retry clicked')
        alert('Retry action triggered! In a real app, this would refetch data.')
      }

      return { handleChange, handleRetry, columns: minimalColumns }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Error state displays an alert with retry button.
        </p>
        <DataTable
          :columns="columns"
          :data="[]"
          :page-count="0"
          :on-server-side-change="handleChange"
          error="Failed to fetch users. The server returned a 500 error."
          @retry="handleRetry"
        />
      </div>
    `,
  }),
}

/**
 * Error with Error object instead of string.
 */
export const ErrorObject: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const handleChange = () => {}
      const error = new Error('Network request failed: ECONNREFUSED')

      return { handleChange, error, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :page-count="0"
        :on-server-side-change="handleChange"
        :error="error"
      />
    `,
  }),
}

/**
 * Simulated error with retry functionality.
 */
export const ErrorWithRetry: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const hasError = ref(true)
      const loading = ref(false)
      const localData = ref({ data: [] as typeof MOCK_USERS, meta: { total_pages: 0 } })

      const handleChange = (state: TableState) => {
        if (!hasError.value) {
          localData.value = simulateServerSide(MOCK_USERS, state)
        }
      }

      const handleRetry = () => {
        loading.value = true
        setTimeout(() => {
          hasError.value = false
          loading.value = false
          localData.value = simulateServerSide(MOCK_USERS, {
            sorting: [],
            filters: [],
            pagination: { pageIndex: 0, pageSize: 10 },
          })
        }, 1000)
      }

      const simulateError = () => {
        hasError.value = true
        localData.value = { data: [], meta: { total_pages: 0 } }
      }

      return {
        hasError,
        loading,
        localData,
        handleChange,
        handleRetry,
        simulateError,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <Button v-if="!hasError" variant="outline" @click="simulateError">
          Simulate Error
        </Button>
        <DataTable
          :columns="columns"
          :data="localData.data"
          :page-count="localData.meta.total_pages"
          :on-server-side-change="handleChange"
          :error="hasError ? 'Connection failed. Please check your network.' : undefined"
          :loading="loading"
          @retry="handleRetry"
        />
      </div>
    `,
  }),
}

/**
 * Empty state with default message.
 */
export const Empty: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const handleChange = () => {}
      return { handleChange, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :page-count="0"
        :on-server-side-change="handleChange"
        empty-message="No users found."
      />
    `,
  }),
}

/**
 * Custom empty state using the #empty slot.
 */
export const CustomEmptySlot: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const handleChange = () => {}
      const handleAddNew = () => {
        alert('Add new user clicked!')
      }

      return { handleChange, handleAddNew, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :page-count="0"
        :on-server-side-change="handleChange"
      >
        <template #empty="{ message, columns }">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="rounded-full bg-muted p-4 mb-4">
              <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">No users yet</h3>
            <p class="text-sm text-muted-foreground mb-4 max-w-sm">
              Get started by adding your first user to the system.
            </p>
            <Button @click="handleAddNew">
              Add Your First User
            </Button>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Custom error slot for completely custom error rendering.
 */
export const CustomErrorSlot: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const handleChange = () => {}

      return { handleChange, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :page-count="0"
        :on-server-side-change="handleChange"
        error="Custom error message"
      >
        <template #error="{ error, retry }">
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="rounded-full bg-destructive/10 p-4 mb-4">
              <svg class="h-8 w-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2 text-destructive">Oops! Something went wrong</h3>
            <p class="text-sm text-muted-foreground mb-4 max-w-sm">
              We couldn't load the data. This might be a temporary issue.
            </p>
            <div class="flex gap-2">
              <Button variant="outline" @click="retry">
                Try Again
              </Button>
              <Button variant="ghost" @click="() => window.location.reload()">
                Refresh Page
              </Button>
            </div>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * All states controllable - toggle between loading, error, and empty.
 */
export const AllStates: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const state = ref<'data' | 'loading' | 'error' | 'empty'>('data')
      const localData = ref(
        simulateServerSide(MOCK_USERS, {
          sorting: [],
          filters: [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }),
      )

      const pageCount = computed(() => localData.value.meta.total_pages)

      const handleChange = (tableState: TableState) => {
        if (state.value === 'data') {
          localData.value = simulateServerSide(MOCK_USERS, tableState)
        }
      }

      const handleRetry = () => {
        state.value = 'loading'
        setTimeout(() => {
          state.value = 'data'
        }, 1000)
      }

      const isLoading = computed(() => state.value === 'loading')
      const errorMessage = computed(() =>
        state.value === 'error' ? 'Simulated error for demo' : undefined,
      )
      const displayData = computed(() => (state.value === 'empty' ? [] : localData.value.data))
      const displayPageCount = computed(() => (state.value === 'empty' ? 0 : pageCount.value))

      return {
        state,
        isLoading,
        errorMessage,
        displayData,
        displayPageCount,
        handleChange,
        handleRetry,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button
            :variant="state === 'data' ? 'default' : 'outline'"
            size="sm"
            @click="state = 'data'"
          >
            Show Data
          </Button>
          <Button
            :variant="state === 'loading' ? 'default' : 'outline'"
            size="sm"
            @click="state = 'loading'"
          >
            Show Loading
          </Button>
          <Button
            :variant="state === 'error' ? 'default' : 'outline'"
            size="sm"
            @click="state = 'error'"
          >
            Show Error
          </Button>
          <Button
            :variant="state === 'empty' ? 'default' : 'outline'"
            size="sm"
            @click="state = 'empty'"
          >
            Show Empty
          </Button>
        </div>
        <DataTable
          :columns="columns"
          :data="displayData"
          :page-count="displayPageCount"
          :on-server-side-change="handleChange"
          :loading="isLoading"
          :error="errorMessage"
          search-column="name"
          @retry="handleRetry"
        />
      </div>
    `,
  }),
}
