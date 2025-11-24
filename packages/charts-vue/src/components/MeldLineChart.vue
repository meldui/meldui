<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useChartBase } from '../composables/useChartBase'
import { useChartResize } from '../composables/useChartResize'
import { useChartTheme } from '../composables/useChartTheme'
import { transformToEChartsOption } from '../adapters/echarts/transformer'
import MeldChartSkeleton from './MeldChartSkeleton.vue'
import type { MeldLineChartProps } from '../types'

const props = withDefaults(defineProps<MeldLineChartProps>(), {
  height: 350,
  width: '100%',
  loading: false,
})

const { chartRef, chartInstance, chartReady, isSSR, initChart, updateChart } = useChartBase()
const { chartThemeConfig } = useChartTheme()

// Compute chart dimensions
const computedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)

const computedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
)

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

// Watch for config changes and update chart
watch(
  () => props.config,
  (newConfig) => {
    if (chartInstance.value) {
      const newOptions = transformToEChartsOption(newConfig, chartThemeConfig.value, 'line')
      updateChart(newOptions)
    }
  },
  { deep: true },
)

// Watch for theme changes
watch(
  () => chartThemeConfig.value,
  (newTheme) => {
    if (chartInstance.value) {
      const newOptions = transformToEChartsOption(props.config, newTheme, 'line')
      updateChart(newOptions)
    }
  },
  { deep: true },
)

// Setup automatic resizing
useChartResize(chartRef, chartInstance)
</script>

<template>
  <div
    class="relative overflow-hidden border border-border rounded-lg"
    :style="{ height: computedHeight, width: computedWidth }"
  >
    <!-- Show skeleton during SSR, loading, or initialization -->
    <MeldChartSkeleton
      v-if="!chartReady || loading"
      :height="height"
      :width="width"
      type="line"
    />

    <!-- Chart container -->
    <div
      ref="chartRef"
      class="h-full w-full transition-opacity duration-300"
      :class="{ 'opacity-0': !chartReady || loading }"
    />
  </div>
</template>
