/**
 * DataTable State Examples
 *
 * Demonstrates loading, error, and empty state lifecycle.
 */

import { IconAlertTriangle, IconPlus, IconReload, IconUsers } from '@meldui/tabler-vue'
import { Button, DataTable } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, watch } from 'vue'
import { MOCK_USERS, minimalColumns, useStoryData } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/States',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
DataTable state lifecycle examples.

- **Loading**: shows skeleton rows while fetching.
- **Error**: renders an inline alert with a retry button; supports string or Error payloads.
- **Empty**: rendered when \`data.length === 0\`.

Each state can be customised via the \`#empty\` and \`#error\` slots.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Skeleton rows while loading. Headers remain visible.
 */
export const Loading: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :page-count="5"
        :loading="true"
        loading-message="Fetching users..."
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Toggle loading state to demonstrate the transition between loading and data.
 */
export const LoadingToggle: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const loading = ref(false)
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const toggle = () => {
        loading.value = true
        setTimeout(() => {
          loading.value = false
        }, 1200)
      }
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        loading,
        toggle,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-3">
        <Button variant="outline" size="sm" @click="toggle">Simulate 1.2s fetch</Button>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :loading="loading"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Error state with a string message. Built-in alert + retry button.
 */
export const ErrorString: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const onRetry = () => alert('Retry clicked — re-fetch your data here.')
      return { onRetry, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        error="Connection lost. Could not load users."
        @retry="onRetry"
      />
    `,
  }),
}

/**
 * Error state with an Error object. Message is extracted automatically.
 */
export const ErrorObject: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const error = new Error('Network request failed: ECONNREFUSED localhost:8080')
      return { error, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
        :error="error"
      />
    `,
  }),
}

/**
 * Retry resets the error ref and reloads data — typical recovery flow.
 */
export const ErrorWithRecovery: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const { sorting, pagination, state } = useStoryData({ pageSize: 10 })
      const error = ref<string | null>('Server returned 500')
      const data = ref<typeof MOCK_USERS>([])
      const pageCount = ref(0)
      const totalRows = ref(0)

      function fetchPage() {
        const next = MOCK_USERS.slice(0, state.value.pagination.pageSize)
        data.value = next
        pageCount.value = Math.ceil(MOCK_USERS.length / state.value.pagination.pageSize)
        totalRows.value = MOCK_USERS.length
      }

      const onRetry = () => {
        error.value = null
        fetchPage()
      }
      const breakIt = () => {
        error.value = 'Something went wrong again'
        data.value = []
      }

      watch(state, fetchPage, { deep: true })
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        error,
        onRetry,
        breakIt,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-3">
        <Button variant="outline" size="sm" @click="breakIt" :disabled="!!error">Break the API</Button>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :error="error ?? undefined"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
          @retry="onRetry"
        />
      </div>
    `,
  }),
}

/**
 * Empty state with the default empty message.
 */
export const Empty: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      return { columns: minimalColumns }
    },
    template: `
      <DataTable :columns="columns" :data="[]" empty-message="No users found." />
    `,
  }),
}

/**
 * Custom empty slot with icon, headline, description, and CTA.
 */
export const CustomEmptySlot: Story = {
  render: () => ({
    components: { DataTable, Button, IconUsers, IconPlus },
    setup() {
      return { columns: minimalColumns }
    },
    template: `
      <DataTable :columns="columns" :data="[]">
        <template #empty>
          <div class="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <IconUsers class="h-12 w-12 text-muted-foreground" />
            <div>
              <h4 class="text-base font-medium">No users yet</h4>
              <p class="text-sm text-muted-foreground">Get started by inviting your first user.</p>
            </div>
            <Button size="sm">
              <IconPlus class="mr-1 h-4 w-4" /> Invite User
            </Button>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Custom error slot with retry + refresh-page actions.
 */
export const CustomErrorSlot: Story = {
  render: () => ({
    components: { DataTable, Button, IconAlertTriangle, IconReload },
    setup() {
      return { columns: minimalColumns }
    },
    template: `
      <DataTable :columns="columns" :data="[]" error="API timeout">
        <template #error="{ error, retry }">
          <div class="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <IconAlertTriangle class="h-12 w-12 text-destructive" />
            <div>
              <h4 class="text-base font-medium">Could not load data</h4>
              <p class="text-sm text-muted-foreground">{{ typeof error === 'string' ? error : error.message }}</p>
            </div>
            <div class="flex gap-2">
              <Button size="sm" variant="outline" @click="retry">
                <IconReload class="mr-1 h-4 w-4" /> Retry
              </Button>
              <Button size="sm" variant="outline" @click="() => location.reload()">Refresh Page</Button>
            </div>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Toggleable cycle through data → loading → error → empty.
 */
export const AllStates: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const view = ref<'data' | 'loading' | 'error' | 'empty'>('data')
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const displayData = computed(() => (view.value === 'data' ? data.value : []))
      const error = computed(() => (view.value === 'error' ? 'Demo error message' : undefined))
      const loading = computed(() => view.value === 'loading')
      return {
        view,
        sorting,
        pagination,
        data: displayData,
        pageCount,
        totalRows,
        error,
        loading,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-3">
        <div class="flex gap-2">
          <Button :variant="view === 'data' ? 'default' : 'outline'" size="sm" @click="view = 'data'">Data</Button>
          <Button :variant="view === 'loading' ? 'default' : 'outline'" size="sm" @click="view = 'loading'">Loading</Button>
          <Button :variant="view === 'error' ? 'default' : 'outline'" size="sm" @click="view = 'error'">Error</Button>
          <Button :variant="view === 'empty' ? 'default' : 'outline'" size="sm" @click="view = 'empty'">Empty</Button>
        </div>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :loading="loading"
          :error="error"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}
