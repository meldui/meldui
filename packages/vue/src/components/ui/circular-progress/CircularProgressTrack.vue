<script setup lang="ts">
import type { Ref, SVGAttributes } from 'vue'
import { computed, inject, unref } from 'vue'
import { cn } from '@/lib/utils'

interface CircularProgressTrackProps {
  class?: SVGAttributes['class']
}

const props = defineProps<CircularProgressTrackProps>()

const context = inject<{
  size: Ref<number>
  thickness: Ref<number>
}>('circularProgress')

if (!context) {
  throw new Error('CircularProgressTrack must be used within CircularProgress')
}

const thickness = computed(() => unref(context.thickness))
const center = computed(() => unref(context.size) / 2)
const radius = computed(() => (unref(context.size) - thickness.value) / 2)
</script>

<template>
  <circle
    data-slot="circular-progress-track"
    :cx="center"
    :cy="center"
    :r="radius"
    :stroke-width="thickness"
    fill="none"
    :class="cn('stroke-current opacity-20', props.class)"
  />
</template>
