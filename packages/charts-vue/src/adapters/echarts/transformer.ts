// Transforms MeldChartConfig to ECharts options
import type { EChartsOption } from 'echarts'
import { CHART_DEFAULTS } from '../../config/defaults'
import type { MeldChartConfig } from '../../types'

/**
 * Deep merge utility for combining objects
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target }

  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null && key in target) {
      output[key] = deepMerge(target[key], source[key] as any)
    } else {
      output[key] = source[key] as any
    }
  }

  return output
}

/**
 * Transform MeldChartConfig to ECharts options
 */
export function transformToEChartsOption(
  config: MeldChartConfig,
  themeConfig: { mode: 'light' | 'dark'; palette: string[] },
  chartType:
    | 'line'
    | 'bar'
    | 'area'
    | 'pie'
    | 'donut'
    | 'scatter'
    | 'radar'
    | 'heatmap'
    | 'mixed' = 'line',
): EChartsOption {
  const {
    series,
    xAxis,
    yAxis,
    legend,
    tooltip,
    grid,
    stroke,
    colors,
    animations,
    toolbar,
    zoom,
    stacked,
    horizontal,
    advanced,
  } = config

  // Start with defaults
  const echartsOption: EChartsOption = {
    ...CHART_DEFAULTS,

    // Apply dark mode
    darkMode: themeConfig.mode === 'dark',

    // Transform series
    series: series.map((s) => {
      const seriesType = s.type || chartType === 'area' ? 'line' : chartType

      const baseSeries: any = {
        name: s.name,
        data: s.data,
        type: seriesType,
      }

      // Apply color if specified
      if (s.color) {
        baseSeries.itemStyle = { color: s.color }
      }

      // Apply stacking
      if (stacked && (seriesType === 'bar' || seriesType === 'line')) {
        baseSeries.stack = 'total'
      }

      // Apply area fill for area charts
      if (chartType === 'area' || s.type === 'area') {
        baseSeries.type = 'line'
        baseSeries.areaStyle = {}
      }

      // Apply stroke configuration for line charts
      if (seriesType === 'line' && stroke) {
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

      // Donut chart configuration
      if (chartType === 'donut') {
        baseSeries.type = 'pie'
        baseSeries.radius = ['40%', '70%']
      }

      // Pie chart configuration
      if (chartType === 'pie') {
        baseSeries.type = 'pie'
        baseSeries.radius = '70%'
      }

      return baseSeries
    }),

    // Color palette
    color: colors === 'auto' || !colors ? themeConfig.palette : colors,

    // Transform x-axis
    xAxis: xAxis
      ? {
          type:
            xAxis.type === 'datetime' ? 'time' : xAxis.type === 'numeric' ? 'value' : 'category',
          data: xAxis.categories,
          name: xAxis.title,
          min: xAxis.min,
          max: xAxis.max,
          axisLabel: xAxis.labels
            ? {
                show: xAxis.labels.show ?? true,
                rotate: xAxis.labels.rotate,
                formatter: xAxis.labels.format,
              }
            : undefined,
        }
      : { type: horizontal ? 'value' : 'category' },

    // Transform y-axis
    yAxis: yAxis
      ? {
          type:
            yAxis.type === 'datetime'
              ? 'time'
              : yAxis.type === 'numeric'
                ? 'value'
                : yAxis.type === 'category'
                  ? 'category'
                  : 'value',
          name: yAxis.title,
          min: yAxis.min,
          max: yAxis.max,
          axisLabel: yAxis.labels
            ? {
                show: yAxis.labels.show ?? true,
                rotate: yAxis.labels.rotate,
                formatter: yAxis.labels.format,
              }
            : undefined,
        }
      : { type: horizontal ? 'category' : 'value' },

    // Transform legend
    legend: legend
      ? {
          show: legend.show ?? true,
          top: legend.position === 'top' ? 0 : legend.position === 'bottom' ? 'bottom' : undefined,
          bottom: legend.position === 'bottom' ? 0 : undefined,
          left: legend.align || 'left',
        }
      : { show: true },

    // Transform tooltip
    tooltip: tooltip
      ? {
          show: tooltip.enabled ?? true,
          trigger: tooltip.shared ? 'axis' : 'item',
          formatter: tooltip.formatter
            ? (params: any) => {
                const data = Array.isArray(params) ? params[0] : params
                return tooltip.formatter!(data.value, data.seriesName, data.dataIndex)
              }
            : undefined,
        }
      : { show: true, trigger: 'axis' },

    // Transform grid
    grid: grid
      ? {
          ...CHART_DEFAULTS.grid,
          show: grid.show ?? true,
        }
      : CHART_DEFAULTS.grid,

    // Toolbox configuration
    toolbox: {
      show: toolbar ?? false,
      feature: {
        dataZoom: zoom ? { yAxisIndex: 'none' } : undefined,
        saveAsImage: toolbar ? {} : undefined,
      },
    },

    // Animation
    animation: animations ?? true,
  }

  // Merge advanced configuration (escape hatch)
  if (advanced) {
    return deepMerge(echartsOption, advanced)
  }

  return echartsOption
}
