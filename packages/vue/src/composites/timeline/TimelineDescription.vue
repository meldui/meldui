<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineDescriptionProps } from './types'
import { TIMELINE_ITEM_INJECTION_KEY } from './types'

const props = defineProps<TimelineDescriptionProps>()

const timelineItem = inject(TIMELINE_ITEM_INJECTION_KEY)

if (!timelineItem) {
  throw new Error('TimelineDescription must be used within a TimelineItem component')
}

const descriptionClass = computed(() => cn('mt-1 text-sm text-muted-foreground', props.class))
</script>

<template>
  <p
    :data-status="timelineItem.status.value"
    data-slot="timeline-description"
    :class="descriptionClass"
  >
    <slot />
  </p>
</template>
