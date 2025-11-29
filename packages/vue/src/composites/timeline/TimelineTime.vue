<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineTimeProps } from './types'
import { TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = defineProps<TimelineTimeProps>()

const timelineItem = inject(TIMELINE_ITEM_INJECTION_KEY)

if (!timelineItem) {
  throw new Error('TimelineTime must be used within a TimelineItem component')
}

const timeClass = computed(() =>
  cn(
    'text-xs text-muted-foreground',
    props.class
  )
)
</script>

<template>
  <time
    :datetime="dateTime"
    :data-status="timelineItem.status.value"
    data-slot="timeline-time"
    :class="timeClass"
  >
    <slot />
  </time>
</template>
