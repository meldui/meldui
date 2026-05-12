/**
 * Usage Examples — the 8 canonical wiring scenarios for DataTable v2.
 *
 * These mirror the plan's Examples 1–8 and demonstrate every combination of
 * internal / external sort / filter / pagination.
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Filters,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useDataTableController,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type {
  DataTableFilterField,
  DataTableFilterState,
  PaginationState,
  SortingState,
} from '@meldui/vue'
import { computed, onMounted, ref, watch } from 'vue'
import {
  MOCK_USERS,
  type ServerResponse,
  type User,
  departmentOptions,
  minimalColumns,
  roleOptions,
  simulateServerSide,
  statusOptions,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Usage Examples',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Canonical usage examples covering every combination of internal vs external
sort, filter, and pagination — plus the grid-view scenarios where DataTable
isn't rendered at all.

| # | Sorting  | Filter   | Pagination | Composable |
|---|----------|----------|------------|------------|
| 1 | internal | internal | internal   | yes        |
| 2 | internal | internal | internal   | no         |
| 3 | external | external | external   | yes        |
| 4 | internal | external | internal   | yes        |
| 5 | dropdown | external | external   | yes (grid) |
| 6 | internal | internal | internal   | yes (URL)  |
| 7 | mixed    | external | external   | yes (switchable) |
| 8 | dropdown | external | external   | no (grid)  |
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const filterFields: DataTableFilterField<User>[] = [
  { id: 'role', type: 'select', label: 'Role', options: roleOptions },
  { id: 'status', type: 'multiselect', label: 'Status', options: statusOptions },
  { id: 'department', type: 'multiselect', label: 'Department', options: departmentOptions },
]

/**
 * Example 1 — Everything internal (recommended).
 *
 * DataTable renders sort, filter, and pagination UI. Parent owns state via
 * `useDataTableController` and triggers fetches from a single watcher on the
 * merged `state` computed.
 */
export const Example1_FullyInternal: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      onMounted(() => {
        localData.value = simulateServerSide(MOCK_USERS, state.value)
      })
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
 * Example 2 — Everything internal, manual wiring (no composable).
 *
 * Same UI as Example 1; shows the boilerplate the composable removes. The
 * two `flush: 'sync'` watchers are load-bearing: without them, every filter
 * or sort change triggers two fetches.
 */
