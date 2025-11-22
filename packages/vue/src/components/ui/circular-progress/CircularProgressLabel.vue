<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { ComputedRef } from 'vue'
import { computed, inject, unref } from 'vue'
import { cn } from '@/lib/utils'

interface CircularProgressLabelProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<CircularProgressLabelProps>()

const context = inject<{
  valueLabel: ComputedRef<string | undefined>
}>('circularProgress')

if (!context) {
  throw new Error('CircularProgressLabel must be used within CircularProgress')
}

const valueLabel = computed(() => unref(context.valueLabel))
</script>

<template>
  <div
    data-slot="circular-progress-label"
    :class="
      cn('absolute inset-0 flex items-center justify-center text-sm font-medium', props.class)
    "
  >
    <slot>{{ valueLabel }}</slot>
  </div>
</template>
