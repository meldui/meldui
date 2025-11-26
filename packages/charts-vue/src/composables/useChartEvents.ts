// Composable for handling chart events with normalized API
// Converts ECharts event format to MeldUI's normalized event types

import type { EChartsType } from 'echarts'
import type { ShallowRef } from 'vue'
import { onUnmounted, watch } from 'vue'
import type {
  ChartBrushSelectEvent,
  ChartClickEvent,
  ChartDataZoomEvent,
  ChartHoverEvent,
  ChartLegendSelectEvent,
  ChartMouseOutEvent,
} from '../types'

// ECharts event parameter types (internal, not exposed to users)
interface EChartsEventParams {
  componentType?: string
  seriesType?: string
  seriesIndex?: number
  seriesName?: string
  name?: string
  dataIndex?: number
  data?: unknown
  value?: unknown
  color?: string
  event?: {
    offsetX?: number
    offsetY?: number
  }
}

interface EChartsLegendParams {
  name?: string
  selected?: Record<string, boolean>
}

interface EChartsDataZoomParams {
  start?: number
  end?: number
  startValue?: number | string
  endValue?: number | string
  batch?: Array<{
    start?: number
    end?: number
    startValue?: number | string
    endValue?: number | string
  }>
}

interface EChartsBrushParams {
  areas?: Array<{
    brushType?: 'rect' | 'polygon' | 'lineX' | 'lineY'
    coordRange?: number[][]
    coordRanges?: number[][][]
  }>
  batch?: Array<{
    seriesIndex?: number
    dataIndex?: number[]
  }>
}

/**
 * Emit function type that matches Vue's emit signature
 */
type EmitFn = {
  (e: 'click', event: ChartClickEvent): void
  (e: 'hover', event: ChartHoverEvent): void
  (e: 'mouseout', event: ChartMouseOutEvent): void
  (e: 'legendSelect', event: ChartLegendSelectEvent): void
  (e: 'dataZoom', event: ChartDataZoomEvent): void
  (e: 'brushSelect', event: ChartBrushSelectEvent): void
}

/**
 * Normalize ECharts click/hover event to MeldUI format
 */
function normalizeClickEvent(params: EChartsEventParams): ChartClickEvent {
  return {
    seriesName: params.seriesName || '',
    dataIndex: params.dataIndex ?? -1,
    value: normalizeValue(params.value),
    name: params.name || '',
    componentType: normalizeComponentType(params.componentType),
    seriesIndex: params.seriesIndex ?? -1,
    raw: params,
  }
}

/**
 * Normalize ECharts hover event to MeldUI format
 */
function normalizeHoverEvent(params: EChartsEventParams): ChartHoverEvent {
  return {
    seriesName: params.seriesName || '',
    dataIndex: params.dataIndex ?? -1,
    value: normalizeValue(params.value),
    name: params.name || '',
    seriesIndex: params.seriesIndex ?? -1,
    raw: params,
  }
}

/**
 * Normalize ECharts mouseout event to MeldUI format
 */
function normalizeMouseOutEvent(params: EChartsEventParams): ChartMouseOutEvent {
  return {
    seriesName: params.seriesName || '',
    dataIndex: params.dataIndex ?? -1,
    seriesIndex: params.seriesIndex ?? -1,
    raw: params,
  }
}

/**
 * Normalize ECharts legend event to MeldUI format
 */
function normalizeLegendEvent(params: EChartsLegendParams): ChartLegendSelectEvent {
  return {
    name: params.name || '',
    selected: params.selected || {},
    raw: params,
  }
}

/**
 * Normalize ECharts datazoom event to MeldUI format
 */
function normalizeDataZoomEvent(params: EChartsDataZoomParams): ChartDataZoomEvent {
  // Handle batch events (from inside datazoom component)
  const batch = params.batch?.[0]
  return {
    start: batch?.start ?? params.start ?? 0,
    end: batch?.end ?? params.end ?? 100,
    startValue: batch?.startValue ?? params.startValue,
    endValue: batch?.endValue ?? params.endValue,
    raw: params,
  }
}

/**
 * Normalize ECharts brush event to MeldUI format
 */
function normalizeBrushEvent(params: EChartsBrushParams): ChartBrushSelectEvent {
  return {
    areas: (params.areas || []).map((area) => ({
      brushType: area.brushType || 'rect',
      coordRange: area.coordRange || [],
      coordRanges: area.coordRanges,
    })),
    batch: (params.batch || []).map((item) => ({
      seriesIndex: item.seriesIndex ?? 0,
      dataIndex: item.dataIndex || [],
    })),
    raw: params,
  }
}

