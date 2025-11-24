// Default ECharts configuration
import type { EChartsOption } from "echarts";

/**
 * Minimal sensible defaults for all charts
 * Integrates with Tailwind CSS v4 design tokens
 */
export const CHART_DEFAULTS: EChartsOption = {
  // Inherit font family from Tailwind
  textStyle: {
    fontFamily: "inherit",
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
  animationEasing: "cubicOut",

  // Transparent background
  backgroundColor: "transparent",

  // Grid configuration
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    top: "10%",
    containLabel: true,
    show: false,
  },

  // Tooltip configuration
  tooltip: {
    trigger: "axis",
    backgroundColor: "hsl(var(--popover))",
    borderColor: "hsl(var(--border))",
    borderWidth: 1,
    axisPointer: {
      type: "line",
      lineStyle: {
        color: "hsl(var(--border))",
        width: 1,
        type: "dashed",
      },
    },
    textStyle: {
      color: "hsl(var(--popover-foreground))",
      fontSize: 14,
      fontFamily: "inherit",
    },
  },

  // Legend configuration
  legend: {
    show: true,
    top: 10,
    left: "center",
    textStyle: {
      color: "hsl(var(--foreground))",
      fontSize: 14,
      fontFamily: "inherit",
    },
  },

  // X-axis styling
  xAxis: {
    axisLine: {
      lineStyle: {
        color: "hsl(var(--border))",
      },
    },
    axisLabel: {
      color: "hsl(var(--foreground))",
      fontFamily: "inherit",
    },
  },

  // Y-axis styling
  yAxis: {
    axisLine: {
      show: false,
    },
    axisLabel: {
      color: "hsl(var(--foreground))",
      fontFamily: "inherit",
    },
    splitLine: {
      lineStyle: {
        color: "hsl(var(--border))",
        type: "dashed",
      },
    },
  },
};
