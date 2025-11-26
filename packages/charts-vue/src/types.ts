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

// ============================================
// SHARED TYPES
// ============================================

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

/** Data labels configuration (show values on chart elements) */
export interface ChartDataLabels {
  /** Show/hide data labels */
  show?: boolean

  /** Label position relative to the data point */
  position?: 'top' | 'inside' | 'bottom' | 'left' | 'right'

  /** Custom formatter for label values */
  formatter?: (value: number) => string
}

// ============================================
// BASE CONFIG INTERFACE
// ============================================

/**
 * Shared base configuration for all chart types.
 * Contains properties common to all charts.
 */
export interface ChartConfigBase {
  /** Chart data series */
  series: ChartSeries[]

  /** Legend configuration */
  legend?: ChartLegend

  /** Tooltip configuration */
  tooltip?: ChartTooltip

  /** Series colors (auto = use theme colors, palette name, or custom array) */
  colors?: 'auto' | PaletteName | string[]

  /** Enable/disable animations */
  animations?: boolean

  /**
   * Advanced configuration (escape hatch)
   * Accepts raw ECharts options for edge cases
   * Type is intentionally generic to avoid exposing ECharts types
   */
  advanced?: Record<string, unknown>
}

// ============================================
// CARTESIAN CHART BASE (charts with axes)
// ============================================

/**
 * Base configuration for charts with X/Y axes.
 * Extends ChartConfigBase with axis and grid properties.
 */
export interface CartesianChartConfigBase extends ChartConfigBase {
  /** X-axis configuration */
  xAxis?: ChartAxis

  /** Y-axis configuration */
  yAxis?: ChartAxis

  /** Grid lines configuration */
  grid?: ChartGrid

  /** Show/hide toolbar (zoom, download, etc.) */
  toolbar?: boolean

  /** Enable zoom functionality */
  zoom?: boolean
}

// ============================================
// BAR CHART CONFIG
// ============================================

/**
 * Configuration for bar charts.
 * Only includes options relevant to bar charts.
 */
export interface MeldBarChartConfig extends CartesianChartConfigBase {
  /** Horizontal bar orientation */
  horizontal?: boolean

  /** Stack bars */
  stacked?: boolean

  /** Show values on bars */
  dataLabels?: ChartDataLabels

  /** Bar width (number in pixels or percentage string like '60%') */
  barWidth?: number | string

  /** Gap between bars in same category (percentage string like '30%') */
  barGap?: string
}

// ============================================
// LINE CHART CONFIG
// ============================================

/**
 * Configuration for line charts.
 * Only includes options relevant to line charts.
 */
export interface MeldLineChartConfig extends CartesianChartConfigBase {
  /** Line stroke configuration */
  stroke?: ChartStroke

  /** Show data points on line */
  showPoints?: boolean

  /** Size of data points */
  pointSize?: number

  /** Show values on data points */
  dataLabels?: ChartDataLabels
}

// ============================================
// AREA CHART CONFIG
// ============================================

/**
 * Configuration for area charts.
 * Only includes options relevant to area charts.
 */
export interface MeldAreaChartConfig extends CartesianChartConfigBase {
  /** Line stroke configuration */
  stroke?: ChartStroke

  /** Stack areas */
  stacked?: boolean

  /** Fill opacity (0-1) */
  fillOpacity?: number

  /** Show data points on line */
  showPoints?: boolean

  /** Size of data points */
  pointSize?: number

  /** Show values on data points */
  dataLabels?: ChartDataLabels
}

// ============================================
// PIE CHART CONFIG
// ============================================

/**
 * Configuration for pie charts.
 * Minimal, focused options for circular charts.
 */
export interface MeldPieChartConfig extends ChartConfigBase {
  /** Show labels on slices */
  showLabels?: boolean

  /** Label position */
  labelPosition?: 'inside' | 'outside'

  /** Starting angle in degrees */
  startAngle?: number

  /** Radius as percentage (e.g., '75%') or pixels */
  radius?: string | number

  /** Show values on slices */
  dataLabels?: ChartDataLabels
}

// ============================================
// DONUT CHART CONFIG
// ============================================

