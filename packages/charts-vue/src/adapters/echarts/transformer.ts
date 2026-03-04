// Transforms MeldChartConfig to ECharts options
import { CHART_DEFAULTS } from "../../config/defaults";
import { MAX_RECOMMENDED_SERIES } from "../../config/palettes";
import type { AnyChartConfig, ChartType, MeldChartConfig } from "../../types";
import { buildGrid } from "./builders/gridBuilder";
import { buildLegend } from "./builders/legendBuilder";
import { buildTooltip } from "./builders/tooltipBuilder";
import { buildXAxis, buildYAxis } from "./utils/axisBuilder";
import { resolveColors } from "./utils/colorResolver";
import { deepMerge } from "./utils/deepMerge";
import { transformSeries } from "./utils/seriesTransformer";

/**
 * Internal config type that normalizes all chart configs to a common shape.
 * Used internally by the transformer for property access.
 */
type NormalizedConfig = {
  series: MeldChartConfig["series"];
  xAxis?: MeldChartConfig["xAxis"];
  yAxis?: MeldChartConfig["yAxis"];
  legend?: MeldChartConfig["legend"];
  tooltip?: MeldChartConfig["tooltip"];
  grid?: MeldChartConfig["grid"];
  stroke?: MeldChartConfig["stroke"];
  colors?: MeldChartConfig["colors"];
  animations?: MeldChartConfig["animations"];
  toolbar?: MeldChartConfig["toolbar"];
  zoom?: MeldChartConfig["zoom"];
  stacked?: MeldChartConfig["stacked"];
  horizontal?: MeldChartConfig["horizontal"];
  dataLabels?: MeldChartConfig["dataLabels"];
  advanced?: MeldChartConfig["advanced"];
};

/**
 * ECharts config type
 */
type EChartsConfig = Record<string, unknown>;

/**
 * Resolved text colors for canvas rendering.
 * Canvas cannot resolve CSS variables or oklch() — these must be pre-resolved rgb values.
 */
interface ResolvedTextColors {
  mutedForeground?: string;
  foreground?: string;
}

/**
 * Build radar chart specific configuration
 */
function buildRadarConfig(
  config: NormalizedConfig,
  colors: ResolvedTextColors,
): EChartsConfig {
  const { xAxis, yAxis, grid } = config;

  // Determine if axis lines should be shown (default to true unless grid.show is explicitly false)
  const showAxisLines = grid?.show !== false;

  return {
    radar: {
      indicator:
        xAxis?.categories?.map((cat) => ({ name: cat, max: yAxis?.max })) || [],
      // Spoke lines from center to each indicator
      axisLine: {
        show: showAxisLines,
        lineStyle: {
          color: "rgba(128, 128, 128, 0.30)",
        },
      },
      // Concentric polygon/circle lines
      splitLine: {
        show: showAxisLines,
        lineStyle: {
          color: "rgba(128, 128, 128, 0.25)",
          type: "dashed",
          width: 1,
        },
      },
      // Fill between split lines
      splitArea: {
        show: false,
      },
      // Indicator name styling
      axisName: {
        color: colors.mutedForeground || "var(--muted-foreground)",
        fontSize: 14,
      },
    },
  };
}

/**
 * Build heatmap chart specific configuration (visualMap)
 */
function buildHeatmapConfig(
  resolvedColors: string[],
  colors: ResolvedTextColors,
): EChartsConfig {
  return {
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "5%",
      inRange: {
        // Use first and last colors from palette to create gradient
        color:
          resolvedColors.length >= 2
            ? [resolvedColors[resolvedColors.length - 1], resolvedColors[0]]
            : ["#f0f0f0", resolvedColors[0] || "#1f77b4"],
      },
      textStyle: {
        color: colors.foreground || "var(--foreground)",
      },
    },
  };
}

