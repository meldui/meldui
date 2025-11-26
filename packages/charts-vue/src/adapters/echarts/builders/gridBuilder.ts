import { CHART_DEFAULTS } from '../../../config/defaults'
import type { ChartGrid, ChartLegend, ChartType } from '../../../types'

/**
 * Build grid configuration
 */
export function buildGrid(
  grid: ChartGrid | undefined,
  legend: ChartLegend | undefined,
  chartType: ChartType,
): any {
  // Pie and donut charts don't use grid
  if (chartType === 'pie' || chartType === 'donut') {
    return { show: false }
  }

  if (grid) {
    return {
      ...CHART_DEFAULTS.grid,
      show: grid.show ?? true,
    }
  }

  // Adjust grid spacing based on legend position (only if legend is shown)
  // If legend is hidden, use minimal top spacing for compact layouts
  // Heatmaps need extra bottom space for visualMap
  return {
    ...CHART_DEFAULTS.grid,
    top:
      legend?.show !== false && legend?.position === 'top'
        ? '15%'
        : legend?.show === false
          ? '5%'
          : '10%',
    bottom:
      chartType === 'heatmap'
        ? '15%'
        : legend?.show !== false && legend?.position === 'bottom'
          ? '18%'
          : '3%',
    left: legend?.show !== false && legend?.position === 'left' ? '15%' : '3%',
    right: legend?.show !== false && legend?.position === 'right' ? '15%' : '4%',
  }
}
