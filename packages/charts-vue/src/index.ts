// @meldui/charts-vue
// MeldUI Chart components for Vue 3 built on Apache ECharts

// ============================================================================
// PUBLIC API - Components
// ============================================================================

export { default as MeldAreaChart } from './components/MeldAreaChart.vue'
export { default as MeldBarChart } from './components/MeldBarChart.vue'
// Loading skeleton component
export { default as MeldChartSkeleton } from './components/MeldChartSkeleton.vue'
// Core chart components (Phase 2)
export { default as MeldLineChart } from './components/MeldLineChart.vue'
export { default as MeldPieChart } from './components/MeldPieChart.vue'

// Additional chart components (will be added in later phases)
// export { default as MeldChart } from './components/MeldChart.vue'
// export { default as MeldDonutChart } from './components/MeldDonutChart.vue'
// export { default as MeldScatterChart } from './components/MeldScatterChart.vue'
// export { default as MeldRadarChart } from './components/MeldRadarChart.vue'
// export { default as MeldHeatmapChart } from './components/MeldHeatmapChart.vue'
// export { default as MeldMixedChart } from './components/MeldMixedChart.vue'

// ============================================================================
// PUBLIC API - Types
// ============================================================================

export type {
  ChartAxis,
  ChartGrid,
  ChartLegend,
  ChartSeries,
  ChartStroke,
  ChartTooltip,
  ChartType,
  MeldAreaChartProps,
  MeldBarChartProps,
  MeldChartBaseProps,
  MeldChartConfig,
  MeldChartProps,
  MeldChartSkeletonProps,
  MeldDonutChartProps,
  MeldHeatmapChartProps,
  MeldLineChartProps,
  MeldMixedChartProps,
  MeldPieChartProps,
  MeldRadarChartProps,
  MeldScatterChartProps,
  PaletteName,
} from './types'

// ============================================================================
// PUBLIC API - Color Palettes
// ============================================================================

export type { Palette } from './config/palettes'
export { generateColors, MAX_RECOMMENDED_SERIES, PALETTES } from './config/palettes'

// ============================================================================
// INTERNAL ONLY - NOT EXPORTED
// ============================================================================
// - adapters/echarts/* (transformer, registry, etc.)
// - composables/* (useChartBase, useChartTheme, useChartResize)
// - config/defaults (default chart configuration)
// These are implementation details and should never be exposed to users
