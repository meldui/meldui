// Transforms MeldChartConfig to ECharts options
import type { EChartsOption } from 'echarts'
import { CHART_DEFAULTS } from '../../config/defaults'
import { MAX_RECOMMENDED_SERIES } from '../../config/palettes'
import type { MeldChartConfig } from '../../types'
import { buildGrid } from './builders/gridBuilder'
import { buildLegend } from './builders/legendBuilder'
import { buildTooltip } from './builders/tooltipBuilder'
import { buildXAxis, buildYAxis } from './utils/axisBuilder'
import { resolveColors } from './utils/colorResolver'
import { deepMerge } from './utils/deepMerge'
import { type ChartType, transformSeries } from './utils/seriesTransformer'

/**
 * Build radar chart specific configuration
 */
function buildRadarConfig(config: MeldChartConfig): any {
  const { xAxis, yAxis, grid } = config

  // Determine if axis lines should be shown (default to true unless grid.show is explicitly false)
  const showAxisLines = grid?.show !== false

  return {
    radar: {
      indicator: xAxis?.categories?.map((cat) => ({ name: cat, max: yAxis?.max })) || [],
      // Spoke lines from center to each indicator
      axisLine: {
        show: showAxisLines,
        lineStyle: {
          color: 'rgba(128, 128, 128, 0.30)',
        },
      },
      // Concentric polygon/circle lines
      splitLine: {
        show: showAxisLines,
        lineStyle: {
          color: 'rgba(128, 128, 128, 0.25)',
          type: 'dashed',
          width: 1,
        },
      },
      // Fill between split lines
      splitArea: {
        show: false,
      },
      // Indicator name styling
      axisName: {
        color: 'hsl(var(--muted-foreground))',
        fontSize: 14,
      },
    },
  }
}

/**
 * Build heatmap chart specific configuration (visualMap)
 */
function buildHeatmapConfig(resolvedColors: string[]): any {
  return {
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        // Use first and last colors from palette to create gradient
        color:
          resolvedColors.length >= 2
            ? [resolvedColors[resolvedColors.length - 1], resolvedColors[0]]
            : ['#f0f0f0', resolvedColors[0] || '#1f77b4'],
      },
      textStyle: {
        color: 'hsl(var(--foreground))',
      },
    },
  }
}

/**
 * Transform MeldChartConfig to ECharts options
 */
export function transformToEChartsOption(
  config: MeldChartConfig,
  themeConfig: { mode: 'light' | 'dark'; palette: string[] },
  chartType: ChartType = 'line',
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
    dataLabels,
    advanced,
  } = config

  // Warn if too many series
  if (series.length > MAX_RECOMMENDED_SERIES) {
    console.warn(
      `Chart has ${series.length} series (recommended max: ${MAX_RECOMMENDED_SERIES}). Consider grouping data for better readability.`,
    )
  }

  // Resolve colors based on palette or custom colors
  const isDarkMode = themeConfig.mode === 'dark'
  const resolvedColors = resolveColors(colors, series.length, isDarkMode)

  // Transform series based on chart type
  const transformedSeries = transformSeries(
    series,
    chartType,
    resolvedColors,
    stacked,
    stroke,
    horizontal,
    dataLabels,
  )

  // Determine if this is a non-Cartesian chart (doesn't use xAxis/yAxis/grid)
  const isNonCartesian = chartType === 'radar' || chartType === 'pie' || chartType === 'donut'

  // Start with defaults, excluding properties not applicable to this chart type
  const {
    legend: _defaultLegend,
    xAxis: _defaultXAxis,
    yAxis: _defaultYAxis,
    grid: _defaultGrid,
    ...coreDefaults
  } = CHART_DEFAULTS as any

  // For Cartesian charts, include the axis/grid defaults; for non-Cartesian, exclude them
  const defaultsWithoutLegend = isNonCartesian
    ? coreDefaults
    : { ...coreDefaults, xAxis: _defaultXAxis, yAxis: _defaultYAxis, grid: _defaultGrid }

  // Build axes normally first (only used for Cartesian charts)
  const builtXAxis = buildXAxis(xAxis, chartType, horizontal)
  const builtYAxis = buildYAxis(yAxis, chartType, horizontal)

  // Build the main ECharts option
  const echartsOption: EChartsOption = {
    ...defaultsWithoutLegend,

    // Apply dark mode
    darkMode: themeConfig.mode === 'dark',

    // Transform series
    series: transformedSeries,

    // Color palette
    color: resolvedColors,

    // Transform axes - swap for horizontal bar charts
    // For horizontal charts: categories (from xAxis config) go on Y-axis, values on X-axis
    ...(!isNonCartesian && {
      xAxis: horizontal ? builtYAxis : builtXAxis,
      yAxis: horizontal ? builtXAxis : builtYAxis,
    }),

    // Transform legend
    legend: buildLegend(legend),

    // Transform tooltip
    tooltip: buildTooltip(tooltip, chartType),

    // Transform grid - adjust spacing for legend position
    ...(!isNonCartesian && {
      grid: buildGrid(grid, legend, chartType),
    }),

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

    // Radar chart specific configuration
    ...(chartType === 'radar' && buildRadarConfig(config)),

    // Heatmap specific configuration - visualMap is required for heatmaps
    ...(chartType === 'heatmap' && buildHeatmapConfig(resolvedColors)),
  }

  // Merge advanced configuration (escape hatch)
  if (advanced) {
    return deepMerge(echartsOption, advanced)
  }

  return echartsOption
}
