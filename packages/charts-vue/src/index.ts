// @meldui/charts-vue
// MeldUI Chart components for Vue 3 built on Apache ECharts

// ============================================================================
// PUBLIC API - Components
// ============================================================================

export { default as MeldAreaChart } from './components/MeldAreaChart.vue'
export { default as MeldBarChart } from './components/MeldBarChart.vue'
// Smart wrapper with dynamic imports (Phase 3)
export { default as MeldChart } from './components/MeldChart.vue'
// Loading skeleton component
export { default as MeldChartSkeleton } from './components/MeldChartSkeleton.vue'
// Additional chart components (Phase 4)
export { default as MeldDonutChart } from './components/MeldDonutChart.vue'
export { default as MeldHeatmapChart } from './components/MeldHeatmapChart.vue'
// Core chart components (Phase 2)
export { default as MeldLineChart } from './components/MeldLineChart.vue'
export { default as MeldMixedChart } from './components/MeldMixedChart.vue'
export { default as MeldPieChart } from './components/MeldPieChart.vue'
export { default as MeldRadarChart } from './components/MeldRadarChart.vue'
export { default as MeldScatterChart } from './components/MeldScatterChart.vue'

// ============================================================================
// PUBLIC API - Types
// ============================================================================

export type {
  // Utility types
  AnyChartConfig,
  CartesianChartConfigBase,
  // Shared types
  ChartAxis,
  // Event types
  ChartBrushSelectEvent,
  ChartClickEvent,
  ChartConfigBase,
  ChartDataLabels,
  ChartDataZoomEvent,
  ChartEmits,
  ChartGrid,
  ChartHoverEvent,
  ChartLegend,
  ChartLegendSelectEvent,
  ChartMouseOutEvent,
  ChartSeries,
  ChartStroke,
  ChartTooltip,
  ChartType,
  // Chart-specific configuration types (recommended)
  MeldAreaChartConfig,
  // Component props
  MeldAreaChartProps,
  MeldBarChartConfig,
  MeldBarChartProps,
  // Legacy types (deprecated, for backwards compatibility)
  /** @deprecated Use chart-specific config types instead */
  MeldChartBaseProps,
  /** @deprecated Use chart-specific config types instead */
  MeldChartConfig,
  MeldChartProps,
  MeldChartSkeletonProps,
  MeldDonutChartConfig,
  MeldDonutChartProps,
  MeldDynamicChartConfig,
  MeldHeatmapChartConfig,
  MeldHeatmapChartProps,
  MeldLineChartConfig,
  MeldLineChartProps,
  MeldMixedChartConfig,
  MeldMixedChartProps,
  MeldPieChartConfig,
  MeldPieChartProps,
  MeldRadarChartConfig,
  MeldRadarChartProps,
  MeldScatterChartConfig,
  MeldScatterChartProps,
  MixedChartSeries,
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
