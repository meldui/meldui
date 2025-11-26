<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { MeldChartProps } from '../types'
import MeldChartSkeleton from './MeldChartSkeleton.vue'

const props = defineProps<MeldChartProps>()

// Dynamically load chart component based on type
const ChartComponent = computed(() => {
  switch (props.type) {
    case 'line':
      return defineAsyncComponent(() => import('./MeldLineChart.vue'))
    case 'bar':
      return defineAsyncComponent(() => import('./MeldBarChart.vue'))
    case 'area':
      return defineAsyncComponent(() => import('./MeldAreaChart.vue'))
    case 'pie':
      return defineAsyncComponent(() => import('./MeldPieChart.vue'))
    case 'donut':
      return defineAsyncComponent(() => import('./MeldDonutChart.vue'))
    case 'scatter':
      return defineAsyncComponent(() => import('./MeldScatterChart.vue'))
    case 'radar':
      return defineAsyncComponent(() => import('./MeldRadarChart.vue'))
    case 'heatmap':
      return defineAsyncComponent(() => import('./MeldHeatmapChart.vue'))
    case 'mixed':
      return defineAsyncComponent(() => import('./MeldMixedChart.vue'))
    default:
      return null
  }
})

// Error handling for unsupported chart types
const isUnsupported = computed(() => {
  return !ChartComponent.value
})
</script>

<template>
  <div class="w-full">
    <!-- Show skeleton while loading component -->
    <Suspense>
      <template #default>
        <component
          :is="ChartComponent"
          v-if="ChartComponent && !isUnsupported"
          v-bind="$props"
        >
          <!-- Pass through slots to child chart component -->
          <template #header>
            <slot name="header" />
          </template>
          <template #footer>
            <slot name="footer" />
          </template>
        </component>
        <div
          v-else-if="isUnsupported"
          class="flex items-center justify-center p-8 text-muted-foreground"
          :style="{ height: typeof height === 'number' ? `${height}px` : height }"
        >
          <div class="text-center">
            <p class="text-lg font-medium">Chart type "{{ type }}" is not yet implemented</p>
            <p class="text-sm mt-2">
              Please use a specific chart component or choose from: line, bar, area, pie, donut
            </p>
          </div>
        </div>
      </template>
      <template #fallback>
        <MeldChartSkeleton :height="height" :width="width" />
      </template>
    </Suspense>
  </div>
</template>
