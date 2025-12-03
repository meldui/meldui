# Project Context

## Purpose

MeldUI is an internal design system monorepo built on shadcn-vue components for enterprise applications. It provides a unified component library that powers internal business applications and dashboards.

**Goals:**
- Provide consistent, reusable UI components across internal applications
- Customize shadcn-vue components to match company design standards
- Offer composite components for common enterprise UI patterns
- Include a dedicated icon system with sensible defaults
- Serve as the single source of truth for UI design tokens and styles

## Tech Stack

### Core
- **TypeScript** - Strict mode enabled, ES2020 target
- **Vue 3** - Composition API with `<script setup>` syntax
- **pnpm** - Package manager with workspace support (v10.13.1)

### UI & Styling
- **Tailwind CSS v4** - CSS-first configuration (NOT v3)
- **shadcn-vue** - Base component primitives (bundled, not peer dependency)
- **Reka UI** - Headless UI primitives (migration from Radix Vue)
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Tailwind class merging

### Build & Development
- **Vite** - Build tool (library mode for packages)
- **Turborepo** - Monorepo build orchestration
- **vite-plugin-dts** - TypeScript declaration generation

### Code Quality
- **Biome.js** - Linting and formatting (replaces ESLint + Prettier)
- **Husky** - Git hooks
- **TypeScript** - Strict type checking

### Documentation
- **Storybook 10** - Component documentation and development

### Versioning & Release
- **Changesets** - Version management and changelogs
- **GitHub Packages** - npm registry (`npm.pkg.github.com`)

### Key Libraries
- **@tanstack/vue-table** - Data tables
- **@floating-ui/vue** - Positioning engine
- **@vueuse/core** - Vue composables
- **@tabler/icons-vue** - Icon library (wrapped via @meldui/tabler-vue)
- **ECharts / vue-echarts** - Charting (via @meldui/charts-vue)
- **vee-validate / zod** - Form validation

## Project Conventions

### Code Style
- **Formatter:** Biome.js
  - Indent: 2 spaces
  - Line width: 100 characters
  - Quote style: Single quotes
  - Semicolons: As needed (no trailing)
- **Imports:** Auto-organized by Biome
- **File naming:** kebab-case for files, PascalCase for components
- **Component naming:** PascalCase (e.g., `Button.vue`, `DataTable.vue`)
- Run `pnpm check:fix` before commits (enforced via pre-commit hook)

### Architecture Patterns

**Monorepo Structure:**
```
packages/
├── vue/               # @meldui/vue - Main component library
│   ├── components/ui/ # Shadcn base components (copied via CLI)
│   ├── composites/    # Custom composite components
│   ├── styles/        # Tailwind CSS v4 configuration
│   └── lib/           # Utilities (cn helper)
├── tabler-vue/        # @meldui/tabler-vue - Icon wrapper package
└── charts-vue/        # @meldui/charts-vue - Chart components

apps/
└── vue-storybook/     # Storybook documentation
```

**Component Patterns:**
- Vue 3 Composition API with `<script setup>`
- Props defined via TypeScript interfaces
- Variants managed via `class-variance-authority`
- Components use `data-slot` attributes for styling hooks
- Headless primitives from Reka UI wrapped with styling

**Build Outputs:**
- ESM (`.mjs`) + CJS (`.cjs`) for library packages
- TypeScript declarations (`.d.ts`)
- Source maps included

**Package Dependencies:**
- Vue is always a peer dependency (not bundled)
- Icon packages are peer dependencies of @meldui/vue
- Shadcn components are bundled (copied into codebase)

### Testing Strategy

Currently, the project does not have automated tests. When tests are added:
- Use Vitest as the test runner
- Component tests with Vue Test Utils
- Visual regression tests via Storybook (recommended)
- Accessibility tests via Storybook a11y addon

### Git Workflow

**Branching:**
- `main` - Primary branch, always deployable
- Feature branches for development
- PRs required for merging to main

**Commits:**
- Conventional commits encouraged but not enforced
- Pre-commit hook runs `pnpm check:fix` (Biome lint/format)

**Releases:**
1. Create changeset: `pnpm changeset`
2. Version packages: `pnpm changeset:version`
3. Release: `pnpm release` (builds + publishes)

**CI/CD:**
- GitHub Actions for CI (lint, build)
- Automated Storybook deployment
- Changesets action for version management

## Domain Context

MeldUI serves as the internal design system for enterprise applications. Key domain concepts:

**Component Categories:**
- **Base Components** - Atomic UI elements from shadcn-vue (Button, Input, etc.)
- **Composite Components** - Complex patterns (DataTable, MultiSelect, Timeline)
- **Charts** - Data visualization components (separate package)
- **Icons** - Tabler icons with custom defaults (separate package)

**Icon System:**
- Icons have custom defaults: size=24, stroke=1.5
- Icons inherit color from `currentColor` (use Tailwind text classes)
- Tree-shaking friendly (explicit imports only)

**Theming:**
- CSS variables for design tokens
- Tailwind CSS v4 `@theme` directive for customization
- Default theme provided via `@meldui/vue/themes/default`

## Important Constraints

### Technical Constraints
- **Tailwind CSS v4 ONLY** - No `tailwind.config.js` files; use CSS-first approach
- **No Tailwind v3 syntax** - Strictly v4 conventions
- **Vue 3.4+** - Required for all packages
- **Node.js 20+** - Required for development and CI
- **pnpm workspaces** - Required package manager

### Browser Support
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- No Internet Explorer 11 support

### Accessibility
- WCAG 2.1 AA compliance expected
- Keyboard navigation support required
- Screen reader compatibility (ARIA attributes)
- Storybook a11y addon for accessibility checks

### Publishing
- Packages published to GitHub Package Registry (`npm.pkg.github.com`)
- Scoped under `@meldui/`

## External Dependencies

### Package Registry
- **GitHub Packages** - npm registry for publishing
  - Registry: `https://npm.pkg.github.com`
  - Scope: `@meldui`

### No External APIs
The component library has no external API dependencies. It's purely a UI component library that consumers integrate with their own data sources.

### Key Upstream Dependencies
- **shadcn-vue** - Source of base component patterns
- **Reka UI** - Headless primitives (accessibility patterns)
- **Tabler Icons** - Icon library source
- **Apache ECharts** - Charting engine
