/**
 * DataTable Events Examples
 *
 * Demonstrates the per-axis emit API. Each user interaction emits exactly one
 * of `update:sorting`, `update:filters`, or `update:pagination`. Parents
 * typically watch a merged computed (e.g., from `useDataTableController.state`)
 * to trigger a single fetch per user action.
 */

import {
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconCoin,
  IconHash,
  IconMail,
  IconMapPin,
  IconShield,
} from '@meldui/tabler-vue'
import {
  DataTable,
  type DataTableFilterField,
  type DataTableFilterState,
  tableStateToServerParams,
  useDataTableController,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { PaginationState, SortingState } from '@tanstack/vue-table'
import { computed, ref, watch } from 'vue'
import {
  MOCK_USERS,
  type ServerResponse,
  type User,
  departmentOptions,
  extendedColumns,
  locationOptions,
  minimalColumns,
  roleOptions,
  simulateServerSide,
  statusOptions,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Events',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Event handling examples for DataTable v2.

\`<DataTable>\` emits three v-model update events:

- \`update:sorting\` — payload \`SortingState\`
- \`update:filters\` — payload \`DataTableFilterState\` (includes search value under \`filterSearch.id\`)
- \`update:pagination\` — payload \`PaginationState\`

Use \`useDataTableController\` to bundle the three refs and watch the merged
\`state\` for data fetches. Use \`tableStateToServerParams\` to convert to a
typical REST API shape.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Sort + pagination events. The simplest event-logging demo — no filters,
 * just the two axes that work without `filter-fields`.
 */
export const SortAndPaginationEvents: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const eventLog = ref<string[]>([])
      const { sorting, pagination, state } = useDataTableController({ pageSize: 10 })
      const localData = ref<ServerResponse>(simulateServerSide(MOCK_USERS, state.value))
      watch(
        state,
        (s) => {
          localData.value = simulateServerSide(MOCK_USERS, s)
        },
        { deep: true },
      )

      const log = (kind: string, payload: unknown) => {
        const ts = new Date().toLocaleTimeString()
        eventLog.value = [
          `[${ts}] ${kind}:\n${JSON.stringify(payload, null, 2)}`,
          ...eventLog.value.slice(0, 9),
        ]
      }
      const clearLog = () => {
        eventLog.value = []
      }

      return {
        sorting,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        eventLog,
        clearLog,
        onSorting: (next: SortingState) => log('update:sorting', next),
        onPagination: (next: PaginationState) => log('update:pagination', next),
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Sort or paginate to see the corresponding event log entry.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
          @update:sorting="onSorting"
          @update:pagination="onPagination"
        />
        <div class="p-4 bg-muted rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium">Event Log (last 10):</h4>
            <button
              @click="clearLog"
              class="text-xs px-2 py-1 bg-secondary rounded hover:bg-secondary/80"
            >Clear</button>
          </div>
          <div v-if="eventLog.length" class="space-y-2">
            <pre v-for="(entry, i) in eventLog" :key="i" class="text-xs p-2 bg-background rounded overflow-auto">{{ entry }}</pre>
          </div>
          <p v-else class="text-xs text-muted-foreground">No events yet.</p>
        </div>
      </div>
    `,
  }),
}

/**
 * **The canonical comprehensive demo.** Every interactive surface is wired:
 * all 8 simple-mode filter types, search, sorting on every column, and
 * pagination. The event log on the right captures every `update:*` emit with
 * a timestamp; counters at the top tally each event type.
 *
 * Use this to see exactly what payload shape each interaction produces.
 */
