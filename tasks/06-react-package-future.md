# Phase 6: React Package (Future)

**Goal:** Create React versions of packages (@meldui/react and @meldui/tabler-react) mirroring the Vue implementation.

**Estimated Time:** 6-8 hours

**Prerequisites:** Phase 1-5 complete, React expertise

**Status:** 🔮 Future / Optional - Only start when React support is needed

---

## Overview

This phase mirrors Phase 2-4 but for React instead of Vue. The architecture and patterns are identical, just adapted for React's ecosystem.

---

## Task 1: Create @meldui/tabler-react Package

Mirror Phase 2 for React.

### Sub-tasks

#### 1.1 Create package structure
- [ ] Create directories:
  ```bash
  mkdir -p packages/tabler-react/src/custom
  mkdir -p packages/tabler-react/scripts
  ```

---

#### 1.2 Create package.json
- [ ] Similar to tabler-vue but with React dependencies:
  ```json
  {
    "name": "@meldui/tabler-react",
    "version": "0.1.0",
    "description": "Tabler Icons for React with MeldUI defaults",
    "type": "module",
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs",
        "types": "./dist/index.d.ts"
      }
    },
    "files": ["dist"],
    "scripts": {
      "dev": "vite build --watch",
      "build": "vite build && tsc --emitDeclarationOnly",
      "generate-icons": "tsx scripts/generate.ts"
    },
    "dependencies": {
      "@tabler/icons-react": "^3.0.0"
    },
    "peerDependencies": {
      "react": "^18.0.0"
    },
    "devDependencies": {
      "@types/react": "^18.2.0",
      "@vitejs/plugin-react": "^4.2.0",
      "react": "^18.2.0",
      "typescript": "^5.3.0",
      "vite": "^5.0.0",
      "tsx": "^4.7.0"
    }
  }
  ```

---

#### 1.3 Create defaults.ts
- [ ] Same as Vue version:
  ```typescript
  export const ICON_DEFAULTS = {
    size: 24,
    strokeWidth: 1.5,
  } as const
  ```

---

#### 1.4 Create wrapper.tsx
- [ ] React wrapper using forwardRef:
  ```typescript
  import React, { forwardRef } from 'react'
  import { ICON_DEFAULTS } from './defaults'

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number
    strokeWidth?: number
    color?: string
  }

  export function createIcon(OriginalIcon: React.ComponentType<any>) {
    return forwardRef<SVGSVGElement, IconProps>(
      ({ size = ICON_DEFAULTS.size, strokeWidth = ICON_DEFAULTS.strokeWidth, color, style, ...props }, ref) => {
        return (
          <OriginalIcon
            ref={ref}
            size={size}
            stroke={strokeWidth}
            style={{
              color: color ?? 'var(--icon-color, currentColor)',
              ...style
            }}
            {...props}
          />
        )
      }
    )
  }
  ```

---

#### 1.5 Create generation script
- [ ] Similar to Vue version but imports from @tabler/icons-react:
  ```typescript
  // scripts/generate.ts
  import { writeFileSync } from 'fs'
  import { resolve } from 'path'

  async function generateIcons() {
    const tablerIcons = await import('@tabler/icons-react')
    const iconNames = Object.keys(tablerIcons).filter(name =>
      name.startsWith('Icon')
    )

    const imports = `import { ${iconNames.join(', ')} } from '@tabler/icons-react'`
    const exports = iconNames.map(name =>
      `export const ${name} = createIcon(${name})`
    ).join('\n')

    const fileContent = `/**
   * Auto-generated icon exports for @meldui/tabler-react
   * Generated: ${new Date().toISOString()}
   */
  import { createIcon } from './wrapper'
  ${imports}

  ${exports}

  export { createIcon } from './wrapper'
  export { ICON_DEFAULTS } from './defaults'
  export type { IconDefaults } from './defaults'
  export type { IconProps } from './wrapper'
  `

    writeFileSync(resolve(__dirname, '../src/index.ts'), fileContent, 'utf-8')
    console.log(`✅ Generated ${iconNames.length} icon exports`)
  }

  generateIcons().catch(console.error)
  ```

---

#### 1.6 Configure Vite and TypeScript
- [ ] Create vite.config.ts with React plugin
- [ ] Create tsconfig.json with React JSX settings

---

#### 1.7 Build and test
- [ ] Run `pnpm generate-icons`
- [ ] Run `pnpm build`
- [ ] Verify dist/ output

---

## Task 2: Create @meldui/react Package

Mirror Phase 3 for React.

### Sub-tasks

#### 2.1 Create package structure
- [ ] Create directories:
  ```bash
  mkdir -p packages/react/src/components/ui
  mkdir -p packages/react/src/composites
  mkdir -p packages/react/src/styles
  mkdir -p packages/react/src/lib
  ```

---

