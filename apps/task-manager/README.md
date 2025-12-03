# Task Manager - MeldUI Example Application

A comprehensive example application demonstrating how to use [@meldui/vue](../../packages/vue), [@meldui/tabler-vue](../../packages/tabler-vue), and [@meldui/charts-vue](../../packages/charts-vue) in a real-world Vue 3 application.

## Features

- **Dashboard** - Overview with stats, charts, and recent activity
- **Tasks** - Full CRUD with DataTable, filtering, sorting, and pagination
- **Projects** - Organize tasks with color-coded projects
- **Settings** - Theme switching, preferences, data export/import

## Getting Started

```bash
# From the monorepo root
pnpm install
pnpm dev:example

# Or from this directory
pnpm dev
```

The app will be available at `http://localhost:5173`

## Tech Stack

- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Vue Router** for multi-page navigation
- **Tailwind CSS v4** for styling
- **vee-validate + zod** for form validation
- **LocalStorage** for data persistence

## Component Usage

This example demonstrates the following MeldUI components:

### UI Components

| Component | Usage Location |
|-----------|----------------|
| Accordion | - |
| Alert | - |
| AlertDialog | Task deletion, Data clearing |
| Avatar | Header, Dashboard |
| Badge | Task status, Task tags |
| Breadcrumb | Navigation |
| Button | Throughout |
| Calendar | Task form due date |
| Card | Dashboard stats, Project cards |
| Checkbox | Task selection |
| Dialog | Task creation/editing |
| DropdownMenu | User menu, Task actions |
| Empty | No tasks/projects state |
| Form | Task form, Project form |
| Input | Search, Task title |
| Label | Form fields |
| Pagination | Task list |
| Popover | Filters, Date picker |
| Progress | Project completion |
| RadioGroup | Theme selection, Project colors |
| Select | Status, Priority, Project filters |
| Separator | Sidebar, Headers |
| Sheet | Project form |
| Sidebar | Main navigation |
| Skeleton | Loading states |
| Switch | Theme toggle |
| Table | Task list |
| Tabs | Settings page |
| TagsInput | Task tags |
| Textarea | Task description |
| Timeline | Recent activity, Task history |
| Tooltip | Sidebar icons |

### Composite Components

| Component | Usage Location |
|-----------|----------------|
| DataTable | Task list (via Table + sorting) |
| RelativeTime | Task dates, Activity timestamps |
| Timeline | Dashboard, Task detail |

### Icon Package

`@meldui/tabler-vue` icons are used throughout for:
- Navigation icons (Dashboard, Tasks, Projects, Settings)
- Action icons (Plus, Edit, Delete, Search)
- Status icons (Check, Progress, Circle)
- Priority icons (Arrow up/down)

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # App shell (Sidebar, Header, Breadcrumb)
│   ├── projects/       # Project form and card
│   └── tasks/          # Task form, filters, card
├── composables/        # Reusable logic (useLocalStorage)
├── pages/              # Route pages
├── router/             # Vue Router setup
├── stores/             # Reactive state (tasks, projects, settings)
├── styles/             # CSS with Tailwind + MeldUI imports
└── types/              # TypeScript interfaces
```

## Patterns Demonstrated

### Form Validation

```vue
<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(1, 'Required'),
})

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(schema),
})
</script>
```

### LocalStorage Persistence

```typescript
import { useLocalStorage } from '@/composables/useLocalStorage'

const tasks = useLocalStorage<Task[]>('task-manager-tasks', [])
// Automatically syncs to localStorage on changes
```

### Theme Switching

```typescript
import { setTheme } from '@/stores/settings'

setTheme('dark') // 'light' | 'dark' | 'system'
```

### Icon Usage

```vue
<script setup>
import { IconPlus, IconTrash } from '@meldui/tabler-vue'
</script>

<template>
  <Button>
    <IconPlus class="mr-2 h-4 w-4" />
    Add Task
  </Button>
</template>
```

## Data Models

```typescript
interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  projectId: string | null
  tags: string[]
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
}
```

## License

MIT - This is an example application for demonstration purposes.