/**
 * Transform chart configuration to ECharts options.
 *
 * Accepts both chart-specific configs (MeldBarChartConfig, MeldLineChartConfig, etc.)
 * and the legacy unified MeldChartConfig for backwards compatibility.
 *
 * @param config - Chart configuration (specific or unified type)
 * @param themeConfig - Theme configuration with mode and palette
 * @param chartType - The type of chart to render
 * @returns ECharts option object
 */
export function transformToEChartsOption(
  config: AnyChartConfig | MeldChartConfig,
  themeConfig: {
    mode: "light" | "dark";
    palette: string[];
    mutedForeground?: string;
    foreground?: string;
  },
  chartType: ChartType = "line",
) {
  // Normalize config to internal type for property access
  // This allows us to safely access properties that may not exist on all config types
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
  } = config as NormalizedConfig;

  // Resolved text colors for canvas-rendered elements
  const textColors: ResolvedTextColors = {
    mutedForeground: themeConfig.mutedForeground,
    foreground: themeConfig.foreground,
  };

  // Warn if too many series
  if (series.length > MAX_RECOMMENDED_SERIES) {
    console.warn(
      `Chart has ${series.length} series (recommended max: ${MAX_RECOMMENDED_SERIES}). Consider grouping data for better readability.`,
    );
  }

  // Resolve colors based on palette or custom colors
  const isDarkMode = themeConfig.mode === "dark";
  const resolvedColors = resolveColors(colors, series.length, isDarkMode);

  // Transform series based on chart type
  const transformedSeries = transformSeries({
    series,
    chartType,
    resolvedColors,
    stacked,
    stroke,
    horizontal,
    dataLabels,
    resolvedForeground: textColors.foreground,
  });

  // Determine if this is a non-Cartesian chart (doesn't use xAxis/yAxis/grid)
  const isNonCartesian =
    chartType === "radar" || chartType === "pie" || chartType === "donut";

  // Start with defaults, excluding properties not applicable to this chart type
  const {
    legend: _defaultLegend,
    xAxis: _defaultXAxis,
    yAxis: _defaultYAxis,
    grid: _defaultGrid,
    ...coreDefaults
  } = CHART_DEFAULTS as EChartsConfig;

  // For Cartesian charts, include the axis/grid defaults; for non-Cartesian, exclude them
  const defaultsWithoutLegend = isNonCartesian
    ? coreDefaults
    : {
        ...coreDefaults,
        xAxis: _defaultXAxis,
        yAxis: _defaultYAxis,
        grid: _defaultGrid,
      };

  // Build axes with resolved label color (canvas can't resolve CSS variables)
  const builtXAxis = buildXAxis(
    xAxis,
    chartType,
    horizontal,
    textColors.mutedForeground,
  );
  const builtYAxis = buildYAxis(
    yAxis,
    chartType,
    horizontal,
    textColors.mutedForeground,
  );

  // Build the main ECharts option
  const echartsOption = {
    ...defaultsWithoutLegend,

    // Apply dark mode
    darkMode: themeConfig.mode === "dark",

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

    // Transform legend - start with defaults, merge consumer config, override color for canvas
    legend: {
      ...(_defaultLegend as Record<string, unknown>),
      ...buildLegend(legend),
      ...(textColors.foreground && {
        textStyle: {
          ...((_defaultLegend as Record<string, unknown>)?.textStyle as Record<
            string,
            unknown
          >),
          color: textColors.foreground,
        },
      }),
    },

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
        dataZoom: zoom ? { yAxisIndex: "none" } : undefined,
        saveAsImage: toolbar ? {} : undefined,
      },
    },

    // Animation
    animation: animations ?? true,

    // Radar chart specific configuration
    ...(chartType === "radar" &&
      buildRadarConfig({ xAxis, yAxis, grid, series }, textColors)),

    // Heatmap specific configuration - visualMap is required for heatmaps
    ...(chartType === "heatmap" &&
      buildHeatmapConfig(resolvedColors, textColors)),
  };

  // Merge advanced configuration (escape hatch)
  if (advanced) {
    return deepMerge(echartsOption, advanced);
  }

  return echartsOption;
}
