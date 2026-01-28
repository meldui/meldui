# Task 10: Charts Package Improvements

> **Status:** Planned
> **Priority:** Medium-High
> **Depends on:** Task 09 (Charts Package MVP - Complete)

## Overview

This task documents improvements and enhancements for the `@meldui/charts-vue` package identified during code review. The MVP implementation is solid, but several areas can be improved for better maintainability, performance, accessibility, and developer experience.

## Key Improvement Areas

| Category               | Priority   | Effort | Impact                          |
| ---------------------- | ---------- | ------ | ------------------------------- |
| Memory Leak Fix        | **High**   | Low    | Production stability            |
| Event System           | **High**   | Medium | User interactivity              |
| Chart-Specific Configs | **High**   | High   | Developer experience (BREAKING) |
| Code Duplication       | **Medium** | Medium | Maintainability                 |
| Bundle Optimization    | **Medium** | Medium | Performance                     |
| Accessibility          | **Medium** | Medium | Compliance                      |
| Type Cleanup           | **Low**    | Low    | Code quality                    |
| Config Validation      | **Low**    | Medium | Error handling                  |

---

## Improvement 1: Memory Leak in Theme Observer (HIGH PRIORITY)

### Problem

In `packages/charts-vue/src/composables/useChartTheme.ts:32-43`, the MutationObserver cleanup uses `beforeunload` which doesn't run when Vue components unmount:

```typescript
// Current (broken)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => observer.disconnect())
}
```

The observer stays alive after component unmount, causing memory leaks in SPAs with route navigation.

### Solution

Use Vue's `onUnmounted` lifecycle hook:

```typescript
import { onUnmounted, ref } from 'vue'

export function useChartTheme() {
  const isDark = ref(false)
  let observer: MutationObserver | null = null

  const updateDarkMode = () => {
    if (typeof document === 'undefined') {
      isDark.value = false
      return
    }
    isDark.value = document.documentElement.classList.contains('dark')
  }

  updateDarkMode()

  if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(updateDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }

  // Proper cleanup on component unmount
  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  // ... rest of the composable
}
```

### Files to Modify

- `packages/charts-vue/src/composables/useChartTheme.ts`

---

## Improvement 2: Event System (HIGH PRIORITY)

### Problem

Charts are purely presentational with no event support. Users cannot respond to clicks, hovers, or selections:

```vue
<!-- Not possible currently -->
<MeldBarChart @click="handleBarClick" @hover="showTooltip" />
```

### Solution

Expose ECharts events through a normalized API:

```typescript
// types.ts - Add event types
export interface ChartClickEvent {
  seriesName: string
  dataIndex: number
  value: number | [number, number]
  name: string
  componentType: 'series' | 'markPoint' | 'markLine'
}

export interface ChartHoverEvent {
  seriesName: string
  dataIndex: number
  value: number | [number, number]
  name: string
}

export interface ChartLegendEvent {
  name: string
  selected: Record<string, boolean>
}

export interface MeldChartEvents {
  click?: (event: ChartClickEvent) => void
  hover?: (event: ChartHoverEvent) => void
  legendSelectChanged?: (event: ChartLegendEvent) => void
  dataZoom?: (event: { start: number; end: number }) => void
}

// Update base props
export interface MeldChartBaseProps {
  config: MeldChartConfig
  height?: number | string
  width?: number | string
  title?: string
  loading?: boolean
  // Add events
  onClick?: (event: ChartClickEvent) => void
  onHover?: (event: ChartHoverEvent) => void
  onLegendSelect?: (event: ChartLegendEvent) => void
}
```

Implementation in chart components:

```typescript
// In useChartBase.ts or individual components
const setupEventHandlers = (instance: EChartsType, emit: any) => {
  instance.on('click', (params) => {
    emit('click', normalizeClickEvent(params))
  })

  instance.on('mouseover', (params) => {
    emit('hover', normalizeHoverEvent(params))
  })

  instance.on('legendselectchanged', (params) => {
    emit('legendSelect', params)
  })
}
```

### Files to Modify

- `packages/charts-vue/src/types.ts`
- `packages/charts-vue/src/composables/useChartBase.ts`
- All chart components in `packages/charts-vue/src/components/`

---

## Improvement 3: Chart-Specific Configuration Types (HIGH PRIORITY - BREAKING CHANGE)

### Problem

The current unified `MeldChartConfig` interface tries to handle all chart types, leading to poor developer experience:

```typescript
// Current: User sees ALL options for a simple pie chart
const pieConfig: MeldChartConfig = {
  series: [...],
  xAxis: { ... },        // Not applicable to pie
  yAxis: { ... },        // Not applicable to pie
  horizontal: false,     // Not applicable to pie
  stacked: false,        // Not applicable to pie
  stroke: { ... },       // Not applicable to pie
  grid: { ... },         // Not applicable to pie
  zoom: false,           // Not applicable to pie
  // ... 15+ optional properties, most irrelevant
}
```

