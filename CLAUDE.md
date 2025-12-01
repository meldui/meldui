# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MeldUI is an internal design system monorepo built on shadcn components. It uses pnpm workspaces to manage multiple packages (Vue, React in the future) that re-export and customize shadcn components while providing additional composite components.

**Key Characteristics:**
- Internal use only (not public open source)
- Independent versioning per package using Changesets
- Shadcn components are bundled (copied and modified), not peer dependencies
- Icons have dedicated packages (@meldui/tabler-vue, @meldui/tabler-react) that wrap Tabler Icons with custom defaults
- Storybook serves as the primary documentation platform

## Monorepo Architecture

This is a pnpm workspace monorepo with two main directories:

### `packages/` - Library packages published to npm
- `packages/vue/` - @meldui/vue (Vue 3 component library)
  - `src/components/ui/` - Shadcn-vue base components (copied via CLI)
  - `src/composites/` - Custom composite components built from base components
  - `src/styles/` - Tailwind CSS v4 configuration
  - `src/lib/` - Utilities (cn helper, etc.)
  - Build target: ESM + CJS with TypeScript definitions

- `packages/tabler-vue/` - @meldui/tabler-vue (Tabler Icons for Vue)
  - Re-exports all Tabler icons with custom defaults (size: 24, stroke: 1.5)
  - `src/index.ts` - Auto-generated icon exports
  - `src/wrapper.ts` - Icon wrapper with defaults
  - `src/defaults.ts` - Icon default configuration
  - `scripts/generate.ts` - Script to sync with Tabler updates

- `packages/react/` - @meldui/react (future React 18 library)
  - Similar structure to Vue package

- `packages/tabler-react/` - @meldui/tabler-react (future Tabler Icons for React)
  - Similar structure to tabler-vue

- `packages/shared/` - @meldui/shared (optional shared utilities)
  - Framework-agnostic utilities and types

### `apps/` - Development and documentation applications
- `apps/vue-storybook/` - Storybook instance for Vue components
  - MDX documentation pages (Installation, Theming, Icons, etc.)
  - Component stories with interactive controls
  - Icon gallery showcase

- `apps/react-storybook/` - Future React Storybook instance

## Essential Commands

### Package Management
```bash
# Install all dependencies
pnpm install

# Add dependency to specific package
pnpm --filter @meldui/vue add <package>
pnpm --filter vue-storybook add -D <package>

# Run command in specific workspace
pnpm --filter <package-name> <command>
```

### Building
```bash
# Build all packages (uses Turborepo if configured)
pnpm build

# Build specific package
pnpm --filter @meldui/vue build

# Development mode (watch mode)
pnpm dev
```

### Code Quality (Biome.js)
```bash
# Lint code
pnpm lint

# Lint and auto-fix
pnpm lint:fix

# Format code
pnpm format

# Check everything (lint + format + organize imports)
pnpm check

# Check and auto-fix everything
pnpm check:fix
```

**Note:** This project uses Biome.js instead of ESLint + Prettier. All formatting and linting is handled by Biome.

### Storybook
```bash
# Run Vue Storybook dev server
pnpm storybook:vue

# Build Vue Storybook for production
pnpm build:storybook:vue
```

### Adding Shadcn Components
```bash
# Navigate to the Vue package
cd packages/vue

# Add a shadcn-vue component (copies it into src/components/ui/)
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
```

**Important:** Shadcn components are copied into the codebase, not installed as dependencies. This allows modification and customization.

### Version Management (Changesets)
```bash
# Create a changeset (records what changed for next release)
pnpm changeset

# Update package versions based on changesets
pnpm version

# Build and publish to npm
pnpm release
```

## Icon System Architecture

The icon system uses **dedicated icon packages** that wrap Tabler Icons with custom defaults.

### Package Structure

**@meldui/tabler-vue** and **@meldui/tabler-react** are separate packages that:
1. Re-export all Tabler icons with custom defaults
2. Wrap each icon with design system integration
3. Provide perfect tree-shaking (only used icons are bundled)
4. Allow custom company icons to be added

### Icon Defaults

Configured in `packages/tabler-vue/src/defaults.ts`:
```typescript
export const ICON_DEFAULTS = {
  size: 24,     // 24px base size
  stroke: 1.5,  // Stroke weight (Tabler default is 2)
} as const
```

### Usage Pattern

```vue
<!-- Basic usage with defaults -->
<IconCross />

<!-- Override size -->
<IconCross :size="32" />

<!-- Override stroke -->
<IconCross :stroke="2" />

<!-- Color inherits from text color (use Tailwind classes) -->
<span class="text-red-500">
  <IconCross /> <!-- Red icon -->
</span>

<!-- Or directly on the icon -->
<IconCross class="text-blue-500" />
```

### Syncing with Tabler Updates

When Tabler releases new icons:
```bash
cd packages/tabler-vue
pnpm update @tabler/icons-vue
pnpm generate-icons  # Runs scripts/generate.ts
# Review changes, commit, publish new version
```

### Key Benefits

- **Perfect tree-shaking** - Explicit imports, only used icons bundled
- **No package bloat** - Icons not bundled in @meldui/vue
- **Customizable defaults** - Change size/stroke in one place
- **CSS color inheritance** - Icons use `currentColor`, works with Tailwind classes
- **Easy updates** - Run generation script when syncing
- **Extensible** - Can add other icon libraries later

## Build Configuration

