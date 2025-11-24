# Task 09: Chart Component Package

> **Library Decision:** Apache ECharts (Apache 2.0 license)
> **Why:** Initially considered ApexCharts, but discovered licensing restrictions (commercial license for $2M+ orgs, OEM license for redistribution). Apache ECharts offers Apache 2.0 license (no restrictions), 20+ chart types, excellent tree-shaking (~70-150 KB), and is production-proven.

## Overview

Create a dedicated chart component package (`@meldui/charts-vue`) that provides a consistent, library-agnostic API for data visualization. Following the same pattern as `@meldui/tabler-vue`, this package will be separate from the core `@meldui/vue` package, making charts an optional dependency.

**MVP Implementation:** Apache ECharts adapter (Apache 2.0 licensed, feature-rich, excellent tree-shaking)
**Bundle Size:** ~70-150 KB for typical usage (1-5 chart types) - 60-75% smaller than ApexCharts

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Package Location** | Separate `@meldui/charts-vue` | Optional dependency, independent versioning, follows icon package pattern |
| **Library Abstraction** | Complete (users never see underlying library) | Can swap libraries without breaking changes, true abstraction |
| **MVP Library** | **Apache ECharts (~50-100KB per chart)** | **Apache 2.0 license (no restrictions), excellent tree-shaking, 20+ chart types** |
| **Licensing** | **Apache 2.0 (free redistribution)** | **No commercial restrictions, no OEM license needed, production-ready** |
| **API Design** | Abstraction + escape hatch | Clean for 80% of cases, flexible for complex dashboards |
| **Peer Dependencies** | Vue + @meldui/vue | Charts reuse UI components from @meldui/vue (Skeleton, Card, etc.) for consistency |
| **Tree-Shaking** | Per-chart-type + ECharts modules | Import only chart types AND components you use |
| **SSR Strategy** | Deferred init + skeleton | Works in Nuxt/SSG out of the box |
| **Theming** | Auto Tailwind CSS v4 integration | Respects design system colors and dark mode |
| **Resizing** | Automatic via ResizeObserver | No manual handling needed |

## Motivation

**Why we need this:**

1. **Consistent API** - Users interact with one unified MeldUI chart API regardless of underlying library
2. **Optional Dependency** - Charts are separate from core components, only installed when needed
3. **Internal Component Reusability** - Charts reuse existing `@meldui/vue` components (Skeleton, Card, Badge, Button) for consistency and reduced code duplication
4. **Swappable Implementation** - Can replace ECharts with Chart.js internally without breaking user code
5. **Design System Integration** - Automatic theme integration with Tailwind CSS v4, dark mode support, and MeldUI design tokens
6. **Independent Versioning** - Chart updates don't force core component updates
7. **Dashboard-Ready** - Primary use case is data dashboards requiring complex, feature-rich charts
8. **Complete Abstraction** - Users never know or choose which library is used internally

## Goals

- ✅ Create library-agnostic chart API that doesn't expose ECharts types
- ✅ Support all major chart types (line, bar, area, pie, donut, scatter, radar, heatmap, mixed, and more)
- ✅ **Apache 2.0 licensed** - No commercial restrictions, free redistribution
- ✅ **Optimized bundle size** - Tree-shaking support (~50-100 KB per chart type)
- ✅ Provide simple API for common cases (80% use cases)
- ✅ Provide escape hatch for advanced configurations (20% edge cases)
- ✅ Full SSR support (Nuxt/SSG compatible)
- ✅ Automatic Tailwind CSS v4 theme integration
- ✅ Dark mode support out of the box
- ✅ Automatic chart resizing using ResizeObserver API
- ✅ Polished loading skeleton with accessibility support
- ✅ TypeScript-first with full type safety
- ✅ Comprehensive Storybook documentation
- ✅ Responsive and accessible by default

## Non-Goals (v1)

- ❌ Real-time/streaming data support (future consideration)
- ❌ Custom D3.js chart types (use ECharts capabilities)
- ❌ Chart export functionality (ECharts supports this, can expose later)
- ❌ 3D charts (ECharts supports 3D, can add in v2)
- ❌ Advanced animations (keep simple for MVP)

## Architecture Decision: Option B (Abstraction + Escape Hatch)

After evaluation, we've chosen **Abstraction with Escape Hatch** approach:

### Why This Approach?

1. **Clean API for 90% of cases** - Most charts use our abstraction layer
2. **Flexible for complex dashboards** - Power users can leverage `advanced` config for edge cases
3. **No vendor lock-in** - Our public API doesn't import or expose ApexCharts types
4. **Practical to build** - Easier than full abstraction, more maintainable
5. **Future-proof** - Adapter layer can be refactored when adding second library

### What We're NOT Doing

- **Not Option A (Full Abstraction)** - Too complex, might miss edge cases
- **Not Direct ApexOptions Exposure** - Defeats the purpose of abstraction
- **Not Limited Props API** - Too inflexible for dashboard use cases

## Package Architecture

Following the `@meldui/tabler-vue` pattern, charts live in a separate package:

```
packages/
├── vue/                  # @meldui/vue (core components, NO charts)
├── tabler-vue/          # @meldui/tabler-vue (icons)
├── charts-vue/          # @meldui/charts-vue (NEW - charts package)
└── shared/              # @meldui/shared (utilities)
```

### Installation

```bash
# Charts package requires @meldui/vue as peer dependency
pnpm add @meldui/vue @meldui/charts-vue

# Full setup with icons
pnpm add @meldui/vue @meldui/charts-vue @meldui/tabler-vue
```

