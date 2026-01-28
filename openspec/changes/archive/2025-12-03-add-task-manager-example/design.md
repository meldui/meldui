# Design: Task Manager Example Application

## Context

This example app serves as living documentation for MeldUI consumers. It must balance:

- **Comprehensiveness** - Show most components in realistic contexts
- **Simplicity** - Easy to understand and copy patterns from
- **Maintainability** - Updates when library changes

## Goals / Non-Goals

**Goals:**

- Demonstrate all three MeldUI packages working together
- Provide copy-paste patterns for common use cases
- Show proper TypeScript usage with components
- Illustrate form validation, data tables, and charting

**Non-Goals:**

- Production backend (use LocalStorage instead)
- Authentication/authorization flows
- Complex state management (Pinia optional, not required)
- Server-side rendering

## Decisions

### 1. Project Structure

```
apps/task-manager/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.ts                 # App entry
│   ├── App.vue                 # Root component with layout
│   ├── router/
│   │   └── index.ts            # Vue Router setup
│   ├── stores/                 # Simple reactive stores (no Pinia required)
│   │   ├── tasks.ts
│   │   ├── projects.ts
│   │   └── settings.ts
│   ├── composables/            # Reusable logic
│   │   ├── useLocalStorage.ts
│   │   └── useTaskFilters.ts
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── pages/
│   │   ├── Dashboard.vue       # Overview with charts
│   │   ├── Tasks.vue           # Task list with DataTable
│   │   ├── TaskDetail.vue      # Single task view
│   │   ├── Projects.vue        # Project management
│   │   └── Settings.vue        # App settings
│   ├── components/             # App-specific compositions
│   │   ├── layout/
│   │   │   ├── AppSidebar.vue
│   │   │   ├── AppHeader.vue
│   │   │   └── AppBreadcrumb.vue
│   │   ├── tasks/
│   │   │   ├── TaskForm.vue
│   │   │   ├── TaskCard.vue
│   │   │   └── TaskFilters.vue
│   │   ├── projects/
│   │   │   └── ProjectCard.vue
│   │   └── dashboard/
│   │       ├── StatsCard.vue
│   │       └── TaskChart.vue
│   └── styles/
│       └── app.css             # App-specific styles + MeldUI theme import
```

**Rationale:** Follows Vue 3 conventions. Separates pages from components. Keeps stores simple (reactive refs) to avoid framework lock-in in examples.

### 2. State Management

**Decision:** Use Vue's native reactivity (`ref`, `reactive`, `computed`) with composables instead of Pinia.

**Rationale:**

- Simpler to understand for newcomers
- Demonstrates that MeldUI doesn't require specific state library
- LocalStorage sync via custom `useLocalStorage` composable
- Pinia can be mentioned as optional upgrade in README

### 3. Data Models

```typescript
interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  projectId: string | null
  tags: string[]
  dueDate: string | null // ISO date string
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
  description: string
  color: string // Tailwind color class
  createdAt: string
}

interface Settings {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
  defaultView: 'list' | 'board'
}
```

### 4. Component Mapping

| App Feature        | MeldUI Components                                                    |
| ------------------ | -------------------------------------------------------------------- |
| Sidebar navigation | Sidebar, Button, Separator, Tooltip                                  |
| Task list          | DataTable, Badge, Avatar, DropdownMenu, Checkbox                     |
| Task form          | Input, Textarea, Select, Combobox, Calendar, TagsInput, Button, Form |
| Task card          | Card, Badge, Avatar, Progress, DropdownMenu                          |
| Dashboard stats    | Card, Progress, CircularProgress                                     |
| Charts             | @meldui/charts-vue components                                        |
| Dialogs            | Dialog, AlertDialog, Sheet, Drawer                                   |
| Notifications      | Sonner (toast)                                                       |
| Loading states     | Skeleton, Spinner                                                    |
| Empty states       | Empty                                                                |
| Filters            | Input, Select, Combobox, Button, Popover                             |
| Breadcrumbs        | Breadcrumb                                                           |
| Tabs               | Tabs                                                                 |
| Timeline           | Timeline (task history)                                              |
| Settings           | Switch, RadioGroup, Select                                           |

### 5. Routing Structure

```typescript
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/tasks', component: Tasks },
  { path: '/tasks/:id', component: TaskDetail },
  { path: '/projects', component: Projects },
  { path: '/settings', component: Settings },
]
```

### 6. Styling Approach

- Import `@meldui/vue/themes/default` for base theme
- Import `@meldui/vue/styles` for component styles
- App-specific styles in `src/styles/app.css`
- Use Tailwind CSS v4 (same as library)
- Dark mode support via CSS variables

## Risks / Trade-offs

| Risk                       | Mitigation                                      |
| -------------------------- | ----------------------------------------------- |
| Example becomes outdated   | Include in CI build to catch breaking changes   |
| Too complex for beginners  | Add extensive code comments and README          |
| Missing component coverage | Create checklist in tasks.md to verify coverage |

## Open Questions

None - scope is well-defined.
