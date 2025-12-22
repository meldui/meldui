<script setup lang="ts" generic="TData">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import type { ActionDefinition, ActionsCellInlineProps } from './componentProps'

const props = defineProps<ActionsCellInlineProps<TData>>()

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
    <div v-if="visibleActions.length > 0" class="flex items-center gap-1">
        <Button
            v-for="(action, index) in visibleActions"
            :key="`action-${index}`"
            :variant="action.variant || 'ghost'"
            size="sm"
            :disabled="isDisabled(action)"
            class="h-8"
            @click="handleAction(action)"
        >
            <component
                :is="action.icon"
                v-if="action.icon"
                class="h-4 w-4"
                :class="{ 'mr-1': action.label }"
            />
            <span v-if="action.label">{{ action.label }}</span>
        </Button>
    </div>
</template>