**Note:** `@meldui/charts-vue` has `@meldui/vue` as a peer dependency. Charts internally reuse components from the main package (Skeleton, Card, etc.) to maintain design consistency.

### Usage (User Never Sees Library Implementation)

```typescript
// Users only see MeldUI API
import { MeldLineChart, MeldBarChart, MeldPieChart } from '@meldui/charts-vue'
import type { MeldChartConfig } from '@meldui/charts-vue'

// Same API regardless of internal library (ApexCharts, Chart.js, etc.)
const config: MeldChartConfig = {
  series: [{ name: 'Revenue', data: [30, 40, 45] }],
  xAxis: { categories: ['Jan', 'Feb', 'Mar'] }
}
```

## Component Structure

```
packages/charts-vue/
├── src/
│   ├── components/
│   │   ├── MeldChart.vue           # Smart wrapper with dynamic imports
│   │   ├── MeldLineChart.vue       # Tree-shakeable specific components
│   │   ├── MeldBarChart.vue
│   │   ├── MeldAreaChart.vue
│   │   ├── MeldPieChart.vue
│   │   ├── MeldDonutChart.vue
│   │   ├── MeldScatterChart.vue
│   │   ├── MeldRadarChart.vue
│   │   ├── MeldHeatmapChart.vue
│   │   ├── MeldMixedChart.vue
│   │   └── MeldChartSkeleton.vue   # Loading skeleton component
│   ├── types.ts                    # Public TypeScript API (library-agnostic)
│   ├── index.ts                    # Public exports (components + types only)
│   ├── adapters/                   # INTERNAL ONLY (not exported)
│   │   └── echarts/                # MVP: Apache ECharts adapter
│   │       ├── base.ts            # Shared adapter logic
│   │       ├── transformer.ts     # Converts MeldChartConfig → EChartsOption
│   │       ├── registry.ts        # Chart type and component registration
│   │       ├── line.ts            # Line-specific transformations
│   │       ├── bar.ts             # Bar-specific transformations
│   │       ├── theme.ts           # Theme integration
│   │       └── ssr.ts             # SSR detection and handling
│   ├── composables/
│   │   ├── useChartBase.ts        # Common logic (lifecycle, SSR, cleanup)
│   │   ├── useChartTheme.ts       # Auto theme colors from Tailwind
│   │   └── useChartResize.ts      # Responsive behavior with ResizeObserver
│   └── config/
│       ├── defaults.ts            # Minimal sensible defaults
│       └── presets.ts             # Optional preset configurations
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

**Key Principle:** The `adapters/` folder is **INTERNAL ONLY**. Users never import from it or know it exists.

## API Design

### Core Types (Public API)

```typescript
// types.ts - Library-agnostic types

/** Supported chart types */
type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'donut' |
                 'scatter' | 'radar' | 'heatmap' | 'mixed'

/** Chart data series */
interface ChartSeries {
  /** Series name (shown in legend and tooltip) */
  name: string

  /** Data points */
  data: number[] | Array<{ x: string | number | Date; y: number | null }>

  /** Custom color for this series (overrides theme colors) */
  color?: string

  /** Chart type for mixed charts */
  type?: 'line' | 'bar' | 'area'
}

/** X or Y axis configuration */
interface ChartAxis {
  /** Category labels for x-axis */
  categories?: string[]

  /** Axis title */
  title?: string

  /** Axis type */
  type?: 'category' | 'datetime' | 'numeric'

  /** Minimum value */
  min?: number

  /** Maximum value */
  max?: number

  /** Label formatting */
  labels?: {
    format?: string
    rotate?: number
    show?: boolean
  }
}

/** Legend configuration */
interface ChartLegend {
  /** Show/hide legend */
  show?: boolean

  /** Legend position */
  position?: 'top' | 'bottom' | 'left' | 'right'

  /** Horizontal alignment */
  align?: 'left' | 'center' | 'right'
}

/** Tooltip configuration */
interface ChartTooltip {
  /** Enable/disable tooltip */
  enabled?: boolean

  /** Shared tooltip for multiple series */
  shared?: boolean

  /** Custom formatter function */
  formatter?: (value: number, seriesName: string, dataPointIndex: number) => string
}

/** Grid configuration */
interface ChartGrid {
  /** Show/hide grid */
  show?: boolean

  /** Dash array for grid lines */
  strokeDashArray?: number
}

/** Stroke configuration (for line/area charts) */
interface ChartStroke {
  /** Line width */
  width?: number

  /** Line curve type */
  curve?: 'smooth' | 'straight' | 'stepline'

  /** Dash array for dashed lines */
  dashArray?: number | number[]
}

/** Main chart configuration interface */
interface MeldChartConfig {
  /** Chart data series */
  series: ChartSeries[]

  /** X-axis configuration */
  xAxis?: ChartAxis

  /** Y-axis configuration */
  yAxis?: ChartAxis

  /** Legend configuration */
  legend?: ChartLegend

  /** Tooltip configuration */
  tooltip?: ChartTooltip

  /** Grid configuration */
  grid?: ChartGrid

  /** Stroke configuration */
  stroke?: ChartStroke

  /** Series colors (auto = use theme colors) */
  colors?: 'auto' | string[]

  /** Enable/disable animations */
  animations?: boolean

  /** Show/hide toolbar (zoom, download, etc.) */
  toolbar?: boolean