export const AllEvents: Story = {
  render: () => ({
    components: { DataTable },
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

      // All 8 simple-mode filter types in one table.
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', icon: IconMail },
        { id: 'age', label: 'Age', type: 'number', icon: IconHash, min: 18, max: 100 },
        { id: 'role', label: 'Role', type: 'select', icon: IconShield, options: roleOptions },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          icon: IconCheck,
          options: statusOptions,
        },
        {
          id: 'department',
          label: 'Department',
          type: 'multiselect',
          icon: IconBuilding,
          options: departmentOptions,
        },
        {
          id: 'location',
          label: 'Location',
          type: 'multiselect',
          icon: IconMapPin,
          options: locationOptions,
        },
        { id: 'is_verified', label: 'Verified', type: 'boolean', icon: IconCheck },
        {
          id: 'salary',
          label: 'Salary',
          type: 'range',
          icon: IconCoin,
          range: [30000, 150000],
          step: 1000,
          unit: '$',
        },
        { id: 'created_at', label: 'Created', type: 'date', icon: IconCalendar },
        { id: 'last_login_at', label: 'Last login', type: 'daterange', icon: IconCalendar },
      ]

      // Search is delivered as a filter under `filterSearch.id`.
      const filterSearch = { id: 'name', placeholder: 'Search by name...' }

      type EventKind = 'sorting' | 'filters' | 'pagination'
      type EventEntry = { ts: string; kind: EventKind; payload: unknown }
      const events = ref<EventEntry[]>([])
      const counts = computed(() => {
        const c: Record<EventKind, number> = { sorting: 0, filters: 0, pagination: 0 }
        for (const e of events.value) c[e.kind]++
        return c
      })

      const log = (kind: EventKind, payload: unknown) => {
        events.value = [
          { ts: new Date().toLocaleTimeString(), kind, payload },
          ...events.value.slice(0, 19),
        ]
      }
      const clear = () => {
        events.value = []
      }

      return {
        sorting,
        filters,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
        filterSearch,
        events,
        counts,
        clear,
        onSorting: (next: SortingState) => log('sorting', next),
        onFilters: (next: DataTableFilterState) => log('filters', next),
        onPagination: (next: PaginationState) => log('pagination', next),
      }
    },
    template: `
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-2 text-sm">
          <div class="rounded-md border p-2 flex items-center justify-between">
            <code class="text-xs text-muted-foreground">update:sorting</code>
            <strong class="font-mono">{{ counts.sorting }}</strong>
          </div>
          <div class="rounded-md border p-2 flex items-center justify-between">
            <code class="text-xs text-muted-foreground">update:filters</code>
            <strong class="font-mono">{{ counts.filters }}</strong>
          </div>
          <div class="rounded-md border p-2 flex items-center justify-between">
            <code class="text-xs text-muted-foreground">update:pagination</code>
            <strong class="font-mono">{{ counts.pagination }}</strong>
          </div>
        </div>

        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          :filter-search="filterSearch"
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
          @update:sorting="onSorting"
          @update:filters="onFilters"
          @update:pagination="onPagination"
        />

        <div class="rounded-md border">
          <div class="flex items-center justify-between border-b p-2">
            <h4 class="text-sm font-medium">Event log (last 20)</h4>
            <button class="text-xs underline" @click="clear">Clear</button>
          </div>
          <div class="max-h-72 overflow-auto p-2 space-y-2">
            <div
              v-for="(e, i) in events"
              :key="i"
              class="text-xs bg-muted/50 rounded border p-2"
            >
              <div class="flex justify-between mb-1">
                <code class="font-medium">update:{{ e.kind }}</code>
                <span class="text-muted-foreground">{{ e.ts }}</span>
              </div>
              <pre class="overflow-auto">{{ JSON.stringify(e.payload, null, 2) }}</pre>
            </div>
            <p v-if="events.length === 0" class="text-xs text-muted-foreground p-4 text-center">
              No events yet — try sorting a column, typing in search, opening a filter, or paginating.
            </p>
          </div>
        </div>
      </div>
    `,
  }),
}

/**
 * Same as `AllEvents` but in advanced filter mode, so every filter payload
 * is wrapped in `[{ operator, value }]` form. Useful to see the difference
 * in payload shape between simple and advanced modes side-by-side.
 *
 * Multi-instance filters work in advanced mode too — click "Add filter →
 * Email" multiple times to see the array grow.
 */
