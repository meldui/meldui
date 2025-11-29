<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import { cn } from '../../lib/utils'
import type { TimelineRootProps } from './types'
import { TIMELINE_INJECTION_KEY } from './types'

const props = withDefaults(defineProps<TimelineRootProps>(), {
  orientation: 'vertical',
  variant: 'default',
  activeIndex: -1,
})

// Track registered items
const itemCount = ref(0)
let nextIndex = 0

const registerItem = () => {
  const index = nextIndex++
  itemCount.value++
  return index
}

const unregisterItem = () => {
  itemCount.value--
}

// Provide context to children
provide(TIMELINE_INJECTION_KEY, {
  orientation: toRef(() => props.orientation),
  variant: toRef(() => props.variant),
  activeIndex: toRef(() => props.activeIndex),
  registerItem,
  unregisterItem,
  totalItems: itemCount,
})

const rootClass = computed(() =>
  cn(
    'flex',
    props.orientation === 'vertical' ? 'flex-col' : 'flex-row',
    props.class
  )
)
</script>

<template>
  <div
    role="list"
    :aria-orientation="orientation"
    :data-orientation="orientation"
    :data-variant="variant"
    data-slot="timeline"
    :class="rootClass"
  >
    <slot />
  </div>
</template>