  /** Enable zoom functionality */
  zoom?: boolean

  /** Stack bars/areas */
  stacked?: boolean

  /** Horizontal orientation (for bar charts) */
  horizontal?: boolean

  /**
   * Advanced configuration (escape hatch)
   * Accepts raw ECharts options for edge cases
   * See: https://echarts.apache.org/en/option.html
   */
  advanced?: Record<string, any>
}

/** Base props for all chart components */
interface MeldChartBaseProps {
  /** Chart configuration */
  config: MeldChartConfig

  /** Chart height */
  height?: number | string // Default: 350

  /** Chart width */
  width?: number | string // Default: '100%'

  /** Chart title */
  title?: string

  /** Show loading skeleton */
  loading?: boolean
}

/** Props for MeldChart (dynamic type) */
interface MeldChartProps extends MeldChartBaseProps {
  /** Chart type (dynamically loaded) */
  type: ChartType
}

/** Props for specific chart types (extends base) */
interface MeldLineChartProps extends MeldChartBaseProps {}
interface MeldBarChartProps extends MeldChartBaseProps {}
interface MeldAreaChartProps extends MeldChartBaseProps {}
interface MeldPieChartProps extends MeldChartBaseProps {}
interface MeldDonutChartProps extends MeldChartBaseProps {}
interface MeldScatterChartProps extends MeldChartBaseProps {}
interface MeldRadarChartProps extends MeldChartBaseProps {}
interface MeldHeatmapChartProps extends MeldChartBaseProps {}
interface MeldMixedChartProps extends MeldChartBaseProps {}
```

### Usage Examples

```vue
<script setup lang="ts">
import {
  MeldLineChart,
  MeldBarChart,
  MeldChart,
  type MeldChartConfig
} from '@meldui/charts-vue'

// Simple line chart
const simpleConfig: MeldChartConfig = {
  series: [
    { name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] }
  ],
  xAxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
}

// Multiple series with customization
const multiSeriesConfig: MeldChartConfig = {
  series: [
    { name: 'Revenue', data: [30, 40, 45, 50, 49, 60, 70] },
    { name: 'Expenses', data: [20, 30, 35, 40, 39, 50, 60] }
  ],
  xAxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  legend: {
    position: 'bottom'
  },
  colors: 'auto' // Use theme colors
}

// Advanced usage with escape hatch
const advancedConfig: MeldChartConfig = {
  series: [
    { name: 'Sales', data: [30, 40, 45, 50, 49, 60, 70] }
  ],
  xAxis: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  // Direct ECharts config for edge cases
  advanced: {
    markPoint: {
      data: [{
        name: 'Target',
        coord: ['Wed', 45],
        itemStyle: {
          color: 'red'
        }
      }]
    },
    itemStyle: {
      borderRadius: [10, 10, 0, 0]
    }
  }
}

// Dynamic chart type
const chartType = ref<ChartType>('line')
</script>

<template>
  <!-- Simple usage -->
  <MeldLineChart :config="simpleConfig" title="Weekly Revenue" />

  <!-- Multiple series -->
  <MeldLineChart :config="multiSeriesConfig" :height="400" />

  <!-- Bar chart -->
  <MeldBarChart :config="advancedConfig" />

  <!-- Dynamic type with lazy loading -->
  <MeldChart :type="chartType" :config="simpleConfig" />

  <!-- Loading state -->
  <MeldLineChart :config="simpleConfig" :loading="true" />
</template>
```

## SSR Support Strategy

### Challenge
ECharts requires browser APIs (`window`, `document`) and cannot execute in Node.js SSR environment.

### Solution

1. **Environment Detection**
   ```typescript
   const isSSR = typeof window === 'undefined'
   ```

2. **Deferred Initialization**
   - Skip chart rendering during SSR
   - Initialize only in `onMounted()` lifecycle hook
   - Use dynamic imports to avoid bundling ECharts in SSR

3. **Placeholder Rendering**
   ```vue
   <template>
     <div class="meld-chart-wrapper">
       <!-- SSR: Render placeholder with correct dimensions -->
       <div
         v-if="!chartReady"
         class="meld-chart-skeleton"
         :style="{ height: computedHeight, width: computedWidth }"
       />

       <!-- Browser: Render actual chart -->
       <div ref="chartRef" :class="{ 'opacity-0': !chartReady }" />
     </div>
   </template>
   ```

4. **Hydration Handling**
   ```typescript
   // composables/useChartBase.ts
   export function useChartBase() {
     const chartRef = ref<HTMLElement | null>(null)
     const chartInstance = shallowRef<any>(null)
     const chartReady = ref(false)
     const isSSR = typeof window === 'undefined'

     const initChart = async (options: any) => {
       if (isSSR) return

       // Wait for component mount
       await nextTick()

       if (!chartRef.value) return

       // Dynamic import (not bundled in SSR)
       const echarts = await import('echarts')

       chartInstance.value = echarts.init(chartRef.value)
       chartInstance.value.setOption(options)

       chartReady.value = true
     }

     onUnmounted(() => {
       chartInstance.value?.destroy()
     })

     return { chartRef, chartInstance, chartReady, initChart, isSSR }
   }
   ```

### User Experience
- **Nuxt/SSG Apps**: Works seamlessly with no configuration
- **Initial Load**: Brief skeleton flash during hydration
- **No Errors**: No "window is not defined" crashes
- **SEO-Friendly**: Placeholder with dimensions prevents layout shift

## Theme Integration

### Auto Color Palette

```typescript
// composables/useChartTheme.ts
import { computed, watchEffect } from 'vue'