**Issues:**

1. **Cognitive overload** - Users must mentally filter irrelevant options
2. **No TypeScript guidance** - IDE suggests properties that don't apply
3. **Runtime confusion** - What happens if you set `horizontal: true` on a radar chart?
4. **Documentation burden** - Must explain "this only applies to X, Y, Z charts"

### Solution

Create chart-specific configuration interfaces that extend a shared base:

```typescript
// Shared base for common properties
interface ChartConfigBase {
  /** Chart data series */
  series: ChartSeries[]
  /** Legend configuration */
  legend?: ChartLegend
  /** Tooltip configuration */
  tooltip?: ChartTooltip
  /** Series colors */
  colors?: 'auto' | PaletteName | string[]
  /** Enable/disable animations */
  animations?: boolean
  /** Advanced ECharts escape hatch */
  advanced?: Record<string, any>
}

// ============================================
// BAR CHART - Only relevant options
// ============================================
interface MeldBarChartConfig extends ChartConfigBase {
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  /** Horizontal bar orientation */
  horizontal?: boolean
  /** Stack bars */
  stacked?: boolean
  /** Show values on bars */
  dataLabels?: ChartDataLabels
  /** Grid lines configuration */
  grid?: ChartGrid
  /** Bar width (number or percentage) */
  barWidth?: number | string
  /** Gap between bars in same category */
  barGap?: string
  /** Show toolbar (zoom, download) */
  toolbar?: boolean
  /** Enable zoom functionality */
  zoom?: boolean
}

// ============================================
// LINE CHART - Different relevant options
// ============================================
interface MeldLineChartConfig extends ChartConfigBase {
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  /** Line stroke configuration */
  stroke?: {
    width?: number
    curve?: 'smooth' | 'straight' | 'stepline'
    dashArray?: number[]
  }
  /** Show data points on line */
  showPoints?: boolean
  /** Size of data points */
  pointSize?: number
  /** Grid lines configuration */
  grid?: ChartGrid
  /** Show toolbar */
  toolbar?: boolean
  /** Enable zoom */
  zoom?: boolean
}

// ============================================
// AREA CHART - Extends line with fill options
// ============================================
interface MeldAreaChartConfig extends ChartConfigBase {
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  stroke?: {
    width?: number
    curve?: 'smooth' | 'straight' | 'stepline'
  }
  /** Stack areas */
  stacked?: boolean
  /** Fill opacity (0-1) */
  fillOpacity?: number
  grid?: ChartGrid
  toolbar?: boolean
  zoom?: boolean
}

// ============================================
// PIE CHART - Minimal, focused options
// ============================================
interface MeldPieChartConfig extends ChartConfigBase {
  /** Show labels on slices */
  showLabels?: boolean
  /** Label position */
  labelPosition?: 'inside' | 'outside'
  /** Starting angle in degrees */
  startAngle?: number
  /** Radius as percentage or pixels */
  radius?: string | number
}

// ============================================
// DONUT CHART - Extends pie with inner radius
// ============================================
interface MeldDonutChartConfig extends ChartConfigBase {
  showLabels?: boolean
  labelPosition?: 'inside' | 'outside'
  startAngle?: number
  /** Outer radius */
  radius?: string | number
  /** Inner radius (creates the hole) */
  innerRadius?: string | number // e.g., '40%' or 50
  /** Center label content */
  centerLabel?: {
    show?: boolean
    title?: string
    value?: string | number
  }
}

// ============================================
// RADAR CHART - Unique configuration
// ============================================
interface MeldRadarChartConfig extends ChartConfigBase {
  /** Radar indicators (categories with optional max) */
  indicators?: Array<{ name: string; max?: number }>
  /** Shape of the radar */
  shape?: 'polygon' | 'circle'
  /** Fill the radar area */
  fillArea?: boolean
  /** Fill opacity when fillArea is true */
  fillOpacity?: number
  /** Show axis labels */
  showAxisLabels?: boolean
}

// ============================================
// HEATMAP CHART - Grid-based visualization
// ============================================
interface MeldHeatmapChartConfig extends ChartConfigBase {
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  /** Color range configuration */
  colorRange?: {
    min?: number
    max?: number
    colors?: string[] // Gradient colors
  }
  /** Show values in cells */
  showValues?: boolean
  /** Cell border configuration */
  cellBorder?: {
    show?: boolean
    color?: string
    width?: number
  }
}

// ============================================
// SCATTER CHART - Point-based visualization
// ============================================
interface MeldScatterChartConfig extends ChartConfigBase {
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  /** Point size (fixed or function of value) */
  pointSize?: number | ((value: number) => number)
  /** Point shape */
  pointShape?: 'circle' | 'rect' | 'triangle' | 'diamond'
  grid?: ChartGrid
  toolbar?: boolean
  zoom?: boolean
}

// ============================================
// MIXED CHART - Combines multiple types
// ============================================
interface MeldMixedChartConfig extends ChartConfigBase {
  xAxis?: ChartAxis
  yAxis?: ChartAxis
  /** Secondary Y-axis for dual-axis charts */
  yAxis2?: ChartAxis
  grid?: ChartGrid
  toolbar?: boolean
  zoom?: boolean
}

// For mixed charts, series can specify their type
interface MixedChartSeries extends ChartSeries {
  type: 'line' | 'bar' | 'area'
  /** Which Y-axis to use (0 = primary, 1 = secondary) */
  yAxisIndex?: 0 | 1
}
```

