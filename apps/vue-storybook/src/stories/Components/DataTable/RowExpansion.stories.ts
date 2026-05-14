/**
 * DataTable Row Expansion Examples
 *
 * Expandable rows with `#expanded-row` slot. Use `helper.expander()` to add an
 * expand-chevron column, plus `enable-row-expansion` on the table.
 */

import { IconCalendar, IconMail, IconUserCheck, IconUserX } from '@meldui/tabler-vue'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  DataTableColumnHeader,
  createColumnHelper,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Column, ColumnDef, Row, Table } from '@tanstack/vue-table'
import { type Component, h, ref } from 'vue'
import { type User, useStoryData } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/RowExpansion',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Row expansion lets each row reveal additional content beneath it. Wire it via:

1. Add an expander column with \`helper.expander()\`.
2. Set \`enable-row-expansion\` on the DataTable.
3. Provide the \`#expanded-row\` slot to render the expanded content.

Use \`:get-row-can-expand\` for per-row predicates and the imperative
\`toggleAllRowsExpanded()\` method for batch operations.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const helper = createColumnHelper<User>()

function header<TData, TValue>(column: Column<TData, TValue>, title: string, table?: Table<TData>) {
  return h(DataTableColumnHeader as Component, { column, table, title })
}

const expandableColumns: ColumnDef<User>[] = [
  helper.expander(),
  {
    accessorKey: 'name',
    header: ({ column, table }) => header(column, 'Name', table),
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('name')),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column, table }) => header(column, 'Email', table),
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: ({ column, table }) => header(column, 'Role', table),
  },
]

/**
 * Basic expansion: click the chevron to reveal additional row data.
 */
export const BasicExpansion: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: expandableColumns,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-row-expansion
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #expanded-row="{ row }">
          <div class="space-y-1 text-sm">
            <div><span class="text-muted-foreground">Department:</span> {{ row.original.department }}</div>
            <div><span class="text-muted-foreground">Location:</span> {{ row.original.location }}</div>
            <div><span class="text-muted-foreground">Salary:</span> \${{ row.original.salary.toLocaleString() }}</div>
            <div><span class="text-muted-foreground">Verified:</span> {{ row.original.is_verified ? 'Yes' : 'No' }}</div>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Only verified users can expand. Other rows render no chevron.
 */
export const ConditionalExpansion: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const canExpand = (row: Row<User>) => row.original.is_verified
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: expandableColumns,
        canExpand,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Chevron only appears on rows where <code>is_verified === true</code>.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          :get-row-can-expand="canExpand"
          enable-row-expansion
          enable-sorting
          enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        >
          <template #expanded-row="{ row }">
            <div class="text-sm">
              <Badge variant="default" class="bg-green-500">Verified</Badge>
              <span class="ml-2">{{ row.original.email }}</span>
            </div>
          </template>
        </DataTable>
      </div>
    `,
  }),
}

/**
 * Expanded content can be its own DataTable (e.g., user's recent activity).
 */
export const NestedTableInExpansion: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 5 })
      const activityColumns: ColumnDef<{ id: string; action: string; at: string }>[] = [
        { accessorKey: 'action', header: 'Action' },
        { accessorKey: 'at', header: 'When' },
      ]
      const activityFor = (user: User) => [
        { id: '1', action: 'Signed in', at: user.last_login_at.slice(0, 10) },
        { id: '2', action: 'Updated profile', at: user.created_at.slice(0, 10) },
        { id: '3', action: 'Accepted invitation', at: user.created_at.slice(0, 10) },
      ]
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: expandableColumns,
        activityColumns,
        activityFor,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-row-expansion
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #expanded-row="{ row }">
          <div class="space-y-2">
            <h4 class="text-sm font-medium">Recent activity for {{ row.original.name }}</h4>
            <DataTable :columns="activityColumns" :data="activityFor(row.original)" :show-toolbar="false" max-height="200px" />
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Rich content inside the expansion slot using Card + Avatar + Badge.
 */
export const ExpansionWithRichContent: Story = {
  render: () => ({
    components: {
      DataTable,
      Card,
      CardHeader,
      CardTitle,
      CardContent,
      Avatar,
      AvatarFallback,
      Badge,
      Button,
      IconMail,
      IconCalendar,
      IconUserCheck,
      IconUserX,
    },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 5 })
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: expandableColumns,
      }
    },
    template: `
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-row-expansion
        enable-sorting
        enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #expanded-row="{ row }">
          <Card class="border-0 shadow-none">
            <CardHeader class="flex flex-row items-center gap-3 pb-2">
              <Avatar>
                <AvatarFallback>{{ row.original.name.split(' ').map(p => p[0]).join('') }}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle class="text-base">{{ row.original.name }}</CardTitle>
                <p class="text-sm text-muted-foreground">{{ row.original.role }} · {{ row.original.department }}</p>
              </div>
              <Badge :variant="row.original.is_verified ? 'default' : 'secondary'" class="ml-auto">
                <component :is="row.original.is_verified ? IconUserCheck : IconUserX" class="mr-1 h-3 w-3" />
                {{ row.original.is_verified ? 'Verified' : 'Unverified' }}
              </Badge>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex items-center gap-2 text-sm">
                <IconMail class="h-4 w-4 text-muted-foreground" />
                <span>{{ row.original.email }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <IconCalendar class="h-4 w-4 text-muted-foreground" />
                <span>Joined {{ row.original.created_at.slice(0, 10) }}</span>
              </div>
              <div class="flex gap-2 pt-2">
                <Button size="sm" variant="outline">View profile</Button>
                <Button size="sm" variant="outline">Send message</Button>
              </div>
            </CardContent>
          </Card>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * Expand-all / Collapse-all via the table ref's imperative API.
 */
export const ExpandAllToggle: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const tableRef = ref<{ toggleAllRowsExpanded: (v?: boolean) => void } | null>(null)
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 5 })
      return {
        tableRef,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: expandableColumns,
      }
    },
    template: `
      <div class="space-y-3">
        <div class="flex gap-2">
          <Button size="sm" variant="outline" @click="tableRef?.toggleAllRowsExpanded(true)">Expand all</Button>
          <Button size="sm" variant="outline" @click="tableRef?.toggleAllRowsExpanded(false)">Collapse all</Button>
        </div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-row-expansion
          enable-sorting
          enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        >
          <template #expanded-row="{ row }">
            <div class="text-sm text-muted-foreground">{{ row.original.email }} — {{ row.original.department }}</div>
          </template>
        </DataTable>
      </div>
    `,
  }),
}
