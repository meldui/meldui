/**
 * DataTable Customization Examples
 *
 * Visual customisation via slots, density modes, row styling functions,
 * and visual flags like `bordered` / `headerClass`.
 */

import { IconDownload, IconPlus, IconRefresh } from '@meldui/tabler-vue'
import { Button, DataTable, Pagination } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Row } from '@tanstack/vue-table'
import { ref } from 'vue'
import { type User, extendedColumns, minimalColumns, useStoryData } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Customization',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Slots (\`#toolbar\`, \`#toolbar-start\`, \`#toolbar-end\`, \`#row\`, \`#footer\`,
\`#pagination\`), density modes, row styling functions, and visual flags.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// SLOTS
// ============================================================================

/**
 * Add buttons before / after the toolbar's main row.
 */
export const ToolbarStartEnd: Story = {
  render: () => ({
    components: { DataTable, Button, IconPlus, IconDownload },
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
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #toolbar-start>
          <h3 class="text-sm font-medium mr-2">Users</h3>
        </template>
        <template #toolbar-end>
          <Button size="sm" variant="outline"><IconDownload class="mr-1 h-4 w-4" /> Export</Button>
          <Button size="sm"><IconPlus class="mr-1 h-4 w-4" /> Add user</Button>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Replace the entire toolbar via the `#toolbar` slot.
 * Receives `{ table, loading }` as slot props.
 */
export const ReplaceToolbar: Story = {
  render: () => ({
    components: { DataTable, Button, IconRefresh },
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
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #toolbar="{ table, loading }">
          <div class="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div class="text-sm">
              <span class="font-medium">{{ table.getRowModel().rows.length }}</span>
              <span class="text-muted-foreground"> rows shown</span>
            </div>
            <Button size="sm" variant="outline" :disabled="loading">
              <IconRefresh class="mr-1 h-4 w-4" /> Refresh
            </Button>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Custom footer slot.
 */
export const FooterSlot: Story = {
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
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #footer="{ table }">
          <tr>
            <td :colspan="columns.length" class="bg-muted p-2 text-sm text-muted-foreground">
              Showing {{ table.getRowModel().rows.length }} on this page
            </td>
          </tr>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Replace the default pagination with a custom layout.
 */
export const PaginationSlot: Story = {
  render: () => ({
    components: { DataTable, Pagination },
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
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #pagination="{ pagination: p, pageCount: pc, totalRows: tr }">
          <div class="rounded-md border bg-muted/30 p-2">
            <p class="text-xs text-muted-foreground mb-2">Custom pagination footer ({{ tr }} total rows)</p>
            <Pagination
              :pagination="p"
              :page-count="pc"
              :total-rows="tr"
              @update:pagination="(v) => pagination = v"
            />
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Replace row rendering entirely via the `#row` slot.
 * Use when you need a completely custom row layout (e.g., card-style rows).
 */
export const RowSlot: Story = {
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
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #row="{ row, index }">
          <tr :class="['hover:bg-muted/40', index % 2 === 0 ? 'bg-muted/10' : '']">
            <td :colspan="columns.length" class="p-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium">{{ row.original.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ row.original.email }}</div>
                </div>
                <div class="text-sm">{{ row.original.role }}</div>
              </div>
            </td>
          </tr>
        </template>
      </DataTable>
    `,
  }),
}

// ============================================================================
// ROW STYLING
// ============================================================================

/**
 * `:row-class` returns classes per row — highlight inactive and admin rows.
 */
export const ConditionalRowClass: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const rowClass = (row: Row<User>) => ({
        'bg-red-50 dark:bg-red-950/30': row.original.status === 'inactive',
        'bg-green-50 dark:bg-green-950/30':
          row.original.role === 'admin' && row.original.status === 'active',
      })
      return { sorting, pagination, data, pageCount, totalRows, columns: extendedColumns, rowClass }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :row-class="rowClass"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * `:row-style` returns inline styles per row.
 */
export const ConditionalRowStyle: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const rowStyle = (row: Row<User>) =>
        row.original.is_verified ? { opacity: '1' } : { opacity: '0.5', fontStyle: 'italic' }
      return { sorting, pagination, data, pageCount, totalRows, columns: extendedColumns, rowStyle }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :row-style="rowStyle"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * `:row-props` adds attributes and event handlers per row.
 */
export const RowProps: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const lastClicked = ref<string>('')
      const rowProps = (row: Row<User>) => ({
        'data-user-id': row.original.id,
        onClick: () => {
          lastClicked.value = `${row.original.name} (id: ${row.original.id})`
        },
        class: 'cursor-pointer',
      })
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        rowProps,
        lastClicked,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm">Last clicked: <span class="font-mono">{{ lastClicked || '(none)' }}</span></p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :row-props="rowProps"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Custom header background via the `headerClass` prop.
 */
export const HeaderClass: Story = {
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
        header-class="bg-primary text-primary-foreground"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * `bordered` prop adds vertical dividers between cells.
 */
export const BorderedCells: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, data, pageCount, totalRows, columns: extendedColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        bordered
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Zebra striping via `row-class`.
 */
export const StripedRows: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const rowClass = (row: Row<User>) => (row.index % 2 === 1 ? 'bg-muted/40' : '')
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns, rowClass }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        :row-class="rowClass"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

// ============================================================================
// DENSITY
// ============================================================================

/**
 * Compact density — minimal padding, fits more rows in the viewport.
 */
export const DensityCompact: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 15 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        density="compact"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Comfortable density (default).
 */
export const DensityComfortable: Story = {
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
        density="comfortable"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Spacious density — generous padding for low-density UIs.
 */
export const DensitySpacious: Story = {
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
        density="spacious"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      />
    `,
  }),
}

/**
 * Runtime density toggle.
 */
export const DensityToggle: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const density = ref<'compact' | 'comfortable' | 'spacious'>('comfortable')
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return {
        density,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
      }
    },
    template: `
      <div class="space-y-3">
        <div class="flex gap-2">
          <Button :variant="density === 'compact' ? 'default' : 'outline'" size="sm" @click="density = 'compact'">Compact</Button>
          <Button :variant="density === 'comfortable' ? 'default' : 'outline'" size="sm" @click="density = 'comfortable'">Comfortable</Button>
          <Button :variant="density === 'spacious' ? 'default' : 'outline'" size="sm" @click="density = 'spacious'">Spacious</Button>
        </div>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :density="density"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}
