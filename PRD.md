# MeldUI Design System - Product Requirements Document

## Project Overview

MeldUI is a design system for internal company use, built on top of shadcn components. The system will re-export and customize shadcn components while providing additional composite components for common use cases.

**Target Audience:** Internal team only
**Versioning Strategy:** Independent versioning per package
**Component Approach:** Bundle shadcn components (copy and modify)

## Technology Stack

### Core Technologies
- **Package Manager:** pnpm with workspaces
- **Monorepo Tool:** Turborepo (optional but recommended for caching & parallel builds)
- **Build Tool:** Vite (library mode)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (required for shadcn, using CSS-first configuration)
- **Linting & Formatting:** Biome.js (replaces ESLint + Prettier)
- **Version Management:** Changesets

### Vue Stack
- **Framework:** Vue 3 with Composition API
- **Component Library Base:** shadcn-vue (components copied into repo)
- **UI Primitives:** Radix Vue (shadcn-vue dependency)
- **Icons:** @meldui/tabler-vue (wraps @tabler/icons-vue with custom defaults)
- **Storybook:** @storybook/vue3-vite

### React Stack (Future)
- **Framework:** React 18
- **Component Library Base:** shadcn/ui
- **UI Primitives:** Radix UI
- **Icons:** @meldui/tabler-react (wraps @tabler/icons-react with custom defaults)
- **Storybook:** @storybook/react-vite

## Project Structure

```
meldui/
├── packages/
│   ├── vue/                    # @meldui/vue - Vue component library
│   │   ├── src/
│   │   │   ├── components/     # Shadcn-vue components (copied & modified)
│   │   │   │   └── ui/         # Base shadcn components (button, card, etc.)
│   │   │   ├── composites/     # Custom composite components
│   │   │   ├── styles/         # Tailwind CSS v4 styles
│   │   │   │   └── index.css   # Main CSS file with @import "tailwindcss"
│   │   │   ├── lib/            # Utilities (cn, etc.)
│   │   │   └── index.ts        # Main export
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── tabler-vue/             # @meldui/tabler-vue - Tabler Icons for Vue
│   │   ├── src/
│   │   │   ├── index.ts        # Re-exports all icons with custom defaults
│   │   │   ├── defaults.ts     # Icon default configuration
│   │   │   └── wrapper.ts      # Icon wrapper helper
│   │   ├── scripts/
│   │   │   └── generate.ts     # Auto-generate icon re-exports
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── react/                  # @meldui/react - React library (future)
│   │   └── (similar structure to vue)
│   │
│   ├── tabler-react/           # @meldui/tabler-react - Tabler Icons for React (future)
│   │   └── (similar structure to tabler-vue)
│   │
│   └── shared/                 # @meldui/shared - Shared utilities/types (optional)
│       ├── src/
│       │   ├── types/          # Shared TypeScript types
│       │   └── utils/          # Framework-agnostic utilities
│       └── package.json
│
├── apps/
│   ├── vue-storybook/         # Storybook for Vue components
│   │   ├── .storybook/
│   │   │   ├── main.ts
│   │   │   ├── preview.ts
│   │   │   └── theme.ts       # Custom theme
│   │   ├── stories/
│   │   │   ├── Introduction.mdx       # Getting Started
│   │   │   ├── Installation.mdx       # Installation guide
│   │   │   ├── Theming.mdx           # Customizing theme
│   │   │   ├── Icons.mdx             # Icon system docs
│   │   │   ├── Components/           # Component stories
│   │   │   ├── Composites/           # Composite component stories
│   │   │   └── Examples/             # Usage patterns
│   │   └── package.json
│   │
│   └── react-storybook/       # Storybook for React (future)
│       └── (similar structure)
│
├── pnpm-workspace.yaml
├── package.json               # Root package.json
├── tsconfig.json             # Base TypeScript config
├── biome.json                # Biome configuration
├── .npmrc
├── turbo.json               # Turborepo config (optional)
└── PRD.md                   # This document
```

