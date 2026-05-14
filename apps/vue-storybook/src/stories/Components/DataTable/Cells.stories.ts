/**
 * DataTable Cells Examples
 *
 * Everything that goes inside a cell:
 * - Built-in cell renderers from `cellRenderers` (badge, boolean, currency, number, date, truncate).
 * - Custom cell content embedding MeldUI components (Avatar, Tooltip, Sheet, AlertDialog,
 *   Switch, inline edit, etc.).
 *
 * Both composition patterns are demonstrated:
 *   - `cell: ({ row }) => h(Component, ...)` on the column def — TanStack-style.
 *   - `#cell-${columnId}` slot — Vue-template-style.
 */

import {
  IconAlertCircle,
  IconCircleCheck,
  IconExternalLink,
  IconMessage,
  IconPencil,
  IconTrash,
} from '@meldui/tabler-vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  Badge,
  Button,
  CircularProgress,
  DataTable,
  Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cellRenderers,
  createColumnHelper,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { ColumnDef } from '@tanstack/vue-table'
import { h, ref } from 'vue'
import { type User, useStoryData } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Cells',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
This page covers cell content — both built-in renderers and custom MeldUI components.

**Two composition patterns** are shown throughout:

1. Column-def \`cell:\` function — render a VNode via \`h()\` in the column definition.
   Closer to TanStack's idiomatic style. Type-safe via \`CellContext\`.

2. \`#cell-\${columnId}\` template slot — declarative Vue templates referencing
   \`{ row, value, cell }\`. Easier when you want JSX-like syntax with components.

Each story tags which pattern it uses.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const helper = createColumnHelper<User>()

// ============================================================================
// BUILT-IN CELL RENDERERS — column-def `cell:` pattern
// ============================================================================

/**
 * `cellRenderers.badge({ variantMap })` — styled badges keyed off cell value.
 */
export const BadgeRenderer: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('role', {
          title: 'Role',
          cell: cellRenderers.badge<User, string>({
            variantMap: { admin: 'default', user: 'secondary', guest: 'outline' },
          }),
        }),
        helper.accessor('status', {
          title: 'Status',
          cell: cellRenderers.badge<User, string>({
            variantMap: { active: 'default', inactive: 'destructive' },
          }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
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

/**
 * `cellRenderers.boolean({ asBadge, trueText, falseText })`.
 */
export const BooleanAsBadge: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('is_verified', {
          title: 'Verified',
          cell: cellRenderers.boolean({
            asBadge: true,
            trueText: 'Verified',
            falseText: 'Pending',
            trueVariant: 'default',
            falseVariant: 'secondary',
          }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
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

/**
 * `cellRenderers.currency()` — locale-aware currency formatting.
 */
export const CurrencyRenderer: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('salary', {
          title: 'Salary (USD)',
          enableSorting: true,
          cell: cellRenderers.currency({ currency: 'USD' }),
        }),
        helper.display({
          id: 'salaryEur',
          title: 'Salary (EUR, est)',
          cell: cellRenderers.currency({ currency: 'EUR', locale: 'de-DE' }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
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

/**
 * `cellRenderers.number()` — locale-aware number formatting with fraction control.
 */
export const NumberRenderer: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('age', {
          title: 'Age',
          cell: cellRenderers.number({ minimumFractionDigits: 0, maximumFractionDigits: 0 }),
        }),
        helper.accessor('salary', {
          title: 'Salary (compact)',
          cell: cellRenderers.number({ compact: true }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
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

/**
 * `cellRenderers.date()` — `short` / `medium` / `long` / `full` formats.
 */
export const DateRenderer: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('created_at', {
          title: 'Joined (short)',
          cell: cellRenderers.date({ format: 'short' }),
        }),
        helper.accessor('last_login_at', {
          title: 'Last login (long)',
          cell: cellRenderers.date({ format: 'long' }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
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

/**
 * `cellRenderers.truncate(maxLength, { showTooltip })` — long text + native tooltip.
 */
export const TruncateRenderer: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.display({
          id: 'bio',
          title: 'Bio',
          cell: ({ row }) => {
            const u = row.original
            const bio = `${u.name} is a ${u.role} in the ${u.department} team based in ${u.location}, with salary ${u.salary}.`
            return cellRenderers.truncate<User, string>(40, { showTooltip: true })({
              getValue: () => bio,
            } as never)
          },
          size: 250,
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
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

/**
 * All renderers combined in a single table.
 */
export const CombinedRenderers: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name', enableSorting: true }),
        helper.accessor('role', {
          title: 'Role',
          cell: cellRenderers.badge<User, string>({
            variantMap: { admin: 'default', user: 'secondary', guest: 'outline' },
          }),
        }),
        helper.accessor('salary', {
          title: 'Salary',
          enableSorting: true,
          cell: cellRenderers.currency({ currency: 'USD' }),
        }),
        helper.accessor('age', {
          title: 'Age',
          cell: cellRenderers.number(),
        }),
        helper.accessor('is_verified', {
          title: 'Verified',
          cell: cellRenderers.boolean({ asBadge: true }),
        }),
        helper.accessor('created_at', {
          title: 'Joined',
          cell: cellRenderers.date({ format: 'medium' }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
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

// ============================================================================
// CUSTOM CELLS — embedding MeldUI components
// ============================================================================

/**
 * Avatar + name combo. **Pattern: column-def `cell:` function.**
 */
export const AvatarCell: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const initials = (name: string) =>
        name
          .split(' ')
          .map((p) => p[0])
          .join('')
          .toUpperCase()
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', {
          title: 'User',
          enableSorting: true,
          cell: ({ row }) =>
            h('div', { class: 'flex items-center gap-3' }, [
              h(Avatar, { class: 'h-8 w-8' }, () =>
                h(AvatarFallback, () => initials(row.original.name)),
              ),
              h('div', {}, [
                h('div', { class: 'font-medium' }, row.original.name),
                h('div', { class: 'text-xs text-muted-foreground' }, row.original.email),
              ]),
            ]),
        }),
        helper.accessor('role', { title: 'Role' }),
        helper.accessor('department', { title: 'Department' }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <!-- pattern: column-def cell function -->
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

/**
 * `<AvatarGroup>` showing team members per row. **Pattern: column-def `cell:` function.**
 */
export const AvatarGroupCell: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const teamFor = (idx: number) => {
        const names = ['Ana', 'Bob', 'Carl', 'Dee', 'Eve', 'Finn', 'Gabi']
        const n = 2 + (idx % 4)
        return names.slice(0, n)
      }
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Owner' }),
        helper.accessor('department', { title: 'Team' }),
        helper.display({
          id: 'members',
          title: 'Members',
          cell: ({ row }) => {
            const members = teamFor(row.index)
            return h(AvatarGroup, { max: 3, spacing: 'sm' }, () =>
              members.map((m) => h(Avatar, () => h(AvatarFallback, () => m[0]))),
            )
          },
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <!-- pattern: column-def cell function -->
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

/**
 * Multiple inline `<Badge>` chips per row. **Pattern: `#cell-tags` slot.**
 */
