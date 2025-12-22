<script setup lang="ts" generic="TData">
import { IconDots } from '@meldui/tabler-vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ActionDefinition, ActionsCellDropdownProps } from './componentProps'

const props = withDefaults(defineProps<ActionsCellDropdownProps<TData>>(), {
  dropdownLabel: 'Actions',
})

// Filter visible actions
const visibleActions = computed(() =>
  props.actions.filter((action) => !action.show || action.show(props.row)),
)

// Handle action click
const handleAction = (action: ActionDefinition<TData>) => {
  action.onClick(props.row)
}

// Check if action is disabled
const isDisabled = (action: ActionDefinition<TData>) => {
  return action.disabled ? action.disabled(props.row) : false
}
</script>

<template>
    <DropdownMenu v-if="visibleActions.length > 0">
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8 p-0">
                <span class="sr-only">{{ dropdownLabel }}</span>
                <IconDots class="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem
                v-for="(action, index) in visibleActions"
                :key="`action-${index}`"
                :disabled="isDisabled(action)"
                :class="{
                    'text-destructive focus:text-destructive':
                        action.variant === 'destructive',
                }"
                @click="handleAction(action)"
            >
                <component
                    :is="action.icon"
                    v-if="action.icon"
                    class="mr-2 h-4 w-4"
                />
                {{ action.label }}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
