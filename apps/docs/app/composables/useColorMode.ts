type ColorMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'meldui-color-mode'

const colorMode = ref<ColorMode>('system')

function applyMode(mode: ColorMode) {
  if (import.meta.server) return

  let isDark = false
  if (mode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  } else {
    isDark = mode === 'dark'
  }

  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function useColorMode() {
  if (import.meta.client) {
    // Initialize from localStorage
    const stored = localStorage.getItem(STORAGE_KEY) as ColorMode | null
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      colorMode.value = stored
    }

    // Watch for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (colorMode.value === 'system') {
        applyMode('system')
      }
    })
  }

  function setMode(mode: ColorMode) {
    colorMode.value = mode
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, mode)
      applyMode(mode)
    }
  }

  watch(colorMode, (newMode) => {
    applyMode(newMode)
  })

  return {
    mode: colorMode,
    setMode,
  }
}
