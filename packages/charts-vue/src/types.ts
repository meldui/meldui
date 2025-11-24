// Library-agnostic type definitions for MeldUI Charts
// Users never see ECharts types - this is our public API

/** Supported chart types */
export type ChartType =
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'radar'
  | 'heatmap'
  | 'mixed'

/** Available color palette names */
export type PaletteName =
  | 'default'
  | 'vibrant'
  | 'pastel'
  | 'monochrome'
  | 'earth'
  | 'ocean'
  | 'sunset'
  | 'corporate'
  | 'neon'
  | 'accessible'

/** Chart data series */
export interface ChartSeries {
  /** Series name (shown in legend and tooltip) */
  name: string

  /** Data points */
  data: number[] | Array<{ x: string | number | Date; y: number | null }>

  /** Custom color for this series (overrides theme colors) */
  color?: string

  /** Chart type for mixed charts */
  type?: 'line' | 'bar' | 'area'
}

/** X or Y axis configuration */
export interface ChartAxis {
  /** Category labels for x-axis */
  categories?: string[]

  /** Axis title */
  title?: string

  /** Axis type */
  type?: 'category' | 'datetime' | 'numeric'

  /** Minimum value */
  min?: number

  /** Maximum value */
  max?: number

  /** Label formatting */
  labels?: {
    format?: string
    rotate?: number
    show?: boolean
  }
}

/** Legend configuration */
export interface ChartLegend {
  /** Show/hide legend */
  show?: boolean

  /** Legend position */
  position?: 'top' | 'bottom' | 'left' | 'right'

  /** Horizontal alignment */
  align?: 'left' | 'center' | 'right'
}

/** Tooltip configuration */
export interface ChartTooltip {
  /** Enable/disable tooltip */
  enabled?: boolean

  /** Shared tooltip for multiple series */
  shared?: boolean

  /** Custom formatter function */
  formatter?: (value: number, seriesName: string, dataPointIndex: number) => string
}

/** Grid configuration */
export interface ChartGrid {
  /** Show/hide grid */
  show?: boolean

  /** Dash array for grid lines */
  strokeDashArray?: number
}

/** Stroke configuration (for line/area charts) */
export interface ChartStroke {
  /** Line width */
  width?: number

  /** Line curve type */
  curve?: 'smooth' | 'straight' | 'stepline'

  /** Dash array for dashed lines */
  dashArray?: number | number[]
}

/** Main chart configuration interface */
export interface MeldChartConfig {
  /** Chart data series */
  series: ChartSeries[]

  /** X-axis configuration */
  xAxis?: ChartAxis

  /** Y-axis configuration */
  yAxis?: ChartAxis

  /** Legend configuration */
  legend?: ChartLegend

  /** Tooltip configuration */
  tooltip?: ChartTooltip

  /** Grid configuration */
  grid?: ChartGrid

  /** Stroke configuration */
  stroke?: ChartStroke

  /** Series colors (auto = use theme colors, palette name, or custom array) */
  colors?: 'auto' | PaletteName | string[]

  /** Enable/disable animations */
  animations?: boolean

  /** Show/hide toolbar (zoom, download, etc.) */
  toolbar?: boolean

  /** Enable zoom functionality */
  zoom?: boolean

  /** Stack bars/areas */
  stacked?: boolean

  /** Horizontal orientation (for bar charts) */
  horizontal?: boolean

  /**
   * Advanced configuration (escape hatch)
   * Accepts raw ECharts options for edge cases
   * Type is intentionally generic to avoid exposing ECharts types
   */
  advanced?: Record<string, any>
}

/** Base props for all chart components */
export interface MeldChartBaseProps {
  /** Chart configuration */
  config: MeldChartConfig

  /** Chart height */
  height?: number | string // Default: 350

  /** Chart width */
  width?: number | string // Default: '100%'

  /** Chart title */
  title?: string

  /** Show loading skeleton */
  loading?: boolean
}

/** Props for MeldChart (dynamic type) */
export interface MeldChartProps extends MeldChartBaseProps {
  /** Chart type (dynamically loaded) */
  type: ChartType
}

/** Props for specific chart types (extends base) */
export interface MeldLineChartProps extends MeldChartBaseProps {}
export interface MeldBarChartProps extends MeldChartBaseProps {}
export interface MeldAreaChartProps extends MeldChartBaseProps {}
export interface MeldPieChartProps extends MeldChartBaseProps {}
export interface MeldDonutChartProps extends MeldChartBaseProps {}
export interface MeldScatterChartProps extends MeldChartBaseProps {}
export interface MeldRadarChartProps extends MeldChartBaseProps {}
export interface MeldHeatmapChartProps extends MeldChartBaseProps {}
export interface MeldMixedChartProps extends MeldChartBaseProps {}

/** Props for skeleton component */
export interface MeldChartSkeletonProps {
  /** Height of the skeleton (matches chart height) */
  height?: number | string

  /** Width of the skeleton (matches chart width) */
  width?: number | string

  /** Show animated pulse effect */
  animated?: boolean

  /** Chart type to render appropriate skeleton */
  type?: ChartType
}
