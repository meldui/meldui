// Default ECharts configuration
import type { EChartsOption } from 'echarts'

/**
 * Minimal sensible defaults for all charts
 * Integrates with Tailwind CSS v4 design tokens
 */
export const CHART_DEFAULTS: EChartsOption = {
  // Inherit font family from Tailwind
  textStyle: {
    fontFamily: 'inherit',
  },

  // Minimal toolbar by default
  toolbox: {
    show: false,
  },

  // Clean data labels
  // label: {
  //   show: false,
  // },

  // Smooth animations
  animation: true,
  animationDuration: 400,
  animationEasing: 'cubicOut',

  // Transparent background
  backgroundColor: 'transparent',

  // Grid configuration
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true,
    borderColor: 'var(--color-border, #e5e7eb)',
    show: true,
  },

  // Tooltip configuration
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'var(--color-border, #e5e7eb)',
        width: 1,
        type: 'dashed',
      },
    },
    textStyle: {
      fontSize: 14,
      fontFamily: 'inherit',
    },
  },

  // Legend configuration
  legend: {
    show: true,
    top: 0,
    left: 'left',
    textStyle: {
      fontSize: 14,
      fontFamily: 'inherit',
    },
  },

  // X-axis styling
  xAxis: {
    axisLine: {
      lineStyle: {
        color: 'var(--color-border, #e5e7eb)',
      },
    },
    axisLabel: {
      color: 'var(--color-foreground, #374151)',
      fontFamily: 'inherit',
    },
  },

  // Y-axis styling
  yAxis: {
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: 'var(--color-foreground, #374151)',
      fontFamily: 'inherit',
    },
    splitLine: {
      lineStyle: {
        color: 'var(--color-border, #e5e7eb)',
        type: 'dashed',
      },
    },
  },
}
