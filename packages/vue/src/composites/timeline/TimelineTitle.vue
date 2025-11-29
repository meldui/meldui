<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineTitleProps } from './types'
import { TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = defineProps<TimelineTitleProps>()

const timelineItem = inject(TIMELINE_ITEM_INJECTION_KEY)

if (!timelineItem) {
  throw new Error('TimelineTitle must be used within a TimelineItem component')
}

const titleClass = computed(() =>
  cn(
    'text-sm font-medium leading-none',
    timelineItem.status.value === 'pending' && 'text-muted-foreground',
    props.class,
  ),
)
</script>

<template>
  <h3
    :data-status="timelineItem.status.value"
    data-slot="timeline-title"
    :class="titleClass"
  >
    <slot />
  </h3>
</template>
