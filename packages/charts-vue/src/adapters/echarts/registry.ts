// ECharts component registry for tree-shaking
// Only import and register the chart types and components you need

import * as echarts from 'echarts/core'

// Import chart types (tree-shakeable)
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  HeatmapChart,
  type LineSeriesOption,
  type BarSeriesOption,
  type PieSeriesOption,
  type ScatterSeriesOption,
  type RadarSeriesOption,
  type HeatmapSeriesOption,
} from 'echarts/charts'

// Import components (tree-shakeable)
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  type GridComponentOption,
  type TooltipComponentOption,
  type LegendComponentOption,
  type TitleComponentOption,
  type ToolboxComponentOption,
  type DataZoomComponentOption,
} from 'echarts/components'

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
>

// Register chart types
echarts.use([
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  HeatmapChart,
])

// Register components
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  CanvasRenderer,
])

// Export echarts instance with registered components
export { echarts }