export const InlineBadges: Story = {
  render: () => ({
    components: { DataTable, Badge },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const tagsFor = (idx: number) => {
        const pool = ['core', 'beta', 'priority', 'vip', 'archived', 'team-lead']
        return pool.slice(0, 1 + (idx % 4))
      }
      const columns: ColumnDef<User & { tags: string[] }>[] = [
        helper.accessor('name', { title: 'Name' }) as ColumnDef<User & { tags: string[] }>,
        helper.display({
          id: 'tags',
          title: 'Tags',
          cell: () => null, // template slot will render this
        }) as ColumnDef<User & { tags: string[] }>,
        helper.accessor('role', { title: 'Role' }) as ColumnDef<User & { tags: string[] }>,
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns, tagsFor }
    },
    template: `
      <!-- pattern: #cell-tags slot -->
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #cell-tags="{ row }">
          <div class="flex flex-wrap gap-1">
            <Badge v-for="t in tagsFor(row.index)" :key="t" variant="outline">{{ t }}</Badge>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * `<CircularProgress>` cell for per-row completion. **Pattern: `#cell-progress` slot.**
 */
export const ProgressCell: Story = {
  render: () => ({
    components: { DataTable, CircularProgress },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const progressFor = (idx: number) => (idx * 17) % 101
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.display({
          id: 'progress',
          title: 'Progress',
          cell: () => null,
          size: 120,
        }),
        helper.accessor('role', { title: 'Role' }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns, progressFor }
    },
    template: `
      <!-- pattern: #cell-progress slot -->
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #cell-progress="{ row }">
          <div class="flex items-center gap-2">
            <CircularProgress :value="progressFor(row.index)" :size="24" />
            <span class="text-xs text-muted-foreground">{{ progressFor(row.index) }}%</span>
          </div>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * `<Tooltip>` showing the full email when hovering a truncated cell.
 * **Pattern: column-def `cell:` function.**
 */
export const TooltipOnCell: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('email', {
          title: 'Email',
          cell: ({ row }) =>
            h(TooltipProvider, { delayDuration: 100 }, () =>
              h(Tooltip, {}, () => [
                h(TooltipTrigger, { asChild: true }, () =>
                  h(
                    'span',
                    { class: 'cursor-help underline decoration-dotted' },
                    row.original.email,
                  ),
                ),
                h(TooltipContent, () => row.original.email),
              ]),
            ),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <!-- pattern: column-def cell function -->
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

/**
 * Link cell — the cell renders an `<a>` to a row-specific URL.
 * **Pattern: column-def `cell:` function.**
 */
export const LinkCell: Story = {
  render: () => ({
    components: { DataTable, IconExternalLink },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', {
          title: 'Name',
          cell: ({ row }) =>
            h(
              'a',
              {
                href: `/users/${row.original.id}`,
                class:
                  'inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline',
                onClick: (e: Event) => e.preventDefault(),
              },
              [row.original.name, h(IconExternalLink, { class: 'h-3 w-3' })],
            ),
        }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('role', { title: 'Role' }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <!-- pattern: column-def cell function -->
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

/**
 * Inline button that opens a `<Sheet>` with row detail. **Pattern: `#cell-actions` slot.**
 */
export const ButtonOpenSheet: Story = {
  render: () => ({
    components: {
      DataTable,
      Button,
      Sheet,
      SheetTrigger,
      SheetContent,
      SheetHeader,
      SheetTitle,
      SheetDescription,
      IconMessage,
    },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const selected = ref<User | null>(null)
      const open = ref(false)
      const view = (u: User) => {
        selected.value = u
        open.value = true
      }
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('email', { title: 'Email' }),
        helper.display({ id: 'actions', title: '', cell: () => null, size: 80 }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns, selected, open, view }
    },
    template: `
      <!-- pattern: #cell-actions slot -->
      <div>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        >
          <template #cell-actions="{ row }">
            <Button size="sm" variant="outline" @click="view(row.original)">
              <IconMessage class="mr-1 h-4 w-4" /> Open
            </Button>
          </template>
        </DataTable>
        <Sheet v-model:open="open">
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{{ selected?.name }}</SheetTitle>
              <SheetDescription>{{ selected?.email }} · {{ selected?.role }}</SheetDescription>
            </SheetHeader>
            <div class="mt-4 space-y-2 text-sm">
              <p><span class="text-muted-foreground">Department:</span> {{ selected?.department }}</p>
              <p><span class="text-muted-foreground">Location:</span> {{ selected?.location }}</p>
              <p><span class="text-muted-foreground">Salary:</span> \${{ selected?.salary.toLocaleString() }}</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    `,
  }),
}

/**
 * Inline-edit cell: click to swap a label for an `<Input>`; commit on blur / Enter.
 * **Pattern: `#cell-name` slot.**
 */
export const InlineEditCell: Story = {
  render: () => ({
    components: { DataTable, Input, IconPencil },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 5 })
      const editing = ref<string | null>(null)
      const draft = ref<string>('')
      const start = (u: User) => {
        editing.value = u.id
        draft.value = u.name
      }
      const commit = (u: User) => {
        u.name = draft.value
        editing.value = null
      }
      const cancel = () => {
        editing.value = null
      }
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name (click to edit)' }),
        helper.accessor('email', { title: 'Email' }),
      ]
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns,
        editing,
        draft,
        start,
        commit,
        cancel,
      }
    },
    template: `
      <!-- pattern: #cell-name slot -->
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-pagination
        v-model:pagination="pagination"
      >
        <template #cell-name="{ row }">
          <Input
            v-if="editing === row.original.id"
            v-model="draft"
            class="h-8"
            @blur="commit(row.original)"
            @keyup.enter="commit(row.original)"
            @keyup.escape="cancel"
            autofocus
          />
          <button
            v-else
            class="flex items-center gap-1 text-left hover:bg-muted/50 -ml-2 px-2 py-1 rounded"
            @click="start(row.original)"
          >
            <span>{{ row.original.name }}</span>
            <IconPencil class="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
          </button>
        </template>
      </DataTable>
    `,
  }),
}