export function useChartTheme() {
  // Detect dark mode
  const isDark = computed(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  // Extract Tailwind CSS v4 theme colors
  const themeColors = computed(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_COLORS // Fallback for SSR
    }

    const style = getComputedStyle(document.documentElement)

    return {
      primary: style.getPropertyValue('--color-primary') || '#3b82f6',
      success: style.getPropertyValue('--color-success') || '#10b981',
      warning: style.getPropertyValue('--color-warning') || '#f59e0b',
      danger: style.getPropertyValue('--color-danger') || '#ef4444',
      info: style.getPropertyValue('--color-info') || '#06b6d4',
      purple: style.getPropertyValue('--color-purple') || '#8b5cf6',
      pink: style.getPropertyValue('--color-pink') || '#ec4899'
    }
  })

  // Generate theme options for ECharts
  const chartThemeConfig = computed(() => ({
    mode: isDark.value ? 'dark' : 'light',
    palette: Object.values(themeColors.value)
  }))

  return { isDark, themeColors, chartThemeConfig }
}
```

### Dark Mode Support

- Automatic detection via `document.documentElement.classList.contains('dark')`
- Reactive updates when theme changes
- Proper contrast for tooltips, legends, and labels
- Grid lines adjust opacity based on theme

## Automatic Chart Resizing

### Challenge
Charts need to resize when:
- Browser window resizes
- Container size changes (sidebar collapse, grid layouts)
- Parent element dimensions change dynamically
- Device orientation changes

### Solution: ResizeObserver API

```typescript
// composables/useChartResize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useChartResize(
  containerRef: Ref<HTMLElement | null>,
  chartInstance: Ref<any>
) {
  const resizeObserver = ref<ResizeObserver | null>(null)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  const handleResize = (entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect

      // Update container dimensions
      containerWidth.value = width
      containerHeight.value = height

      // Resize chart if initialized
      if (chartInstance.value) {
        chartInstance.value.updateOptions({
          chart: {
            width,
            height: height || undefined
          }
        }, false, false) // redrawPaths: false, animate: false
      }
    }
  }

  onMounted(() => {
    if (!containerRef.value) return

    // Use ResizeObserver for efficient resize detection
    resizeObserver.value = new ResizeObserver(handleResize)
    resizeObserver.value.observe(containerRef.value)
  })

  onUnmounted(() => {
    resizeObserver.value?.disconnect()
  })

  return {
    containerWidth,
    containerHeight
  }
}
```

### Implementation in Chart Components

```vue
<!-- MeldLineChart.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useChartBase } from './composables/useChartBase'
import { useChartResize } from './composables/useChartResize'
import { useChartTheme } from './composables/useChartTheme'
import type { MeldLineChartProps } from './types'

const props = defineProps<MeldLineChartProps>()

const containerRef = ref<HTMLElement | null>(null)
const { chartInstance, chartReady, initChart } = useChartBase()
const { chartThemeConfig } = useChartTheme()

// Automatic resizing
const { containerWidth } = useChartResize(containerRef, chartInstance)

// Watch for config changes and update chart
watch(() => props.config, (newConfig) => {
  if (chartInstance.value) {
    const echartsOptions = transformToEChartsOption(newConfig, chartThemeConfig.value)
    chartInstance.value.setOption(echartsOptions)
  }
}, { deep: true })
</script>

<template>
  <div ref="containerRef" class="meld-chart-container">
    <MeldChartSkeleton v-if="!chartReady || loading" :height="height" />
    <div ref="chartRef" :class="{ 'opacity-0': !chartReady }" />
  </div>
</template>
```

### Benefits

- **Automatic**: No manual resize handling needed
- **Efficient**: Only triggers when actual size changes (not on every window event)
- **Smooth**: Debounced naturally by ResizeObserver API
- **Responsive Grids**: Works perfectly with CSS Grid, Flexbox, and container queries
- **Sidebar Toggles**: Automatically adjusts when sidebars expand/collapse

### Fallback for Older Browsers

ResizeObserver has 96%+ browser support, but we provide a fallback:

```typescript
export function useChartResize(/* ... */) {
  const hasResizeObserver = typeof ResizeObserver !== 'undefined'

  if (hasResizeObserver) {
    // Use ResizeObserver (preferred)
  } else {
    // Fallback to window resize event
    const handleWindowResize = debounce(() => {
      if (containerRef.value && chartInstance.value) {
        const { width, height } = containerRef.value.getBoundingClientRect()
        chartInstance.value.updateOptions({ chart: { width, height } })
      }
    }, 250)

    window.addEventListener('resize', handleWindowResize)
    onUnmounted(() => window.removeEventListener('resize', handleWindowResize))
  }
}
```

## Loading Skeleton Component

### Purpose
Provide a consistent, accessible loading state for charts during:
- SSR hydration
- Data fetching
- Chart initialization
- Dynamic data updates

### Component Design

```vue
<!-- MeldChartSkeleton.vue -->
<script setup lang="ts">
interface MeldChartSkeletonProps {
  /** Height of the skeleton (matches chart height) */
  height?: number | string

  /** Width of the skeleton (matches chart width) */
  width?: number | string

  /** Show animated pulse effect */
  animated?: boolean
}

const props = withDefaults(defineProps<MeldChartSkeletonProps>(), {
  height: 350,
  width: '100%',
  animated: true
})

const computedHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)

const computedWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width
)
</script>

