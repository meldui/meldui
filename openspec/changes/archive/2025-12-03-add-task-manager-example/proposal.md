# Change: Add Task Manager Example Application

## Why

Users need a comprehensive, real-world example demonstrating how to use @meldui/vue, @meldui/tabler-vue, and @meldui/charts-vue together in a production-like application. Currently, only Storybook exists for isolated component demos, but there's no reference showing:

- How to structure a full application with MeldUI
- How to integrate all three packages together
- Real-world patterns for forms, data tables, navigation, and charts
- Best practices for theming and component composition

A task management app provides natural use cases for nearly every component type.

## What Changes

- **NEW:** `apps/task-manager/` - Vite + TypeScript + Vue 3 application
- Multi-page routing with Vue Router (Dashboard, Tasks, Projects, Settings)
- LocalStorage persistence layer for demo purposes
- Comprehensive component usage covering:
  - **Forms & Inputs:** Input, Select, Combobox, Checkbox, DatePicker, Textarea, TagsInput, form validation with vee-validate + zod
  - **Data Display:** DataTable with sorting/filtering/pagination, Cards, Timeline, Avatar, Badge, Progress
  - **Navigation & Layout:** Sidebar, Tabs, Breadcrumb, DropdownMenu, Dialog, Sheet, Drawer
  - **Feedback:** Sonner toasts, AlertDialog, Skeleton loaders, Spinner, Empty states
  - **Charts:** Task completion trends, project distribution (via @meldui/charts-vue)
  - **Icons:** Contextual icon usage throughout (via @meldui/tabler-vue)

## Impact

- **Affected specs:** example-apps (NEW capability)
- **Affected code:**
  - `apps/task-manager/` (new directory)
  - `pnpm-workspace.yaml` (already includes `apps/*`)
  - Root `package.json` scripts (optional convenience scripts)
- **No breaking changes** - additive only