export const AllEventsAdvancedMode: Story = {
  render: () => ({
    components: { DataTable },
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

      // Advanced mode requires base types (no multiselect/range/daterange).
      // Each field declares its preferred default operator.
      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          defaultOperator: 'contains',
        },
        { id: 'age', label: 'Age', type: 'number', icon: IconHash, defaultOperator: 'greaterThan' },
        {
          id: 'salary',
          label: 'Salary',
          type: 'number',
          icon: IconCoin,
          defaultOperator: 'between',
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          options: roleOptions,
          defaultOperator: 'isAnyOf',
        },
        {
          id: 'is_verified',
          label: 'Verified',
          type: 'boolean',
          icon: IconCheck,
          defaultOperator: 'is',
        },
        {
          id: 'created_at',
          label: 'Created',
          type: 'date',
          icon: IconCalendar,
          defaultOperator: 'isAfter',
        },
      ]

      const filterSearch = { id: 'name', placeholder: 'Search by name...' }

      return {
        sorting,
        filters,
        pagination,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: minimalColumns,
        filterFields,
        filterSearch,
      }
    },
    template: `
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          Advanced mode wraps every value in <code>{ operator, value }</code>. Open a filter,
          pick an operator, and watch the <code>filters</code> ref update on the right.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          :filter-search="filterSearch"
          advanced-mode
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
        <div class="rounded-md border p-3 bg-muted">
          <h4 class="text-sm font-medium mb-2">Current <code>filters</code>:</h4>
          <pre class="text-xs overflow-auto">{{ JSON.stringify(filters, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
}

/**
 * Converting merged state to server-side API params via `tableStateToServerParams`.
 *
 * Wires every interaction surface — all 8 simple-mode filter types, search,
 * sorting, pagination — and shows the resulting REST-shaped params live as
 * you interact. Useful when your backend expects
 * `{ page, per_page, sort_by, sort_order, filters }`.
 *
 * The third arg to `tableStateToServerParams` is the search column id; it
 * tells the helper to keep that filter's value as a plain string instead of
 * coercing to an array.
 */
export const StateToServerParams: Story = {
  render: () => ({
    components: { DataTable },
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

      // All 8 simple-mode filter types so every per-type transformation in
      // `tableStateToServerParams` is exercised.
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', icon: IconMail },
        { id: 'age', label: 'Age', type: 'number', icon: IconHash, min: 18, max: 100 },
        { id: 'role', label: 'Role', type: 'select', icon: IconShield, options: roleOptions },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          icon: IconCheck,
          options: statusOptions,
        },
        {
          id: 'department',
          label: 'Department',
          type: 'multiselect',
          icon: IconBuilding,
          options: departmentOptions,
        },
        {
          id: 'location',
          label: 'Location',
          type: 'multiselect',
          icon: IconMapPin,
          options: locationOptions,
        },
        { id: 'is_verified', label: 'Verified', type: 'boolean', icon: IconCheck },
        {
          id: 'salary',
          label: 'Salary',
          type: 'range',
          icon: IconCoin,
          range: [30000, 150000],
          step: 1000,
          unit: '$',
        },
        { id: 'created_at', label: 'Created', type: 'date', icon: IconCalendar },
        { id: 'last_login_at', label: 'Last login', type: 'daterange', icon: IconCalendar },
      ]

      // Search travels in `filters` under filterSearch.id. The helper's
      // third argument tells it to keep that key as a plain string.
      const filterSearch = { id: 'name', placeholder: 'Search by name...' }

      const serverParams = computed(() =>
        tableStateToServerParams(state.value, filterFields, filterSearch.id),
      )

      return {
        sorting,
        filters,
        pagination,
        serverParams,
        data: computed(() => localData.value.data),
        pageCount: computed(() => localData.value.meta.total_pages),
        totalRows: computed(() => localData.value.meta.total),
        columns: extendedColumns,
        filterFields,
        filterSearch,
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Sort, type in search, open each filter chip type, change pagination — and watch the
          REST-shaped params update live below. Range tuples become <code>{start, end}</code>;
          single text values are wrapped in arrays; etc.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          :filter-search="filterSearch"
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="rounded-md border p-3 bg-muted">
            <h4 class="text-sm font-medium mb-2">Raw <code>filters</code> ref</h4>
            <pre class="text-xs overflow-auto max-h-72">{{ JSON.stringify(filters, null, 2) }}</pre>
          </div>
          <div class="rounded-md border p-3 bg-muted">
            <h4 class="text-sm font-medium mb-2">Server params (<code>tableStateToServerParams</code>)</h4>
            <pre class="text-xs overflow-auto max-h-72">{{ JSON.stringify(serverParams, null, 2) }}</pre>
          </div>
        </div>
      </div>
    `,
  }),
}
