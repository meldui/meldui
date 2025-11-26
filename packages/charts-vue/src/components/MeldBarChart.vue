<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { transformToEChartsOption } from '../adapters/echarts/transformer'
import { useChartBase } from '../composables/useChartBase'
import { useChartEvents } from '../composables/useChartEvents'
import { useChartResize } from '../composables/useChartResize'
import { useChartTheme } from '../composables/useChartTheme'
import type { ChartEmits, MeldBarChartProps } from '../types'
import MeldChartSkeleton from './MeldChartSkeleton.vue'

const props = withDefaults(defineProps<MeldBarChartProps>(), {
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

// Transform config to ECharts options
const echartsOptions = computed(() =>
  transformToEChartsOption(props.config, chartThemeConfig.value, 'bar'),
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
      const newOptions = transformToEChartsOption(newConfig, chartThemeConfig.value, 'bar')
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
      const newOptions = transformToEChartsOption(props.config, newTheme, 'bar')
      updateChart(newOptions)
    }
  },
  { deep: true },
)

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
        type="bar"
      />

      <!-- Chart canvas -->
      <div
        ref="chartRef"
        class="h-full w-full transition-opacity duration-300"
        :class="{ 'opacity-0': !chartReady || loading }"
      />
    </div>

    <!-- Footer slot for legends, captions, etc. -->
    <slot name="footer" />
  </div>
</template>