#### 2.2 Create package.json
- [ ] Similar to Vue but with React dependencies:
  ```json
  {
    "name": "@meldui/react",
    "version": "0.1.0",
    "description": "MeldUI React component library built on shadcn/ui",
    "type": "module",
    "main": "./dist/index.cjs",
    "module": "./dist/index.mjs",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs",
        "types": "./dist/index.d.ts"
      },
      "./styles": "./dist/styles/index.css"
    },
    "files": ["dist"],
    "scripts": {
      "dev": "vite build --watch",
      "build": "vite build && tsc --emitDeclarationOnly"
    },
    "dependencies": {
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.1.0",
      "@radix-ui/react-slot": "^1.0.0",
      "tailwind-merge": "^2.5.0"
    },
    "peerDependencies": {
      "@meldui/tabler-react": "workspace:*",
      "react": "^18.0.0",
      "react-dom": "^18.0.0"
    },
    "devDependencies": {
      "@tailwindcss/vite": "^4.0.0-alpha.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "@vitejs/plugin-react": "^4.2.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "tailwindcss": "^4.0.0-alpha.0",
      "typescript": "^5.3.0",
      "vite": "^5.0.0"
    }
  }
  ```

---

#### 2.3 Create Tailwind CSS file
- [ ] Create `src/styles/index.css` - same as Vue version

---

#### 2.4 Create utilities
- [ ] Create `src/lib/utils.ts`:
  ```typescript
  import { type ClassValue, clsx } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```

---

#### 2.5 Configure shadcn/ui
- [ ] Create `components.json`:
  ```json
  {
    "style": "default",
    "typescript": true,
    "tailwind": {
      "config": "",
      "css": "src/styles/index.css",
      "baseColor": "slate",
      "cssVariables": true
    },
    "framework": "react",
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils"
    }
  }
  ```

---

#### 2.6 Add shadcn components
- [ ] Run:
  ```bash
  cd packages/react
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add input
  ```

---

#### 2.7 Configure Vite and TypeScript
- [ ] Create vite.config.ts with React and Tailwind v4 plugins
- [ ] Create tsconfig.json with React settings

---

#### 2.8 Create main export
- [ ] Create `src/index.ts`:
  ```typescript
  export { cn } from './lib/utils'
  export { Button } from './components/ui/button'
  export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card'
  export { Input } from './components/ui/input'
  ```

---

#### 2.9 Build and test
- [ ] Run `pnpm build`
- [ ] Verify dist/ outputs

---

## Task 3: Create React Storybook

Mirror Phase 4 for React.

### Sub-tasks

#### 3.1 Initialize Storybook
- [ ] Create `apps/react-storybook/`
- [ ] Run:
  ```bash
  cd apps/react-storybook
  npx storybook@latest init --type react
  ```

---

#### 3.2 Configure Tailwind CSS v4
- [ ] Create `src/styles/tailwind.css` - same as Vue Storybook
- [ ] Update `.storybook/preview.tsx` to import CSS

---

#### 3.3 Configure Storybook
- [ ] Update `.storybook/main.ts` with Tailwind v4 plugin
- [ ] Add workspace dependencies to package.json

---

#### 3.4 Create MDX documentation
- [ ] Copy MDX files from Vue Storybook
- [ ] Update code examples for React syntax

---

#### 3.5 Create component stories
- [ ] Create Button.stories.tsx
- [ ] Create Card.stories.tsx
- [ ] Create IconGallery.stories.tsx

---

#### 3.6 Test and build
- [ ] Run `pnpm storybook`
- [ ] Run `pnpm build-storybook`

---

## Task 4: Update Publishing Configuration

Add React packages to Changesets.

### Sub-tasks

#### 4.1 Verify package configurations
- [ ] Check @meldui/react package.json exports
- [ ] Check @meldui/tabler-react package.json exports

---

#### 4.2 Test publishing
- [ ] Run dry-run publish for both packages
- [ ] Verify file lists

---

## Key Differences from Vue

### 1. Icon Wrapper
- Vue uses `defineComponent` and `h()` render function
- React uses `forwardRef` and JSX

### 2. Component Syntax
- Vue uses Composition API with `<script setup>`
- React uses function components with hooks

### 3. Styling
- Both use Tailwind CSS v4 (same approach)
- Same CSS variables for theming

### 4. Dependencies
- Vue: radix-vue, @vitejs/plugin-vue
- React: @radix-ui/react-*, @vitejs/plugin-react

### 5. Storybook
- Vue: @storybook/vue3
- React: @storybook/react

---

## Phase 6 Completion Checklist

Verify all tasks:

- [ ] @meldui/tabler-react package created and builds
- [ ] @meldui/react package created and builds
- [ ] React Storybook running and building
- [ ] Component stories created
- [ ] Documentation pages adapted for React
- [ ] Packages configured for publishing
- [ ] README files created for both packages

---

## Testing Both Frameworks

When both Vue and React packages exist:

### Consistency Testing
- [ ] Verify components look identical
- [ ] Check that theme variables work the same
- [ ] Test icon sizes and defaults match
- [ ] Ensure Tailwind classes behave consistently

### Documentation
- [ ] Update main README to mention both frameworks
- [ ] Cross-link Vue and React docs in Storybook
- [ ] Document framework-specific differences

---

## Maintenance

When maintaining both frameworks:

1. **Add Components:** Use respective CLI (shadcn-vue vs shadcn-ui)
2. **Update Icons:** Run generation script for both packages
3. **Theme Changes:** Update CSS variables in both style files
4. **Version Bumps:** Create changesets for affected packages

---

**Note:** This phase is marked as "future" because it's only needed when React support is required. The Vue implementation should be fully functional and tested before starting React support.
