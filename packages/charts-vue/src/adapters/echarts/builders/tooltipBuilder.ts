import type { ChartTooltip } from '../../../types'
import type { ChartType } from '../utils/seriesTransformer'

/**
 * Build tooltip configuration
 */
export function buildTooltip(tooltip: ChartTooltip | undefined, chartType: ChartType): any {
  if (tooltip) {
    return {
      show: tooltip.enabled ?? true,
      trigger: tooltip.shared ? 'axis' : 'item',
      formatter: tooltip.formatter
        ? (params: any) => {
            const data = Array.isArray(params) ? params[0] : params
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