<template>
  <div
    class="meld-chart-skeleton"
    :class="{ 'animate-pulse': animated }"
    :style="{ height: computedHeight, width: computedWidth }"
    role="status"
    aria-label="Loading chart"
  >
    <!-- Visual structure matching chart layout -->
    <div class="skeleton-header">
      <div class="skeleton-title" />
      <div class="skeleton-legend">
        <div class="skeleton-legend-item" />
        <div class="skeleton-legend-item" />
        <div class="skeleton-legend-item" />
      </div>
    </div>

    <div class="skeleton-chart-area">
      <!-- Fake chart bars/lines -->
      <div class="skeleton-bars">
        <div
          v-for="i in 7"
          :key="i"
          class="skeleton-bar"
          :style="{ height: `${Math.random() * 60 + 20}%` }"
        />
      </div>
    </div>

    <div class="skeleton-footer">
      <div class="skeleton-axis-labels">
        <div v-for="i in 7" :key="i" class="skeleton-label" />
      </div>
    </div>

    <!-- Screen reader announcement -->
    <span class="sr-only">Loading chart data...</span>
  </div>
</template>

<style scoped>
.meld-chart-skeleton {
  display: flex;
  flex-direction: column;
  background: var(--color-muted, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.5rem;
  padding: 1.5rem;
  overflow: hidden;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.skeleton-title {
  width: 120px;
  height: 20px;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem;
}

.skeleton-legend {
  display: flex;
  gap: 1rem;
}

.skeleton-legend-item {
  width: 60px;
  height: 16px;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem;
}

.skeleton-chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem 0;
  min-height: 200px;
}

.skeleton-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  gap: 0.5rem;
}

.skeleton-bar {
  flex: 1;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem 0.25rem 0 0;
  transition: height 0.3s ease;
}

.skeleton-footer {
  margin-top: 1rem;
}

