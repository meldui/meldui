// Task Management Types

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type ThemeMode = 'light' | 'dark' | 'system'
export type DefaultView = 'list' | 'board'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string | null
  tags: string[]
  dueDate: string | null // ISO date string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  color: string // Tailwind color class (e.g., 'blue', 'green', 'red')
  createdAt: string
}

export interface Settings {
  theme: ThemeMode
  sidebarCollapsed: boolean
  defaultView: DefaultView
}

// Helper type for task history entries
export interface TaskHistoryEntry {
  id: string
  taskId: string
  action: 'created' | 'updated' | 'status-changed' | 'deleted'
  description: string
  timestamp: string
}

// Form types for validation
export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string | null
  tags: string[]
  dueDate: string | null
}

export interface ProjectFormData {
  name: string
  description: string
  color: string
}