## Icon System Strategy

### Separate Icon Packages Approach

**Architecture:** Create dedicated icon packages (`@meldui/tabler-vue`, `@meldui/tabler-react`) that wrap Tabler Icons with custom defaults and design system integration.

### Why Separate Icon Packages?

1. **Customizable Defaults** - Set stroke-width, default sizes globally for the design system
2. **Version Control** - Control when to update Tabler, not tied to their release schedule
3. **Extensibility** - Easy to add `@meldui/heroicons-vue`, `@meldui/lucide-vue` in the future
4. **Clean Separation** - Icons are independent packages with clear purpose
5. **Perfect Tree-shaking** - Explicit imports ensure only used icons are bundled
6. **Custom Icons** - Can add custom company icons to these packages

### Icon Package Architecture

**@meldui/tabler-vue:**
- Re-exports all Tabler icons with custom defaults
- Wraps each icon component with design system defaults
- Auto-generated via script when syncing with new Tabler versions
- Can include custom icons alongside Tabler icons

**Dependencies:**
```json
{
  "name": "@meldui/tabler-vue",
  "dependencies": {
    "@tabler/icons-vue": "^3.0.0"
  },
  "peerDependencies": {
    "vue": "^3.4.0"
  }
}
```

### Icon Component Implementation (Hybrid Approach)

**Option 3: Hybrid - Component defaults + CSS variables**

**packages/tabler-vue/src/defaults.ts:**
```typescript
export const ICON_DEFAULTS = {
  size: 24,           // 24px base size
  strokeWidth: 1.5,   // Medium stroke weight
} as const
```

**packages/tabler-vue/src/wrapper.ts:**
```typescript
import { defineComponent, h } from 'vue'

export function createIcon(OriginalIcon: any) {
  return defineComponent({
    name: OriginalIcon.name,
    props: {
      size: { type: Number, default: ICON_DEFAULTS.size },
      strokeWidth: { type: Number, default: ICON_DEFAULTS.strokeWidth },
      color: { type: String, default: undefined },
    },
    setup(props, { attrs }) {
      return () => h(OriginalIcon, {
        ...props,
        style: {
          color: props.color ?? 'var(--icon-color, currentColor)',
          ...attrs.style
        },
        ...attrs
      })
    }
  })
}
```

**packages/tabler-vue/src/index.ts (Auto-generated):**
```typescript
import { IconX, IconUser, IconSettings /* ... */ } from '@tabler/icons-vue'
import { createIcon } from './wrapper'

// Re-export all icons with custom defaults
export const IconCross = createIcon(IconX)
export const IconUser = createIcon(IconUser)
export const IconSettings = createIcon(IconSettings)
// ... ~5000+ icons
```

**packages/tabler-vue/scripts/generate.ts:**
```typescript
// Script that:
// 1. Reads all exports from @tabler/icons-vue
// 2. Generates index.ts with wrapped re-exports
// 3. Run when syncing with new Tabler versions
```

### Icon API Usage

```vue
<!-- Basic usage with defaults (size=24, strokeWidth=1.5) -->
<IconCross />

<!-- Override size -->
<IconCross :size="32" />

<!-- Override stroke width -->
<IconCross :stroke-width="2" />

<!-- Color inherits from text color (Tailwind integration) -->
<span class="text-red-500">
  <IconCross /> <!-- Red icon -->
</span>

<!-- Explicit color -->
<IconCross color="#ff0000" />
```

### CSS Variables Integration (Tailwind v4)

**packages/vue/src/styles/index.css:**
```css
@import "tailwindcss";

@theme {
  --icon-color: theme('colors.gray.700');
}

.dark {
  --icon-color: theme('colors.gray.200');
}
```

### Benefits