### Updated Component Props

```typescript
// Each component accepts ONLY its specific config type
interface MeldBarChartProps {
  config: MeldBarChartConfig // Not MeldChartConfig!
  height?: number | string
  width?: number | string
  title?: string
  loading?: boolean
}

interface MeldPieChartProps {
  config: MeldPieChartConfig // Focused, relevant options only
  height?: number | string
  width?: number | string
  title?: string
  loading?: boolean
}

// ... similar for all chart types
```

### Handling MeldChart (Dynamic Type)

For the dynamic `MeldChart` component, use a discriminated union:

```typescript
// Discriminated union for type safety
type MeldDynamicChartProps =
  | { type: 'bar'; config: MeldBarChartConfig }
  | { type: 'line'; config: MeldLineChartConfig }
  | { type: 'area'; config: MeldAreaChartConfig }
  | { type: 'pie'; config: MeldPieChartConfig }
  | { type: 'donut'; config: MeldDonutChartConfig }
  | { type: 'radar'; config: MeldRadarChartConfig }
  | { type: 'heatmap'; config: MeldHeatmapChartConfig }
  | { type: 'scatter'; config: MeldScatterChartConfig }
  | { type: 'mixed'; config: MeldMixedChartConfig }

// Usage - TypeScript enforces correct config for type!
<MeldChart type="bar" :config="barConfig" />     // barConfig must be MeldBarChartConfig
<MeldChart type="pie" :config="pieConfig" />     // pieConfig must be MeldPieChartConfig
```

### User Experience Comparison

**Before (unified):**

```typescript
// IDE shows 20+ properties, user must guess which matter
const config: MeldChartConfig = {
  series: [{ name: 'Sales', data: [30, 40, 50] }],
  // ... what else do I need for a pie chart? Let me check docs...
  xAxis: { categories: ['A', 'B', 'C'] }, // Wait, does pie need this?
}
```

**After (specific):**

```typescript
// IDE shows only 6-8 relevant properties - self-documenting!
const config: MeldPieChartConfig = {
  series: [
    { name: 'Desktop', data: [65] },
    { name: 'Mobile', data: [35] },
  ],
  showLabels: true,
  labelPosition: 'outside',
  // Done! IDE only suggests relevant options.
}
```

### Migration Guide

This is a **breaking change**. Users upgrading will need to:

1. Update imports to use specific config types
2. Remove irrelevant properties from configs
3. Update `MeldChart` usage to use discriminated union

```typescript
// Before
import type { MeldChartConfig } from '@meldui/charts-vue'
const config: MeldChartConfig = { ... }

// After
import type { MeldBarChartConfig } from '@meldui/charts-vue'
const config: MeldBarChartConfig = { ... }
```

### Transformer Updates

The transformer will need to be updated to handle chart-specific configs:

```typescript
// adapters/echarts/transformer.ts
export function transformBarChart(config: MeldBarChartConfig, theme: ThemeConfig): EChartsOption
export function transformLineChart(config: MeldLineChartConfig, theme: ThemeConfig): EChartsOption
export function transformPieChart(config: MeldPieChartConfig, theme: ThemeConfig): EChartsOption
// ... etc

// Or use function overloads / type guards
export function transformToEChartsOption(
  config: MeldBarChartConfig | MeldLineChartConfig | MeldPieChartConfig | ...,
  theme: ThemeConfig,
  chartType: ChartType
): EChartsOption
```

### Files to Modify

- `packages/charts-vue/src/types.ts` - Complete rewrite of config interfaces
- `packages/charts-vue/src/adapters/echarts/transformer.ts` - Update to handle specific configs
- `packages/charts-vue/src/adapters/echarts/utils/seriesTransformer.ts` - Type updates
- All chart components - Update prop types
- All Storybook stories - Update to use specific config types
- Documentation - Add migration guide

### Benefits

