<script setup lang="ts">
import { IconStack2, IconX } from '@meldui/tabler-vue'
import type { Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BulkActionOption } from './types'

interface Props {
  table: Table<TData>
  options: BulkActionOption<TData>[]
}

const props = defineProps<Props>()

const selectedRows = computed(() => {
  return props.table.getSelectedRowModel().rows.map((row) => row.original)
})

const selectedCount = computed(() => selectedRows.value.length)

const hasSelection = computed(() => selectedCount.value > 0)

const handleAction = (action: (selectedRows: TData[]) => void) => {
  action(selectedRows.value)
}

const clearSelection = () => {
  props.table.resetRowSelection()
}
</script>

<template>
    <DropdownMenu v-if="hasSelection">
        <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm" class="h-8 gap-1.5">
                <IconStack2 class="h-4 w-4" />
                <span class="text-xs font-medium">{{ selectedCount }}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuItem
                v-for="(option, index) in options"
                :key="index"
                :class="
                    option.variant === 'destructive'
                        ? 'text-destructive focus:text-destructive'
                        : ''
                "
                @click="handleAction(option.action)"
            >
                <component
                    v-if="option.icon"
                    :is="option.icon"
                    class="mr-2 h-4 w-4"
                />
                {{ option.label }}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem @click="clearSelection">
                <IconX class="mr-2 h-4 w-4" />
                Clear
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
