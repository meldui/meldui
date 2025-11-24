// Base composable for chart lifecycle management
import { ref, shallowRef, onUnmounted, nextTick } from 'vue'
import type { EChartsType, EChartsOption } from 'echarts'

export function useChartBase() {
  const chartRef = ref<HTMLElement | null>(null)
  const chartInstance = shallowRef<EChartsType | null>(null)
  const chartReady = ref(false)
  const isSSR = typeof window === 'undefined'

  /**
   * Initialize chart with ECharts options
   * Handles SSR gracefully by skipping initialization
   */
  const initChart = async (options: EChartsOption) => {
    // Skip initialization during SSR
    if (isSSR) return

    // Wait for component mount
    await nextTick()

    if (!chartRef.value) return

    try {
      // Dynamic import to avoid bundling during SSR
      const echarts = await import('echarts')

      // Initialize chart instance
      chartInstance.value = echarts.init(chartRef.value)
      chartInstance.value.setOption(options)

      chartReady.value = true
    } catch (error) {
      console.error('[MeldUI Charts] Failed to initialize chart:', error)
    }
  }

  /**
   * Update chart options
   */
  const updateChart = (options: EChartsOption, notMerge = false) => {
    if (!chartInstance.value) return

    try {
      chartInstance.value.setOption(options, notMerge)
    } catch (error) {
      console.error('[MeldUI Charts] Failed to update chart:', error)
    }
  }

  /**
   * Resize chart to fit container
   */
  const resizeChart = () => {
    if (!chartInstance.value) return

    try {
      chartInstance.value.resize()
    } catch (error) {
      console.error('[MeldUI Charts] Failed to resize chart:', error)
    }
  }

  /**
   * Show loading animation
   */
  const showLoading = () => {
    if (!chartInstance.value) return
    chartInstance.value.showLoading()
  }

  /**
   * Hide loading animation
   */
  const hideLoading = () => {
    if (!chartInstance.value) return
    chartInstance.value.hideLoading()
  }

  /**
   * Cleanup chart instance on unmount
   */
  onUnmounted(() => {
    if (chartInstance.value) {
      chartInstance.value.dispose()
      chartInstance.value = null
    }
  })

  return {
    chartRef,
    chartInstance,
    chartReady,
    isSSR,
    initChart,
    updateChart,
    resizeChart,
    showLoading,
    hideLoading,
  }
}
