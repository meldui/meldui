<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineHeaderProps } from './types'
import { TIMELINE_INJECTION_KEY, TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = defineProps<TimelineHeaderProps>()

const timeline = inject(TIMELINE_INJECTION_KEY)
const timelineItem = inject(TIMELINE_ITEM_INJECTION_KEY)

if (!timeline || !timelineItem) {
  throw new Error('TimelineHeader must be used within a TimelineItem component')
}

const headerClass = computed(() =>
  cn(
    'flex items-center gap-2',
    timeline.variant.value === 'alternate' &&
      timeline.orientation.value === 'vertical' &&
      timelineItem.isAlternateRight.value &&
      'flex-row-reverse',
    props.class,
  ),
)
</script>

<template>
  <div :data-status="timelineItem.status.value" data-slot="timeline-header" :class="headerClass">
    <slot />
  </div>
</template>