1. **Perfect Tree-shaking** - Only imported icons are bundled (explicit imports)
2. **No Package Bloat** - Icons not bundled in @meldui/vue
3. **Type Safety** - Full TypeScript support with autocomplete
4. **Customizable Defaults** - Change in one place (ICON_DEFAULTS)
5. **Theme Integration** - CSS variables work with Tailwind v4
6. **Easy Updates** - Run generate script when Tabler updates
7. **Extensible** - Add custom icons or other icon libraries

### User Installation

```bash
# For Vue projects
pnpm add @meldui/vue @meldui/tabler-vue vue

# For React projects (future)
pnpm add @meldui/react @meldui/tabler-react react react-dom
```

### Syncing with Tabler Updates

```bash
# When Tabler releases new icons:
cd packages/tabler-vue
pnpm update @tabler/icons-vue
pnpm generate-icons  # Runs scripts/generate.ts
# Review generated changes
# Publish new version
```

## Biome.js Configuration

### Why Biome?

- 🚀 **35x faster** than ESLint + Prettier
- 🔧 Single tool for linting & formatting
- 📦 No plugin ecosystem complexity
- 💾 Low memory footprint
- 🔄 Drop-in replacement workflow

### Configuration (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".turbo",
      "storybook-static"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "organizeImports": {
    "enabled": true
  }
}
```

### Development Workflow

**Pre-commit:**
```bash
biome check --write .  # Format, lint, and organize imports
```

**CI Pipeline:**
```bash
biome ci .            # Check formatting and linting (fails on errors)
pnpm build            # Build all packages
```

## Tailwind CSS v4 Configuration

### Why Tailwind CSS v4?

- 🚀 **New Oxide Engine** - Faster compilation and better performance
- 🎨 **CSS-first configuration** - No more JavaScript config files
- 📦 **Simplified setup** - Import directly in CSS
- 🔧 **Better composability** - CSS variables and layers
- ⚡ **Zero-config for common use cases**

### Key Differences from v3

**1. CSS-First Configuration:**
```css
/* Instead of tailwind.config.js, use CSS imports */
@import "tailwindcss";

/* Customize using CSS variables */
@theme {
  --color-primary: #3b82f6;
  --font-display: "Inter", sans-serif;
}
```

**2. No PostCSS Plugin Required:**
- Tailwind v4 is a PostCSS plugin itself
- Simplified build pipeline integration

**3. Installation:**
```bash
pnpm add tailwindcss@next @tailwindcss/vite@next
```

**4. Vite Integration:**
```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()]
})
```

### Package-Level Configuration

Each package that needs Tailwind should have:

**packages/vue/src/styles/index.css:**
```css
@import "tailwindcss";

/* Custom theme configuration */
@theme {
  /* Design tokens */
}

/* Component-specific styles */
@layer components {
  /* ... */
}
```

### Storybook Configuration

Storybook apps must also configure Tailwind v4:

**apps/vue-storybook/.storybook/preview.ts:**
```typescript
import '../src/styles/tailwind.css' // Import Tailwind v4 styles

