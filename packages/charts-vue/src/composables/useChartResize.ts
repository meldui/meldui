// Chart resize composable using ResizeObserver

import type { EChartsType } from 'echarts'
import { onMounted, onUnmounted, type Ref, ref } from 'vue'

/**
 * Automatic chart resizing using ResizeObserver API
 * Falls back to window resize events for older browsers
 */
export function useChartResize(
  containerRef: Ref<HTMLElement | null>,
  chartInstance: Ref<EChartsType | null>,
) {
  const resizeObserver = ref<ResizeObserver | null>(null)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  /**
   * Handle resize events
   */
  const handleResize = (entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect

      // Update container dimensions
      containerWidth.value = width
      containerHeight.value = height

      // Resize chart if initialized
      if (chartInstance.value) {
        try {
          chartInstance.value.resize({
            width,
            height: height || undefined,
          })
        } catch (error) {
          console.error('[MeldUI Charts] Failed to resize chart:', error)
        }
      }
    }
  }

  /**
   * Fallback resize handler for older browsers
   */
  const handleWindowResize = () => {
    if (!containerRef.value || !chartInstance.value) return

    try {
      const { width, height } = containerRef.value.getBoundingClientRect()
      containerWidth.value = width
      containerHeight.value = height

      chartInstance.value.resize({
        width,
        height: height || undefined,
      })
    } catch (error) {
      console.error('[MeldUI Charts] Failed to resize chart:', error)
    }
  }

  /**
   * Debounce helper for window resize
   */
  const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  }

  const debouncedWindowResize = debounce(handleWindowResize, 250)

  onMounted(() => {
    if (!containerRef.value) return

    // Check for ResizeObserver support
    const hasResizeObserver = typeof ResizeObserver !== 'undefined'

    if (hasResizeObserver) {
      // Use ResizeObserver (preferred, more efficient)
      resizeObserver.value = new ResizeObserver(handleResize)
      resizeObserver.value.observe(containerRef.value)
    } else if (typeof window !== 'undefined') {
      // Fallback to window resize event
      window.addEventListener('resize', debouncedWindowResize)
    }
  })

  onUnmounted(() => {
    // Cleanup ResizeObserver
    if (resizeObserver.value) {
      resizeObserver.value.disconnect()
      resizeObserver.value = null
    }

    // Cleanup window resize listener
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', debouncedWindowResize)
    }
  })

  return {
    containerWidth,
    containerHeight,
  }
}
