<script setup lang="ts">
import { cn, Skeleton } from '@meldui/vue'
import { computed } from 'vue'
import type { MeldChartSkeletonProps } from '../types'

const props = withDefaults(defineProps<MeldChartSkeletonProps>(), {
  height: 350,
  width: '100%',
  animated: true,
  type: 'bar',
})

const computedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const computedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

// Generate random bar heights for visual variety (static per render)
const barHeights = Array.from({ length: 7 }, () => Math.floor(Math.random() * 60 + 20))
</script>

<template>
  <div
    :class="cn('flex flex-col border border-border rounded-lg p-6 overflow-hidden bg-background')"
    :style="{ height: computedHeight, width: computedWidth }"
    role="status"
    aria-label="Loading chart"
  >
    <!-- Header with title and legend -->
    <div class="flex justify-between items-center mb-6 shrink-0">
      <Skeleton :class="cn('h-5 w-[120px] rounded-md', !animated && 'animate-none')" />
      <div class="flex gap-4">
        <Skeleton
          v-for="i in 3"
          :key="i"
          :class="cn('h-4 w-[60px] rounded-md', !animated && 'animate-none')"
        />
      </div>
    </div>

    <!-- Main chart area with bars -->
    <div class="flex-1 flex items-end justify-center py-8 min-h-[200px]">
      <div class="flex items-end justify-evenly w-full h-full gap-4">
        <div
          v-for="(height, i) in barHeights"
          :key="i"
          class="flex-1 flex items-stretch min-w-0"
          :style="{ height: `${height}%` }"
        >
          <Skeleton
            :class="cn('w-full h-full rounded-t-md', !animated && 'animate-none')"
          />
        </div>
      </div>
    </div>

    <!-- Footer with axis labels -->
    <div class="mt-4 shrink-0">
      <div class="flex justify-between items-center gap-4">
        <Skeleton
          v-for="i in 7"
          :key="i"
          :class="cn('h-3 w-full rounded-sm', !animated && 'animate-none')"
        />
      </div>
    </div>

    <!-- Screen reader announcement -->
    <span class="sr-only">Loading chart data...</span>
  </div>
</template>
