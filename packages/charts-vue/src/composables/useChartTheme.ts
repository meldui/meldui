// Theme integration composable
import { computed, onUnmounted, ref } from 'vue'

// Default series color palette (fallback for SSR)
const DEFAULT_PALETTE = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  purple: '#8b5cf6',
  pink: '#ec4899',
}

// Default text colors (not used in series palette)
const DEFAULT_TEXT_COLORS = {
  mutedForeground: '#6b7280',
  foreground: '#111827',
}

/**
 * Resolve a CSS color value (oklch, hsl, etc.) to an rgb string that canvas can render.
 * Uses a temporary DOM element to let the browser do the conversion.
 */
function resolveColor(value: string): string {
  if (!value || typeof document === 'undefined') return value
  const el = document.createElement('div')
  el.style.color = value
  document.body.appendChild(el)
  const resolved = getComputedStyle(el).color
  document.body.removeChild(el)
  return resolved || value
}

export function useChartTheme() {
  // Detect dark mode
  const isDark = ref(false)

  // Track observer for cleanup
  let observer: MutationObserver | null = null

  // Update dark mode detection
  // Check both <html> and <body> — apps may set the `dark` class on either element
  const updateDarkMode = () => {
    if (typeof document === 'undefined') {
      isDark.value = false
      return
    }
    isDark.value =
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark')
  }

  // Initial dark mode check
  updateDarkMode()

  // Watch for theme changes on both <html> and <body>
  if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
    observer = new MutationObserver(updateDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    observer.observe(document.body, {
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
  // Access isDark.value to create reactive dependency — recompute when theme changes
  const themeColors = computed(() => {
    if (typeof window === 'undefined') {
      return { ...DEFAULT_PALETTE, ...DEFAULT_TEXT_COLORS } // Fallback for SSR
    }

    // Read from <body> — CSS variables may be scoped to body.dark, not html.dark
    const style = getComputedStyle(document.body)

    return {
      primary: style.getPropertyValue('--color-primary')?.trim() || DEFAULT_PALETTE.primary,
      success: style.getPropertyValue('--color-success')?.trim() || DEFAULT_PALETTE.success,
      warning: style.getPropertyValue('--color-warning')?.trim() || DEFAULT_PALETTE.warning,
      danger: style.getPropertyValue('--color-danger')?.trim() || DEFAULT_PALETTE.danger,
      info: style.getPropertyValue('--color-info')?.trim() || DEFAULT_PALETTE.info,
      purple: style.getPropertyValue('--color-purple')?.trim() || DEFAULT_PALETTE.purple,
      pink: style.getPropertyValue('--color-pink')?.trim() || DEFAULT_PALETTE.pink,
      mutedForeground: resolveColor(
        style.getPropertyValue('--muted-foreground')?.trim() || DEFAULT_TEXT_COLORS.mutedForeground,
      ),
      foreground: resolveColor(
        style.getPropertyValue('--foreground')?.trim() || DEFAULT_TEXT_COLORS.foreground,
      ),
    }
  })

  // Generate theme configuration for ECharts
  const chartThemeConfig = computed(() => {
    const { mutedForeground, foreground, ...paletteColors } = themeColors.value
    return {
      mode: isDark.value ? ('dark' as const) : ('light' as const),
      palette: Object.values(paletteColors),
      mutedForeground,
      foreground,
    }
  })

  return {
    isDark,
    themeColors,
    chartThemeConfig,
  }
}
