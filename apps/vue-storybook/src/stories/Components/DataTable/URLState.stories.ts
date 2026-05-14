/**
 * DataTable URL State Restoration
 *
 * Restore table state from URL query parameters and persist back on every change.
 * `useDataTableController` accepts `initialSorting` / `initialFilters` /
 * `initialPagination` for one-shot seed; a `watch(state, ...)` writes back.
 */

import { CalendarDate } from '@internationalized/date'
import {
  DataTable,
  type DataTableFilterField,
  type DataTableFilterState,
  useDataTableController,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { PaginationState, SortingState } from '@tanstack/vue-table'
import { computed, ref, watch } from 'vue'
import {
  MOCK_USERS,
  type ServerResponse,
  type User,
  extendedColumns,
  minimalColumns,
  roleOptions,
  simulateServerSide,
  statusOptions,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/URLState',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
URL-driven state restoration: seed the controller from query params on mount,
write back to the URL on every state change.

These stories simulate URL queries via static objects (no Vue Router required).
In a real app, replace the \`mockQuery\` with \`useRoute().query\` and the
\`persistedUrl\` ref with \`router.replace({ query: ... })\`.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const filterFields: DataTableFilterField<User>[] = [
  { id: 'email', label: 'Email', type: 'text' },
  { id: 'role', label: 'Role', type: 'select', options: roleOptions },
  { id: 'status', label: 'Status', type: 'multiselect', options: statusOptions },
]

/**
 * Restore sorting from `?sort=name:asc`.
 */
export const SortingFromURL: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const mockQuery = '?sort=name:asc'
      const initialSorting: SortingState = [{ id: 'name', desc: false }]
      const { sorting, pagination, state } = useDataTableController({
        pageSize: 10,
        initialSorting,
      })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        mockQuery,
        sorting,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">URL: <code>{{ mockQuery }}</code> → name asc.</p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Restore pagination from `?page=2&size=20`.
 */
export const PaginationFromURL: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const mockQuery = '?page=2&size=20'
      const initialPagination: PaginationState = { pageIndex: 1, pageSize: 20 }
      const { sorting, pagination, state } = useDataTableController({
        pageSize: 20,
        initialPagination,
      })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        mockQuery,
        sorting,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">URL: <code>{{ mockQuery }}</code> → start on page 2 with 20 rows.</p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Simple-mode filter restoration. Pre-applied: role = admin, status = [active].
 */
export const FiltersFromURL: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const mockQuery = '?role=admin&status=active'
      const initialFilters: DataTableFilterState = { role: 'admin', status: ['active'] }
      const { sorting, filters, pagination, state } = useDataTableController({
        pageSize: 10,
        initialFilters,
      })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        mockQuery,
        sorting,
        filters,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">URL: <code>{{ mockQuery }}</code> → role admin, active status pre-applied.</p>
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
 * Advanced-mode filter restoration. Payload shape: `[{ operator, value }]`.
 */
export const AdvancedFiltersFromURL: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const mockQuery = '?email[contains]=smith&age[greaterThan]=40'
      const initialFilters: DataTableFilterState = {
        email: [{ operator: 'contains', value: 'smith' }],
        age: [{ operator: 'greaterThan', value: 40 }],
      }
      const { sorting, filters, pagination, state } = useDataTableController({
        pageSize: 10,
        initialFilters,
      })
      const advancedFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', defaultOperator: 'contains' },
        { id: 'age', label: 'Age', type: 'number', defaultOperator: 'greaterThan' },
      ]
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        mockQuery,
        sorting,
        filters,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: extendedColumns,
        advancedFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">URL: <code>{{ mockQuery }}</code></p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="advancedFields"
          advanced-mode
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
        <pre class="text-xs p-2 bg-muted rounded">{{ JSON.stringify(filters, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * Read all three from URL, write back on every state change.
 * Encode / decode helpers shown inline.
 */
export const FullURLPersistence: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Simulated initial URL.
      const initialURL = '?sort=name:asc&page=2&size=10&role=admin'

      const parseQuery = (url: string): URLSearchParams =>
        new URLSearchParams(url.startsWith('?') ? url.slice(1) : url)

      const parseSorting = (q: URLSearchParams): SortingState => {
        const sort = q.get('sort')
        if (!sort) return []
        const [id, dir] = sort.split(':')
        return [{ id, desc: dir === 'desc' }]
      }

      const parsePagination = (q: URLSearchParams): PaginationState => ({
        pageIndex: Math.max(0, (Number(q.get('page')) || 1) - 1),
        pageSize: Number(q.get('size')) || 10,
      })

      const parseFilters = (q: URLSearchParams): DataTableFilterState => {
        const out: DataTableFilterState = {}
        const role = q.get('role')
        const status = q.getAll('status')
        if (role) out.role = role
        if (status.length) out.status = status
        return out
      }

      const encode = (s: {
        sorting: SortingState
        filters: DataTableFilterState
        pagination: PaginationState
      }): string => {
        const params = new URLSearchParams()
        if (s.sorting[0]) {
          params.set('sort', `${s.sorting[0].id}:${s.sorting[0].desc ? 'desc' : 'asc'}`)
        }
        if (s.pagination.pageIndex > 0) params.set('page', String(s.pagination.pageIndex + 1))
        if (s.pagination.pageSize !== 10) params.set('size', String(s.pagination.pageSize))
        if (typeof s.filters.role === 'string') params.set('role', s.filters.role)
        if (Array.isArray(s.filters.status)) {
          for (const v of s.filters.status as string[]) params.append('status', v)
        }
        return '?' + params.toString()
      }

      const initialQuery = parseQuery(initialURL)
      const { sorting, filters, pagination, state } = useDataTableController({
        pageSize: 10,
        initialSorting: parseSorting(initialQuery),
        initialFilters: parseFilters(initialQuery),
        initialPagination: parsePagination(initialQuery),
      })

      const persistedUrl = ref(initialURL)
      watch(
        state,
        (s) => {
          persistedUrl.value = encode(s)
        },
        { deep: true },
      )

      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )

      return {
        sorting,
        filters,
        pagination,
        persistedUrl,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm">Simulated URL: <code class="text-xs">{{ persistedUrl }}</code></p>
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
 * Date filter restoration with CalendarDate from @internationalized/date.
 */
export const DateFiltersFromURL: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const mockQuery = '?created_at=2024-01-15'
      const initialFilters: DataTableFilterState = {
        created_at: [new CalendarDate(2024, 1, 15)] as never,
      }
      const dateFields: DataTableFilterField<User>[] = [
        { id: 'created_at', label: 'Created', type: 'date' },
      ]
      const { sorting, filters, pagination, state } = useDataTableController({
        pageSize: 10,
        initialFilters,
      })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        mockQuery,
        sorting,
        filters,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: extendedColumns,
        dateFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">URL: <code>{{ mockQuery }}</code> → CalendarDate(2024, 1, 15).</p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="dateFields"
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}