| Aspect         | Before (Unified)              | After (Specific)                  |
| -------------- | ----------------------------- | --------------------------------- |
| TypeScript DX  | Poor - irrelevant suggestions | Excellent - only relevant options |
| Learning curve | Confusing - what applies?     | Self-documenting                  |
| Documentation  | Complex caveats needed        | Types ARE the docs                |
| Runtime errors | Possible invalid combos       | Prevented at compile time         |
| IDE experience | Noisy autocomplete            | Clean, focused suggestions        |

---

## Improvement 4: Code Duplication Across Chart Components (MEDIUM PRIORITY) - SKIPPED

> **Decision:** After review, this improvement was **intentionally skipped**. While there is code duplication across chart components, the current approach is preferred because:
>
> 1. Logic is already extracted into composables (`useChartBase`, `useChartEvents`, `useChartResize`, `useChartTheme`)
> 2. Each component is self-contained and easy to understand
> 3. Vue SFCs don't work well with JavaScript factories for template logic
> 4. The "duplicated" boilerplate is stable and rarely changes
> 5. Explicit code is easier to debug than abstracted factories

### Problem

Every chart component (MeldBarChart, MeldLineChart, etc.) has nearly identical code. The only difference is the chart type string passed to `transformToEChartsOption`:

```typescript
// MeldBarChart.vue
transformToEChartsOption(props.config, chartThemeConfig.value, 'bar')

// MeldLineChart.vue
transformToEChartsOption(props.config, chartThemeConfig.value, 'line')
```

This leads to:

- Maintenance burden (changes must be replicated 9+ times)
- Inconsistency risk
- Larger bundle size

### Solution

Create a factory function or generic base component:

**Option A: Composable Factory**

```typescript
// composables/createChartSetup.ts
export function createChartSetup(chartType: ChartType) {
  return (props: MeldChartBaseProps) => {
    const { chartRef, chartInstance, chartReady, isSSR, initChart, updateChart } = useChartBase()
    const { chartThemeConfig } = useChartTheme()

    const computedHeight = computed(() =>
      typeof props.height === 'number' ? `${props.height}px` : props.height
    )

    const computedWidth = computed(() =>
      typeof props.width === 'number' ? `${props.width}px` : props.width
    )

    const echartsOptions = computed(() =>
      transformToEChartsOption(props.config, chartThemeConfig.value, chartType)
    )

    onMounted(async () => {
      if (!isSSR) {
        await initChart(echartsOptions.value)
      }
    })

    watch(
      () => props.config,
      (newConfig) => {
        if (chartInstance.value) {
          const newOptions = transformToEChartsOption(newConfig, chartThemeConfig.value, chartType)
          updateChart(newOptions)
        }
      },
      { deep: true }
    )

    watch(
      () => chartThemeConfig.value,
      (newTheme) => {
        if (chartInstance.value) {
          const newOptions = transformToEChartsOption(props.config, newTheme, chartType)
          updateChart(newOptions)
        }
      },
      { deep: true }
    )

    useChartResize(chartRef, chartInstance)

    return {
      chartRef,
      chartReady,
      computedHeight,
      computedWidth,
    }
  }
}

// MeldBarChart.vue - Now much simpler
<script setup lang="ts">
import { createChartSetup } from '../composables/createChartSetup'
import type { MeldBarChartProps } from '../types'

const props = withDefaults(defineProps<MeldBarChartProps>(), {
  height: 350,
  width: '100%',
  loading: false,
})

const { chartRef, chartReady, computedHeight, computedWidth } = createChartSetup('bar')(props)
</script>
```

**Option B: Generic Base Component**

```vue
<!-- MeldChartBase.vue -->
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import type { ChartType, MeldChartBaseProps } from '../types'

const props = withDefaults(defineProps<MeldChartBaseProps & { chartType: ChartType }>(), {
  height: 350,
  width: '100%',
  loading: false,
})

// All shared logic here...
</script>

<!-- MeldBarChart.vue -->
<script setup lang="ts">
import MeldChartBase from './MeldChartBase.vue'
</script>

<template>
  <MeldChartBase v-bind="$props" chart-type="bar" />
</template>
```

### Files to Modify

- Create `packages/charts-vue/src/composables/createChartSetup.ts`
- Simplify all 9 chart components in `packages/charts-vue/src/components/`

---

## Improvement 5: Type Duplication (LOW PRIORITY)

### Problem

`ChartType` is defined in two places:

- `packages/charts-vue/src/types.ts:5-14`
- `packages/charts-vue/src/adapters/echarts/utils/seriesTransformer.ts:3-13`

### Solution

Import from single source of truth:

```typescript
// seriesTransformer.ts
import type { ChartType } from '../../../types'

// Remove duplicate definition
```

### Files to Modify

