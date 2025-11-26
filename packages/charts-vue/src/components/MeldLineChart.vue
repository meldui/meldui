<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { transformToEChartsOption } from '../adapters/echarts/transformer'
import { useChartBase } from '../composables/useChartBase'
import { useChartEvents } from '../composables/useChartEvents'
import { useChartResize } from '../composables/useChartResize'
import { useChartTheme } from '../composables/useChartTheme'
import type { ChartEmits, MeldLineChartProps } from '../types'
import MeldChartSkeleton from './MeldChartSkeleton.vue'

const props = withDefaults(defineProps<MeldLineChartProps>(), {
  height: 350,
  width: '100%',
  loading: false,
})

const emit = defineEmits<ChartEmits>()

const { chartRef, chartInstance, chartReady, isSSR, initChart, updateChart } = useChartBase()
const { chartThemeConfig } = useChartTheme()

// Setup event handlers
useChartEvents(chartInstance, emit)

// Compute chart dimensions
const computedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const computedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

// Generate accessible label for screen readers
const computedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  const seriesNames = props.config.series.map((s) => s.name).join(', ')
  return props.title
    ? `Line chart: ${props.title}. Data series: ${seriesNames}`
    : `Line chart with data series: ${seriesNames}`
})

// Transform config to ECharts options
const echartsOptions = computed(() =>
  transformToEChartsOption(props.config, chartThemeConfig.value, 'line'),
)

// Initialize chart on mount
onMounted(async () => {
  if (!isSSR) {
    await initChart(echartsOptions.value)
  }
})

// Watch for config or theme changes and update chart
// Note: No deep watch - users should replace config object, not mutate nested properties
watch([() => props.config, chartThemeConfig], () => {
  if (chartInstance.value) {
    updateChart(echartsOptions.value)
  }
})

// Setup automatic resizing
useChartResize(chartRef, chartInstance)
</script>

<template>
  <div class="flex flex-col" :style="{ width: computedWidth }">
    <!-- Header slot for title, actions, etc. -->
    <slot name="header">
      <h3
        v-if="title"
        class="text-base font-semibold text-foreground mb-2 px-1"
      >
        {{ title }}
      </h3>
    </slot>

    <!-- Chart container -->
    <div
      class="relative overflow-hidden border border-border rounded-lg"
      :style="{ height: computedHeight }"
    >
      <!-- Show skeleton during SSR, loading, or initialization -->
      <MeldChartSkeleton
        v-if="!chartReady || loading"
        :height="height"
        :width="width"
        type="line"
      />

      <!-- Chart canvas -->
      <div
        ref="chartRef"
        role="img"
        :aria-label="computedAriaLabel"
        class="h-full w-full transition-opacity duration-300"
        :class="{ 'opacity-0': !chartReady || loading }"
      />
    </div>

    <!-- Footer slot for legends, captions, etc. -->
    <slot name="footer" />
  </div>
</template>
