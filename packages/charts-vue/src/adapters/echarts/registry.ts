// ECharts component registry for tree-shaking
// Only import and register the chart types and components you need

// Import chart types (tree-shakeable)
import {
  BarChart,
  type BarSeriesOption,
  HeatmapChart,
  type HeatmapSeriesOption,
  LineChart,
  type LineSeriesOption,
  PieChart,
  type PieSeriesOption,
  RadarChart,
  type RadarSeriesOption,
  ScatterChart,
  type ScatterSeriesOption,
} from 'echarts/charts'
// Import components (tree-shakeable)
import {
  DataZoomComponent,
  type DataZoomComponentOption,
  GridComponent,
  type GridComponentOption,
  LegendComponent,
  type LegendComponentOption,
  RadarComponent,
  type RadarComponentOption,
  TitleComponent,
  type TitleComponentOption,
  ToolboxComponent,
  type ToolboxComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  VisualMapComponent,
  type VisualMapComponentOption,
} from 'echarts/components'
import * as echarts from 'echarts/core'

// Import renderers
import { CanvasRenderer } from 'echarts/renderers'

// Compose option type with all registered components
export type ECOption = echarts.ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | RadarSeriesOption
  | HeatmapSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | ToolboxComponentOption
  | DataZoomComponentOption
  | VisualMapComponentOption
  | RadarComponentOption
>

// Register chart types
echarts.use([LineChart, BarChart, PieChart, ScatterChart, RadarChart, HeatmapChart])

// Register components
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  RadarComponent,
  CanvasRenderer,
])

// Export echarts instance with registered components
export { echarts }
