// @meldui/charts-vue
// MeldUI Chart components for Vue 3 built on Apache ECharts

// ============================================================================
// PUBLIC API - Components
// ============================================================================

// Loading skeleton component
export { default as MeldChartSkeleton } from './components/MeldChartSkeleton.vue'

// Chart components will be added in Phase 2
// export { default as MeldChart } from './components/MeldChart.vue'
// export { default as MeldLineChart } from './components/MeldLineChart.vue'
// export { default as MeldBarChart } from './components/MeldBarChart.vue'
// export { default as MeldAreaChart } from './components/MeldAreaChart.vue'
// export { default as MeldPieChart } from './components/MeldPieChart.vue'
// export { default as MeldDonutChart } from './components/MeldDonutChart.vue'
// export { default as MeldScatterChart } from './components/MeldScatterChart.vue'
// export { default as MeldRadarChart } from './components/MeldRadarChart.vue'
// export { default as MeldHeatmapChart } from './components/MeldHeatmapChart.vue'
// export { default as MeldMixedChart } from './components/MeldMixedChart.vue'

// ============================================================================
// PUBLIC API - Types
// ============================================================================

export type {
  ChartType,
  ChartSeries,
  ChartAxis,
  ChartLegend,
  ChartTooltip,
  ChartGrid,
  ChartStroke,
  MeldChartConfig,
  MeldChartBaseProps,
  MeldChartProps,
  MeldLineChartProps,
  MeldBarChartProps,
  MeldAreaChartProps,
  MeldPieChartProps,
  MeldDonutChartProps,
  MeldScatterChartProps,
  MeldRadarChartProps,
  MeldHeatmapChartProps,
  MeldMixedChartProps,
  MeldChartSkeletonProps,
} from './types'

// ============================================================================
// INTERNAL ONLY - NOT EXPORTED
// ============================================================================
// - adapters/echarts/* (transformer, registry, etc.)
// - composables/* (useChartBase, useChartTheme, useChartResize)
// - config/* (defaults, presets)
// These are implementation details and should never be exposed to users