export const Example2_FullyInternalManual: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const sorting = ref<SortingState>([])
      const filters = ref<DataTableFilterState>({})
      const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 10 })

      // flush: 'sync' — without it, every filter/sort change fires fetchPage twice.
      watch(
        filters,
        () => {
          pagination.value = { ...pagination.value, pageIndex: 0 }
        },
        { deep: true, flush: 'sync' },
      )
      watch(
        sorting,
        () => {
          pagination.value = { ...pagination.value, pageIndex: 0 }
        },
        { deep: true, flush: 'sync' },
      )

      const localData = ref<ServerResponse>(
        simulateServerSide(MOCK_USERS, {
          sorting: sorting.value,
          filters: filters.value,
          pagination: pagination.value,
        }),
      )
      watch(
        [sorting, filters, pagination],
        () => {
          localData.value = simulateServerSide(MOCK_USERS, {
            sorting: sorting.value,
            filters: filters.value,
            pagination: pagination.value,
          })
        },
        { deep: true },
      )

      return {
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
 * Example 3 — Everything external. DataTable as pure renderer.
 *
 * Filters and Pagination are rendered as siblings; sorting is external too
 * (column headers render plain text). Same composable plumbing as Example 1.
 */
export const Example3_FullyExternal: Story = {
  render: () => ({
    components: { DataTable, Filters, Pagination },
    setup() {
      const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      void sorting
      return {
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
      <div class="space-y-4">
        <Filters v-model:filterValues="filters" :fields="filterFields" />
        <DataTable :data="data" :columns="columns" />
        <Pagination
          v-model:pagination="pagination"
          :page-count="pageCount"
          :total-rows="totalRows"
        />
      </div>
    `,
  }),
}

/**
 * Example 4 — Mixed: external filter, internal sort + pagination.
 *
 * Filter UI lives outside the table; sort and pagination remain inside.
 */
export const Example4_MixedExternalFilter: Story = {
  render: () => ({
    components: { DataTable, Filters },
    setup() {
      const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 10 })
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
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="rounded-md border p-3">
          <Filters v-model:filterValues="filters" :fields="filterFields" />
        </div>
        <DataTable
          :data="data"
          :columns="columns"
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
 * Example 5 — Grid view with composable. No DataTable; same state plumbing.
 *
 * Sort is a `<Select>` dropdown because there's no column header to attach to.
 */
export const Example5_GridViewWithComposable: Story = {
  render: () => ({
    components: {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
      Filters,
      Pagination,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 12 })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )

      const sortOptions = [
        {
          key: 'name-asc',
          label: 'Name (A→Z)',
          value: [{ id: 'name', desc: false }] as SortingState,
        },
        {
          key: 'name-desc',
          label: 'Name (Z→A)',
          value: [{ id: 'name', desc: true }] as SortingState,
        },
        {
          key: 'newest',
          label: 'Newest first',
          value: [{ id: 'created_at', desc: true }] as SortingState,
        },
      ]
      const sortKey = computed<string>({
        get() {
          const s = sorting.value[0]
          return (
            sortOptions.find((o) => o.value[0]?.id === s?.id && o.value[0]?.desc === s?.desc)
              ?.key ?? 'name-asc'
          )
        },
        set(k) {
          sorting.value = sortOptions.find((o) => o.key === k)?.value ?? []
        },
      })

      return {
        filters,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        filterFields,
        sortOptions,
        sortKey,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <Filters class="flex-1" v-model:filterValues="filters" :fields="filterFields" />
          <Select v-model="sortKey">
            <SelectTrigger class="w-48 h-8"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in sortOptions" :key="opt.key" :value="opt.key">{{ opt.label }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card v-for="user in data" :key="user.id">
            <CardHeader><CardTitle>{{ user.name }}</CardTitle></CardHeader>
            <CardContent><p>{{ user.role }} · {{ user.status }}</p></CardContent>
          </Card>
        </div>
        <Pagination
          v-model:pagination="pagination"
          :page-count="pageCount"
          :total-rows="totalRows"
        />
      </div>
    `,
  }),
}

/**
 * Example 6 — URL state restoration. Seed the controller from query params,
 * persist back to the URL on every change. Same DataTable wiring as Example 1.
 */
export const Example6_URLStateRestoration: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      // Simulated query params (a real app would read from useRoute()).
      const initialQuery = { page: 2, size: 20 }
      const { sorting, filters, pagination, state } = useDataTableController({
        pageSize: initialQuery.size,
        initialPagination: { pageIndex: initialQuery.page, pageSize: initialQuery.size },
      })
      const persistedUrl = ref('')
      watch(
        state,
        (s) => {
          persistedUrl.value =
            `?page=${s.pagination.pageIndex}` +
            `&size=${s.pagination.pageSize}` +
            (s.sorting[0] ? `&sort=${s.sorting[0].id}:${s.sorting[0].desc ? 'desc' : 'asc'}` : '')
        },
        { deep: true, immediate: true },
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
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
        persistedUrl,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Simulated URL: <code>{{ persistedUrl }}</code>
        </p>
        <DataTable
          :data="data"
          :columns="columns"
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
 * Example 7 — Switchable table / grid view. State is preserved across views
 * because it lives in the composable, not the rendering component.
 */
export const Example7_SwitchableView: Story = {
  render: () => ({
    components: {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
      DataTable,
      Filters,
      Pagination,
    },
    setup() {
      const view = ref<'table' | 'grid'>('table')
      const { sorting, filters, pagination, state } = useDataTableController({ pageSize: 12 })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )
      return {
        view,
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
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <button
            class="rounded-md border px-3 py-1 text-sm"
            :class="{ 'bg-primary text-primary-foreground': view === 'table' }"
            @click="view = 'table'"
          >Table</button>
          <button
            class="rounded-md border px-3 py-1 text-sm"
            :class="{ 'bg-primary text-primary-foreground': view === 'grid' }"
            @click="view = 'grid'"
          >Grid</button>
        </div>
        <Filters v-model:filterValues="filters" :fields="filterFields" />
        <DataTable
          v-if="view === 'table'"
          :data="data" :columns="columns"
          :page-count="pageCount" :total-rows="totalRows"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card v-for="user in data" :key="user.id">
            <CardHeader><CardTitle>{{ user.name }}</CardTitle></CardHeader>
            <CardContent><p>{{ user.role }} · {{ user.status }}</p></CardContent>
          </Card>
        </div>
        <Pagination
          v-if="view === 'grid'"
          v-model:pagination="pagination"
          :page-count="pageCount"
          :total-rows="totalRows"
        />
      </div>
    `,
  }),
}

/**
 * Example 8 — Grid view, no DataTable, no composable.
 *
 * Same UI as Example 5 but with all state and watchers wired manually.
 * Shows the cost of skipping the composable for a pure-grid scenario:
 * two explicit `flush: 'sync'` watchers.
 */
export const Example8_GridViewManual: Story = {
  render: () => ({
    components: {
      Card,
      CardContent,
      CardHeader,
      CardTitle,
      Filters,
      Pagination,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const sorting = ref<SortingState>([])
      const filters = ref<DataTableFilterState>({})
      const pagination = ref<PaginationState>({ pageIndex: 0, pageSize: 12 })

      watch(
        filters,
        () => {
          pagination.value = { ...pagination.value, pageIndex: 0 }
        },
        { deep: true, flush: 'sync' },
      )
      watch(
        sorting,
        () => {
          pagination.value = { ...pagination.value, pageIndex: 0 }
        },
        { deep: true, flush: 'sync' },
      )

      const merged = computed(() => ({
        sorting: sorting.value,
        filters: filters.value,
        pagination: pagination.value,
      }))
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, merged.value))
      watch(
        merged,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )

      const sortOptions = [
        {
          key: 'name-asc',
          label: 'Name (A→Z)',
          value: [{ id: 'name', desc: false }] as SortingState,
        },
        {
          key: 'name-desc',
          label: 'Name (Z→A)',
          value: [{ id: 'name', desc: true }] as SortingState,
        },
        {
          key: 'newest',
          label: 'Newest first',
          value: [{ id: 'created_at', desc: true }] as SortingState,
        },
      ]
      const sortKey = computed<string>({
        get() {
          const s = sorting.value[0]
          return (
            sortOptions.find((o) => o.value[0]?.id === s?.id && o.value[0]?.desc === s?.desc)
              ?.key ?? 'name-asc'
          )
        },
        set(k) {
          sorting.value = sortOptions.find((o) => o.key === k)?.value ?? []
        },
      })

      return {
        filters,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        filterFields,
        sortOptions,
        sortKey,
      }
    },
    template: `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
          <Filters class="flex-1" v-model:filterValues="filters" :fields="filterFields" />
          <Select v-model="sortKey">
            <SelectTrigger class="w-48 h-8"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="opt in sortOptions" :key="opt.key" :value="opt.key">{{ opt.label }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card v-for="user in data" :key="user.id">
            <CardHeader><CardTitle>{{ user.name }}</CardTitle></CardHeader>
            <CardContent><p>{{ user.role }} · {{ user.status }}</p></CardContent>
          </Card>
        </div>
        <Pagination
          v-model:pagination="pagination"
          :page-count="pageCount"
          :total-rows="totalRows"
        />
      </div>
    `,
  }),
}
