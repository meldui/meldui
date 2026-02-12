import type { ChartTooltip, ChartType } from '../../../types'

/**
 * ECharts tooltip configuration type
 */
type EChartsTooltipConfig = Record<string, unknown>

/**
 * Build tooltip configuration
 */
export function buildTooltip(
  tooltip: ChartTooltip | undefined,
  chartType: ChartType,
): EChartsTooltipConfig {
  if (tooltip) {
    return {
      show: tooltip.enabled ?? true,
      trigger: tooltip.shared ? 'axis' : 'item',
      formatter: tooltip.formatter
        ? (params: unknown) => {
            const paramsArray = Array.isArray(params) ? params : [params]
            const data = paramsArray[0] as { value: unknown; seriesName: string; dataIndex: number }
            return tooltip.formatter!(data.value, data.seriesName, data.dataIndex)
          }
        : undefined,
    }
  }

  // Default tooltip configuration based on chart type
  // Non-Cartesian charts (radar, pie, donut) and heatmaps use 'item' trigger
  const useItemTrigger =
    chartType === 'radar' || chartType === 'pie' || chartType === 'donut' || chartType === 'heatmap'

  return {
    show: true,
    trigger: useItemTrigger ? 'item' : 'axis',
  }
}
