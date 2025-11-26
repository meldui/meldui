import type { ChartDataLabels, ChartSeries, ChartStroke } from '../../../types'

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

/** Default border radius for bar charts (top corners rounded) */
const BAR_BORDER_RADIUS = 2

/**
 * Transform series data for pie/donut charts
 */
function transformPieSeries(
  series: ChartSeries[],
  resolvedColors: string[],
  chartType: 'pie' | 'donut',
): any[] {
  return [
    {
      type: 'pie',
      radius: chartType === 'donut' ? ['40%', '70%'] : '70%',
      data: series.map((s, index) => ({
        value: Array.isArray(s.data) ? s.data[0] : s.data,
        name: s.name,
        itemStyle: {
          color: s.color || resolvedColors[index % resolvedColors.length],
        },
        emphasis: {
          // Disable scale effect to preserve colors
          scale: false,
          scaleSize: 1,
          // Preserve original color on hover
          itemStyle: {
            color: s.color || resolvedColors[index % resolvedColors.length],
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
      })),
      label: {
        color: 'hsl(var(--foreground))',
      },
      emphasis: {
        label: {
          color: 'hsl(var(--foreground))',
          fontWeight: 'bold',
        },
      },
    },
  ]
}

/**
 * Apply stroke configuration to line series
 */
function applyStrokeConfig(baseSeries: any, stroke: ChartStroke): void {
  baseSeries.lineStyle = {
    width: stroke.width || 2,
    type: stroke.dashArray ? 'dashed' : 'solid',
  }

  if (stroke.curve === 'smooth') {
    baseSeries.smooth = true
  } else if (stroke.curve === 'stepline') {
    baseSeries.step = 'middle'
  }
}

/**
 * Apply area fill configuration
 */
function applyAreaConfig(baseSeries: any): void {
  baseSeries.type = 'line'
  baseSeries.areaStyle = {}
  // Preserve area color on emphasis
  if (!baseSeries.emphasis.areaStyle) {
    baseSeries.emphasis.areaStyle = {}
  }
}

/**
 * Apply bar chart styling with rounded corners
 * @param baseSeries - The series object to modify
 * @param horizontal - Whether the bar chart is horizontal
 */
function applyBarStyling(baseSeries: any, horizontal: boolean = false): void {
  // Initialize itemStyle if not present
  if (!baseSeries.itemStyle) {
    baseSeries.itemStyle = {}
  }

  // Apply rounded corners
  // For vertical bars: round top corners [top-left, top-right, bottom-right, bottom-left]
  // For horizontal bars: round right corners [top-left, top-right, bottom-right, bottom-left]
  baseSeries.itemStyle.borderRadius = horizontal
    ? [0, BAR_BORDER_RADIUS, BAR_BORDER_RADIUS, 0] // Right corners for horizontal
    : [BAR_BORDER_RADIUS, BAR_BORDER_RADIUS, 0, 0] // Top corners for vertical

  // Preserve rounded corners on emphasis
  if (!baseSeries.emphasis.itemStyle) {
    baseSeries.emphasis.itemStyle = {}
  }
  baseSeries.emphasis.itemStyle.borderRadius = baseSeries.itemStyle.borderRadius
}

/**
 * Transform scatter chart data
 */
function transformScatterData(s: ChartSeries, baseSeries: any): void {
  baseSeries.type = 'scatter'
  // Convert {x, y} format to [x, y] format for ECharts
  if (Array.isArray(s.data) && s.data.length > 0 && typeof s.data[0] === 'object') {
    baseSeries.data = s.data.map((point: any) =>
      Array.isArray(point) ? point : [point.x, point.y],
    )
  }
}

/**
 * Transform radar chart data
 */
function transformRadarData(s: ChartSeries, baseSeries: any): void {
  baseSeries.type = 'radar'
  // ECharts radar charts expect data in format: [{ value: [...], name: '...' }]
  baseSeries.data = [
    {
      value: s.data,
      name: s.name,
    },
  ]
  // Remove the name from series level since it's in the data
  delete baseSeries.name
}

/**
 * Transform heatmap chart data
 */
function transformHeatmapData(baseSeries: any): void {
  baseSeries.type = 'heatmap'
  baseSeries.label = {
    show: false,
  }
  baseSeries.emphasis = {
    itemStyle: {
      shadowBlur: 10,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
    },
  }
}

/**
 * Apply data labels configuration
 */
function applyDataLabels(baseSeries: any, dataLabels: ChartDataLabels, horizontal?: boolean): void {
  type LabelPosition = 'top' | 'inside' | 'bottom' | 'left' | 'right'

  // Map position for horizontal bar charts
  let position: LabelPosition = dataLabels.position || 'top'
  if (horizontal && baseSeries.type === 'bar') {
    // For horizontal bars, swap top/bottom with right/left
    const positionMap: Record<LabelPosition, LabelPosition> = {
      top: 'right',
      bottom: 'left',
      left: 'bottom',
      right: 'top',
      inside: 'inside',
    }
    position = positionMap[position]
  }

  baseSeries.label = {
    ...baseSeries.label,
    show: dataLabels.show ?? true,
    position,
    formatter: dataLabels.formatter
      ? (params: any) => dataLabels.formatter!(params.value)
      : undefined,
    fontSize: 12,
    fontFamily: 'inherit',
  }
}

/**
 * Transform series data for cartesian charts (line, bar, area, scatter, etc.)
 */
function transformCartesianSeries(
  series: ChartSeries[],
  chartType: ChartType,
  stacked: boolean | undefined,
  stroke: ChartStroke | undefined,
  horizontal: boolean | undefined,
  dataLabels: ChartDataLabels | undefined,
): any[] {
  return series.map((s) => {
    const seriesType = s.type || (chartType === 'area' ? 'line' : chartType)

    const baseSeries: any = {
      name: s.name,
      data: s.data,
      type: seriesType,
      label: {
        color: 'hsl(var(--foreground))',
      },
      emphasis: {
        // Disable scale effect to preserve colors
        scale: false,
        scaleSize: 1,
        label: {
          color: 'hsl(var(--foreground))',
          fontWeight: 'bold',
        },
        // Preserve original color on hover
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
        },
      },
    }

    // Apply color if specified, otherwise ensure emphasis doesn't change palette colors
    if (s.color) {
      baseSeries.itemStyle = { color: s.color }
      // Preserve color in emphasis state
      baseSeries.emphasis.itemStyle.color = s.color
    } else {
      // No custom color, but ensure emphasis doesn't override palette colors
      baseSeries.emphasis.itemStyle = {
        ...baseSeries.emphasis.itemStyle,
      }
    }

    // Apply stacking
    if (stacked && (seriesType === 'bar' || seriesType === 'line')) {
      baseSeries.stack = 'total'
    }

    // Apply area fill for area charts
    if (chartType === 'area' || s.type === 'area') {
      applyAreaConfig(baseSeries)
    }

    // Apply stroke configuration for line charts
    if (seriesType === 'line' && stroke) {
      applyStrokeConfig(baseSeries, stroke)
    }

    // Apply bar chart styling with rounded corners
    if (seriesType === 'bar') {
      applyBarStyling(baseSeries, horizontal)
    }

    // Chart type specific transformations
    if (chartType === 'scatter') {
      transformScatterData(s, baseSeries)
    } else if (chartType === 'radar') {
      transformRadarData(s, baseSeries)
    } else if (chartType === 'heatmap') {
      transformHeatmapData(baseSeries)
    }

    // Apply data labels configuration
    if (dataLabels) {
      applyDataLabels(baseSeries, dataLabels, horizontal)
    }

    return baseSeries
  })
}

/**
 * Transform series configuration based on chart type
 */
export function transformSeries(
  series: ChartSeries[],
  chartType: ChartType,
  resolvedColors: string[],
  stacked: boolean | undefined,
  stroke: ChartStroke | undefined,
  horizontal: boolean | undefined,
  dataLabels: ChartDataLabels | undefined,
): any[] {
  // Special handling for pie/donut charts
  if (chartType === 'pie' || chartType === 'donut') {
    return transformPieSeries(series, resolvedColors, chartType)
  }

  // Cartesian and other chart types
  return transformCartesianSeries(series, chartType, stacked, stroke, horizontal, dataLabels)
}
