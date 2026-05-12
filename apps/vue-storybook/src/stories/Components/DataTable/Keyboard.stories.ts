/**
 * DataTable Keyboard Navigation
 *
 * Enable with `enable-keyboard-navigation`. Provides:
 * - ↑ / ↓: row navigation
 * - Home / End: jump to first / last row
 * - PageUp / PageDown: previous / next page
 * - Ctrl+PageUp / Ctrl+PageDown: jump to first / last page
 * - Space: toggle selection (when `enable-row-selection`)
 * - Enter: fire `@row-activate`
 * - Escape: clear selection (when selection is on)
 *
 * The component exposes `focusTable()` and `blurTable()` via the ref for
 * programmatic focus control.
 */

import {
  Button,
  DataTable,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { Row } from '@tanstack/vue-table'
import { ref } from 'vue'
import { type User, columnsWithSelection, minimalColumns, useStoryData } from './_shared'

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable/Keyboard',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Keyboard navigation patterns for the DataTable.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * Arrow keys move row focus. Home / End jump to first / last row.
 */
export const BasicKeyboardNav: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Click the table once to focus it. Then try ↑ / ↓ / Home / End.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-keyboard-navigation
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Space toggles selection on the focused row.
 */
export const KeyboardSelection: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const getRowId = (row: User) => row.id
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return {
        getRowId,
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: columnsWithSelection,
      }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Focus the table, navigate with arrow keys, press <kbd>Space</kbd> to toggle the row.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-keyboard-navigation
          :get-row-id="getRowId"
        enable-row-selection
          enable-sorting enable-pagination
          show-selected-count
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Enter fires `@row-activate`. Example handler opens a `<Sheet>` with row details.
 */
export const KeyboardRowActivation: Story = {
  render: () => ({
    components: { DataTable, Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      const selected = ref<User | null>(null)
      const open = ref(false)
      const activate = (row: Row<User>) => {
        selected.value = row.original
        open.value = true
      }
      return {
        sorting,
        pagination,
        data,
        pageCount,
        totalRows,
        columns: minimalColumns,
        selected,
        open,
        activate,
      }
    },
    template: `
      <div>
        <p class="text-sm text-muted-foreground mb-2">
          Focus the table, navigate with ↑ / ↓, press <kbd>Enter</kbd> to open the detail sheet.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-keyboard-navigation
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
          @row-activate="activate"
        />
        <Sheet v-model:open="open">
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{{ selected?.name }}</SheetTitle>
              <SheetDescription>Activated via keyboard.</SheetDescription>
            </SheetHeader>
            <pre class="mt-4 text-xs">{{ JSON.stringify(selected, null, 2) }}</pre>
          </SheetContent>
        </Sheet>
      </div>
    `,
  }),
}

/**
 * Page navigation via keyboard. PageUp / PageDown for adjacent pages,
 * Ctrl+PageUp / Ctrl+PageDown for first / last page.
 */
export const PageNavigation: Story = {
  render: () => ({
    components: { DataTable },
    setup() {
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 5 })
      return { sorting, pagination, data, pageCount, totalRows, columns: minimalColumns }
    },
    template: `
      <div class="space-y-2">
        <p class="text-sm text-muted-foreground">
          Focus the table, then try <kbd>PageDown</kbd> / <kbd>PageUp</kbd> and
          <kbd>Ctrl+PageUp</kbd> / <kbd>Ctrl+PageDown</kbd>.
        </p>
        <DataTable
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-keyboard-navigation
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}

/**
 * Imperative focus / blur via the ref.
 */
export const ProgrammaticFocus: Story = {
  render: () => ({
    components: { DataTable, Button },
    setup() {
      const tableRef = ref<{ focusTable: () => void; blurTable: () => void } | null>(null)
      const { sorting, pagination, data, pageCount, totalRows } = useStoryData({ pageSize: 10 })
      return {
        tableRef,
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
          <Button size="sm" variant="outline" @click="tableRef?.focusTable()">focusTable()</Button>
          <Button size="sm" variant="outline" @click="tableRef?.blurTable()">blurTable()</Button>
        </div>
        <DataTable
          ref="tableRef"
          :columns="columns"
          :data="data"
          :page-count="pageCount"
          :total-rows="totalRows"
          enable-keyboard-navigation
          enable-sorting enable-pagination
          v-model:sorting="sorting"
          v-model:pagination="pagination"
        />
      </div>
    `,
  }),
}
