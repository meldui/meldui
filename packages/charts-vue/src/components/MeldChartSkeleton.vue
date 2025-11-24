<script setup lang="ts">
import { computed } from 'vue'
import { Skeleton, cn } from '@meldui/vue'
import type { MeldChartSkeletonProps } from '../types'

const props = withDefaults(defineProps<MeldChartSkeletonProps>(), {
  height: 350,
  width: '100%',
  animated: true,
})

const computedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const computedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

// Generate random bar heights for visual variety
const barHeights = computed(() =>
  Array.from({ length: 7 }, () => `${Math.random() * 60 + 20}%`),
)
</script>

<template>
  <div
    class="meld-chart-skeleton"
    :style="{ height: computedHeight, width: computedWidth }"
    role="status"
    aria-label="Loading chart"
  >
    <!-- Visual structure matching chart layout -->
    <div class="skeleton-header">
      <Skeleton :class="cn('h-5 w-[120px]', !animated && 'animate-none')" />
      <div class="skeleton-legend">
        <Skeleton
          v-for="i in 3"
          :key="i"
          :class="cn('h-4 w-[60px]', !animated && 'animate-none')"
        />
      </div>
    </div>

    <div class="skeleton-chart-area">
      <!-- Fake chart bars/lines -->
      <div class="skeleton-bars">
        <Skeleton
          v-for="(height, i) in barHeights"
          :key="i"
          :class="cn('flex-1 rounded-t-md', !animated && 'animate-none')"
          :style="{ height }"
        />
      </div>
    </div>

    <div class="skeleton-footer">
      <div class="skeleton-axis-labels">
        <Skeleton
          v-for="i in 7"
          :key="i"
          :class="cn('h-3 flex-1', !animated && 'animate-none')"
        />
      </div>
    </div>

    <!-- Screen reader announcement -->
    <span class="sr-only">Loading chart data...</span>
  </div>
</template>

<style scoped>
.meld-chart-skeleton {
  display: flex;
  flex-direction: column;
  background: hsl(var(--muted));
  border: 1px solid hsl(var(--border));
  border-radius: 0.5rem;
  padding: 1.5rem;
  overflow: hidden;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.skeleton-legend {
  display: flex;
  gap: 1rem;
}

.skeleton-chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem 0;
  min-height: 200px;
}

.skeleton-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  gap: 0.5rem;
}

.skeleton-footer {
  margin-top: 1rem;
}

.skeleton-axis-labels {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
