// Transforms MeldChartConfig to ECharts options
import type { EChartsOption } from 'echarts'
import { CHART_DEFAULTS } from '../../config/defaults'
import { generateColors, MAX_RECOMMENDED_SERIES, PALETTES } from '../../config/palettes'
import type { MeldChartConfig, PaletteName } from '../../types'

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

  // Warn if too many series
  if (series.length > MAX_RECOMMENDED_SERIES) {
    console.warn(
      `Chart has ${series.length} series (recommended max: ${MAX_RECOMMENDED_SERIES}). Consider grouping data for better readability.`,
    )
  }

  // Generate colors based on palette or use provided colors
  let resolvedColors: string[]
  const isDarkMode = themeConfig.mode === 'dark'

  if (Array.isArray(colors)) {
    // Custom color array provided
    resolvedColors = colors
  } else if (typeof colors === 'string' && colors !== 'auto' && colors in PALETTES) {
    // Palette name provided - generate colors for the number of series
    // Automatically adjust for dark mode
    resolvedColors = generateColors(colors as PaletteName, series.length, isDarkMode)
  } else {
    // 'auto' or undefined - use theme default
    resolvedColors = themeConfig.palette
  }

  // Start with defaults (exclude legend - we'll set it explicitly)
  const { legend: _defaultLegend, ...defaultsWithoutLegend } = CHART_DEFAULTS as any

  const echartsOption: EChartsOption = {
    ...defaultsWithoutLegend,

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
    color: resolvedColors,

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
    legend: (() => {
      const legendConfig: any = legend
        ? legend.show === false
          ? { show: false }
          : {
              show: legend.show ?? true,
              ...(legend.position === 'top' && { top: 10 }),
              ...(legend.position === 'bottom' && { bottom: 0 }),
              ...(legend.position === 'left' && {
                left: 10,
                orient: 'vertical' as const,
              }),
              ...(legend.position === 'right' && {
                right: 10,
                orient: 'vertical' as const,
              }),
              ...((!legend.position ||
                (legend.position !== 'left' && legend.position !== 'right')) && {
                left: legend.align || 'center',
              }),
            }
        : { show: true, top: 10, left: 'center' }

      console.log('Transformer legend output:', legendConfig)
      return legendConfig
    })(),

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

    // Transform grid - adjust spacing for legend position
    grid: grid
      ? {
          ...CHART_DEFAULTS.grid,
          show: grid.show ?? true,
        }
      : {
          ...CHART_DEFAULTS.grid,
          // Adjust grid spacing based on legend position (only if legend is shown)
          // If legend is hidden, use minimal top spacing for compact layouts
          top:
            legend?.show !== false && legend?.position === 'top'
              ? '15%'
              : legend?.show === false
                ? '5%'
                : '10%',
          bottom: legend?.show !== false && legend?.position === 'bottom' ? '18%' : '3%',
          left: legend?.show !== false && legend?.position === 'left' ? '15%' : '3%',
          right: legend?.show !== false && legend?.position === 'right' ? '15%' : '4%',
        },

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