/**
 * Configuration for donut charts.
 * Extends pie chart with inner radius (the hole).
 */
export interface MeldDonutChartConfig extends ChartConfigBase {
  /** Show labels on slices */
  showLabels?: boolean

  /** Label position */
  labelPosition?: 'inside' | 'outside'

  /** Starting angle in degrees */
  startAngle?: number

  /** Outer radius as percentage (e.g., '75%') or pixels */
  radius?: string | number

  /** Inner radius (creates the hole), e.g., '40%' or 50 */
  innerRadius?: string | number

  /** Center label content */
  centerLabel?: {
    show?: boolean
    title?: string
    value?: string | number
  }

  /** Show values on slices */
  dataLabels?: ChartDataLabels
}

// ============================================
// RADAR CHART CONFIG
// ============================================

/**
 * Configuration for radar charts.
 * Unique configuration for spider/radar visualizations.
 */
export interface MeldRadarChartConfig extends ChartConfigBase {
  /** Radar indicators (categories with optional max) */
  indicators?: Array<{ name: string; max?: number }>

  /** Shape of the radar */
  shape?: 'polygon' | 'circle'

  /** Fill the radar area */
  fillArea?: boolean

  /** Fill opacity when fillArea is true */
  fillOpacity?: number

  /** Show axis labels */
  showAxisLabels?: boolean

  /** X-axis configuration (used for indicator names) */
  xAxis?: ChartAxis

  /** Y-axis configuration (used for max values) */
  yAxis?: ChartAxis

  /** Grid configuration (used for axis line visibility) */
  grid?: ChartGrid
}

// ============================================
// HEATMAP CHART CONFIG
// ============================================

/**
 * Configuration for heatmap charts.
 * Grid-based visualization with color intensity.
 */
export interface MeldHeatmapChartConfig extends CartesianChartConfigBase {
  /** Color range configuration */
  colorRange?: {
    min?: number
    max?: number
    colors?: string[] // Gradient colors
  }

  /** Show values in cells */
  showValues?: boolean

  /** Cell border configuration */
  cellBorder?: {
    show?: boolean
    color?: string
    width?: number
  }

  /** Show values on cells */
  dataLabels?: ChartDataLabels
}

// ============================================
// SCATTER CHART CONFIG
// ============================================

/**
 * Configuration for scatter charts.
 * Point-based visualization for correlation data.
 */
export interface MeldScatterChartConfig extends CartesianChartConfigBase {
  /** Point size (fixed number) */
  pointSize?: number

  /** Point shape */
  pointShape?: 'circle' | 'rect' | 'triangle' | 'diamond'

  /** Show values on points */
  dataLabels?: ChartDataLabels
}

// ============================================
// MIXED CHART CONFIG
// ============================================

/** Series configuration for mixed charts with type specification */
export interface MixedChartSeries extends ChartSeries {
  /** Chart type for this series */
  type: 'line' | 'bar' | 'area'

  /** Which Y-axis to use (0 = primary, 1 = secondary) */
  yAxisIndex?: 0 | 1
}

/**
 * Configuration for mixed charts.
 * Combines multiple chart types (line, bar, area).
 */
export interface MeldMixedChartConfig extends CartesianChartConfigBase {
  /** Mixed chart series with type specification */
  series: MixedChartSeries[]

  /** Secondary Y-axis for dual-axis charts */
  yAxis2?: ChartAxis

  /** Line stroke configuration (applies to line/area series) */
  stroke?: ChartStroke

  /** Stack bars/areas of the same type */
  stacked?: boolean

  /** Show values on data points */
  dataLabels?: ChartDataLabels
}

// ============================================
// UNIFIED CONFIG TYPE (for internal use and backwards compatibility)
// ============================================