- `packages/charts-vue/src/adapters/echarts/utils/seriesTransformer.ts`

---

## Improvement 6: `title` Prop Never Used (MEDIUM PRIORITY) - COMPLETED

### Problem

The `title` prop was defined in `MeldChartBaseProps` but never rendered.

### Solution Implemented

Used **slots** for maximum flexibility. Each chart now has:

- `header` slot - for title, actions, filters, etc.
- `footer` slot - for legends, captions, timestamps, etc.

The `title` prop serves as default content for the `header` slot:

```vue
<template>
  <div class="flex flex-col" :style="{ width: computedWidth }">
    <!-- Header slot with title prop as default -->
    <slot name="header">
      <h3 v-if="title" class="text-base font-semibold text-foreground mb-2 px-1">
        {{ title }}
      </h3>
    </slot>

    <!-- Chart container -->
    <div class="relative overflow-hidden border border-border rounded-lg flex-1" ...>
      <!-- chart content -->
    </div>

    <!-- Footer slot -->
    <slot name="footer" />
  </div>
</template>
```

### Usage Examples

```vue
<!-- Simple: just use title prop -->
<MeldBarChart :config="config" title="Monthly Sales" />

<!-- Custom: use header slot -->
<MeldBarChart :config="config">
  <template #header>
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-bold">Sales Report</h3>
      <button>Export</button>
    </div>
  </template>
</MeldBarChart>

<!-- With footer -->
<MeldBarChart :config="config" title="Sales">
  <template #footer>
    <p class="text-xs text-muted-foreground mt-2">Updated: {{ lastUpdate }}</p>
  </template>
</MeldBarChart>
```

### Files Modified

- All chart components in `packages/charts-vue/src/components/`
- `MeldChart.vue` updated to pass through slots

---

## Improvement 7: Deep Watch Performance (MEDIUM PRIORITY) - COMPLETED

> **Implementation:** Removed `{ deep: true }` from all chart component watches. Consolidated two separate watches into a single watch on `[() => props.config, chartThemeConfig]`. Users should replace config objects entirely (standard Vue reactive pattern) rather than mutating nested properties.

### Problem

In chart components, deep watching config can be expensive for large datasets:

```typescript
watch(
  () => props.config,
  (newConfig) => {
    /* ... */
  },
  { deep: true }, // Expensive for thousands of data points
)
```

### Solution

**Option A: Document the expected usage pattern**

Users should replace the config object entirely for reactivity instead of mutating nested properties.

**Option B: Use a config hash for comparison**

```typescript
import { computed, watch } from 'vue'

const configHash = computed(() => JSON.stringify(props.config))

watch(configHash, () => {
  if (chartInstance.value) {
    const newOptions = transformToEChartsOption(props.config, chartThemeConfig.value, chartType)
    updateChart(newOptions)
  }
})
```

**Option C: Shallow watch with explicit refresh method**

```typescript
// Expose a refresh method via defineExpose
const refresh = () => {
  if (chartInstance.value) {
    updateChart(echartsOptions.value)
  }
}

defineExpose({ refresh })
```

### Files to Modify

- All chart components in `packages/charts-vue/src/components/`
- Documentation updates

---

## Improvement 8: No Chart Instance Exposure (MEDIUM PRIORITY) - SKIPPED

> **Decision:** Skipped for v1. Charts are controlled entirely through props, keeping the API surface minimal and predictable. Can be revisited in a future version if users need direct instance access for advanced operations.

### Problem

Users cannot access the underlying ECharts instance for advanced operations:

```vue
<script setup>
const chartRef = ref()
// No way to call: chartRef.value.dispatchAction({ type: 'highlight', ... })
</script>
```

### Solution

Use `defineExpose` to expose controlled access:

```typescript
// In each chart component
defineExpose({
  /** Get the underlying ECharts instance (use with caution) */
  getChartInstance: () => chartInstance.value,

  /** Force refresh the chart with current config */
  refresh: () => updateChart(echartsOptions.value, true),

  /** Resize chart to fit container */
  resize: () => chartInstance.value?.resize(),

  /** Dispatch an ECharts action */
  dispatchAction: (action: any) => chartInstance.value?.dispatchAction(action),
})
```

### Files to Modify

- All chart components in `packages/charts-vue/src/components/`
- `packages/charts-vue/src/types.ts` (add exposed method types)

---

## Improvement 9: Accessibility Enhancements (MEDIUM PRIORITY) - PARTIAL

> **Implementation:** Added `role="img"` and `:aria-label` attributes to all chart canvas containers. Added `ariaLabel` prop to `ChartComponentPropsBase`. Auto-generated aria labels include chart type, title (if provided), and series names. Data table and keyboard navigation deferred.

### Problem

The chart container lacks proper accessibility attributes:

```vue
<!-- Current -->
<div ref="chartRef" class="h-full w-full ..." />
```

### Solution

Add comprehensive accessibility support:

```vue
<template>
  <div class="meld-chart-wrapper">
    <!-- Chart container with ARIA -->
    <div
      ref="chartRef"
      role="img"
      :aria-label="ariaLabel || generateChartDescription(config)"
      tabindex="0"
      class="h-full w-full ..."
    />

    <!-- Hidden data table for screen readers -->
    <table v-if="config.series.length" class="sr-only">
      <caption>
        {{
          title || 'Chart data'
        }}
      </caption>
      <thead>
        <tr>
          <th>Category</th>
          <th v-for="series in config.series" :key="series.name">{{ series.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, i) in config.xAxis?.categories" :key="i">
          <td>{{ category }}</td>
          <td v-for="series in config.series" :key="series.name">
            {{ Array.isArray(series.data) ? series.data[i] : '-' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

Add prop for custom aria-label:

```typescript
interface MeldChartBaseProps {
  // ...
  ariaLabel?: string
  showAccessibleTable?: boolean // Default: true
}
```

### Files to Modify

- `packages/charts-vue/src/types.ts`
- All chart components
- Consider creating a shared accessibility composable

---

## Improvement 10: Bundle Size Optimization (MEDIUM PRIORITY) - COMPLETED

> **Implementation:** Updated `useChartBase.ts` to dynamically import from the modular `registry.ts` instead of the full echarts bundle. Added missing `VisualMapComponent` and `RadarComponent` to the registry. Updated type imports across `useChartEvents.ts` and `useChartResize.ts` to use `echarts/core`.

### Problem

Full ECharts is imported dynamically, but selective imports could reduce bundle size by 50-70%:

```typescript
// Current
const echarts = await import('echarts') // ~354KB full
```

### Solution

Use selective imports with ECharts modular architecture:

```typescript
// adapters/echarts/registry.ts
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  HeatmapChart,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register only what's needed
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  CanvasRenderer,
])

export { echarts }
```

Update `useChartBase.ts`:

```typescript
const initChart = async (options: EChartsOption) => {
  if (isSSR) return
  await nextTick()
  if (!chartRef.value) return

  try {
    // Import optimized echarts bundle
    const { echarts } = await import('../adapters/echarts/registry')
    chartInstance.value = echarts.init(chartRef.value)
    chartInstance.value.setOption(options)
    chartReady.value = true
  } catch (error) {
    console.error('[MeldUI Charts] Failed to initialize chart:', error)
  }
}
```

**Expected bundle size reduction:** ~354KB → ~100-150KB (depending on chart types used)

### Files to Modify

- Create `packages/charts-vue/src/adapters/echarts/registry.ts`
- `packages/charts-vue/src/composables/useChartBase.ts`

---

## Improvement 11: Config Validation (LOW PRIORITY)

### Problem

Invalid configs fail silently or cause cryptic ECharts errors:

```typescript
const config = { series: [] } // Empty series
const config = { series: [{ data: 'not-an-array' }] } // Invalid type
```

### Solution

Add runtime validation with helpful error messages:

```typescript
// utils/configValidator.ts
export function validateChartConfig(config: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Config must be an object'] }
  }

  const c = config as Record<string, unknown>

  if (!Array.isArray(c.series)) {
    errors.push('config.series must be an array')
  } else if (c.series.length === 0) {
    errors.push('config.series cannot be empty')
  } else {
    c.series.forEach((s: any, i: number) => {
      if (!s.name) errors.push(`series[${i}].name is required`)
      if (!Array.isArray(s.data)) errors.push(`series[${i}].data must be an array`)
    })
  }

  return { valid: errors.length === 0, errors }
}

// Optional: Use Zod for comprehensive validation
import { z } from 'zod'

const ChartSeriesSchema = z.object({
  name: z.string().min(1, 'Series name is required'),
  data: z.union([
    z.array(z.number()),
    z.array(z.object({ x: z.union([z.string(), z.number()]), y: z.number().nullable() })),
  ]),
  color: z.string().optional(),
  type: z.enum(['line', 'bar', 'area']).optional(),
})

export const MeldChartConfigSchema = z.object({
  series: z.array(ChartSeriesSchema).min(1, 'At least one series is required'),
  xAxis: z
    .object({
      /* ... */
    })
    .optional(),
  // ... other fields
})
```

### Files to Modify

- Create `packages/charts-vue/src/utils/configValidator.ts`
- Update chart components to validate on mount/update
- Add development-only warnings (tree-shake in production)

---

## Improvement 12: Heatmap visualMap Hardcoded Values (LOW PRIORITY)

### Problem

In `transformer.ts:60-78`, heatmap min/max are hardcoded:

```typescript
visualMap: {
  min: 0,
  max: 100,  // Hardcoded - should be data-driven
}
```

### Solution

Calculate from data or accept via config:

```typescript
// types.ts
interface MeldChartConfig {
  // ...
  heatmap?: {
    min?: number
    max?: number
    gradientColors?: string[]
  }
}

