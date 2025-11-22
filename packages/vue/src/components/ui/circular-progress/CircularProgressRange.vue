<script setup lang="ts">
import type { SVGAttributes } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { computed, inject, unref } from 'vue'
import { cn } from '@/lib/utils'

interface CircularProgressRangeProps {
  class?: SVGAttributes['class']
}

const props = defineProps<CircularProgressRangeProps>()

const context = inject<{
  size: Ref<number>
  thickness: Ref<number>
  percentage: ComputedRef<number | null>
  state: ComputedRef<string>
}>('circularProgress')

if (!context) {
  throw new Error('CircularProgressRange must be used within CircularProgress')
}

const thickness = computed(() => unref(context.thickness))
const center = computed(() => unref(context.size) / 2)
const radius = computed(() => (unref(context.size) - thickness.value) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const isIndeterminate = computed(() => unref(context.state) === 'indeterminate')

const strokeDasharray = computed(() => {
  const pct = unref(context.percentage)
  if (pct === null) {
    // Indeterminate state - show 25% arc
    return `${circumference.value * 0.25} ${circumference.value * 0.75}`
  }
  // Show pct% of the circle as filled, rest as gap
  const filled = (pct / 100) * circumference.value
  const gap = circumference.value - filled
  return `${filled} ${gap}`
})

const strokeDashoffset = computed(() => {
  // Start from the top (already rotated -90deg)
  return 0
})
</script>

<template>
  <circle
    data-slot="circular-progress-range"
    :cx="center"
    :cy="center"
    :r="radius"
    :stroke-width="thickness"
    :stroke-dasharray="strokeDasharray"
    :stroke-dashoffset="strokeDashoffset"
    stroke-linecap="round"
    fill="none"
    :transform="`rotate(-90 ${center} ${center})`"
    :class="
      cn(
        'stroke-current',
        !isIndeterminate && 'transition-all duration-300 ease-in-out',
        props.class,
      )
    "
  >
    <animateTransform
      v-if="isIndeterminate"
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      :from="`-90 ${center} ${center}`"
      :to="`270 ${center} ${center}`"
      dur="1.5s"
      repeatCount="indefinite"
    />
  </circle>
</template>