/**
 * Unified chart configuration interface.
 * Contains all possible options across all chart types.
 * Used internally for transformation and backwards compatibility.
 *
 * @deprecated For better TypeScript support, use chart-specific config types:
 * - MeldBarChartConfig
 * - MeldLineChartConfig
 * - MeldAreaChartConfig
 * - MeldPieChartConfig
 * - MeldDonutChartConfig
 * - MeldRadarChartConfig
 * - MeldHeatmapChartConfig
 * - MeldScatterChartConfig
 * - MeldMixedChartConfig
 */
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

  /** Data labels configuration (show values on chart elements) */
  dataLabels?: ChartDataLabels

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
  advanced?: Record<string, unknown>
}

// ============================================
// TYPE UNION FOR DYNAMIC CHART COMPONENT
// ============================================

/**
 * Discriminated union for the dynamic MeldChart component.
 * TypeScript will enforce that the config type matches the chart type.
 */
export type MeldDynamicChartConfig =
  | { type: 'bar'; config: MeldBarChartConfig }
  | { type: 'line'; config: MeldLineChartConfig }
  | { type: 'area'; config: MeldAreaChartConfig }
  | { type: 'pie'; config: MeldPieChartConfig }
  | { type: 'donut'; config: MeldDonutChartConfig }
  | { type: 'radar'; config: MeldRadarChartConfig }
  | { type: 'heatmap'; config: MeldHeatmapChartConfig }
  | { type: 'scatter'; config: MeldScatterChartConfig }
  | { type: 'mixed'; config: MeldMixedChartConfig }

/**
 * Union type of all chart-specific configurations.
 * Useful for functions that accept any chart config.
 */
export type AnyChartConfig =
  | MeldBarChartConfig
  | MeldLineChartConfig
  | MeldAreaChartConfig
  | MeldPieChartConfig
  | MeldDonutChartConfig
  | MeldRadarChartConfig
  | MeldHeatmapChartConfig
  | MeldScatterChartConfig
  | MeldMixedChartConfig

// ============================================
// COMPONENT PROPS
// ============================================

/** Base props shared by all chart components */
interface ChartComponentPropsBase {
  /** Chart height */
  height?: number | string // Default: 350

  /** Chart width */
  width?: number | string // Default: '100%'

  /** Chart title */
  title?: string

  /** Show loading skeleton */
  loading?: boolean
}

/** Props for MeldBarChart */
export interface MeldBarChartProps extends ChartComponentPropsBase {
  /** Bar chart configuration */
  config: MeldBarChartConfig
}

/** Props for MeldLineChart */
export interface MeldLineChartProps extends ChartComponentPropsBase {
  /** Line chart configuration */
  config: MeldLineChartConfig
}

/** Props for MeldAreaChart */
export interface MeldAreaChartProps extends ChartComponentPropsBase {
  /** Area chart configuration */
  config: MeldAreaChartConfig
}

/** Props for MeldPieChart */
export interface MeldPieChartProps extends ChartComponentPropsBase {
  /** Pie chart configuration */
  config: MeldPieChartConfig
}

/** Props for MeldDonutChart */
export interface MeldDonutChartProps extends ChartComponentPropsBase {
  /** Donut chart configuration */
  config: MeldDonutChartConfig
}

/** Props for MeldRadarChart */
export interface MeldRadarChartProps extends ChartComponentPropsBase {
  /** Radar chart configuration */
  config: MeldRadarChartConfig
}

/** Props for MeldHeatmapChart */
export interface MeldHeatmapChartProps extends ChartComponentPropsBase {
  /** Heatmap chart configuration */
  config: MeldHeatmapChartConfig
}

/** Props for MeldScatterChart */
export interface MeldScatterChartProps extends ChartComponentPropsBase {
  /** Scatter chart configuration */
  config: MeldScatterChartConfig
}

/** Props for MeldMixedChart */
export interface MeldMixedChartProps extends ChartComponentPropsBase {
  /** Mixed chart configuration */
  config: MeldMixedChartConfig
}

/**
 * @deprecated Use chart-specific props instead (MeldBarChartProps, MeldLineChartProps, etc.)
 */
export interface MeldChartBaseProps extends ChartComponentPropsBase {
  /** Chart configuration */
  config: MeldChartConfig
}

/** Props for MeldChart (dynamic type) */
export interface MeldChartProps extends ChartComponentPropsBase {
  /** Chart type (dynamically loaded) */
  type: ChartType

