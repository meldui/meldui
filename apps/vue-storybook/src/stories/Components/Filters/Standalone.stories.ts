/**
 * Standalone <Filters>
 *
 * The <Filters> component renders the same filter UX used by <DataTable>
 * but works with any view (grid, card list, kanban). The parent owns the
 * data, listens via `v-model:filterValues` (or `@update:filter-values`),
 * and feeds filtered results to its view of choice.
 *
 * Search is part of the same component (via the `searchField` prop) and the
 * search value is included inside `filterValues` keyed by `searchField.id`
 * — there is no separate `searchValue` event field.
 */

import {
  IconBuilding,
  IconCalendar,
  IconCircleCheck,
  IconCurrencyDollar,
  IconHash,
  IconMail,
  IconMapPin,
  IconUser,
} from '@meldui/tabler-vue'
import { type DataTableFilterField, defineFilter, Filters, useFilters } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, defineComponent, h, ref } from 'vue'
import {
  type User,
  departmentOptions,
  locationOptions,
  MOCK_USERS,
  roleOptions,
  statusOptions,
} from '../DataTable/_shared'

// =====================================================================
// Field definitions covering every built-in filter type
// =====================================================================

const allTypeFields: DataTableFilterField<User>[] = [
  { id: 'name', label: 'Name', type: 'text', icon: IconUser, placeholder: 'Filter by name...' },
  { id: 'email', label: 'Email', type: 'text', icon: IconMail, placeholder: 'Filter by email...' },
  { id: 'role', label: 'Role', type: 'select', icon: IconBuilding, options: roleOptions },
  {
    id: 'status',
    label: 'Status',
    type: 'multiselect',
    icon: IconCircleCheck,
    options: statusOptions,
  },
  { id: 'department', label: 'Department', type: 'multiselect', options: departmentOptions },
  {
    id: 'location',
    label: 'Location',
    type: 'multiselect',
    icon: IconMapPin,
    options: locationOptions,
  },
  {
    id: 'age',
    label: 'Age',
    type: 'number',
    icon: IconHash,
    min: 18,
    max: 80,
    placeholder: 'Filter by age...',
  },
  {
    id: 'salary',
    label: 'Salary',
    type: 'range',
    icon: IconCurrencyDollar,
    range: [30000, 250000],
    step: 5000,
    unit: '$',
  },
  { id: 'is_verified', label: 'Verified', type: 'boolean' },
  { id: 'last_login_at', label: 'Last login', type: 'date', icon: IconCalendar },
  { id: 'created_at', label: 'Created', type: 'daterange', icon: IconCalendar },
]

// Advanced mode does not allow complex types (multiselect/range/daterange).
// The base equivalents are used with explicit defaultOperators.
const advancedFields: DataTableFilterField<User>[] = [
  { id: 'name', label: 'Name', type: 'text', icon: IconUser },
  { id: 'email', label: 'Email', type: 'text', icon: IconMail },
  { id: 'role', label: 'Role', type: 'select', icon: IconBuilding, options: roleOptions },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    icon: IconCircleCheck,
    options: statusOptions,
    defaultOperator: 'isAnyOf',
  },
  {
    id: 'department',
    label: 'Department',
    type: 'select',
    options: departmentOptions,
    defaultOperator: 'isAnyOf',
  },
  { id: 'age', label: 'Age', type: 'number', icon: IconHash, min: 18, max: 80 },
  {
    id: 'salary',
    label: 'Salary',
    type: 'number',
    icon: IconCurrencyDollar,
    defaultOperator: 'between',
  },
  { id: 'is_verified', label: 'Verified', type: 'boolean' },
  { id: 'last_login_at', label: 'Last login', type: 'date', icon: IconCalendar },
  {
    id: 'created_at',
    label: 'Created',
    type: 'date',
    icon: IconCalendar,
    defaultOperator: 'isBetween',
  },
]

// =====================================================================
// Custom plugin filter (rating slider)
// =====================================================================

const RatingFilterComponent = defineComponent({
  name: 'RatingFilter',
  props: {
    title: { type: String, default: 'Rating' },
    initialValue: { type: Number, default: undefined },
  },
  emits: ['valueChange', 'remove', 'close'],
  setup(props, { emit }) {
    const value = ref<number | undefined>(props.initialValue)
    return () =>
      h(
        'div',
        {
          class: 'flex items-center gap-2 border rounded-md h-8 px-2',
        },
        [
          h(
            'span',
            { class: 'text-xs text-muted-foreground whitespace-nowrap' },
            `${props.title}: ${value.value ?? '—'}`,
          ),
          h('input', {
            type: 'range',
            min: 0,
            max: 5,
            step: 1,
            value: value.value ?? 0,
            class: 'w-20',
            onInput: (e: Event) => {
              const v = Number((e.target as HTMLInputElement).value)
              value.value = v || undefined
              emit('valueChange', v || undefined)
            },
          }),
          h(
            'button',
            {
              class: 'text-xs underline',
              onClick: () => {
                value.value = undefined
                emit('valueChange', undefined)
                emit('remove')
              },
            },
            'clear',
          ),
        ],
      )
  },
})