/**
 * Normalize value to expected format
 */
function normalizeValue(
  value: unknown,
): number | [number, number] | [string | number, string | number, number] {
  if (typeof value === 'number') {
    return value
  }
  if (Array.isArray(value)) {
    if (value.length === 2) {
      return value as [number, number]
    }
    if (value.length === 3) {
      return value as [string | number, string | number, number]
    }
    // Return first number if array has other length
    return typeof value[0] === 'number' ? value[0] : 0
  }
  // For object values (like { value: number }), extract the value
  if (value && typeof value === 'object' && 'value' in value) {
    return normalizeValue((value as { value: unknown }).value)
  }
  return 0
}

/**
 * Normalize component type string
 */
function normalizeComponentType(type?: string): 'series' | 'markPoint' | 'markLine' | 'markArea' {
  switch (type) {
    case 'markPoint':
      return 'markPoint'
    case 'markLine':
      return 'markLine'
    case 'markArea':
      return 'markArea'
    default:
      return 'series'
  }
}

/**
 * Composable for setting up chart event handlers.
 * Attaches normalized event listeners to an ECharts instance.
 *
 * @param chartInstance - ShallowRef to the ECharts instance
 * @param emit - Vue emit function for the component
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * const emit = defineEmits<ChartEmits>()
 * const { chartInstance } = useChartBase()
 *
 * useChartEvents(chartInstance, emit)
 * </script>
 * ```
 */
export function useChartEvents(chartInstance: ShallowRef<EChartsType | null>, emit: EmitFn) {
  // Track if we've set up listeners (to avoid duplicates)
  let listenersAttached = false

  /**
   * Attach event listeners to the chart instance
   */
  const setupEventListeners = (instance: EChartsType) => {
    if (listenersAttached) return

    // Click event
    // biome-ignore lint/suspicious/noExplicitAny: ECharts event types are incompatible with our normalized types
    instance.on('click', (params: any) => {
      emit('click', normalizeClickEvent(params as EChartsEventParams))
    })

    // Hover event (mouseover)
    // biome-ignore lint/suspicious/noExplicitAny: ECharts event types are incompatible with our normalized types
    instance.on('mouseover', (params: any) => {
      emit('hover', normalizeHoverEvent(params as EChartsEventParams))
    })

    // Mouseout event
    // biome-ignore lint/suspicious/noExplicitAny: ECharts event types are incompatible with our normalized types
    instance.on('mouseout', (params: any) => {
      emit('mouseout', normalizeMouseOutEvent(params as EChartsEventParams))
    })

    // Legend selection change
    // biome-ignore lint/suspicious/noExplicitAny: ECharts event types are incompatible with our normalized types
    instance.on('legendselectchanged', (params: any) => {
      emit('legendSelect', normalizeLegendEvent(params as EChartsLegendParams))
    })

    // Data zoom change
    // biome-ignore lint/suspicious/noExplicitAny: ECharts event types are incompatible with our normalized types
    instance.on('datazoom', (params: any) => {
      emit('dataZoom', normalizeDataZoomEvent(params as EChartsDataZoomParams))
    })

    // Brush selection (if brush tool is enabled)
    // biome-ignore lint/suspicious/noExplicitAny: ECharts event types are incompatible with our normalized types
    instance.on('brushselected', (params: any) => {
      emit('brushSelect', normalizeBrushEvent(params as EChartsBrushParams))
    })

    listenersAttached = true
  }

  /**
   * Remove all event listeners from the chart instance
   */
  const removeEventListeners = (instance: EChartsType) => {
    if (!listenersAttached) return

    instance.off('click')
    instance.off('mouseover')
    instance.off('mouseout')
    instance.off('legendselectchanged')
    instance.off('datazoom')
    instance.off('brushselected')

    listenersAttached = false
  }

  // Watch for chart instance changes and setup listeners
  watch(
    () => chartInstance.value,
    (newInstance, oldInstance) => {
      // Clean up old instance listeners
      if (oldInstance) {
        removeEventListeners(oldInstance)
      }

      // Setup new instance listeners
      if (newInstance) {
        setupEventListeners(newInstance)
      }
    },
    { immediate: true },
  )

  // Cleanup on unmount
  onUnmounted(() => {
    if (chartInstance.value) {
      removeEventListeners(chartInstance.value)
    }
  })

  return {
    setupEventListeners,
    removeEventListeners,
  }
}