### Vite Library Mode
Packages are built using Vite in library mode with:
- **Outputs:** ESM (.mjs) and CJS (.cjs)
- **Externals:** Framework (vue/react) and icon libraries are external
- **TypeScript:** Type definitions generated automatically
- **Source maps:** Included for debugging

**Key config location:** `packages/vue/vite.config.ts`

### Package Exports
Each package's `package.json` must have correct `exports` field for proper module resolution:
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

## Styling with Tailwind CSS v4

**CRITICAL: This project uses Tailwind CSS v4, not v3.**

### Key Differences from v3
- **CSS-first configuration** - No `tailwind.config.js` files
- **Use `@import "tailwindcss"`** in CSS files
- **Use `@theme` directive** for customization
- **Vite plugin:** `@tailwindcss/vite` instead of PostCSS plugin

### Installation
```bash
pnpm add tailwindcss @tailwindcss/vite
```

### Configuration Pattern

**In Vite config:**
```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()]
})
```

**In CSS files (e.g., `packages/vue/src/styles/index.css`):**
```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-display: "Inter", sans-serif;
}

@layer components {
  /* Component-specific styles */
}
```

### Important Constraints
- **DO NOT create `tailwind.config.js` files** - Use CSS-first approach
- **DO NOT use Tailwind v3 syntax** - Strictly v4 only
- **Each package needing Tailwind** should have its own CSS file with `@import "tailwindcss"`
- **Storybook must import Tailwind v4 CSS** to render components correctly

## Documentation in Storybook

Storybook serves as the primary documentation. When documenting:

1. **MDX Pages** in `apps/vue-storybook/stories/`:
   - Installation.mdx - How to install packages
   - Theming.mdx - Customization guide
   - Icons.mdx - Icon system documentation

2. **Component Stories:**
   - Show all variants and states
   - Use Controls addon for interactive prop testing
   - Include usage examples and code snippets
   - Add accessibility notes where relevant

3. **Storybook Addons:** Use these pre-configured addons:
   - addon-docs (auto-generated prop tables)
   - addon-controls (interactive props)
   - addon-a11y (accessibility checks)
   - addon-viewport (responsive testing)

## Development Workflow Guidelines

### Adding a New Component
1. If it's a shadcn component: `npx shadcn-vue@latest add <component>`
2. Modify the copied component as needed for your design system
3. Ensure component uses Tailwind CSS v4 classes (no v3-specific syntax)
4. Export it from `packages/vue/src/index.ts`
5. Create a story in `apps/vue-storybook/stories/Components/`
6. Run `pnpm check:fix` before committing

### Creating Composite Components
1. Place in `packages/vue/src/composites/`
2. Build using existing base components from `components/ui/`
3. Follow Vue 3 Composition API patterns
4. Export from main index
5. Document in Storybook with usage examples

### Version Bumping and Releasing
1. Make changes to packages
2. Run `pnpm changeset` and describe changes
3. Run `pnpm version` to update package versions
4. Run `pnpm release` to publish (requires npm authentication)

## Important Constraints

### Peer Dependencies

**For @meldui/vue users:**
```bash
pnpm add @meldui/vue @meldui/tabler-vue vue
```

**For @meldui/tabler-vue package:**
- @tabler/icons-vue is a regular dependency (auto-installed)
- Vue is a peer dependency

**For @meldui/vue package:**
- @meldui/tabler-vue is a peer dependency
- Vue is a peer dependency

Ensure peer dependencies are correctly declared in each package's `package.json`.

### Code Style
- **Formatter:** Single quotes, 2 spaces, semicolons as needed
- **Line width:** 100 characters
- **Import organization:** Auto-sorted by Biome
- Run `pnpm check:fix` before commits

### Don't Bundle These

**In @meldui/vue and @meldui/react:**
- Vue/React framework
- @meldui/tabler-vue / @meldui/tabler-react

**In @meldui/tabler-vue and @meldui/tabler-react:**
- Vue/React framework
- @tabler/icons-vue / @tabler/icons-react is bundled (regular dependency)

These should always be external dependencies in build configs.

## Working with Icon Packages

### Adding Icons to Projects

```vue
<script setup>
import { IconCross, IconUser, IconSettings } from '@meldui/tabler-vue'
</script>

<template>
  <div>
    <IconCross />
    <IconUser :size="32" />
    <IconSettings :stroke="2" class="text-blue-500" />
  </div>
</template>
```

### Updating Icon Package When Tabler Updates

1. Navigate to icon package: `cd packages/tabler-vue`
2. Update Tabler: `pnpm update @tabler/icons-vue`
3. Run generation script: `pnpm generate-icons`
4. Review generated `src/index.ts` for new icons
5. Test in Storybook
6. Create changeset: `pnpm changeset`
7. Publish new version

### Adding Custom Icons

Add custom icons directly in the icon package:

```typescript
// packages/tabler-vue/src/custom/IconMyLogo.vue
<template>
  <svg><!-- custom icon SVG --></svg>
</template>

// packages/tabler-vue/src/index.ts
export { default as IconMyLogo } from './custom/IconMyLogo.vue'
```

### Changing Icon Defaults

Edit `packages/tabler-vue/src/defaults.ts`:
```typescript
export const ICON_DEFAULTS = {
  size: 20,     // Change from 24 to 20
  stroke: 2,    // Change from 1.5 to 2
} as const
```

Then republish the icon package.

## File Reference

- **PRD.md** - Complete product requirements and technical plan
- **pnpm-workspace.yaml** - Defines workspace packages
- **biome.json** - Code quality configuration
- **turbo.json** - Build orchestration (if using Turborepo)
- **tsconfig.json** - Base TypeScript configuration
