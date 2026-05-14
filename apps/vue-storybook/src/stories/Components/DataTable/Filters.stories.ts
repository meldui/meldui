/**
 * DataTable Filter Examples
 *
 * Covers all 8 built-in filter types in simple mode, 8 operator-mode scenarios,
 * and the custom filter plugin pattern.
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
  IconUser,
} from '@meldui/tabler-vue'
import {
  Badge,
  Button,
  DataTable,
  type DataTableFilterField,
  Popover,
  PopoverContent,
  PopoverTrigger,
  defineFilter,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, defineComponent, h, ref, watch } from 'vue'
import {
  type User,
  departmentOptions,
  extendedColumns,
  locationOptions,
  minimalColumns,
  roleOptions,
  statusOptions,
  useStoryData,
} from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Filters',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
DataTable filters live inside the toolbar when \`enable-filter="true"\` is set.
The 8 built-in filter types are: \`text\`, \`number\`, \`select\`, \`multiselect\`,
\`boolean\`, \`range\`, \`date\`, \`daterange\`.

**Simple mode** (default) uses each type's natural payload shape.
**Advanced mode** (\`advancedMode: true\`) wraps every value in
\`[{ operator, value }]\`, enables operator selection per field, and supports
multiple chip instances per field.

Custom filter types can be defined via \`defineFilter({ type, component, operators })\`
and passed to the DataTable via the \`:filter-plugins\` prop.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// SEARCH PATTERNS — three ways to set up search
// ============================================================================
//
// The toolbar's filter row (rendered when `enable-filter` is true) hosts BOTH
// a search input and the filter chips. You can use either, neither, or both.
// These three stories make the relationship explicit.

/**
 * **Search only.** `filterSearch` is provided; `filter-fields` is empty.
 *
 * The toolbar shows just the search input — no "Add filter" command, no chips.
 * The search string is stored under `filterSearch.id` (`'name'` here) inside
 * the `filters` ref.
 *
 * Use this when the data set is small and free-text matching is enough.
 */
export const SearchOnly: Story = {
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
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Just <code>:filter-search</code> + <code>enable-filter</code> +
          <code>v-model:filters</code>. No <code>filter-fields</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-search="filterSearch"
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
        <pre class="rounded-md bg-muted p-2 text-xs">{{ JSON.stringify(filters, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * **Filter chips only.** `filter-fields` is provided; `filterSearch` is omitted.
 *
 * The toolbar shows the "Add filter" command and any active chips — but no
 * always-visible search input. Use this when free-text search isn't meaningful
 * (e.g., when every column is a structured value).
 */
export const FilterChipsOnly: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'role', label: 'Role', type: 'select', icon: IconShield, options: roleOptions },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          icon: IconCheck,
          options: statusOptions,
        },
        { id: 'is_verified', label: 'Verified', type: 'boolean', icon: IconCheck },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Just <code>:filter-fields</code>. Click "Add filter" to add chips.
        </p>
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
        <pre class="rounded-md bg-muted p-2 text-xs">{{ JSON.stringify(filters, null, 2) }}</pre>
      </div>
    `,
  }),
}

/**
 * **Search + filter chips.** Both `filterSearch` and `filter-fields` are provided.
 *
 * The toolbar renders the search input first, then any active chips, then the
 * "Add filter" command. The single `filters` record holds both — search value
 * under `filterSearch.id`, chip values under their respective field ids.
 *
 * This is the most common production setup.
 */
export const SearchAndFilterChips: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterSearch = { id: 'name', placeholder: 'Search by name...' }
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'role', label: 'Role', type: 'select', icon: IconShield, options: roleOptions },
        {
          id: 'status',
          label: 'Status',
          type: 'multiselect',
          icon: IconCheck,
          options: statusOptions,
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterSearch,
        filterFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Both <code>:filter-search</code> and <code>:filter-fields</code>. Try typing in the
          search box and adding a Role chip — both appear in the same <code>filters</code> ref.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-search="filterSearch"
          :filter-fields="filterFields"
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
        <pre class="rounded-md bg-muted p-2 text-xs">{{ JSON.stringify(filters, null, 2) }}</pre>
      </div>
    `,
  }),
}

// ============================================================================
// SIMPLE MODE — every built-in type
// ============================================================================

/**
 * Text filter — partial match (contains).
 */
export const TextFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          placeholder: 'Filter by email',
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * Number filter — exact match with min/max/step validation.
 */
