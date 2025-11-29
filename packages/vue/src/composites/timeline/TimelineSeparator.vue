<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '../../lib/utils'
import { TIMELINE_INJECTION_KEY } from './types'

interface TimelineSeparatorProps {
  class?: string
}

const props = defineProps<TimelineSeparatorProps>()

const timeline = inject(TIMELINE_INJECTION_KEY)

if (!timeline) {
  throw new Error('TimelineSeparator must be used within a Timeline component')
}

const isVertical = computed(() => timeline.orientation.value === 'vertical')
const isAlternate = computed(() => timeline.variant.value === 'alternate')

const separatorClass = computed(() =>
  cn(
    'flex items-center',
    isVertical.value ? 'flex-col' : 'flex-row',
    // In default horizontal layout, stretch to fill item width
    !isAlternate.value && !isVertical.value && 'w-full',
    // In alternate layout, position in center and stretch to fill cell
    isAlternate.value && isVertical.value && 'col-start-2 row-start-1 self-stretch',
    // In alternate horizontal layout, span all columns and stretch
    isAlternate.value && !isVertical.value && 'row-start-2 col-span-full w-full',
    props.class
  )
)
</script>

<template>
  <div
    data-slot="timeline-separator"
    :data-orientation="timeline.orientation.value"
    :class="separatorClass"
  >
    <slot />
  </div>
</template>
