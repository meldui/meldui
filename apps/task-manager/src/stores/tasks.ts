import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Task, TaskPriority, TaskStatus } from '@/types'

// Generate unique ID
function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Sample demo tasks
const demoTasks: Task[] = [
  {
    id: 'task-demo-1',
    title: 'Review MeldUI documentation',
    description:
      'Go through the component library documentation and understand available components.',
    status: 'done',
    priority: 'high',
    projectId: 'project-demo-1',
    tags: ['documentation', 'onboarding'],
    dueDate: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-demo-2',
    title: 'Set up development environment',
    description: 'Install dependencies, configure IDE, and run the example app locally.',
    status: 'done',
    priority: 'high',
    projectId: 'project-demo-1',
    tags: ['setup', 'development'],
    dueDate: null,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-demo-3',
    title: 'Implement user dashboard',
    description:
      'Create the main dashboard with stats cards, charts, and recent activity timeline.',
    status: 'in-progress',
    priority: 'high',
    projectId: 'project-demo-2',
    tags: ['feature', 'dashboard'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-demo-4',
    title: 'Add form validation',
    description: 'Integrate vee-validate with zod for comprehensive form validation.',
    status: 'in-progress',
    priority: 'medium',
    projectId: 'project-demo-2',
    tags: ['feature', 'forms'],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-demo-5',
    title: 'Write unit tests',
    description: 'Add tests for critical components and utility functions.',
    status: 'todo',
    priority: 'medium',
    projectId: 'project-demo-2',
    tags: ['testing', 'quality'],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'task-demo-6',
    title: 'Design system review',
    description: 'Review color palette, typography, and spacing for consistency.',
    status: 'todo',
    priority: 'low',
    projectId: 'project-demo-3',
    tags: ['design', 'review'],
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-demo-7',
    title: 'Performance optimization',
    description: 'Profile the app and optimize slow components using Vue DevTools.',
    status: 'todo',
    priority: 'low',
    projectId: 'project-demo-2',
    tags: ['performance', 'optimization'],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Initialize store with localStorage persistence
const tasks = useLocalStorage<Task[]>('task-manager-tasks', demoTasks)

// Computed values
export const allTasks = computed(() => tasks.value)

export const tasksByStatus = computed(() => ({
  todo: tasks.value.filter((t) => t.status === 'todo'),
  'in-progress': tasks.value.filter((t) => t.status === 'in-progress'),
  done: tasks.value.filter((t) => t.status === 'done'),
}))

export const taskStats = computed(() => ({
  total: tasks.value.length,
  todo: tasks.value.filter((t) => t.status === 'todo').length,
  inProgress: tasks.value.filter((t) => t.status === 'in-progress').length,
  done: tasks.value.filter((t) => t.status === 'done').length,
  overdue: tasks.value.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done',
  ).length,
}))

// Actions
export function addTask(data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const now = new Date().toISOString()
  const task: Task = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  tasks.value = [...tasks.value, task]
  return task
}

export function updateTask(
  id: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>,
): Task | null {
  const index = tasks.value.findIndex((t) => t.id === id)
  if (index === -1) return null

  const updatedTask = {
    ...tasks.value[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  tasks.value = [...tasks.value.slice(0, index), updatedTask, ...tasks.value.slice(index + 1)]
  return updatedTask
}

export function deleteTask(id: string): boolean {
  const index = tasks.value.findIndex((t) => t.id === id)
  if (index === -1) return false

  tasks.value = [...tasks.value.slice(0, index), ...tasks.value.slice(index + 1)]
  return true
}

export function getTask(id: string): Task | undefined {
  return tasks.value.find((t) => t.id === id)
}

export function getTasksByProject(projectId: string): Task[] {
  return tasks.value.filter((t) => t.projectId === projectId)
}

export function updateTaskStatus(id: string, status: TaskStatus): Task | null {
  return updateTask(id, { status })
}

export function updateTaskPriority(id: string, priority: TaskPriority): Task | null {
  return updateTask(id, { priority })
}

// Bulk actions
export function deleteTasks(ids: string[]): number {
  const initialLength = tasks.value.length
  tasks.value = tasks.value.filter((t) => !ids.includes(t.id))
  return initialLength - tasks.value.length
}

export function updateTasksStatus(ids: string[], status: TaskStatus): number {
  let count = 0
  tasks.value = tasks.value.map((t) => {
    if (ids.includes(t.id)) {
      count++
      return { ...t, status, updatedAt: new Date().toISOString() }
    }
    return t
  })
  return count
}