export const NumberFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'age', label: 'Age', type: 'number', icon: IconHash, min: 18, max: 100, unit: 'yrs' },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * Select filter — single-choice radio list.
 */
export const SelectFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'role', label: 'Role', type: 'select', icon: IconShield, options: roleOptions },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * MultiSelect filter — checkbox list (OR within the same field).
 */
export const MultiSelectFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
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
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * Boolean filter — switch toggle.
 */
export const BooleanFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'is_verified', label: 'Verified', type: 'boolean', icon: IconCheck },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * Range filter — slider for value ranges.
 */
export const RangeFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'salary',
          label: 'Salary',
          type: 'range',
          icon: IconCoin,
          range: [30000, 150000],
          step: 1000,
          unit: '$',
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * Date filter — single date picker.
 */
export const DateFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'created_at', label: 'Created at', type: 'date', icon: IconCalendar },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * Date-range filter — start + end calendar picker.
 */
export const DateRangeFilter: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'last_login_at', label: 'Last login', type: 'daterange', icon: IconCalendar },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
 * Every built-in filter type in one table.
 */
export const AllFilterTypesCombined: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
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
        { id: 'is_verified', label: 'Verified', type: 'boolean', icon: IconCheck },
        {
          id: 'salary',
          label: 'Salary',
          type: 'range',
          icon: IconCoin,
          range: [30000, 150000],
          step: 1000,
        },
        { id: 'created_at', label: 'Created at', type: 'date', icon: IconCalendar },
        { id: 'last_login_at', label: 'Last login', type: 'daterange', icon: IconCalendar },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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

// ============================================================================
// ADVANCED MODE — operator selection per field
// ============================================================================

/**
 * Text in advanced mode — operators: contains / equals / startsWith / endsWith / isEmpty / etc.
 */
export const TextOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', icon: IconMail, defaultOperator: 'contains' },
        { id: 'name', label: 'Name', type: 'text', icon: IconUser, defaultOperator: 'startsWith' },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
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
        advanced-mode
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Number operators — equals / greaterThan / lessThan / between.
 */
export const NumberOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'age', label: 'Age', type: 'number', icon: IconHash, defaultOperator: 'greaterThan' },
        {
          id: 'salary',
          label: 'Salary',
          type: 'number',
          icon: IconCoin,
          defaultOperator: 'between',
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
        advanced-mode
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Date operators — is / isBefore / isAfter / isBetween.
 */
export const DateOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'created_at',
          label: 'Created',
          type: 'date',
          icon: IconCalendar,
          defaultOperator: 'isAfter',
        },
        {
          id: 'last_login_at',
          label: 'Last login',
          type: 'date',
          icon: IconCalendar,
          defaultOperator: 'isBetween',
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
        advanced-mode
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Select operators — is / isAnyOf / isNot / isNoneOf.
 */
export const SelectOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          icon: IconShield,
          options: roleOptions,
          defaultOperator: 'isAnyOf',
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
        advanced-mode
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Boolean operators — is / isEmpty / isNotEmpty.
 */
export const BooleanOperators: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'is_verified',
          label: 'Verified',
          type: 'boolean',
          icon: IconCheck,
          defaultOperator: 'is',
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: extendedColumns,
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
        advanced-mode
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Restrict the operator list via `availableOperators`.
 */
export const AvailableOperatorsSubset: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        {
          id: 'email',
          label: 'Email',
          type: 'text',
          icon: IconMail,
          defaultOperator: 'contains',
          availableOperators: ['contains', 'startsWith', 'endsWith'],
        },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Email field only exposes contains / startsWith / endsWith (no equals, no isEmpty, etc.)
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          advanced-mode
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
 * Multiple chip instances per field — only available in advanced mode.
 */
export const MultipleInstancesPerField: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', icon: IconMail, defaultOperator: 'contains' },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Click "Add filter → Email" multiple times — each chip is an independent instance.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          advanced-mode
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
 * Live view of the advanced-mode payload format `[{ operator, value }]`.
 */
export const AdvancedPayloadFormat: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 5,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', icon: IconMail, defaultOperator: 'contains' },
        { id: 'role', label: 'Role', type: 'select', options: roleOptions, defaultOperator: 'is' },
        { id: 'age', label: 'Age', type: 'number', defaultOperator: 'greaterThan' },
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterFields,
      }
    },
    template: `
      <div class="space-y-3">
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          advanced-mode
          enable-sorting enable-filter enable-pagination
          v-model:sorting="sorting"
          v-model:filters="filters"
          v-model:pagination="pagination"
        />
        <div class="p-3 bg-muted rounded-md">
          <h4 class="text-sm font-medium mb-1">filters payload:</h4>
          <pre class="text-xs">{{ JSON.stringify(filters, null, 2) }}</pre>
        </div>
      </div>
    `,
  }),
}

