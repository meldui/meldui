// Theme integration composable
import { computed, onUnmounted, ref } from 'vue'

// Default color palette (fallback for SSR)
const DEFAULT_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
}

export function useChartTheme() {
  // Detect dark mode
  const isDark = ref(false)

  // Track observer for cleanup
  let observer: MutationObserver | null = null

  // Update dark mode detection
  const updateDarkMode = () => {
    if (typeof document === 'undefined') {
      isDark.value = false
      return
    }
    isDark.value = document.documentElement.classList.contains('dark')
  }

  // Initial dark mode check
  updateDarkMode()

  // Watch for theme changes (if MutationObserver is available)
  if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(updateDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }

  // Cleanup observer on component unmount
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  // Extract Tailwind CSS v4 theme colors
  const themeColors = computed(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_COLORS // Fallback for SSR
    }

    const style = getComputedStyle(document.documentElement)

    return {
      primary: style.getPropertyValue('--color-primary')?.trim() || DEFAULT_COLORS.primary,
      success: style.getPropertyValue('--color-success')?.trim() || DEFAULT_COLORS.success,
      warning: style.getPropertyValue('--color-warning')?.trim() || DEFAULT_COLORS.warning,
      danger: style.getPropertyValue('--color-danger')?.trim() || DEFAULT_COLORS.danger,
      info: style.getPropertyValue('--color-info')?.trim() || DEFAULT_COLORS.info,
      purple: style.getPropertyValue('--color-purple')?.trim() || DEFAULT_COLORS.purple,
      pink: style.getPropertyValue('--color-pink')?.trim() || DEFAULT_COLORS.pink,
    }
  })

  // Generate theme configuration for ECharts
  const chartThemeConfig = computed(() => ({
    mode: isDark.value ? ('dark' as const) : ('light' as const),
    palette: Object.values(themeColors.value),
  }))

  return {
    isDark,
    themeColors,
    chartThemeConfig,
  }
}