const ratingFilterPlugin = defineFilter({
  type: 'rating',
  component: RatingFilterComponent,
})

const fieldsWithPlugin: DataTableFilterField<User>[] = [
  ...allTypeFields,
  // Plugin filter — id is a custom key (not in User); cast bypasses the
  // `id: keyof User` constraint since the field id is only a runtime string key.
  { id: 'rating' as unknown as keyof User, label: 'Star rating', type: 'rating' },
]

const meta: Meta<typeof Filters> = {
  title: 'Components/Filters/Standalone',
  component: Filters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
The standalone \`<Filters>\` component drives any view of the same dataset.
Pair it with a card grid, a virtualized list, or a custom layout.

Search is part of the same component via the \`searchField\` prop and the
search value is merged into \`filterValues\` keyed by \`searchField.id\`.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// =====================================================================
// Stories
// =====================================================================

/**
 * Every built-in filter type (text, number, date, select, boolean,
 * multiselect, range, daterange) plus debounced search input. The output
 * panel echoes the aggregated filterValues record on each change.
 */
export const AllFilterTypes: Story = {
  render: () => ({
    components: { Filters },
    setup() {
      const lastChange = ref<Record<string, unknown> | null>(null)
      return {
        fields: allTypeFields,
        lastChange,
        onChange: (next: Record<string, unknown>) => {
          lastChange.value = next
        },
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Open each filter pill to interact. Search is debounced ~300ms and surfaces under the searchField id.
        </p>
        <Filters
          :fields="fields"
          :search-field="{ id: 'q', placeholder: 'Search...' }"
          @update:filter-values="onChange"
        />
        <pre class="text-xs bg-muted p-3 rounded-md overflow-auto">{{ JSON.stringify(lastChange, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * Same field set in advanced mode. Each filter exposes operator selection
 * (contains, equals, isAnyOf, between, isBetween, etc.) and aggregates
 * into operator-tagged arrays suitable for server-side query builders.
 */
export const AdvancedMode: Story = {
  render: () => ({
    components: { Filters },
    setup() {
      const lastChange = ref<unknown>(null)
      return {
        fields: advancedFields,
        lastChange,
        onChange: (payload: unknown) => {
          lastChange.value = payload
        },
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Advanced mode: each filter shows an operator dropdown and supports multiple instances per field.
        </p>
        <Filters
          :fields="fields"
          :advanced-mode="true"
          :search-field="{ id: 'q' }"
          @update:filter-values="onChange"
        />
        <pre class="text-xs bg-muted p-3 rounded-md overflow-auto">{{ JSON.stringify(lastChange, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * MultiSelect filter showcase. Demonstrates the simple-mode multiselect UX
 * (checkbox list, badge pills). After this refactor MultiSelectFilter is
 * value-in/value-out and no longer renders facet count badges.
 */
export const MultiSelect: Story = {
  render: () => ({
    components: { Filters },
    setup() {
      const fields: DataTableFilterField<User>[] = [
        { id: 'status', label: 'Status', type: 'multiselect', options: statusOptions },
        { id: 'department', label: 'Department', type: 'multiselect', options: departmentOptions },
        { id: 'location', label: 'Location', type: 'multiselect', options: locationOptions },
      ]
      const lastChange = ref<unknown>(null)
      return {
        fields,
        lastChange,
        onChange: (p: unknown) => {
          lastChange.value = p
        },
      }
    },
    template: `
      <div class="space-y-4">
        <Filters :fields="fields" @update:filter-values="onChange" />
        <pre class="text-xs bg-muted p-3 rounded-md overflow-auto">{{ JSON.stringify(lastChange, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * Multi-instance filters: text/number/date/range/daterange support adding
 * multiple instances per field that aggregate into an array.
 */
export const MultiInstance: Story = {
  render: () => ({
    components: { Filters },
    setup() {
      const fields: DataTableFilterField<User>[] = [
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'age', label: 'Age', type: 'number', min: 18, max: 80 },
      ]
      const lastChange = ref<unknown>(null)
      return {
        fields,
        lastChange,
        onChange: (p: unknown) => {
          lastChange.value = p
        },
      }
    },
    template: `
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          Click the Filter button and add the same field multiple times — values aggregate into an array.
        </p>
        <Filters :fields="fields" @update:filter-values="onChange" />
        <pre class="text-xs bg-muted p-3 rounded-md overflow-auto">{{ JSON.stringify(lastChange, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * Plugin filter via defineFilter(). The custom Rating component is rendered
 * inline alongside built-in filter pills and emits valueChange like any
 * built-in filter.
 */
export const WithPluginFilter: Story = {
  render: () => ({
    components: { Filters },
    setup() {
      const lastChange = ref<unknown>(null)
      return {
        fields: fieldsWithPlugin,
        plugins: [ratingFilterPlugin],
        lastChange,
        onChange: (p: unknown) => {
          lastChange.value = p
        },
      }
    },
    template: `
      <div class="space-y-4">
        <Filters :fields="fields" :plugins="plugins" @update:filter-values="onChange" />
        <pre class="text-xs bg-muted p-3 rounded-md overflow-auto">{{ JSON.stringify(lastChange, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * External composable: parent instantiates useFilters() and passes the
 * result via the :state prop. Unlocks imperative access — programmatic
 * addFilter/resetAll, custom URL persistence, or driving multiple views.
 */
export const ExternalComposable: Story = {
  render: () => ({
    components: { Filters },
    setup() {
      const filtersState = useFilters<User>({
        filterFields: allTypeFields,
        searchField: { id: 'q' },
      })

      return {
        fields: allTypeFields,
        filtersState,
        addRoleFilter: () => filtersState.addFilter('role'),
        addNameFilter: () => filtersState.addFilter('name'),
        reset: () => filtersState.resetAll(),
      }
    },
    template: `
      <div class="space-y-4">
        <div class="flex gap-3 text-xs">
          <button class="underline" @click="addRoleFilter">addFilter('role')</button>
          <button class="underline" @click="addNameFilter">addFilter('name')</button>
          <button class="underline" @click="reset">resetAll()</button>
        </div>
        <Filters
          :state="filtersState"
          :fields="fields"
          :search-field="{ id: 'q' }"
        />
        <div class="text-xs">
          <strong>Aggregated values:</strong>
          <pre class="bg-muted p-3 rounded-md overflow-auto">{{ JSON.stringify(filtersState.filterValues.value, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
}

/**
 * Cross-view scenario: the same <Filters> drives a card grid view of users.
 * Filtering happens in the parent (here, in-memory; a real app would call
 * an API and replace the dataset).
 */
export const DrivesCardGrid: Story = {
  render: () => ({
    components: { Filters },
    setup() {
      const filtersState = useFilters<User>({
        filterFields: allTypeFields,
        searchField: { id: 'q', placeholder: 'Search users...' },
      })

      const visibleUsers = computed(() => {
        const values = filtersState.filterValues.value
        const search = (values.q as string | undefined)?.toLowerCase()
        return MOCK_USERS.filter((u) => {
          if (search && !`${u.name} ${u.email}`.toLowerCase().includes(search)) return false
          const nameFilter = values.name as string[] | undefined
          if (
            nameFilter?.length &&
            !nameFilter.some((n) => u.name.toLowerCase().includes(n.toLowerCase()))
          )
            return false
          const role = values.role as string | undefined
          if (role && u.role !== role) return false
          const statuses = values.status as string[] | undefined
          if (statuses?.length && !statuses.includes(u.status)) return false
          const departments = values.department as string[] | undefined
          if (departments?.length && !departments.includes(u.department)) return false
          return true
        }).slice(0, 12)
      })

      return { fields: allTypeFields, filtersState, visibleUsers }
    },
    template: `
      <div class="space-y-4">
        <Filters
          :state="filtersState"
          :fields="fields"
          :search-field="{ id: 'q', placeholder: 'Search users...' }"
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="u in visibleUsers"
            :key="u.id"
            class="border rounded-md p-3 space-y-1 bg-card"
          >
            <div class="font-medium text-sm">{{ u.name }}</div>
            <div class="text-xs text-muted-foreground">{{ u.email }}</div>
            <div class="text-xs">
              <span class="font-mono">{{ u.role }}</span> · {{ u.status }} · {{ u.department }}
            </div>
          </div>
          <div v-if="visibleUsers.length === 0" class="col-span-full text-center text-sm text-muted-foreground py-8">
            No users match the current filters.
          </div>
        </div>
      </div>
    `,
  }),
}

// The "DataTable in external-filter mode" story used to live here. It's
// now covered by Components/DataTable/Usage Examples / Example 4 (mixed:
// external filter + internal pagination/sort) under the v2 API.
