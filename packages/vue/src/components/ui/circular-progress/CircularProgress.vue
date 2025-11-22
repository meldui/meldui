<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, provide, toRefs } from 'vue'
import { cn } from '@/lib/utils'
import type { CircularProgressVariants } from '.'
import { circularProgressVariants } from '.'

export interface CircularProgressProps {
  value?: number | null
  min?: number
  max?: number
  size?: number
  thickness?: number
  variant?: CircularProgressVariants['variant']
  class?: HTMLAttributes['class']
  getValueLabel?: (value: number, max: number) => string
}

const props = withDefaults(defineProps<CircularProgressProps>(), {
  value: 0,
  min: 0,
  max: 100,
  size: 48,
  thickness: 4,
  variant: 'default',
  getValueLabel: (value: number, max: number) => {
    return `${Math.round((value / max) * 100)}%`
  },
})

const normalizedValue = computed(() => {
  if (props.value === null) return null
  return Math.min(Math.max(props.value, props.min), props.max)
})

const percentage = computed(() => {
  if (normalizedValue.value === null) return null
  return ((normalizedValue.value - props.min) / (props.max - props.min)) * 100
})

const state = computed(() => {
  if (props.value === null) return 'indeterminate'
  if (normalizedValue.value === props.max) return 'complete'
  return 'loading'
})

const valueLabel = computed(() => {
  if (normalizedValue.value === null) return undefined
  return props.getValueLabel(normalizedValue.value, props.max)
})

// Provide context for child components
const context = {
  value: normalizedValue,
  percentage,
  size: toRefs(props).size,
  thickness: toRefs(props).thickness,
  variant: toRefs(props).variant,
  state,
  valueLabel,
  min: toRefs(props).min,
  max: toRefs(props).max,
}

provide('circularProgress', context)
</script>

<template>
  <div
    data-slot="circular-progress"
    role="progressbar"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="normalizedValue ?? undefined"
    :aria-valuetext="valueLabel"
    :data-state="state"
    :data-value="normalizedValue ?? undefined"
    :data-max="max"
    :class="cn(circularProgressVariants({ variant }), props.class)"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }"
  >
    <slot />
  </div>
</template>