// transformer.ts
function buildHeatmapConfig(config: MeldChartConfig, resolvedColors: string[]): any {
  const heatmapConfig = config.heatmap || {}

  // Calculate min/max from data if not provided
  let min = heatmapConfig.min
  let max = heatmapConfig.max

  if (min === undefined || max === undefined) {
    const allValues = config.series
      .flatMap((s) =>
        Array.isArray(s.data) ? s.data.map((d) => (typeof d === 'number' ? d : d.y)) : [],
      )
      .filter((v): v is number => v !== null)

    min = min ?? Math.min(...allValues, 0)
    max = max ?? Math.max(...allValues, 100)
  }

  return {
    visualMap: {
      min,
      max,
      calculable: true,
      // ...
    },
  }
}
```

### Files to Modify

- `packages/charts-vue/src/types.ts`
- `packages/charts-vue/src/adapters/echarts/transformer.ts`

---

## Improvement 13: Unused Loading Functions (LOW PRIORITY) - COMPLETED

> **Implementation:** Removed `showLoading` and `hideLoading` functions from `useChartBase.ts`. Skeletons are the preferred approach for initial load. ECharts loading can be added later for data refresh scenarios if needed.

### Problem

`useChartBase.ts` exports `showLoading`/`hideLoading` functions that are never used:

```typescript
const showLoading = () => {
  /* ... */
} // Exported but unused
const hideLoading = () => {
  /* ... */
} // Exported but unused
```

### Solution

Either:

**Option A: Remove unused functions**

```typescript
// Remove from useChartBase.ts
return {
  chartRef,
  chartInstance,
  chartReady,
  isSSR,
  initChart,
  updateChart,
  resizeChart,
  // Remove: showLoading, hideLoading
}
```

**Option B: Use for data refresh loading**

Use ECharts native loading for data updates while keeping skeleton for initial load:

```typescript
// In chart components
watch(
  () => props.loading,
  (isLoading) => {
    if (chartInstance.value) {
      isLoading ? showLoading() : hideLoading()
    }
  },
)
```

### Files to Modify

- `packages/charts-vue/src/composables/useChartBase.ts`
- Chart components (if Option B)

---

## Improvement 14: Chart-Type-Specific Skeletons (LOW PRIORITY) - COMPLETED

> **Implementation:** Updated `MeldChartSkeleton.vue` to render distinct skeleton shapes based on chart type:
>
> - **Cartesian** (bar, line, area, heatmap, mixed): Animated bars with axis labels
> - **Pie**: Circular skeleton with segment divider lines (SVG overlay)
> - **Donut**: Ring skeleton (circle with center hole cut out via bg-background) with segment lines
> - **Radar**: Simple circular skeleton (simplified from initial hexagon design)
> - **Scatter**: Grid lines with scattered dots of varying sizes (30-120px)

### Problem

`MeldChartSkeleton` accepts a `type` prop but renders the same bar skeleton for all chart types.

### Solution

Render different skeleton shapes based on chart type:

```vue
<!-- MeldChartSkeleton.vue -->
<template>
  <div class="meld-chart-skeleton" ...>
    <!-- Bar/Line/Area skeleton -->
    <div v-if="isCartesianType" class="skeleton-bars">
      <div v-for="i in 7" :key="i" class="skeleton-bar" ... />
    </div>

    <!-- Pie/Donut skeleton -->
    <div v-else-if="type === 'pie' || type === 'donut'" class="skeleton-pie">
      <div class="skeleton-circle" :class="{ 'skeleton-donut': type === 'donut' }" />
    </div>

    <!-- Radar skeleton -->
    <div v-else-if="type === 'radar'" class="skeleton-radar">
      <div class="skeleton-polygon" />
    </div>

    <!-- Scatter skeleton -->
    <div v-else-if="type === 'scatter'" class="skeleton-scatter">
      <div v-for="i in 12" :key="i" class="skeleton-dot" ... />
    </div>
  </div>
</template>

