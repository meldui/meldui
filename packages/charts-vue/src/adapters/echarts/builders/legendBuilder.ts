import type { ChartLegend } from '../../../types'

/**
 * ECharts legend configuration type
 */
type EChartsLegendConfig = Record<string, unknown>

/**
 * Build legend configuration
 */
export function buildLegend(legend: ChartLegend | undefined): EChartsLegendConfig {
  if (!legend) {
    return { show: true, top: 10, left: 'center' }
  }

  if (legend.show === false) {
    return { show: false }
  }

  const legendConfig: EChartsLegendConfig = {
    show: legend.show ?? true,
  }

  // Position-based configuration
  if (legend.position === 'top') {
    legendConfig.top = 10
  } else if (legend.position === 'bottom') {
    legendConfig.bottom = 0
  } else if (legend.position === 'left') {
    legendConfig.left = 10
    legendConfig.orient = 'vertical' as const
  } else if (legend.position === 'right') {
    legendConfig.right = 10
    legendConfig.orient = 'vertical' as const
  }

  // Apply alignment for horizontal legends
  if (!legend.position || (legend.position !== 'left' && legend.position !== 'right')) {
    legendConfig.left = legend.align || 'center'
  }

  return legendConfig
}
