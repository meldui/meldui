import { CHART_DEFAULTS } from '../../../config/defaults'
import type { ChartAxis, ChartType } from '../../../types'

/**
 * ECharts axis configuration type
 */
type EChartsAxisConfig = Record<string, unknown>

/**
 * Build X-axis configuration
 */
export function buildXAxis(
  xAxis: ChartAxis | undefined,
  chartType: ChartType,
  _horizontal?: boolean | undefined, // Unused - kept for compatibility
): EChartsAxisConfig {
  // Pie and donut charts don't need axes
  if (chartType === 'pie' || chartType === 'donut') {
    return { show: false }
  }

  // Start with default xAxis styling
  const defaultXAxis = (CHART_DEFAULTS.xAxis as EChartsAxisConfig) || {}

  if (xAxis) {
    return {
      ...defaultXAxis, // Preserve default styling (colors, fonts, etc.)
      // Heatmap charts MUST have category axes
      type:
        chartType === 'heatmap'
          ? 'category'
          : xAxis.type === 'datetime'
            ? 'time'
            : xAxis.type === 'numeric'
              ? 'value'
              : 'category',
      data: xAxis.categories,
      name: xAxis.title,
      min: xAxis.min,
      max: xAxis.max,
      axisLabel: xAxis.labels
        ? {
            ...defaultXAxis.axisLabel, // Preserve default label styling
            show: xAxis.labels.show ?? true,
            rotate: xAxis.labels.rotate,
            formatter: xAxis.labels.format,
          }
        : defaultXAxis.axisLabel,
    }
  }

  return {
    ...defaultXAxis, // Preserve default styling
    type: chartType === 'heatmap' ? 'category' : 'category',
  }
}

/**
 * Build Y-axis configuration
 */
export function buildYAxis(
  yAxis: ChartAxis | undefined,
  chartType: ChartType,
  _horizontal?: boolean | undefined, // Unused - kept for compatibility
): EChartsAxisConfig {
  // Pie and donut charts don't need axes
  if (chartType === 'pie' || chartType === 'donut') {
    return { show: false }
  }

  // Start with default yAxis styling
  const defaultYAxis = (CHART_DEFAULTS.yAxis as EChartsAxisConfig) || {}

  if (yAxis) {
    return {
      ...defaultYAxis, // Preserve default styling (colors, fonts, split lines, etc.)
      // Heatmap charts MUST have category axes
      type:
        chartType === 'heatmap'
          ? 'category'
          : yAxis.type === 'datetime'
            ? 'time'
            : yAxis.type === 'numeric'
              ? 'value'
              : yAxis.type === 'category'
                ? 'category'
                : 'value',
      data: yAxis.categories,
      name: yAxis.title,
      min: yAxis.min,
      max: yAxis.max,
      axisLabel: yAxis.labels
        ? {
            ...defaultYAxis.axisLabel, // Preserve default label styling
            show: yAxis.labels.show ?? true,
            rotate: yAxis.labels.rotate,
            formatter: yAxis.labels.format,
          }
        : defaultYAxis.axisLabel,
    }
  }

  return {
    ...defaultYAxis, // Preserve default styling
    type: chartType === 'heatmap' ? 'category' : 'value',
  }
}