  /**
   * Chart configuration.
   * For best TypeScript support, ensure config matches the type.
   */
  config: AnyChartConfig
}

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

// ============================================
// CHART EVENTS
// ============================================

/**
 * Event fired when a data point or series is clicked.
 * Contains normalized information about the clicked element.
 */
export interface ChartClickEvent {
  /** Name of the series that was clicked */
  seriesName: string

  /** Index of the data point in the series */
  dataIndex: number

  /** Value at the clicked point (number for single value, tuple for scatter/heatmap) */
  value: number | [number, number] | [string | number, string | number, number]

  /** Category name (x-axis label) if applicable */
  name: string

  /** Type of component that was clicked */
  componentType: 'series' | 'markPoint' | 'markLine' | 'markArea'

  /** Index of the series in the chart */
  seriesIndex: number

  /** Raw ECharts event data (for advanced use cases) */
  raw: unknown
}

/**
 * Event fired when hovering over a data point.
 * Contains normalized information about the hovered element.
 */
export interface ChartHoverEvent {
  /** Name of the series being hovered */
  seriesName: string

  /** Index of the data point in the series */
  dataIndex: number

  /** Value at the hovered point */
  value: number | [number, number] | [string | number, string | number, number]

  /** Category name (x-axis label) if applicable */
  name: string

  /** Index of the series in the chart */
  seriesIndex: number

  /** Raw ECharts event data (for advanced use cases) */
  raw: unknown
}

/**
 * Event fired when mouse leaves a data point.
 */
export interface ChartMouseOutEvent {
  /** Name of the series that was left */
  seriesName: string

  /** Index of the data point that was left */
  dataIndex: number

  /** Index of the series in the chart */
  seriesIndex: number

  /** Raw ECharts event data (for advanced use cases) */
  raw: unknown
}

/**
 * Event fired when legend selection changes.
 * Contains the current selection state of all series.
 */
export interface ChartLegendSelectEvent {
  /** Name of the legend item that triggered the change */
  name: string

  /** Current selection state of all series */
  selected: Record<string, boolean>

  /** Raw ECharts event data (for advanced use cases) */
  raw: unknown
}

/**
 * Event fired when data zoom (range selection) changes.
 * Contains the current zoom range.
 */
export interface ChartDataZoomEvent {
  /** Start percentage of the zoom range (0-100) */
  start: number

  /** End percentage of the zoom range (0-100) */
  end: number

  /** Start value (actual data value) if available */
  startValue?: number | string

  /** End value (actual data value) if available */
  endValue?: number | string

  /** Raw ECharts event data (for advanced use cases) */
  raw: unknown
}

/**
 * Event fired when brush selection is made.
 * Contains the selected data points.
 */
export interface ChartBrushSelectEvent {
  /** Areas that were brushed */
  areas: Array<{
    /** Brush type */
    brushType: 'rect' | 'polygon' | 'lineX' | 'lineY'

    /** Coordinate range */
    coordRange: number[][]

    /** Index range of selected items */
    coordRanges?: number[][][]
  }>

  /** Batch of selected data per series */
  batch: Array<{
    /** Series index */
    seriesIndex: number

    /** Selected data indices */
    dataIndex: number[]
  }>

  /** Raw ECharts event data (for advanced use cases) */
  raw: unknown
}

/**
 * Map of all chart events for type-safe emit definitions.
 * Used with Vue's defineEmits for proper typing.
 */
export interface ChartEmits {
  /** Fired when a data point is clicked */
  (e: 'click', event: ChartClickEvent): void

  /** Fired when hovering over a data point */
  (e: 'hover', event: ChartHoverEvent): void

  /** Fired when mouse leaves a data point */
  (e: 'mouseout', event: ChartMouseOutEvent): void

  /** Fired when legend selection changes */
  (e: 'legendSelect', event: ChartLegendSelectEvent): void

  /** Fired when data zoom changes */
  (e: 'dataZoom', event: ChartDataZoomEvent): void

  /** Fired when brush selection is made */
  (e: 'brushSelect', event: ChartBrushSelectEvent): void
}
