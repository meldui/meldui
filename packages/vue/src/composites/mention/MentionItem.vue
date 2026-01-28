<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import type { MentionItemProps, MentionItemSlotProps } from './types'
import { MENTION_INJECTION_KEY } from './types'

const props = defineProps<MentionItemProps & { class?: HTMLAttributes['class'] }>()

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionItem must be used within a Mention component')
}

const { items, highlightedIndex, selectItem, setHighlightedIndex } = context

// Find this item's index in the enabled items list
const itemIndex = computed(() => {
  const enabledItems = items.value.filter((item) => !item.disabled)
  return enabledItems.findIndex((item) => item.value === props.item.value)
})

// Check if this item is highlighted
const isHighlighted = computed(() => itemIndex.value === highlightedIndex.value)

// Check if this item is disabled
const isDisabled = computed(() => props.item.disabled ?? false)

// Handle click
const handleClick = () => {
  if (!isDisabled.value) {
    selectItem(props.item)
  }
}

// Handle mouse enter (for highlighting)
const handleMouseEnter = () => {
  if (!isDisabled.value && itemIndex.value >= 0) {
    setHighlightedIndex(itemIndex.value)
  }
}

// Handle select (for slot)
const handleSelect = () => {
  if (!isDisabled.value) {
    selectItem(props.item)
  }
}

// Slot props
const slotProps = computed<MentionItemSlotProps>(() => ({
  item: props.item,
  highlighted: isHighlighted.value,
  disabled: isDisabled.value,
  select: handleSelect,
}))
</script>

<template>
  <div
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
    :data-highlighted="isHighlighted ? '' : undefined"
    :data-disabled="isDisabled ? '' : undefined"
    :data-value="props.item.value"
    data-slot="mention-item"
    role="option"
    :aria-selected="isHighlighted"
    :aria-disabled="isDisabled"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
  >
    <slot v-bind="slotProps">
      {{ props.item.label }}
    </slot>
  </div>
</template>
