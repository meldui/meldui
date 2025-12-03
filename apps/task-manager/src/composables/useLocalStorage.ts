import { type Ref, ref, watch } from 'vue'

/**
 * Reactive localStorage composable
 * Syncs a ref with localStorage, persisting changes automatically
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  // Try to get existing value from localStorage
  const storedValue = localStorage.getItem(key)
  const initial = storedValue ? (JSON.parse(storedValue) as T) : defaultValue

  const data = ref<T>(initial) as Ref<T>

  // Watch for changes and sync to localStorage
  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true },
  )

  return data
}

/**
 * Clear all app data from localStorage
 */
export function clearAllStorage(): void {
  const keys = ['task-manager-tasks', 'task-manager-projects', 'task-manager-settings']
  keys.forEach((key) => localStorage.removeItem(key))
}

/**
 * Export all app data as JSON string
 */
export function exportData(): string {
  const data = {
    tasks: JSON.parse(localStorage.getItem('task-manager-tasks') || '[]'),
    projects: JSON.parse(localStorage.getItem('task-manager-projects') || '[]'),
    settings: JSON.parse(localStorage.getItem('task-manager-settings') || '{}'),
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(data, null, 2)
}

/**
 * Import data from JSON string
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString)
    if (data.tasks) localStorage.setItem('task-manager-tasks', JSON.stringify(data.tasks))
    if (data.projects) localStorage.setItem('task-manager-projects', JSON.stringify(data.projects))
    if (data.settings) localStorage.setItem('task-manager-settings', JSON.stringify(data.settings))
    return true
  } catch {
    return false
  }
}
