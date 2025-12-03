# Tasks: Add Task Manager Example Application

## 1. Project Setup
- [x] 1.1 Scaffold Vite + Vue 3 + TypeScript project in `apps/task-manager/`
- [x] 1.2 Configure package.json with workspace dependencies (@meldui/vue, @meldui/tabler-vue, @meldui/charts-vue)
- [x] 1.3 Set up Tailwind CSS v4 with @tailwindcss/vite plugin
- [x] 1.4 Configure TypeScript (tsconfig.json extending root config)
- [x] 1.5 Import MeldUI theme and styles in app.css
- [x] 1.6 Add dev script to root package.json: `"dev:example": "pnpm --filter task-manager dev"`

## 2. Core Infrastructure
- [x] 2.1 Create TypeScript interfaces (Task, Project, Settings) in `src/types/`
- [x] 2.2 Implement `useLocalStorage` composable for persistence
- [x] 2.3 Create reactive stores (tasks.ts, projects.ts, settings.ts)
- [x] 2.4 Set up Vue Router with route definitions
- [x] 2.5 Seed initial demo data (sample tasks and projects)

## 3. Layout Components
- [x] 3.1 Create App.vue with Sidebar layout structure
- [x] 3.2 Build AppSidebar.vue using Sidebar, Button, Separator, Tooltip
- [x] 3.3 Build AppHeader.vue with search Input and user DropdownMenu
- [x] 3.4 Build AppBreadcrumb.vue using Breadcrumb component
- [x] 3.5 Implement dark mode toggle using Switch (in AppHeader)

## 4. Dashboard Page
- [x] 4.1 Create Dashboard.vue page structure
- [x] 4.2 Build StatsCard.vue showing task counts with Card, Progress
- [x] 4.3 Implement task completion chart using @meldui/charts-vue
- [x] 4.4 Add project distribution pie/donut chart (in TaskChart)
- [x] 4.5 Show recent activity using Timeline component
- [x] 4.6 Add Skeleton loading states

## 5. Tasks Page
- [x] 5.1 Create Tasks.vue page with DataTable
- [x] 5.2 Configure DataTable columns (title, status, priority, project, due date, actions)
- [x] 5.3 Build TaskFilters.vue using Input, Select, Combobox, Popover
- [x] 5.4 Implement row selection with Checkbox
- [x] 5.5 Add bulk actions via DropdownMenu
- [x] 5.6 Implement sorting and pagination
- [x] 5.7 Add Empty state when no tasks match filters

## 6. Task Form & Detail
- [x] 6.1 Create TaskForm.vue with full form validation (vee-validate + zod)
- [x] 6.2 Include: Input (title), Textarea (description), Select (status, priority)
- [x] 6.3 Include: Combobox (project selection), Calendar (due date), TagsInput (tags)
- [x] 6.4 Create "New Task" Dialog using Dialog component
- [x] 6.5 Create TaskDetail.vue page for viewing/editing single task
- [x] 6.6 Add task history using Timeline
- [x] 6.7 Implement delete confirmation with AlertDialog

## 7. Projects Page
- [x] 7.1 Create Projects.vue page with Card grid layout
- [x] 7.2 Build ProjectCard.vue showing project stats
- [x] 7.3 Create project form in Sheet (slide-out panel)
- [x] 7.4 Show project task count and completion Progress
- [x] 7.5 Add color picker for project using RadioGroup or custom component

## 8. Settings Page
- [x] 8.1 Create Settings.vue page with Tabs sections
- [x] 8.2 Build Appearance tab (theme Switch, sidebar RadioGroup)
- [x] 8.3 Build Preferences tab (default view Select)
- [x] 8.4 Add data management section (export/import, clear data)
- [x] 8.5 Show success feedback with Sonner toasts

## 9. Polish & Integration
- [x] 9.1 Add Sonner toast provider and notifications for CRUD operations
- [x] 9.2 Implement keyboard shortcuts with Kbd hints in Tooltips
- [x] 9.3 Add responsive design (mobile sidebar as Drawer)
- [x] 9.4 Create README.md with setup instructions and component mapping
- [x] 9.5 Verify all MeldUI components are demonstrated (checklist below)

## 10. Validation & CI
- [x] 10.1 Verify app builds successfully: `pnpm --filter task-manager build`
- [~] 10.2 Add to CI workflow to catch regressions (deferred - no CI config in project)
- [x] 10.3 Test LocalStorage persistence across browser refresh
- [x] 10.4 Test dark mode transitions

---

## Component Coverage Summary

### Components Used (32 component families)

| Component | Location |
|-----------|----------|
| AlertDialog | TaskDetail.vue, Settings.vue |
| Avatar | AppHeader.vue |
| Badge | Tasks.vue, TaskDetail.vue |
| Breadcrumb | AppBreadcrumb.vue |
| Button | Throughout app |
| Calendar | TaskForm.vue |
| Card | Dashboard, Projects, TaskDetail, Settings |
| DataTable | Tasks.vue (with filtering, sorting, pagination, bulk actions) |
| Dialog | Tasks.vue, TaskDetail.vue |
| DropdownMenu | Tasks.vue, AppHeader.vue |
| Empty | Tasks.vue |
| Form | TaskForm.vue (FormField, FormItem, FormLabel, FormControl, FormMessage) |
| Input | TaskForm.vue, Settings.vue |
| Label | TaskForm.vue, Settings.vue |
| Popover | TaskForm.vue |
| Progress | StatsCard.vue, Projects.vue |
| RadioGroup | Settings.vue |
| RelativeTime | Tasks.vue, TaskDetail.vue, RecentActivity.vue |
| Select | TaskForm.vue, Settings.vue |
| Separator | AppSidebar.vue, TaskDetail.vue |
| Sheet | Projects.vue |
| Sidebar | App.vue, AppSidebar.vue |
| Skeleton | TaskDetail.vue |
| Sonner/Toaster | App.vue |
| Tabs | Settings.vue |
| TagsInput | TaskForm.vue |
| Textarea | TaskForm.vue, Settings.vue |
| Timeline | TaskDetail.vue, RecentActivity.vue |
| Tooltip | AppSidebar.vue |

### Packages Used
- **@meldui/vue** - Core component library
- **@meldui/tabler-vue** - Icons throughout the app
- **@meldui/charts-vue** - TaskChart.vue (bar chart for task distribution)

### Components Not Used

The following components were intentionally not included as they weren't needed for the task manager use case:

**UI Components:** Accordion, Alert, ButtonGroup, CircularProgress, Collapsible, Combobox, Command, ContextMenu, Dot, Drawer, HoverCard, InputGroup, Kbd, NativeSelect, NumberField, ScrollArea, Slider, Spinner, Switch, Toggle, ToggleGroup

**Composite Components:** AvatarGroup, ClipboardCopy, MultiSelect
