# MeldUI

A modern component library built on shadcn, providing Vue components with Tailwind CSS v4 styling.

## Motivation

MeldUI is an internal design system that provides a consistent, well-tested component library built on top of shadcn components. Rather than depending on shadcn as a library, we copy and customize components to fit our specific design requirements while maintaining full control over styling, behavior, and future updates.

Key goals:

- **Consistency** - Unified component API and styling across projects
- **Customization** - Full control over component implementation and design tokens
- **Icon System** - Dedicated icon packages with smart defaults and tree-shaking
- **Documentation** - Comprehensive Storybook documentation with live examples

## Project Structure

This is a pnpm workspace monorepo organized into two main directories:

### Packages (`packages/`)

Published packages available via GitHub Packages:

- **`@meldui/vue`** - Vue 3 component library with shadcn-vue base components and custom composites
- **`@meldui/tabler-vue`** - Tabler Icons wrapped with design system defaults (size: 24, strokeWidth: 1.5)
- **`@meldui/react`** - React 18 component library (planned)
- **`@meldui/tabler-react`** - Tabler Icons for React (planned)

### Apps (`apps/`)

Development and documentation applications:

- **`vue-storybook`** - Component documentation and interactive playground
- **`react-storybook`** - React documentation (planned)
- **`task-manager`** - Full-featured example application showcasing MeldUI components

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run Vue Storybook
pnpm storybook:vue
```

## Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @meldui/vue build

# Development mode (watch)
pnpm dev
```

## Development

```bash
# Lint and format code
pnpm check:fix

# Type check
pnpm --filter @meldui/vue typecheck

# Add dependency to package
pnpm --filter @meldui/vue add <package-name>
```

### Adding Components

Add shadcn components by copying them into the codebase:

```bash
cd packages/vue
npx shadcn-vue@latest add button
```

Components are copied (not installed as dependencies), allowing full customization.

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and automated releases to GitHub Packages.

For detailed release instructions, see [RELEASING.md](./RELEASING.md).

Quick workflow:

```bash
# Create a changeset
pnpm changeset

# Release (after changesets are committed)
pnpm release
```

## Tech Stack

- **Vue 3** - Component framework (Composition API)
- **Tailwind CSS v4** - Utility-first styling (CSS-first configuration)
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Biome** - Linting and formatting
- **Storybook** - Component documentation
- **pnpm** - Package manager with workspace support
- **Changesets** - Version management and publishing

## Documentation

Component documentation is available in Storybook:

```bash
pnpm storybook:vue
```

Visit `http://localhost:6006` to browse components, view props, and interact with live examples.

## Example Application

The **Task Manager** app (`apps/task-manager`) is a full-featured example demonstrating real-world usage of MeldUI components.

### Features Showcased

- **Layout** - Sidebar navigation with collapsible state, responsive design
- **Data Display** - DataTable with server-side filtering, sorting, pagination, and bulk actions
- **Forms** - Task and project creation with validation using vee-validate and zod
- **Components** - Cards, Badges, Timeline, Charts, Dialogs, Sheets, and more
- **Theming** - Dark/light mode toggle with persistent settings

### Running the Example

```bash
# Development server
pnpm --filter task-manager dev

# Build for production
pnpm --filter task-manager build
```

Visit `http://localhost:5173` to explore the application.

## License

Internal use only.
