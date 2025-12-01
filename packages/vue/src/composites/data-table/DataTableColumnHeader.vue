<script setup lang="ts" generic="TData, TValue">
import {
  IconArrowDown,
  IconArrowsUpDown,
  IconArrowUp,
  IconCheck,
  IconEyeOff,
  IconPin,
  IconPinnedOff,
} from '@meldui/tabler-vue'
import type { Column, Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Props {
  column: Column<TData, TValue>
  table?: Table<TData>
  title: string
  class?: string
}

const props = defineProps<Props>()

// TanStack Table handles enableSorting logic:
// - Sortable by default if enableSorting is not specified
// - Only disabled when explicitly set to false in column definition
const canSort = computed(() => props.column.getCanSort())
const isSorted = computed(() => props.column.getIsSorted())

const sortIcon = computed(() => {
  const sorted = isSorted.value
  if (sorted === 'desc') return IconArrowDown
  if (sorted === 'asc') return IconArrowUp
  return IconArrowsUpDown
})

// Pinning state
const isPinned = computed(() => props.column.getIsPinned())
const canPin = computed(() => props.column.getCanPin())

// Access table meta for configuration
const tableMeta = computed(() => {
  // Use table prop if provided, otherwise fallback to column.table
  const table = props.table || props.column.table
  if (!table) return undefined

  return table.options.meta as
    | {
        defaultPinning?: { left: string[]; right: string[] }
        enableColumnPinning?: boolean
      }
    | undefined
})

// Check if column is in default pinning (locked from user changes)
const isDefaultPinned = computed(() => {
  const columnId = props.column.id
  const defaultPinning = tableMeta.value?.defaultPinning

  if (!defaultPinning) return false

  return (
    (defaultPinning.left || []).includes(columnId) ||
    (defaultPinning.right || []).includes(columnId)
  )
})

// Show pin options only if:
// 1. Table has enableColumnPinning: true
// 2. Column can be pinned (column.getCanPin())
// 3. Column is NOT in defaultPinning arrays (user can't modify locked columns)
const showPinOptions = computed(() => {
  const enableColumnPinning = tableMeta.value?.enableColumnPinning ?? false
  return enableColumnPinning && canPin.value && !isDefaultPinned.value
})

// Hiding state
// - Hideable by default if enableHiding is not specified
// - Only disabled when explicitly set to false in column definition
const canHide = computed(() => props.column.getCanHide())

// Determine if dropdown menu should be shown at all
// Show dropdown if ANY of these are true:
// 1. Column can be sorted
// 2. Column can be hidden
// 3. Column can be pinned AND is not default-pinned
const showDropdown = computed(() => {
  return canSort.value || canHide.value || showPinOptions.value
})

// Custom pin handler to support symmetric stacking behavior
const handlePin = (position: 'left' | 'right' | false) => {
  if (!props.table) {
    // Fallback to native behavior if table not provided
    props.column.pin(position)
    return
  }

  const columnId = props.column.id
  const currentPinning = props.table.getState().columnPinning
  const newPinning = { ...currentPinning }

  if (position === false) {
    // Unpin - remove from both sides
    newPinning.left = (newPinning.left || []).filter((id) => id !== columnId)
    newPinning.right = (newPinning.right || []).filter((id) => id !== columnId)
  } else {
    // Remove from opposite side
    if (position === 'left') {
      newPinning.right = (newPinning.right || []).filter((id) => id !== columnId)
      const leftSide = newPinning.left || []
      if (!leftSide.includes(columnId)) {
        // Left: Add to end (stack to the right)
        newPinning.left = [...leftSide, columnId]
      }
    } else {
      newPinning.left = (newPinning.left || []).filter((id) => id !== columnId)
      const rightSide = newPinning.right || []
      if (!rightSide.includes(columnId)) {
        // Right: Add to start (stack to the left)
        newPinning.right = [columnId, ...rightSide]
      }
    }
  }

  // Update the table state
  props.table.setColumnPinning(newPinning)
}
</script>

<template>
    <!-- No dropdown - just show text -->
    <div
        v-if="!showDropdown"
        :class="cn('flex items-center space-x-2', props.class)"
    >
        <span>{{ title }}</span>
    </div>

    <!-- Show dropdown menu with available options -->
    <div v-else :class="cn('flex items-center space-x-2', props.class)">
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button
                    variant="ghost"
                    size="sm"
                    class="-ml-3 h-8 data-[state=open]:bg-accent"
                >
                    <span>{{ title }}</span>
                    <component
                        v-if="canSort"
                        :is="sortIcon"
                        class="ml-2 h-4 w-4"
                        :class="{ 'opacity-50': !isSorted }"
                    />
                    <IconPin
                        v-if="isPinned && !isDefaultPinned"
                        class="ml-1 h-3 w-3 text-primary"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <!-- Sorting Options (only if column can be sorted) -->
                <template v-if="canSort">
                    <DropdownMenuItem @click="column.toggleSorting(false)">
                        <IconArrowUp
                            class="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                        />
                        Asc
                        <span v-if="isSorted === 'asc'" class="ml-auto"
                            ><IconCheck class="size-4"
                        /></span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="column.toggleSorting(true)">
                        <IconArrowDown
                            class="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                        />
                        Desc
                        <span v-if="isSorted === 'desc'" class="ml-auto"
                            ><IconCheck class="size-4"
                        /></span>
                    </DropdownMenuItem>
                    <template v-if="isSorted">
                        <DropdownMenuSeparator />
                        <DropdownMenuItem @click="column.clearSorting()">
                            <IconArrowsUpDown
                                class="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                            />
                            Clear
                        </DropdownMenuItem>
                    </template>
                </template>

                <!-- Pin/Unpin Options -->
                <template v-if="showPinOptions">
                    <!-- Separator only if there are sort options above -->
                    <DropdownMenuSeparator v-if="canSort" />
                    <DropdownMenuItem
                        v-if="isPinned !== 'left'"
                        @click="handlePin('left')"
                    >
                        <IconPin
                            class="mr-2 h-3.5 w-3.5 text-muted-foreground/70 rotate-45"
                        />
                        Pin Left
                        <span v-if="isPinned === 'left'" class="ml-auto"
                            ><IconCheck class="size-4"
                        /></span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        v-if="isPinned !== 'right'"
                        @click="handlePin('right')"
                    >
                        <IconPin
                            class="mr-2 h-3.5 w-3.5 text-muted-foreground/70 rotate-[-45deg]"
                        />
                        Pin Right
                        <span v-if="isPinned === 'right'" class="ml-auto"
                            ><IconCheck class="size-4"
                        /></span>
                    </DropdownMenuItem>
                    <DropdownMenuItem v-if="isPinned" @click="handlePin(false)">
                        <IconPinnedOff
                            class="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                        />
                        Unpin
                    </DropdownMenuItem>
                </template>

                <!-- Hide Option (only if column can be hidden) -->
                <template v-if="canHide">
                    <!-- Separator only if there are sort or pin options above -->
                    <DropdownMenuSeparator v-if="canSort || showPinOptions" />
                    <DropdownMenuItem @click="column.toggleVisibility(false)">
                        <IconEyeOff
                            class="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                        />
                        Hide
                    </DropdownMenuItem>
                </template>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>
