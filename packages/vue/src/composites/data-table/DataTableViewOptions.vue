<script setup lang="ts">
import { IconSettings2 } from '@meldui/tabler-vue'
import type { Column, Table } from '@tanstack/vue-table'
import { ref, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  table: Table<TData>
}

const props = defineProps<Props>()

interface ColumnItem {
  id: string
  column: Column<TData, unknown>
}

// Track columns - let TypeScript infer the type
const columnItems = ref<ColumnItem[]>([])
// Track visibility state separately for v-model binding
const visibilityState = ref<Record<string, boolean>>({})

watchEffect(() => {
  const allColumns = props.table.getAllColumns()

  const filtered = allColumns
    .filter((column) => {
      const hasAccessor = column.accessorFn !== undefined || 'accessorKey' in column.columnDef
      const canHide = column.getCanHide()
      return hasAccessor && canHide
    })
    .map((column) => {
      // Initialize visibility state
      visibilityState.value[column.id] = column.getIsVisible()
      return {
        id: column.id,
        column: column,
      }
    })

  columnItems.value = filtered
})

const handleVisibilityChange = (columnId: string, value: boolean) => {
  const item = columnItems.value.find((col) => col.id === columnId)
  if (item) {
    item.column.toggleVisibility(value)
    visibilityState.value[columnId] = value
  }
}

/**
 * Get display name for a column
 * Priority: meta.displayName > columnDef.header (if string) > formatted ID
 */
const getColumnDisplayName = (column: {
  id: string
  columnDef: { meta?: unknown; header?: unknown }
}): string => {
  // 1. Try meta.displayName (recommended approach)
  const meta = column.columnDef.meta as { displayName?: string } | undefined
  if (meta?.displayName) {
    return meta.displayName
  }

  // 2. Try header if it's a string
  const header = column.columnDef.header
  if (typeof header === 'string') {
    return header
  }

  // 3. Fall back to formatted column ID
  return formatColumnId(column.id)
}

/**
 * Format column ID into readable name (fallback)
 * Handles snake_case, camelCase, PascalCase
 */
const formatColumnId = (id: string): string => {
  return id
    .replace(/_/g, ' ') // snake_case
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase/PascalCase
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize
}

/**
 * Get pinned status badge text for a column
 * Returns "← Pinned", "Pinned →", or empty string
 */
const getPinnedStatus = (columnId: string): string => {
  const { left = [], right = [] } = props.table.getState().columnPinning
  if (left.includes(columnId)) return '← Pinned'
  if (right.includes(columnId)) return 'Pinned →'
  return ''
}
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="outline"
                size="sm"
                class="ml-auto hidden h-8 lg:flex"
            >
                <IconSettings2 class="mr-1.5 h-4 w-4 shrink-0" />
                <span class="text-xs">View</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-[200px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuCheckboxItem
                v-for="item in columnItems"
                :key="item.id"
                v-model="visibilityState[item.id]"
                @update:model-value="
                    (value: boolean) => handleVisibilityChange(item.id, value)
                "
            >
                <div class="flex items-center justify-between w-full">
                    <span>{{ getColumnDisplayName(item.column) }}</span>
                    <span
                        v-if="getPinnedStatus(item.id)"
                        class="text-[10px] text-muted-foreground ml-2 font-medium"
                    >
                        {{ getPinnedStatus(item.id) }}
                    </span>
                </div>
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