<script setup>
const isCartesianType = computed(() =>
  ['bar', 'line', 'area', 'heatmap', 'mixed'].includes(props.type || 'bar'),
)
</script>
```

### Files to Modify

- `packages/charts-vue/src/components/MeldChartSkeleton.vue`

---

## Implementation Phases

### Phase 1: Critical Fixes (High Priority)

- [x] Fix memory leak in `useChartTheme.ts`
- [x] Fix type duplication in `seriesTransformer.ts`
- [x] Implement `title` prop rendering (via slots: `header` and `footer`)

### Phase 2: Chart-Specific Configuration Types (High Priority - BREAKING) - COMPLETED

> **Important:** This is a breaking change and should be done before v1.0 release.

- [x] Design and document all chart-specific config interfaces
- [x] Create `ChartConfigBase` shared interface
- [x] Implement `MeldBarChartConfig`
- [x] Implement `MeldLineChartConfig`
- [x] Implement `MeldAreaChartConfig`
- [x] Implement `MeldPieChartConfig`
- [x] Implement `MeldDonutChartConfig`
- [x] Implement `MeldRadarChartConfig`
- [x] Implement `MeldHeatmapChartConfig`
- [x] Implement `MeldScatterChartConfig`
- [x] Implement `MeldMixedChartConfig`
- [x] Create discriminated union type for `MeldChart`
- [x] Update transformer to handle specific configs
- [x] Update all chart component props
- [x] Update all Storybook stories
- [x] Write migration guide documentation

### Phase 3: Event System (High Priority) - COMPLETED

- [x] Define event types in `types.ts`
- [x] Create event normalization utilities (`useChartEvents.ts` composable)
- [x] Update all chart components with event emits
- [x] Forward events in dynamic `MeldChart` component
- [x] Export new types from `index.ts`
- [x] Create Storybook story with event examples

### Phase 4: Code Quality (Medium Priority) - COMPLETED

- [x] ~~Create `createChartSetup` factory composable~~ - **SKIPPED**: Current approach is simpler. Logic is already in composables (`useChartBase`, `useChartEvents`, `useChartResize`, `useChartTheme`). The remaining boilerplate in each component is stable and explicit. Factory would add abstraction without meaningful benefit.
- [x] ~~Refactor all chart components to use factory~~ - **SKIPPED**: See above.
- [x] Remove deep watch in favor of documented pattern - **DONE**: Consolidated two deep watches into single shallow watch on `[() => props.config, chartThemeConfig]`. Users should replace config objects, not mutate nested properties (standard Vue pattern).
- [x] ~~Add `defineExpose` for chart instance access~~ - **SKIPPED**: For v1, charts are controlled entirely through props. Keeps API surface minimal. Can be added later if needed.

### Phase 5: Performance (Medium Priority) - COMPLETED

- [x] Create modular ECharts registry - Added `VisualMapComponent` and `RadarComponent` to existing registry
- [x] Update chart initialization to use registry - Updated `useChartBase.ts` to import from registry instead of full echarts
- [x] Update type imports across composables - Changed `echarts` to `echarts/core` in `useChartEvents.ts`, `useChartResize.ts`
- [x] Verify bundle works correctly
- [ ] Add bundle analysis to CI - Deferred (optional enhancement)

### Phase 6: Accessibility (Medium Priority) - PARTIAL

- [x] Add ARIA attributes to chart containers - Added `role="img"` and `aria-label` to all chart components with auto-generated descriptions
- [x] Add `ariaLabel` prop to `ChartComponentPropsBase` for custom labels
- [ ] Create accessible data table component - Deferred
- [ ] Add keyboard navigation support - Deferred
- [ ] Test with screen readers - Deferred

### Phase 7: Polish (Low Priority) - PARTIAL

- [ ] Add config validation utilities - Deferred
- [ ] Make heatmap min/max configurable - Deferred
- [x] Remove unused loading functions - Removed `showLoading`/`hideLoading` from `useChartBase.ts`. Skeletons preferred for initial load.
- [x] Implement chart-type-specific skeletons - Added distinct skeletons for: Cartesian (animated bars + axis labels), Pie (circle + SVG segments), Donut (ring with center hole), Radar (circular), Scatter (grid + varied dots 30-120px)

---

## Success Criteria

1. **No memory leaks** - Observer properly cleaned up on unmount
2. **Chart-specific configs** - Each chart type has focused, self-documenting config interface
3. **Type safety** - TypeScript provides relevant suggestions per chart type
4. **Event system** - Users can handle click, hover, legend events
5. **Code DRY** - Chart components share logic via factory
6. **No duplicate types** - Single source of truth for shared types
7. **Bundle optimized** - ~100-150KB vs ~354KB full ECharts
8. **Accessible** - WCAG 2.1 AA compliant
9. **Well documented** - All improvements reflected in Storybook + migration guide

---

## References

- [ECharts Events Documentation](https://echarts.apache.org/en/api.html#bindbindbindbindbindbindbindbindEventsbindbindEvents)
- [ECharts Tree-Shaking Guide](https://apache.github.io/echarts-handbook/en/basics/import/)
- [Vue 3 defineExpose](https://vuejs.org/api/sfc-script-setup.html#defineexpose)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
