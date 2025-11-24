<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<template>
  <div
    class="meld-chart-skeleton"
    :class="{ 'animate-pulse': animated }"
    :style="{ height: computedHeight, width: computedWidth }"
    role="status"
    aria-label="Loading chart"
  >
    <!-- Visual structure matching chart layout -->
    <div class="skeleton-header">
      <div class="skeleton-title" />
      <div class="skeleton-legend">
        <div class="skeleton-legend-item" />
        <div class="skeleton-legend-item" />
        <div class="skeleton-legend-item" />
      </div>
    </div>

    <div class="skeleton-chart-area">
      <!-- Fake chart bars/lines -->
      <div class="skeleton-bars">
        <div
          v-for="i in 7"
          :key="i"
          class="skeleton-bar"
          :style="{ height: `${Math.random() * 60 + 20}%` }"
        />
      </div>
    </div>

    <div class="skeleton-footer">
      <div class="skeleton-axis-labels">
        <div v-for="i in 7" :key="i" class="skeleton-label" />
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
  background: var(--color-muted, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
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

.skeleton-title {
  width: 120px;
  height: 20px;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem;
}

.skeleton-legend {
  display: flex;
  gap: 1rem;
}

.skeleton-legend-item {
  width: 60px;
  height: 16px;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem;
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

.skeleton-bar {
  flex: 1;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem 0.25rem 0 0;
  transition: height 0.3s ease;
}

.skeleton-footer {
  margin-top: 1rem;
}

.skeleton-axis-labels {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.skeleton-label {
  flex: 1;
  height: 12px;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
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

/* Dark mode support */
.dark .meld-chart-skeleton {
  background: var(--color-muted, #1f2937);
  border-color: var(--color-border, #374151);
}

.dark .skeleton-title,
.dark .skeleton-legend-item,
.dark .skeleton-bar,
.dark .skeleton-label {
  background: var(--color-muted-foreground, #4b5563);
}
</style>
