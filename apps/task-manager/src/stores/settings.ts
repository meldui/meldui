import { computed, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type { DefaultView, Settings, ThemeMode } from '@/types'

// Default settings
const defaultSettings: Settings = {
  theme: 'system',
  sidebarCollapsed: false,
  defaultView: 'list',
}

// Initialize store with localStorage persistence
const settings = useLocalStorage<Settings>('task-manager-settings', defaultSettings)

// Computed values
export const currentSettings = computed(() => settings.value)
export const theme = computed(() => settings.value.theme)
export const sidebarCollapsed = computed(() => settings.value.sidebarCollapsed)
export const defaultView = computed(() => settings.value.defaultView)

// Actions
export function setTheme(newTheme: ThemeMode): void {
  settings.value = { ...settings.value, theme: newTheme }
  applyTheme(newTheme)
}

export function toggleSidebar(): void {
  settings.value = { ...settings.value, sidebarCollapsed: !settings.value.sidebarCollapsed }
}

export function setSidebarCollapsed(collapsed: boolean): void {
  settings.value = { ...settings.value, sidebarCollapsed: collapsed }
}

export function setDefaultView(view: DefaultView): void {
  settings.value = { ...settings.value, defaultView: view }
}

export function resetSettings(): void {
  settings.value = { ...defaultSettings }
  applyTheme(defaultSettings.theme)
}

// Theme application
function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

// Initialize theme on load
export function initializeTheme(): void {
  applyTheme(settings.value.theme)

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (settings.value.theme === 'system') {
      document.documentElement.classList.toggle('dark', e.matches)
    }
  })
}

// Watch for theme changes
watch(
  () => settings.value.theme,
  (newTheme) => applyTheme(newTheme),
)