/**
 * `<Switch>` cell toggling a boolean field. **Pattern: column-def `cell:` function.**
 */
export const SwitchCell: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('email', { title: 'Email' }),
        helper.accessor('is_verified', {
          title: 'Verified',
          cell: ({ row }) =>
            h(Switch, {
              modelValue: row.original.is_verified,
              'onUpdate:modelValue': (v: boolean) => {
                row.original.is_verified = v
              },
            }),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <!-- pattern: column-def cell function -->
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

/**
 * Action button opens an `<AlertDialog>` for confirmation.
 * **Pattern: column-def `cell:` function.**
 */
export const DialogActionCell: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('role', { title: 'Role' }),
        helper.display({
          id: 'delete',
          title: '',
          size: 80,
          cell: ({ row }) =>
            h(AlertDialog, {}, () => [
              h(AlertDialogTrigger, { asChild: true }, () =>
                h(Button, { size: 'sm', variant: 'destructive' }, () => [
                  h(IconTrash, { class: 'mr-1 h-4 w-4' }),
                  'Delete',
                ]),
              ),
              h(AlertDialogContent, {}, () => [
                h(AlertDialogHeader, {}, () => [
                  h(AlertDialogTitle, () => `Delete ${row.original.name}?`),
                  h(AlertDialogDescription, () => 'This cannot be undone.'),
                ]),
                h(AlertDialogFooter, {}, () => [
                  h(AlertDialogCancel, () => 'Cancel'),
                  h(
                    AlertDialogAction,
                    { onClick: () => alert(`Deleted ${row.original.name}`) },
                    () => 'Delete',
                  ),
                ]),
              ]),
            ]),
        }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <!-- pattern: column-def cell function -->
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

/**
 * Icon + text + Badge combined in a single cell. **Pattern: `#cell-status` slot.**
 */
export const CompoundRichCell: Story = {
  render: () => ({
    components: { DataTable, Badge, IconCircleCheck, IconAlertCircle },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const columns: ColumnDef<User>[] = [
        helper.accessor('name', { title: 'Name' }),
        helper.accessor('status', { title: 'Status' }),
        helper.accessor('role', { title: 'Role' }),
      ]
      return { sorting, pagination, data, pageCount, totalRows, columns }
    },
    template: `
      <!-- pattern: #cell-status slot -->
      <DataTable
        :columns="columns"
        :data="data"
        :page-count="pageCount"
        :total-rows="totalRows"
        enable-sorting enable-pagination
        v-model:sorting="sorting"
        v-model:pagination="pagination"
      >
        <template #cell-status="{ row }">
          <div class="flex items-center gap-2">
            <IconCircleCheck v-if="row.original.status === 'active'" class="h-4 w-4 text-green-500" />
            <IconAlertCircle v-else class="h-4 w-4 text-amber-500" />
            <Badge :variant="row.original.status === 'active' ? 'default' : 'secondary'">
              {{ row.original.status }}
            </Badge>
          </div>
        </template>
      </DataTable>
    `,
  }),
}
