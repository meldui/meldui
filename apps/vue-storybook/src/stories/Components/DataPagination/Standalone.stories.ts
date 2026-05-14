/**
 * Standalone DataPagination Composite
 *
 * The `<DataPagination>` composite is decoupled from DataTable and can drive any
 * list view (cards, custom layouts, etc.). It takes a single `:pagination`
 * v-model of shape `{ pageIndex, pageSize }` plus display-only props.
 */

import { DataPagination } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { PaginationState } from '@tanstack/vue-table'
import { ref } from 'vue'

const meta: Meta<typeof DataPagination> = {
  title: 'Components/DataPagination/Standalone',
  component: DataPagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The standalone \`<DataPagination>\` composite mirrors the pagination footer
of \`<DataTable>\` but takes plain props — no TanStack \`Table\` instance
required.

Bind the same \`pagination\` ref to both \`<DataTable>\`'s
\`v-model:pagination\` and a sibling \`<DataPagination>\` and they stay in
sync via Vue reactivity.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Basic usage with v-model.
 */
export const Default: Story = {
  render: () => ({
    components: { DataPagination },
    setup() {
      const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
      return { pagination }
    },
    template: `
      <div class="space-y-2">
        <pre class="rounded-md bg-muted p-2 text-xs">{{ pagination }}</pre>
        <DataPagination v-model:pagination="pagination" :page-count="10" :total-rows="100" />
      </div>
    `,
  }),
}

/**
 * Custom page size options.
 */
export const CustomPageSizeOptions: Story = {
  render: () => ({
    components: { DataPagination },
    setup() {
      const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 25 })
      return { pagination }
    },
    template: `
      <Pagination
        v-model:pagination="pagination"
        :page-count="20"
        :total-rows="500"
        :page-size-options="[25, 50, 100, 250]"
      />
    `,
  }),
}

/**
 * Hide the page-size selector.
 */
export const HidePageSizeSelector: Story = {
  render: () => ({
    components: { DataPagination },
    setup() {
      const pagination = ref<PaginationState>({ pageIndex: 2, pageSize: 10 })
      return { pagination }
    },
    template: `
      <Pagination
        v-model:pagination="pagination"
        :page-count="10"
        :show-page-size-selector="false"
      />
    `,
  }),
}

/**
 * Hide the page info.
 */
export const HidePageInfo: Story = {
  render: () => ({
    components: { DataPagination },
    setup() {
      const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
      return { pagination }
    },
    template: `
      <Pagination
        v-model:pagination="pagination"
        :page-count="10"
        :show-page-info="false"
      />
    `,
  }),
}

/**
 * Selected count display.
 */
export const WithSelectedCount: Story = {
  render: () => ({
    components: { DataPagination },
    setup() {
      const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
      return { pagination }
    },
    template: `
      <Pagination
        v-model:pagination="pagination"
        :page-count="10"
        :total-rows="100"
        :selected-count="7"
        show-selected-count
      />
    `,
  }),
}

/**
 * Empty state (pageCount = 0). All buttons disabled.
 */
export const EmptyState: Story = {
  render: () => ({
    components: { DataPagination },
    setup() {
      const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })
      return { pagination }
    },
    template: `
      <Pagination
        v-model:pagination="pagination"
        :page-count="0"
        :total-rows="0"
      />
    `,
  }),
}
