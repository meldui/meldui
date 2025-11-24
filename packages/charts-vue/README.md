# @meldui/charts-vue

MeldUI Chart components for Vue 3 built on Apache ECharts.

## Overview

A library-agnostic chart component package that provides a consistent API for data visualization. This package is built on Apache ECharts (Apache 2.0 licensed) and offers excellent tree-shaking support for optimized bundle sizes.

## Features

- **Library-agnostic API** - Users interact with MeldUI's API, not ECharts directly
- **Apache 2.0 Licensed** - No commercial restrictions or redistribution limitations
- **Excellent tree-shaking** - ~70-150 KB for typical usage (1-5 chart types)
- **Multiple chart types** - Line, Bar, Area, Pie, Donut, Scatter, Radar, Heatmap, Mixed
- **SSR support** - Works seamlessly with Nuxt and SSG
- **Automatic theming** - Integrates with Tailwind CSS v4
- **Dark mode** - Built-in dark mode support
- **Automatic resizing** - Charts resize automatically using ResizeObserver
- **TypeScript-first** - Full type safety with IntelliSense

## Installation

```bash
pnpm add @meldui/charts-vue

# Peer dependencies (if not already installed)
pnpm add vue
```

## Basic Usage

```vue
<script setup lang="ts">
import { MeldLineChart } from '@meldui/charts-vue'
import type { MeldChartConfig } from '@meldui/charts-vue'

const config: MeldChartConfig = {
  series: [
    { name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }
  ],
  xAxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
}
</script>

<template>
  <MeldLineChart :config="config" title="Weekly Revenue" />
</template>
```

## Available Components

- `MeldChart` - Smart wrapper with dynamic chart type loading
- `MeldLineChart` - Line charts
- `MeldBarChart` - Bar charts
- `MeldAreaChart` - Area charts
- `MeldPieChart` - Pie charts
- `MeldDonutChart` - Donut charts
- `MeldScatterChart` - Scatter plots
- `MeldRadarChart` - Radar charts
- `MeldHeatmapChart` - Heatmaps
- `MeldMixedChart` - Mixed chart types
- `MeldChartSkeleton` - Loading skeleton component

## Documentation

For comprehensive documentation, examples, and API reference, visit the [Storybook documentation](https://meldui.dev).

## License

MIT

## Repository

https://github.com/meldui/meldui
