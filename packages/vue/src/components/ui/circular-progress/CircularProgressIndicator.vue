<script setup lang="ts">
import type { HTMLAttributes, Ref } from 'vue'
import { computed, inject, unref } from 'vue'
import { cn } from '@/lib/utils'

interface CircularProgressIndicatorProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<CircularProgressIndicatorProps>()

const context = inject<{
  size: Ref<number>
  thickness: Ref<number>
}>('circularProgress')

if (!context) {
  throw new Error('CircularProgressIndicator must be used within CircularProgress')
}

const size = computed(() => unref(context.size))
const center = computed(() => size.value / 2)
const radius = computed(() => (size.value - unref(context.thickness)) / 2)
const viewBox = computed(() => `0 0 ${size.value} ${size.value}`)
</script>

<template>
  <svg
    data-slot="circular-progress-indicator"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="none"
    :class="cn('relative', props.class)"
  >
    <slot :center="center" :radius="radius" />
  </svg>
</template>
