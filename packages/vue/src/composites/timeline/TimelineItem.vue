<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineItemProps, TimelineStatus } from './types'
import { TIMELINE_INJECTION_KEY, TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = defineProps<TimelineItemProps>()

const timeline = inject(TIMELINE_INJECTION_KEY)

if (!timeline) {
  throw new Error('TimelineItem must be used within a Timeline component')
}

const itemIndex = ref(-1)

onMounted(() => {
  itemIndex.value = timeline.registerItem()
})

onBeforeUnmount(() => {
  timeline.unregisterItem(itemIndex.value)
})

// Compute status based on activeIndex
const status = computed<TimelineStatus>(() => {
  if (timeline.activeIndex.value < 0) return 'pending'
  if (itemIndex.value < timeline.activeIndex.value) return 'completed'
  if (itemIndex.value === timeline.activeIndex.value) return 'active'
  return 'pending'
})

// Check if this is the last item
const isLast = computed(() => itemIndex.value === timeline.totalItems.value - 1)

// For alternate variant, determine if content should be on the right
const isAlternateRight = computed(() => {
  if (timeline.variant.value !== 'alternate') return false
  return itemIndex.value % 2 === 1
})

// Provide item context to children
provide(TIMELINE_ITEM_INJECTION_KEY, {
  index: itemIndex,
  status,
  isLast,
  isAlternateRight,
})

const isVertical = computed(() => timeline.orientation.value === 'vertical')
const isAlternate = computed(() => timeline.variant.value === 'alternate')

const itemClass = computed(() =>
  cn(
    'group relative',
    // Default vertical layout
    isVertical.value && !isAlternate.value && 'flex gap-3',
    // Default horizontal layout - flex-1 to grow, align content to start
    !isVertical.value && !isAlternate.value && 'flex flex-1 flex-col items-start gap-3',
    // Alternate vertical layout - use grid for proper two-column layout
    isVertical.value && isAlternate.value && 'grid grid-cols-[1fr_auto_1fr] gap-x-3',
    // Alternate horizontal layout - flex-1 to grow and fill space
    !isVertical.value && isAlternate.value && 'flex-1 grid grid-rows-[1fr_auto_1fr] gap-y-3 justify-items-center',
    props.class
  )
)
</script>

<template>
  <div
    role="listitem"
    :aria-current="status === 'active' ? 'step' : undefined"
    :data-status="status"
    :data-orientation="timeline.orientation.value"
    :data-variant="timeline.variant.value"
    :data-alternate-right="isAlternateRight ? '' : undefined"
    data-slot="timeline-item"
    :class="itemClass"
  >
    <slot />
  </div>
</template>
