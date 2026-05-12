/**
 * useDataTableController — the parent-side helper that bundles sorting / filters /
 * pagination refs, applies the filter→page and sort→page reset rules with
 * `flush: 'sync'`, and exposes a single merged `state` computed for the parent's
 * fetch watcher.
 */

import { DataTable, useDataTableController } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref, watch } from 'vue'
import {
  MOCK_USERS,
  type ServerResponse,
  type User,
  minimalColumns,
  roleOptions,
  simulateServerSide,
  statusOptions,
} from './_shared'
import type { DataTableFilterField } from '@meldui/vue'

const meta = {
  title: 'Components/DataTable/useDataTableController',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`useDataTableController\` is the parent-side helper. It owns the three v-model
refs and encapsulates the page-reset rule.

**Options:**

| Option                    | Default | Behaviour |
|--------------------------|---------|-----------|
| \`pageSize\`               | 10      | Initial page size when \`initialPagination\` isn't supplied. |
| \`initialSorting\`         | \`[]\`  | Initial \`SortingState\`. |
| \`initialFilters\`         | \`{}\`  | Initial \`DataTableFilterState\`. |
| \`initialPagination\`      | derived | Full initial \`PaginationState\`. |
| \`resetPageOnFilterChange\` | \`true\` | Reset \`pageIndex\` to 0 on filter mutations. |
| \`resetPageOnSortChange\`   | \`true\` | Reset \`pageIndex\` to 0 on sort mutations. |

**Returns:** \`{ sorting, filters, pagination, state, reset }\` — bind the three
refs as v-models on \`<DataTable>\` and watch \`state\` for data fetches.
        `,
      },
    },
  },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

const filterFields: DataTableFilterField<User>[] = [
  { id: 'role', type: 'select', label: 'Role', options: roleOptions },
  { id: 'status', type: 'multiselect', label: 'Status', options: statusOptions },
]

/**
 * Default options. Reset to defaults via the exposed `reset()` method.
 */
export const Default: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const controller = useDataTableController({ pageSize: 10 })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, controller.state.value))
      watch(
        controller.state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        ...controller,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-2">
        <button class="rounded-md border px-3 py-1 text-sm" @click="reset()">
          Reset (sorting + filters + pageIndex)
        </button>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Seed initial state — equivalent to URL state restoration on page refresh.
 *
 * The composable doesn't validate that the seeded `pageIndex` is within the
 * filtered dataset's bounds — that's the parent's job. If a URL like
 * `?page=5&role=admin` is bookmarked while the admin pool was large and the
 * data later shrinks, the parent should clamp `pageIndex` to
 * `pageCount - 1` after the first fetch resolves.
 *
 * This demo seeds page 2 (`pageIndex: 1`) with `role: 'user'` because there
 * are enough users for that page to exist.
 */
export const WithInitialState: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const controller = useDataTableController({
        pageSize: 10,
        initialSorting: [{ id: 'name', desc: false }],
        initialFilters: { role: 'user' },
        initialPagination: { pageIndex: 1, pageSize: 10 },
      })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, controller.state.value))
      watch(
        controller.state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        ...controller,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-fields="filterFields"
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Opt out of sort-change pagination reset. Page index is preserved when
 * the user changes sort. Use sparingly — generally industry behaviour is to
 * reset.
 */
export const DisableSortReset: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const controller = useDataTableController({
        pageSize: 10,
        resetPageOnSortChange: false,
      })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, controller.state.value))
      watch(
        controller.state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        ...controller,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}
