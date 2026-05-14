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
import { minimalColumns, useStoryData } from './_shared'

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
- Minimal table configuration with v-model
- Search input via filter field configuration
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

/**
 * Minimal DataTable setup — sorting + pagination internal, parent owns state.
 */
export const Minimal: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        :show-toolbar="false"
      />
    `,
  }),
}

/**
 * DataTable with search input — enable filter and configure `filterSearch`.
 *
 * Search lives inside the `<Filters>` row, so to render just a search bar you
 * still need three pieces:
 *   1. `enable-filter`     — turn on the filter toolbar (search is part of it)
 *   2. `:filter-search`    — `{ id, placeholder?, debounceMs? }` config
 *   3. `v-model:filters`   — search value is written under `filterSearch.id`
 *
 * `filter-fields` can be empty when you only want search.
 */
export const WithSearch: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterSearch = { id: 'name', placeholder: 'Search by name...' }
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterSearch,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-search="filterSearch"
        enable-sorting
        enable-filter
        enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Search with a custom debounce window.
 *
 * `filterSearch.debounceMs` controls how long the component waits after the
 * last keystroke before emitting the new value upward (default: 300ms). A
 * higher value reduces server-side query volume for fast typists; a lower
 * value makes search feel snappier.
 *
 * Open the browser console while typing — the `update:filters` log only
 * fires once the user pauses for ~800ms.
 */
export const WithSearchDebounce: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterSearch = {
        id: 'name',
        placeholder: 'Type to find users (800ms debounce)...',
        debounceMs: 800,
      }
      const onFilters = (next: unknown) => {
        // eslint-disable-next-line no-console
        console.log('[update:filters]', next)
      }
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterSearch,
        onFilters,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-search="filterSearch"
        enable-sorting
        enable-filter
        enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
        @update:filters="onFilters"
      />
    `,
  }),
}

/**
 * Custom default page size (20 items per page).
 */
export const CustomDefaultPageSize: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 20 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
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
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 5 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :page-size-options="[5, 15, 25, 50]"
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
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
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        :show-toolbar="false"
      />
    `,
  }),
}

/**
 * Table without pagination — relies on the data prop holding the entire set.
 */
export const WithoutPagination: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, data, totalRows } = useStoryData({ pageSize: 100 })
      return { sorting, data, totalRows, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :total-rows="totalRows"
        enable-sorting
        v-model:sorting="sorting"
        :show-toolbar="false"
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
      return { columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
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
      return { columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="[]"
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
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 50 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
        :show-toolbar="false"
        max-height="300px"
      />
    `,
  }),
}

/**
 * Recommended complete setup — sorting, search, and pagination wired with
 * the controller composable.
 */
export const RecommendedSetup: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterSearch = { id: 'name', placeholder: 'Search users...' }
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterSearch,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Recommended basic setup with search, sorting, and pagination.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-search="filterSearch"
          :page-size-options="[10, 20, 50, 100]"
          enable-sorting
          enable-filter
          enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}
