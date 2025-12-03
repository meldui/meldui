import { computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import type { Project } from '@/types'
import { getTasksByProject } from './tasks'

// Generate unique ID
function generateId(): string {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Sample demo projects
const demoProjects: Project[] = [
  {
    id: 'project-demo-1',
    name: 'Getting Started',
    description: 'Initial setup and learning resources for MeldUI',
    color: 'blue',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'project-demo-2',
    name: 'Feature Development',
    description: 'Building new features for the task manager app',
    color: 'green',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'project-demo-3',
    name: 'Design Review',
    description: 'UI/UX improvements and design system maintenance',
    color: 'purple',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Initialize store with localStorage persistence
const projects = useLocalStorage<Project[]>('task-manager-projects', demoProjects)

// Computed values
export const allProjects = computed(() => projects.value)

export const projectsWithStats = computed(() =>
  projects.value.map((project) => {
    const tasks = getTasksByProject(project.id)
    const done = tasks.filter((t) => t.status === 'done').length
    return {
      ...project,
      taskCount: tasks.length,
      completedCount: done,
      progress: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
    }
  }),
)

// Actions
export function addProject(data: Omit<Project, 'id' | 'createdAt'>): Project {
  const project: Project = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }
  projects.value = [...projects.value, project]
  return project
}

export function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'createdAt'>>,
): Project | null {
  const index = projects.value.findIndex((p) => p.id === id)
  if (index === -1) return null

  const updatedProject = { ...projects.value[index], ...updates }
  projects.value = [
    ...projects.value.slice(0, index),
    updatedProject,
    ...projects.value.slice(index + 1),
  ]
  return updatedProject
}

export function deleteProject(id: string): boolean {
  const index = projects.value.findIndex((p) => p.id === id)
  if (index === -1) return false

  projects.value = [...projects.value.slice(0, index), ...projects.value.slice(index + 1)]
  return true
}

export function getProject(id: string): Project | undefined {
  return projects.value.find((p) => p.id === id)
}

// Available colors for projects
export const projectColors = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
] as const
