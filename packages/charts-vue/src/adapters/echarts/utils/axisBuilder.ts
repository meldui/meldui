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
  resolvedLabelColor?: string,
): EChartsAxisConfig {
  // Pie and donut charts don't need axes
  if (chartType === 'pie' || chartType === 'donut') {
    return { show: false }
  }

  // Start with default xAxis styling
  const defaultXAxis = (CHART_DEFAULTS.xAxis as EChartsAxisConfig) || {}

  // Build label config with resolved color override
  const buildAxisLabel = (labels?: ChartAxis['labels']) => {
    const base = labels
      ? {
          ...defaultXAxis.axisLabel,
          show: labels.show ?? true,
          rotate: labels.rotate,
          formatter: labels.format,
        }
      : defaultXAxis.axisLabel

    if (resolvedLabelColor && base && typeof base === 'object') {
      return { ...base, color: resolvedLabelColor }
    }
    return base
  }

  const nameTextStyle = resolvedLabelColor ? { color: resolvedLabelColor } : undefined

  if (xAxis) {
    return {
      ...defaultXAxis,
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
      axisLabel: buildAxisLabel(xAxis.labels),
      ...(nameTextStyle && { nameTextStyle }),
    }
  }

  return {
    ...defaultXAxis,
    type: chartType === 'heatmap' ? 'category' : 'category',
    axisLabel: buildAxisLabel(),
    ...(nameTextStyle && { nameTextStyle }),
  }
}

/**
 * Build Y-axis configuration
 */
export function buildYAxis(
  yAxis: ChartAxis | undefined,
  chartType: ChartType,
  _horizontal?: boolean | undefined, // Unused - kept for compatibility
  resolvedLabelColor?: string,
): EChartsAxisConfig {
  // Pie and donut charts don't need axes
  if (chartType === 'pie' || chartType === 'donut') {
    return { show: false }
  }

  // Start with default yAxis styling
  const defaultYAxis = (CHART_DEFAULTS.yAxis as EChartsAxisConfig) || {}

  // Build label config with resolved color override
  const buildAxisLabel = (labels?: ChartAxis['labels']) => {
    const base = labels
      ? {
          ...defaultYAxis.axisLabel,
          show: labels.show ?? true,
          rotate: labels.rotate,
          formatter: labels.format,
        }
      : defaultYAxis.axisLabel

    if (resolvedLabelColor && base && typeof base === 'object') {
      return { ...base, color: resolvedLabelColor }
    }
    return base
  }

  const nameTextStyle = resolvedLabelColor ? { color: resolvedLabelColor } : undefined

  if (yAxis) {
    return {
      ...defaultYAxis,
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
      axisLabel: buildAxisLabel(yAxis.labels),
      ...(nameTextStyle && { nameTextStyle }),
    }
  }

  return {
    ...defaultYAxis,
    type: chartType === 'heatmap' ? 'category' : 'value',
    axisLabel: buildAxisLabel(),
    ...(nameTextStyle && { nameTextStyle }),
  }
}
