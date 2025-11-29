<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineDotProps } from './types'
import { TIMELINE_INJECTION_KEY, TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = withDefaults(defineProps<TimelineDotProps>(), {
  size: 'md',
})

const slots = useSlots()

const timeline = inject(TIMELINE_INJECTION_KEY)
const timelineItem = inject(TIMELINE_ITEM_INJECTION_KEY)

if (!timeline || !timelineItem) {
  throw new Error('TimelineDot must be used within a TimelineItem component')
}

// Size presets
const sizeClasses: Record<string, string> = {
  sm: 'size-2.5',
  md: 'size-3.5',
  lg: 'size-5',
}

const hasSlotContent = computed(() => !!slots.default)

const dotClass = computed(() =>
  cn(
    'relative z-10 flex shrink-0 items-center justify-center rounded-full',
    // Apply size preset only if no custom class overrides it
    sizeClasses[props.size],
    // Default background based on status when no slot content
    !hasSlotContent.value && [
      'border-2',
      timelineItem.status.value === 'completed' && 'border-primary bg-primary',
      timelineItem.status.value === 'active' && 'border-primary bg-background',
      timelineItem.status.value === 'pending' && 'border-muted-foreground/30 bg-background',
    ],
    // When has slot content, just provide container styles
    hasSlotContent.value && 'border-0 bg-transparent',
    props.class,
  ),
)
</script>

<template>
  <div
    :data-status="timelineItem.status.value"
    :data-orientation="timeline.orientation.value"
    :data-has-content="hasSlotContent ? '' : undefined"
    data-slot="timeline-dot"
    :class="dotClass"
  >
    <slot />
  </div>
</template>
