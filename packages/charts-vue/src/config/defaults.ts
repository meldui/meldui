// Default ECharts configuration
import type { EChartsOption } from 'echarts'

/**
 * Minimal sensible defaults for all charts
 * Integrates with Tailwind CSS v4 design tokens
 */
export const CHART_DEFAULTS: EChartsOption = {
  // Inherit font family from Tailwind
  textStyle: {
    fontSize: 16,
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
    show: false,
  },

  // Tooltip configuration
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'hsl(var(--popover))',
    borderColor: 'hsl(var(--border))',
    borderWidth: 1,
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'hsl(var(--border))',
        width: 1,
        type: 'dashed',
      },
    },
    textStyle: {
      color: 'hsl(var(--popover-foreground))',
      fontSize: 14,
      fontFamily: 'inherit',
    },
    // Ensure tooltip text is always visible
    extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.15);',
  },

  // Emphasis/hover state configuration
  emphasis: {
    focus: 'series',
    blurScope: 'coordinateSystem',
    // Disable default color changes on hover - we handle this per series
    disabled: false,
  },

  // Legend configuration
  legend: {
    show: true,
    top: 10,
    left: 'center',
    textStyle: {
      color: 'hsl(var(--foreground))',
      fontSize: 14,
      fontFamily: 'inherit',
    },
  },

  // X-axis styling
  xAxis: {
    axisLine: {
      lineStyle: {
        color: 'rgba(128, 128, 128, 0.30)', // Subtle light gray with 30% opacity
      },
    },
    axisLabel: {
      color: 'hsl(var(--muted-foreground))',
      fontFamily: 'inherit',
      fontSize: 14,
    },
  },

  // Y-axis styling
  yAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(128, 128, 128, 0.30)', // Subtle light gray with 30% opacity
      },
    },
    axisLabel: {
      color: 'hsl(var(--muted-foreground))',
      fontFamily: 'inherit',
      fontSize: 14,
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(128, 128, 128, 0.25)', // Very subtle grid lines with 25% opacity
        type: 'dashed',
        width: 1,
      },
    },
  },
}
