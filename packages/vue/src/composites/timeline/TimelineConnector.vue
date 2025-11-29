<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineConnectorProps } from './types'
import { TIMELINE_INJECTION_KEY, TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = withDefaults(defineProps<TimelineConnectorProps>(), {
  thickness: 'default',
})

const timeline = inject(TIMELINE_INJECTION_KEY)
const timelineItem = inject(TIMELINE_ITEM_INJECTION_KEY)

if (!timeline || !timelineItem) {
  throw new Error('TimelineConnector must be used within a TimelineItem component')
}

// Thickness presets for vertical (width) and horizontal (height)
const thicknessClasses: Record<string, { vertical: string; horizontal: string }> = {
  thin: { vertical: 'w-px', horizontal: 'h-px' },
  default: { vertical: 'w-0.5', horizontal: 'h-0.5' },
  thick: { vertical: 'w-1', horizontal: 'h-1' },
}

const isVertical = computed(() => timeline.orientation.value === 'vertical')
const isCompleted = computed(() => timelineItem.status.value === 'completed')

const connectorClass = computed(() =>
  cn(
    // Use flex-1 to grow within flex container (works for both default and alternate)
    'flex-1',
    isVertical.value
      ? [thicknessClasses[props.thickness].vertical, 'min-h-8']
      : [thicknessClasses[props.thickness].horizontal, 'min-w-8'],
    // Color based on completion status
    isCompleted.value ? 'bg-primary' : 'bg-muted-foreground/30',
    // Hide if last item
    timelineItem.isLast.value && 'invisible',
    props.class,
  ),
)
</script>

<template>
  <div
    aria-hidden="true"
    :data-status="timelineItem.status.value"
    :data-orientation="timeline.orientation.value"
    :data-completed="isCompleted ? '' : undefined"
    data-slot="timeline-connector"
    :class="connectorClass"
  />
</template>