.skeleton-axis-labels {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.skeleton-label {
  flex: 1;
  height: 12px;
  background: var(--color-muted-foreground, #d1d5db);
  border-radius: 0.25rem;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Dark mode support */
.dark .meld-chart-skeleton {
  background: var(--color-muted, #1f2937);
  border-color: var(--color-border, #374151);
}

.dark .skeleton-title,
.dark .skeleton-legend-item,
.dark .skeleton-bar,
.dark .skeleton-label {
  background: var(--color-muted-foreground, #4b5563);
}
</style>
```

### Usage

```vue
<template>
  <!-- Automatic loading state -->
  <MeldLineChart
    :config="chartConfig"
    :loading="isDataLoading"
  />

  <!-- Standalone skeleton -->
  <MeldChartSkeleton :height="400" />

  <!-- Without animation -->
  <MeldChartSkeleton :animated="false" />
</template>
```

### Accessibility Features

- **ARIA role="status"**: Announces loading state to screen readers
- **aria-label**: Descriptive label for the skeleton
- **sr-only text**: Additional context for assistive technologies
- **Semantic markup**: Proper structure for keyboard navigation
- **Color contrast**: Meets WCAG 2.1 AA standards in both light and dark modes

### Skeleton Variations

For different chart types, you can customize the skeleton appearance:

```typescript
// Optional: Chart-type-specific skeletons
export const SKELETON_VARIANTS = {
  line: 'skeleton-bars', // Line-shaped bars
  bar: 'skeleton-bars',
  pie: 'skeleton-circle', // Circular segments
  donut: 'skeleton-donut',
  area: 'skeleton-bars',
  scatter: 'skeleton-dots'
}
```

## Bundle Size Strategy

### Tree-Shaking Architecture

**Goal:** Users only bundle chart types they import.

**Implementation:**

1. **Separate Component Files**
   - Each chart type is a standalone `.vue` file
   - No shared component registration
   - Build tool can eliminate unused files

2. **Dynamic Imports in Smart Wrapper**
   ```vue
   <!-- MeldChart.vue -->
   <script setup lang="ts">
   import { defineAsyncComponent, computed } from 'vue'
   import type { MeldChartProps } from './types'

   const props = defineProps<MeldChartProps>()

   // Lazy load based on type
   const ChartComponent = computed(() => {
     switch (props.type) {
       case 'line':
         return defineAsyncComponent(() => import('./MeldLineChart.vue'))
       case 'bar':
         return defineAsyncComponent(() => import('./MeldBarChart.vue'))
       case 'area':
         return defineAsyncComponent(() => import('./MeldAreaChart.vue'))
       // ... etc
       default:
         return null
     }
   })
   </script>

   <template>
     <component :is="ChartComponent" v-bind="$props" />
   </template>
   ```

3. **Lazy ECharts Import**
   - Only import ECharts when chart mounts
   - Not bundled during SSR builds
   - Shared across all chart types (single import in browser)

### Bundle Impact Analysis

| Usage Pattern | Bundle Size (Gzipped) | Notes |
|---------------|----------------------|-------|
| `import { MeldLineChart }` | **~70-90 KB** | ECharts core + Line chart + Grid + Tooltip |
| `import { MeldLineChart, MeldBarChart }` | **~85-105 KB** | Shared core, add Bar chart module |
| `import { MeldChart }` + dynamic type | **~70 KB + ~15-25 KB per type** | Code-split chart components |
| Using 5 different chart types | **~120-150 KB** | Excellent tree-shaking |
| Full ECharts (no tree-shaking) | ~354 KB | ⚠️ Don't do this - use tree-shaking! |

**Key Insight:** ECharts with tree-shaking is **60-75% smaller** than ApexCharts for most use cases!

## Adapter Architecture

### Transformer Pattern

```typescript
// adapters/echarts/transformer.ts

import type { MeldChartConfig } from '../../types'
import type { EChartsOption } from 'echarts'

export function transformToEChartsOption(
  config: MeldChartConfig,
  themeConfig: any,
  defaults: Partial<EChartsOption>
): EChartsOption {
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
    advanced
  } = config

  // Build ECharts options from our abstraction
  const echartsOption: EChartsOption = {
    ...defaults,

    series: series.map(s => ({
      name: s.name,
      data: s.data,
      type: s.type || 'line',
      ...(s.color && { color: s.color }),
      ...(stacked && { stack: 'total' }),
      ...(stroke?.width && { lineStyle: { width: stroke.width } }),
      ...(stroke?.curve && {
        smooth: stroke.curve === 'smooth',
        step: stroke.curve === 'stepline' ? 'middle' : undefined
      })
    })),

    xAxis: xAxis ? {
      type: xAxis.type || 'category',
      data: xAxis.categories,
      name: xAxis.title,
      min: xAxis.min,
      max: xAxis.max,
      axisLabel: xAxis.labels
    } : { type: 'category' },

    yAxis: yAxis ? {
      type: yAxis.type || 'value',
      name: yAxis.title,
      min: yAxis.min,
      max: yAxis.max,
      axisLabel: yAxis.labels
    } : { type: 'value' },

    legend: legend ? {
      show: legend.show ?? true,
      top: legend.position === 'top' ? 0 : legend.position === 'bottom' ? 'bottom' : undefined,
      left: legend.align || 'left'
    } : { show: true },

    tooltip: tooltip ? {
      show: tooltip.enabled ?? true,
      trigger: tooltip.shared ? 'axis' : 'item',
      ...(tooltip.formatter && {
        formatter: (params: any) => {
          const data = Array.isArray(params) ? params[0] : params
          return tooltip.formatter!(data.value, data.seriesName, data.dataIndex)
        }
      })
    } : { show: true, trigger: 'axis' },

    grid: grid ? {
      show: grid.show ?? true,
      borderColor: 'var(--color-border, #e5e7eb)',
      borderWidth: 1
    } : { show: true },

    color: colors === 'auto' ? themeConfig.palette : colors,

    toolbox: {
      show: toolbar ?? false,
      feature: {
        dataZoom: zoom ? { yAxisIndex: 'none' } : undefined,
        saveAsImage: toolbar ? {} : undefined
      }
    },

    animation: animations ?? true,

    darkMode: themeConfig.mode === 'dark'
  }

  // Merge advanced config (escape hatch)
  if (advanced) {
    return deepMerge(echartsOption, advanced)
  }

  return echartsOption
}

// Deep merge utility
function deepMerge(target: any, source: any): any {
  // Implementation...
}
```

### Defaults Configuration

```typescript
// config/defaults.ts
import type { EChartsOption } from 'echarts'

export const CHART_DEFAULTS: Partial<EChartsOption> = {
  // Inherit font family from Tailwind
  textStyle: {
    fontFamily: 'inherit'
  },

  // Minimal toolbar by default
  toolbox: {
    show: false
  },

  // Clean data labels
  label: {
    show: false
  },

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
    show: true
  },

  // Tooltip configuration
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: 'var(--color-border, #e5e7eb)',
        width: 1,
        type: 'dashed'
      }
    },
    textStyle: {
      fontSize: 14,
      fontFamily: 'inherit'
    }
  },

  // Legend configuration
  legend: {
    show: true,
    top: 0,
    left: 'left',
    textStyle: {
      fontSize: 14,
      fontFamily: 'inherit'
    }
  },

  // Axis styling
  xAxis: {
    axisLine: {
      lineStyle: {
        color: 'var(--color-border, #e5e7eb)'
      }
    },
    axisLabel: {
      color: 'var(--color-foreground, #374151)',
      fontFamily: 'inherit'
    }
  },

  yAxis: {
    axisLine: {
      show: false
    },
    axisLabel: {
      color: 'var(--color-foreground, #374151)',
      fontFamily: 'inherit'
    },
    splitLine: {
      lineStyle: {
        color: 'var(--color-border, #e5e7eb)',
        type: 'dashed'
      }
    }
  }
}
```

## Implementation Phases

### Phase 0: Package Setup
- [x] Create `packages/charts-vue/` directory
- [x] Set up `package.json` with correct metadata and exports
- [x] Configure `vite.config.ts` for library build (ESM + CJS)
- [x] Set up `tsconfig.json` extending workspace config
- [x] Add to `pnpm-workspace.yaml`
- [x] Configure build scripts in root package.json

### Phase 1: Foundation (MVP)
- [x] Install dependencies (`echarts@^6.0.0`, `vue-echarts@^8.0.1`)
- [x] Create library-agnostic type definitions (`types.ts`)
- [x] Build base composables (`useChartBase`, `useChartTheme`, `useChartResize`)
- [x] Create ECharts transformer adapter (`adapters/echarts/transformer.ts`)
- [x] Create ECharts registry for tree-shaking (`adapters/echarts/registry.ts`)
- [x] Set up defaults configuration
- [x] Build `MeldChartSkeleton.vue` component
- [x] Create `index.ts` with public exports (components + types only, NO adapters)

### Phase 1.5: MeldUI Vue Integration (Internal Component Reusability)
- [x] Add `@meldui/vue` as peer dependency in `package.json`
- [x] Update `vite.config.ts` to externalize `@meldui/vue` in build
- [x] Refactor `MeldChartSkeleton.vue` to use `Skeleton` component from `@meldui/vue`
- [x] Import and use `cn` utility from `@meldui/vue` instead of local implementation
- [x] Test that skeleton component renders correctly with MeldUI styles
- [x] Verify build succeeds with peer dependency
- [x] Update installation instructions in README.md

**Rationale:** Charts should reuse components from `@meldui/vue` (Skeleton, Card, Badge, Button, etc.) to maintain design consistency and promote internal reusability. This ensures charts feel native to the MeldUI design system and reduces code duplication.

### Phase 2: Core Chart Components (MVP)
- [ ] `MeldLineChart.vue`
- [ ] Create Storybook story for `MeldLineChart`
- [ ] `MeldBarChart.vue`
- [ ] Create Storybook story for `MeldBarChart`
- [ ] `MeldAreaChart.vue`
- [ ] Create Storybook story for `MeldAreaChart`
- [ ] `MeldPieChart.vue`
- [ ] Create Storybook story for `MeldPieChart`
- [ ] Integrate SSR support, skeleton loader, and automatic resizing in all components
- [ ] Test imports from `@meldui/charts-vue`

### Phase 3: Smart Wrapper
- [ ] `MeldChart.vue` with dynamic imports
- [ ] Create Storybook story for `MeldChart` (dynamic type switching)
- [ ] Loading states and error handling
- [ ] Test automatic resizing across all chart types
- [ ] Verify tree-shaking works correctly

### Phase 4: Additional Chart Types
- [ ] `MeldDonutChart.vue`
- [ ] Create Storybook story for `MeldDonutChart`
- [ ] `MeldScatterChart.vue`
- [ ] Create Storybook story for `MeldScatterChart`
- [ ] `MeldRadarChart.vue`
- [ ] Create Storybook story for `MeldRadarChart`
- [ ] `MeldHeatmapChart.vue`
- [ ] Create Storybook story for `MeldHeatmapChart`
- [ ] `MeldMixedChart.vue`
- [ ] Create Storybook story for `MeldMixedChart`

### Phase 5: Storybook Documentation
- [ ] Installation guide (MDX) - emphasize separate package
- [ ] Charts overview (MDX)
- [ ] Advanced configuration examples story
- [ ] Theme customization guide (MDX)
- [ ] Dashboard example showcases
- [ ] ECharts escape hatch examples (advanced config)

### Phase 6: Testing & Polish
- [ ] Unit tests for transformer
- [ ] Integration tests for SSR
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Bundle size analysis (verify ~70-150KB for typical usage with tree-shaking)
- [ ] Test installation workflow
- [ ] Test with example consumer app

### Phase 7: Publishing Setup
- [ ] Configure changeset for independent versioning
- [ ] Set up npm publish workflow
- [ ] Create initial release (v0.1.0)
- [ ] Verify published package works correctly

## Dependencies

### Package: `@meldui/charts-vue`

**Production Dependencies**
```json
{
  "name": "@meldui/charts-vue",
  "version": "0.1.0",
  "dependencies": {
    "echarts": "^6.0.0",
    "vue-echarts": "^8.0.1"
  },
  "peerDependencies": {
    "@meldui/vue": "workspace:*",
    "vue": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Important Notes:**
- **@meldui/vue** is a **peer dependency** - charts reuse components (Skeleton, Card, etc.) from the main package
- **Apache ECharts** is a **regular dependency** (not peer) - users don't need to install it separately
- **vue-echarts** provides official Vue 3 integration with TypeScript support
- ECharts types (`EChartsOption`) are **only used internally** in the adapter layer, never exposed in public API
- `vue` is a peer dependency (users install it for `@meldui/vue` anyway)
- **Tree-shaking**: Users can configure Vite to tree-shake unused ECharts components automatically

**User Installation:**
```bash
# Users install these (@meldui/vue is a peer dependency)
pnpm add @meldui/vue @meldui/charts-vue

# Auto-installed as regular dependencies:
# - echarts@^6.0.0
# - vue-echarts@^8.0.1
```

**License Compliance:**
- ✅ **Apache License 2.0** - Free for commercial use and redistribution
- ✅ No revenue restrictions or OEM licensing required
- ✅ Only requirement: Preserve copyright and license notices (automatically handled in build)

## File Locations

- **Package**: `packages/charts-vue/`
- **Components**: `packages/charts-vue/src/components/`
- **Types**: `packages/charts-vue/src/types.ts`
- **Adapters**: `packages/charts-vue/src/adapters/` (internal only)
- **Stories**: `apps/vue-storybook/stories/Charts/`
- **Documentation**: `apps/vue-storybook/stories/Charts/Overview.mdx`

## Success Criteria (MVP)

1. ✅ **Separate Package** - Charts live in `@meldui/charts-vue`, following `@meldui/tabler-vue` pattern
2. ✅ **Zero Library Exposure** - Public API has no `EChartsOption` or any library-specific types
3. ✅ **Optional Dependency** - Charts are opt-in, not bundled with core `@meldui/vue`
4. ✅ **Internal Component Reusability** - Charts reuse `@meldui/vue` components (Skeleton, Card, etc.) for design consistency
5. ✅ **Apache 2.0 Licensed** - Free redistribution, no commercial restrictions, production-ready
6. ✅ **Excellent Tree-Shaking** - ECharts modules are tree-shakeable (~70-150 KB typical usage)
7. ✅ **SSR Compatible** - Works in Nuxt without configuration
8. ✅ **Theme Integration** - Automatically uses Tailwind CSS v4 colors
9. ✅ **TypeScript Safety** - Full type definitions with IntelliSense
10. ✅ **80/20 API** - Simple configs cover 80% of cases, escape hatch covers 20%
11. ✅ **Performance** - Chart initialization < 100ms, smooth animations
12. ✅ **Auto Resize** - Charts automatically resize on container changes without manual intervention
13. ✅ **Loading States** - Skeleton component provides smooth loading experience with zero layout shift
14. ✅ **Documentation** - Comprehensive Storybook examples for all chart types
15. ✅ **Accessibility** - WCAG 2.1 AA compliant (color contrast, keyboard nav, ARIA labels)
16. ✅ **Bundle Size** - **~70-150 KB** for most use cases (excellent tree-shaking)

## Future Enhancements (Post-MVP)

### V2: Advanced ECharts Features
ECharts already includes these features - expose them through our API:

**3D Charts**
- 3D bar charts, 3D scatter plots, 3D surface charts
- Add `Meld3DBarChart`, `Meld3DScatterChart` components

**Chart Export**
- PNG, SVG export (built into ECharts toolbox)
- Expose via `exportable` prop

**Advanced Visualizations**
- Treemap, Sunburst diagrams
- Sankey, Graph (network) charts
- Parallel coordinates for multi-dimensional data
- Calendar heatmaps

**Real-time Data**
- Streaming data updates
- Auto-refresh and data polling
- WebSocket integration helpers

### V3: Additional Features
- Custom chart themes/presets (beyond Tailwind integration)
- Chart data transformations (aggregations, filters)
- Multi-axis support for complex dashboards
- Advanced animation configurations
- Brush/zoom interactions
- Timeline component for time-series data
- DataZoom sliders for large datasets

### V4: Alternative Adapters (If Needed)
- uPlot adapter for ultra-lightweight time-series (~45 KB)
- Chart.js adapter for simpler API surface
- Only add if user demand requires it

## Questions & Decisions Log

**Q: Should charts be in `@meldui/vue` or a separate package?**
**A:** Separate package `@meldui/charts-vue`, following the `@meldui/tabler-vue` pattern. Charts are optional, don't bloat core package, and can version independently.

**Q: Should we expose ECharts types or let users choose libraries?**
**A:** Absolutely not. Users should never know what library is used internally. Use `Record<string, any>` for escape hatch. The abstraction is the entire point.

**Q: ApexCharts vs Chart.js vs ECharts - which to use?**
**A:**
- ❌ **ApexCharts** - Dual license model with commercial restrictions, OEM license required for redistribution
- ✅ **Chart.js** - MIT licensed (good), but fewer features and chart types
- ✅✅ **Apache ECharts** - Apache 2.0 license (perfect!), 20+ chart types, excellent tree-shaking, production-proven

**Winner: Apache ECharts** - No licensing concerns, best features, great performance.

**Q: What about ApexCharts licensing issues?**
**A:** ApexCharts requires:
- Commercial license if organization earns $2M+/year
- OEM/Redistribution license for embedding in libraries/platforms
- This makes it unsuitable for a redistributable component library like MeldUI
- ECharts (Apache 2.0) has none of these restrictions

**Q: Single component or multiple?**
**A:** Multiple specific components + smart wrapper for best tree-shaking.

**Q: How to handle SSR?**
**A:** Environment detection + deferred initialization + skeleton placeholder.

**Q: Bundle size concern?**
**A:**
- **ECharts with tree-shaking:** ~70-150KB for typical usage (1-5 chart types)
- **Excellent optimization** - 60-75% smaller than ApexCharts
- Tree-shaking is automatic when using Vite/Rollup
- Much better than originally anticipated!

**Q: Theming approach?**
**A:** Auto-extract colors from Tailwind CSS v4 variables, with manual override option.

**Q: How to handle chart resizing?**
**A:** Use ResizeObserver API for automatic, efficient resizing. Fallback to window resize events for older browsers. No manual handling required by users.

**Q: What about loading states during SSR/hydration?**
**A:** Build dedicated `MeldChartSkeleton` component with accessibility features. Automatically shown during SSR, chart initialization, and when `loading` prop is true.

**Q: How does ECharts tree-shaking work?**
**A:** ECharts uses a modular architecture - you import only the chart types and components needed. Our adapter handles registration automatically. Vite/Rollup eliminates unused modules at build time.

## References

**Chart Libraries:**
- [Apache ECharts Documentation](https://echarts.apache.org/) - MVP implementation
- [ECharts Examples Gallery](https://echarts.apache.org/examples/en/index.html) - Interactive examples
- [vue-echarts Official Integration](https://vue-echarts.dev/) - Vue 3 wrapper
- [ECharts GitHub](https://github.com/apache/echarts) - Source code and license
- [ECharts Tree-Shaking Guide](https://apache.github.io/echarts-handbook/en/basics/import/) - Bundle optimization

**Vue & Build:**
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Tree Shaking Best Practices](https://webpack.js.org/guides/tree-shaking/)

**Styling & Accessibility:**
- [Tailwind CSS v4 Theme](https://tailwindcss.com/docs/theme)
- [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

**Package Design:**
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Changesets for Versioning](https://github.com/changesets/changesets)
