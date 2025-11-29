<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineContentProps } from './types'
import { TIMELINE_INJECTION_KEY, TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = defineProps<TimelineContentProps>()

const timeline = inject(TIMELINE_INJECTION_KEY)
const timelineItem = inject(TIMELINE_ITEM_INJECTION_KEY)

if (!timeline || !timelineItem) {
  throw new Error('TimelineContent must be used within a TimelineItem component')
}

const isVertical = computed(() => timeline.orientation.value === 'vertical')
const isAlternate = computed(() => timeline.variant.value === 'alternate')
const isContentStart = computed(() => timeline.contentPosition.value === 'start')

const contentClass = computed(() =>
  cn(
    'flex flex-col',
    // Vertical layout: add bottom padding for spacing between items
    isVertical.value && 'pb-6',
    // Default vertical layout: align text based on content position
    isVertical.value &&
      !isAlternate.value && [
        // content-position="start" means content is on LEFT, so right-align text towards separator
        isContentStart.value && 'items-end text-right',
        // content-position="end" (default) means content is on RIGHT, so left-align text
        !isContentStart.value && 'items-start text-left',
      ],
    // Default horizontal layout: align content to start (under the dot)
    !isVertical.value && !isAlternate.value && 'items-start text-left',
    // Alternate vertical layout - position based on item index (all in row-start-1)
    isAlternate.value &&
      isVertical.value && [
        'row-start-1',
        // Even items (0, 2, 4): content on LEFT, so align text to right
        !timelineItem.isAlternateRight.value && 'col-start-1 items-end text-right',
        // Odd items (1, 3, 5): content on RIGHT, so align text to left
        timelineItem.isAlternateRight.value && 'col-start-3 items-start text-left',
      ],
    // Alternate horizontal layout - content above or below the dot, left-aligned in item
    isAlternate.value &&
      !isVertical.value && [
        'justify-self-start',
        // Even items (0, 2, 4): content on TOP
        !timelineItem.isAlternateRight.value && 'row-start-1 items-start text-left self-end',
        // Odd items (1, 3, 5): content on BOTTOM
        timelineItem.isAlternateRight.value && 'row-start-3 items-start text-left self-start',
      ],
    props.class,
  ),
)
</script>

<template>
  <div
    :data-status="timelineItem.status.value"
    :data-orientation="timeline.orientation.value"
    data-slot="timeline-content"
    :class="contentClass"
  >
    <slot />
  </div>
</template>