// ============================================================================
// CUSTOM FILTER PLUGINS
// ============================================================================

/**
 * A small "star rating" filter component. Demonstrates the `FilterPluginComponentProps`
 * contract: receives `title`, `icon`, `defaultOpen`, `initialValue`; emits
 * `value-change`, `remove`, `close`.
 */
const RatingFilter = defineComponent<{
  title: string
  icon?: unknown
  defaultOpen?: boolean
  openTrigger?: number
  initialValue?: number
}>({
  props: {
    title: { type: String, required: true },
    icon: { type: Object as never, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    openTrigger: { type: Number, default: 0 },
    initialValue: { type: Number, default: undefined },
  },
  emits: ['value-change', 'remove', 'close'],
  setup(props, { emit }) {
    const open = ref(props.defaultOpen)
    const rating = ref<number | undefined>(props.initialValue)
    watch(
      () => props.openTrigger,
      () => {
        open.value = true
      },
    )
    const setRating = (n: number) => {
      rating.value = rating.value === n ? undefined : n
      emit('value-change', rating.value)
    }
    const label = computed(() =>
      rating.value === undefined ? '' : `: ${'★'.repeat(rating.value)}`,
    )
    return () =>
      h(
        Popover,
        {
          open: open.value,
          'onUpdate:open': (v: boolean) => {
            open.value = v
            if (!v) emit('close')
          },
        },
        () => [
          h(PopoverTrigger, { asChild: true }, () =>
            h(
              Button,
              { variant: 'outline', size: 'sm', class: 'h-8 border-dashed' },
              () => `${props.title}${label.value}`,
            ),
          ),
          h(PopoverContent, { class: 'w-48' }, () =>
            h(
              'div',
              { class: 'flex gap-1' },
              [1, 2, 3, 4, 5].map((n) =>
                h(
                  'button',
                  {
                    class: 'text-xl hover:scale-110 transition',
                    onClick: () => setRating(n),
                  },
                  rating.value !== undefined && n <= rating.value ? '★' : '☆',
                ),
              ),
            ),
          ),
        ],
      )
  },
})

const ratingPlugin = defineFilter({
  type: 'rating',
  component: RatingFilter,
  operators: ['equals', 'greaterThanOrEqual', 'lessThanOrEqual'],
  defaultOperator: 'equals',
  supportsMultiInstance: false,
})

/**
 * Register a custom filter plugin via `defineFilter()`.
 * The plugin's `type` becomes a usable filter field type.
 */
export const DefineRatingPlugin: Story = {
  render: () => ({
    components: { DataTable, Badge },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        // The 'rating' type is provided by ratingPlugin.
        // We attach an arbitrary id (we use 'age' so simulateServerSide has data).
        { id: 'age', label: 'Rating', type: 'rating' as never, icon: IconShield } as never,
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterFields,
        filterPlugins: [ratingPlugin],
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          The "Rating" filter is a custom plugin registered via <code>defineFilter()</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          :filter-plugins="filterPlugins"
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
 * Plugin filter alongside built-in types in simple mode.
 */
export const PluginInSimpleMode: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'email', label: 'Email', type: 'text', icon: IconMail },
        { id: 'role', label: 'Role', type: 'select', options: roleOptions },
        { id: 'age', label: 'Rating', type: 'rating' as never, icon: IconShield } as never,
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterFields,
        filterPlugins: [ratingPlugin],
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :filter-fields="filterFields"
        :filter-plugins="filterPlugins"
        enable-sorting enable-filter enable-pagination
        v-model:sorting="sorting"
        v-model:filters="filters"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Plugin filter in advanced mode — uses the plugin's operators.
 */
export const PluginInAdvancedMode: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, filters, pagination, data, pageCount, totalRows } = useStoryData({
        pageSize: 10,
      })
      const filterFields: DataTableFilterField<User>[] = [
        { id: 'age', label: 'Rating', type: 'rating' as never, icon: IconShield } as never,
      ]
      return {
        sorting,
        filters,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        filterFields,
        filterPlugins: [ratingPlugin],
      }
    },
    template: `
      <div class="space-y-3">
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :filter-fields="filterFields"
          :filter-plugins="filterPlugins"
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