export default {
  // ... preview config
}
```

### Important Constraints

- **Strictly use Tailwind CSS v4** - Do not use v3 syntax or configuration
- **CSS-first approach** - No tailwind.config.js files
- **Use @theme directive** for customization
- **Ensure Storybook has Tailwind v4 configured** to render components correctly

## Documentation Strategy

### Primary Approach: Storybook

For internal team usage, Storybook serves as the primary documentation platform.

### Why Storybook?

- ✅ **Single source of truth** - Components and docs live together
- ✅ **Interactive playground** - Developers can test props in real-time
- ✅ **Already in stack** - No additional infrastructure
- ✅ **Auto-generated prop tables** - Less manual documentation
- ✅ **Visual regression testing** - Can add Chromatic later
- ✅ **Fast iteration** - Update code and docs together
- ✅ **Component-focused** - Perfect for design system use case
- ✅ **Design/Dev collaboration** - Designers can see live components

### Storybook Addons

```json
{
  "devDependencies": {
    "@storybook/addon-docs": "^7.x",           // MDX docs
    "@storybook/addon-controls": "^7.x",       // Interactive props
    "@storybook/addon-a11y": "^7.x",          // Accessibility checks
    "@storybook/addon-links": "^7.x",         // Link between stories
    "@storybook/addon-measure": "^7.x",       // Measure elements
    "@storybook/addon-outline": "^7.x",       // Show outlines
    "@storybook/addon-viewport": "^7.x",      // Responsive testing
    "@storybook/addon-backgrounds": "^7.x"    // Background variants
  }
}
```

### Documentation Structure

**1. Getting Started Pages (MDX):**
- Introduction & philosophy
- Installation guide
- Quick start tutorial
- Theming & customization

**2. Component Documentation:**
- Auto-generated prop tables
- Interactive controls
- Multiple variants/states
- Usage examples
- Do's and Don'ts
- Accessibility notes

**3. Design Tokens:**
- Color palette showcase
- Typography scale
- Spacing system
- Shadow/elevation

**4. Patterns & Examples:**
- Common form patterns
- Layout compositions
- Real-world examples

### Future Extension: VitePress (Optional)

Add VitePress later if needed for:
- 📱 Public marketing pages
- 🔍 SEO for external users
- 📚 Extensive guides
- 🎨 Design principle documentation
- 📖 Blog/changelog section

## Implementation Phases

### Phase 1: Project Initialization
1. Initialize pnpm workspace (pnpm-workspace.yaml)
2. Set up base TypeScript configuration
3. Install and configure Biome.js
4. Configure Turborepo (optional)
5. Set up git hooks with Biome

**Key Files:**
- `pnpm-workspace.yaml`
- `package.json` (root)
- `biome.json`
- `tsconfig.json` (base)
- `turbo.json` (optional)
- `.npmrc`

### Phase 2: Tabler Icon Package Setup
1. Create `packages/tabler-vue` directory structure
2. Set up Vite library configuration
3. Add @tabler/icons-vue as dependency
4. Create icon wrapper helper (`wrapper.ts`)
5. Create defaults configuration (`defaults.ts`)
6. Create generation script (`scripts/generate.ts`)
7. Run generation script to create `index.ts` with all re-exports
8. Configure build outputs (ESM, CJS)
9. Set up exports in package.json

**Key Deliverables:**
- Working @meldui/tabler-vue package
- All Tabler icons re-exported with custom defaults
- Generation script for syncing with Tabler updates
- TypeScript types for all icons
- Package.json with correct exports

**Icon Defaults:**
- `size: 24` (24px base size)
- `strokeWidth: 1.5` (medium stroke weight)

### Phase 3: Vue Package Setup
1. Create `packages/vue` directory structure
2. Set up Vite library configuration with `@tailwindcss/vite` plugin
3. Configure Tailwind CSS v4 (CSS-first with `@import "tailwindcss"`)
4. Add CSS variables for icon theming (--icon-color)
5. Add @meldui/tabler-vue as peer dependency
6. Use `shadcn-vue` CLI to add initial components
7. Configure build outputs (ESM, CJS)
8. Set up exports in package.json

**Key Deliverables:**
- Vite config for library mode with Tailwind v4 plugin
- Tailwind v4 CSS file with `@theme` configuration and icon variables
- Package.json with @meldui/tabler-vue as peer dependency
- TypeScript configuration

### Phase 4: Vue Storybook Setup
1. Create `apps/vue-storybook` directory
2. Initialize Storybook with Vue 3 + Vite
3. Configure Tailwind CSS v4 in Storybook (import CSS with `@import "tailwindcss"`)
4. Install @tabler/icons-vue in Storybook
5. Create MDX documentation pages:
   - Introduction.mdx
   - Installation.mdx
   - Theming.mdx
   - Icons.mdx
6. Create stories for shadcn components
7. Create Icon Gallery story (searchable icon browser)
8. Create composite component examples

**Storybook Configuration:**
- Custom theme configuration
- Addon setup (docs, controls, a11y, viewport, etc.)
- Preview configuration with Tailwind v4 CSS import
- Build optimization

### Phase 5: Publishing Setup
1. Configure package.json exports correctly
2. Install and configure Changesets
3. Verify peer dependencies installation workflow
4. Document release process
5. Set up npm publishing workflow (manual or CI/CD)

**Version Management:**
- Independent versioning per package
- Automated changelog generation
- Semantic versioning

### Phase 6: React Package (Future)
- Mirror Phase 2-4 for React
- Use @tabler/icons-react
- Create React Storybook instance
- Ensure shared utilities work across frameworks

## Build Configuration

### Package Outputs

Each package should output:
- **ESM** - Modern bundlers (primary)
- **CJS** - Node/legacy support
- **Type definitions** - `.d.ts` files
- **Source maps** - For debugging

### Vite Library Configuration

```typescript
// packages/vue/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'MeldUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
    },
    rollupOptions: {
      external: ['vue', '@tabler/icons-vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

## Root Package Scripts

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "check": "biome check .",
    "check:fix": "biome check --write .",
    "storybook:vue": "pnpm --filter vue-storybook storybook",
    "build:storybook:vue": "pnpm --filter vue-storybook build-storybook",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

## CLI Tools Reference

### Development
1. **pnpm** - Package management and workspaces
2. **Vite** - Build tool and dev server
3. **Biome CLI** - Linting, formatting, and code quality
4. **Turborepo** - Build orchestration (optional)

### Scaffolding
1. **shadcn-vue CLI** - Add shadcn components
   ```bash
   npx shadcn-vue@latest add button
   ```
2. **Storybook CLI** - Initialize Storybook
   ```bash
   npx storybook@latest init
   ```

### Version Management
1. **Changesets** - Version bumps and changelog
   ```bash
   npx changeset
   npx changeset version
   npx changeset publish
   ```

## Key Considerations

### Advantages of This Architecture

1. **Clean separation** - Vue and React packages are independent
2. **Scalable** - Easy to add new frameworks or packages
3. **Standard workflow** - Following shadcn best practices
4. **Fast development** - Biome and Vite optimize DX
5. **Flexible versioning** - Independent package versions
6. **Good DX** - Storybook provides excellent developer experience

### Design Decisions

1. **Bundle vs Peer Dependencies:**
   - Shadcn components: Bundled (standard approach)
   - Icons: Peer dependency (user choice, better tree-shaking)

2. **Tailwind CSS v4 (CSS-first):**
   - Chosen for new Oxide engine performance
   - CSS-first configuration simplifies setup
   - No JavaScript config files needed
   - Better composability with CSS variables and @theme

3. **Biome vs ESLint/Prettier:**
   - Chosen for speed and simplicity
   - Single tool reduces configuration complexity

4. **Storybook vs Separate Docs:**
   - Storybook sufficient for internal use
   - Can add VitePress later if needed

5. **Independent Versioning:**
   - Allows Vue and React to evolve separately
   - More flexible for different framework adoption rates

### Future Enhancements

- Testing infrastructure (Vitest, Playwright)
- Visual regression testing (Chromatic)
- Design tokens package
- Accessibility testing automation
- Performance monitoring
- Usage analytics
- Additional framework support (Svelte, Solid, etc.)

## Success Criteria

### Phase 1-3 Success
- ✅ Monorepo structure set up with pnpm workspaces
- ✅ Biome configured and working
- ✅ Vue package can be built and imported
- ✅ Shadcn components integrated
- ✅ Icon component working with Tabler icons

### Phase 4 Success
- ✅ Storybook running locally
- ✅ Component documentation complete
- ✅ Interactive examples working
- ✅ MDX guides created

### Phase 5 Success
- ✅ Packages can be published to npm
- ✅ Changesets workflow established
- ✅ Internal teams can install and use packages

## Next Steps

1. Review and approve this PRD
2. Set up initial project structure (Phase 1)
3. Begin Vue package development (Phase 2)
4. Iterate and gather team feedback
