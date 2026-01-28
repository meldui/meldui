# Phase 3: Vue Package Setup

**Goal:** Create `@meldui/vue` package with shadcn components and Tailwind CSS v4 integration.

**Estimated Time:** 4-5 hours

**Prerequisites:** Phase 1 and 2 must be complete

---

## Task 1: Create Package Structure

Set up the directory structure for the Vue component library.

### Sub-tasks

#### 1.1 Create package directories

- [ ] Create the directory structure:
  ```bash
  mkdir -p packages/vue/src/components/ui
  mkdir -p packages/vue/src/composites
  mkdir -p packages/vue/src/styles
  mkdir -p packages/vue/src/lib
  ```
- [ ] This creates:
  - `components/ui/` - Shadcn base components
  - `composites/` - Custom composite components
  - `styles/` - Tailwind CSS v4 configuration
  - `lib/` - Utility functions

**Acceptance Criteria:**

- All directories exist under packages/vue/src/

---

#### 1.2 Create package.json

- [ ] Create `packages/vue/package.json`:
  ```json
  {
    "name": "@meldui/vue",
    "version": "0.1.0",
    "description": "MeldUI Vue component library built on shadcn-vue",
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
      "./styles": {
        "import": "./dist/styles/index.css",
        "require": "./dist/styles/index.css"
      }
    },
    "files": ["dist"],
    "scripts": {
      "dev": "vite build --watch",
      "build": "vite build && tsc --emitDeclarationOnly"
    },
    "dependencies": {
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.1.0",
      "radix-vue": "^1.9.0",
      "tailwind-merge": "^2.5.0"
    },
    "peerDependencies": {
      "@meldui/tabler-vue": "workspace:*",
      "vue": "^3.4.0"
    },
    "devDependencies": {
      "@tailwindcss/vite": "^4.0.0-alpha.0",
      "@vitejs/plugin-vue": "^5.0.0",
      "@vue/tsconfig": "^0.5.0",
      "tailwindcss": "^4.0.0-alpha.0",
      "typescript": "^5.3.0",
      "vite": "^5.0.0",
      "vue": "^3.4.0",
      "vue-tsc": "^2.0.0"
    },
    "keywords": ["vue", "components", "design-system", "shadcn", "tailwind"],
    "publishConfig": {
      "access": "public"
    }
  }
  ```

**Key Points:**

- shadcn dependencies (class-variance-authority, clsx, tailwind-merge, radix-vue)
- Tailwind CSS v4 (alpha version)
- @meldui/tabler-vue as peer dependency
- Exports both components and styles

**Acceptance Criteria:**

- package.json exists with correct dependencies
- Tailwind CSS v4 and @tailwindcss/vite are included
- peer dependencies include @meldui/tabler-vue

---

#### 1.3 Install dependencies

- [ ] Navigate to package:
  ```bash
  cd packages/vue
  ```
- [ ] Install all dependencies:
  ```bash
  pnpm install
  ```

**Acceptance Criteria:**

- All dependencies installed successfully
- node_modules exists
- pnpm-lock.yaml updated

---

## Task 2: Set up Tailwind CSS v4

Configure Tailwind CSS v4 with CSS-first approach.

### Sub-tasks

#### 2.1 Create Tailwind CSS file

- [ ] Create `packages/vue/src/styles/index.css`:

  ```css
  /**
   * MeldUI Tailwind CSS v4 Configuration
   *
   * This is a CSS-first configuration for Tailwind CSS v4.
   * No tailwind.config.js file is needed.
   */

  @import 'tailwindcss';

  /**
   * Design Tokens
   * Define custom theme values using the @theme directive.
   */
  @theme {
    /* Colors - Define your design system colors */
    --color-primary: #3b82f6;
    --color-primary-foreground: #ffffff;

    --color-secondary: #6366f1;
    --color-secondary-foreground: #ffffff;

    --color-accent: #f59e0b;
    --color-accent-foreground: #ffffff;

    --color-destructive: #ef4444;
    --color-destructive-foreground: #ffffff;

    --color-muted: #f3f4f6;
    --color-muted-foreground: #6b7280;

    --color-border: #e5e7eb;
    --color-input: #e5e7eb;
    --color-ring: #3b82f6;

    /* Background and foreground */
    --color-background: #ffffff;
    --color-foreground: #0f172a;

    --color-card: #ffffff;
    --color-card-foreground: #0f172a;

    --color-popover: #ffffff;
    --color-popover-foreground: #0f172a;

    /* Icon theming */
    --icon-color: #374151; /* gray-700 */

    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
  }

  /**
   * Dark mode
   * Override theme values for dark mode.
   */
  .dark {
    --color-primary: #60a5fa;
    --color-primary-foreground: #1e293b;

    --color-background: #0f172a;
    --color-foreground: #f1f5f9;

    --color-card: #1e293b;
    --color-card-foreground: #f1f5f9;

    --color-muted: #1e293b;
    --color-muted-foreground: #94a3b8;

    --color-border: #334155;
    --color-input: #334155;

    --icon-color: #e5e7eb; /* gray-200 */
  }

  /**
   * Base styles
   * Apply base styles to HTML elements.
   */
  @layer base {
    * {
      @apply border-border;
    }

    body {
      @apply bg-background text-foreground;
      font-feature-settings:
        'rlig' 1,
        'calt' 1;
    }
  }

  /**
   * Component layer
   * Add custom component classes here.
   */
  @layer components {
    /* Component-specific styles will be added by shadcn components */
  }

  /**
   * Utility layer
   * Custom utility classes.
   */
  @layer utilities {
    /* Add custom utilities if needed */
  }
  ```

**IMPORTANT:**

- This uses `@import "tailwindcss"` (v4 syntax)
- Uses `@theme` directive (v4 feature)
- No tailwind.config.js needed
- Includes icon color CSS variable for icon package integration

**Acceptance Criteria:**

- styles/index.css exists
- Uses Tailwind v4 syntax (@import "tailwindcss", @theme)
- Includes design tokens and dark mode
- Includes --icon-color variable

---

## Task 3: Create Utility Functions

Set up utility functions needed by shadcn components.

### Sub-tasks

#### 3.1 Create cn utility

- [ ] Create `packages/vue/src/lib/utils.ts`:

  ```typescript
  import { type ClassValue, clsx } from 'clsx'
  import { twMerge } from 'tailwind-merge'

  /**
   * Utility for merging Tailwind CSS classes.
   *
   * This function combines clsx and tailwind-merge to:
   * 1. Handle conditional classes (via clsx)
   * 2. Properly merge conflicting Tailwind classes (via tailwind-merge)
   *
   * Example:
   * cn('px-2 py-1', condition && 'px-4') => 'py-1 px-4'
   * Without merge, you'd get: 'px-2 py-1 px-4' (conflicting classes)
   */
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```

**What this does:**

- Combines clsx (conditional classes) and tailwind-merge (deduplication)
- Essential for shadcn components
- Handles class conflicts properly

**Acceptance Criteria:**

- lib/utils.ts exists
- cn function is exported
- Has JSDoc documentation

---

## Task 4: Configure Vite Build

Set up Vite to build the Vue package with Tailwind CSS v4.

### Sub-tasks

#### 4.1 Create vite.config.ts

- [ ] Create `packages/vue/vite.config.ts`:

  ```typescript
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import tailwindcss from '@tailwindcss/vite'
  import { resolve } from 'path'

  export default defineConfig({
    plugins: [
      vue(),
      tailwindcss(), // Tailwind CSS v4 Vite plugin
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'MeldUIVue',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        // External dependencies that shouldn't be bundled
        external: [
          'vue',
          '@meldui/tabler-vue',
          /^@tabler\/icons-vue/, // Exclude all @tabler/icons-vue imports
        ],
        output: {
          globals: {
            vue: 'Vue',
          },
          // Also export CSS
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'styles/index.css'
            }
            return assetInfo.name || ''
          },
        },
      },
      cssCodeSplit: false, // Bundle all CSS into one file
      sourcemap: true,
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  })
  ```

**Key Configuration:**

- `tailwindcss()` plugin for Tailwind v4
- External: vue and @meldui/tabler-vue (peer dependencies)
- CSS bundled into dist/styles/index.css
- Alias `@` points to src/ for imports

**Acceptance Criteria:**

- vite.config.ts exists
- Uses @tailwindcss/vite plugin
- External dependencies are correct
- CSS output path is configured

---

#### 4.2 Create tsconfig.json

- [ ] Create `packages/vue/tsconfig.json`:
  ```json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src",
      "composite": true,
      "jsx": "preserve",
      "jsxImportSource": "vue",
      "paths": {
        "@/*": ["./src/*"]
      }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
  }
  ```

**Acceptance Criteria:**

- tsconfig.json extends root config
- Path alias `@/*` matches Vite config
- Includes src/ directory

---

## Task 5: Add Shadcn Components

Use shadcn-vue CLI to add base components.

### Sub-tasks

#### 5.1 Configure shadcn-vue

- [ ] Create `components.json` in packages/vue/:
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
    "framework": "vue",
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils"
    }
  }
  ```

**What this does:**

- Configures shadcn-vue CLI
- Points to Tailwind CSS file (v4)
- Sets up aliases for imports
- Enables CSS variables for theming

**Acceptance Criteria:**

- components.json exists
- Points to correct CSS file
- Aliases match tsconfig and vite config

---

#### 5.2 Add initial components

- [ ] Add Button component:
  ```bash
  cd packages/vue
  npx shadcn-vue@latest add button
  ```
- [ ] Add Card component:
  ```bash
  npx shadcn-vue@latest add card
  ```
- [ ] Add Input component:
  ```bash
  npx shadcn-vue@latest add input
  ```

**What this does:**

- Downloads component files from shadcn-vue
- Copies them into src/components/ui/
- Components are now part of your codebase (can be modified)

**Expected Output:**

```
✔ Which components would you like to add? › button
✔ Checking registry...
✔ Installing dependencies...
✔ Created 1 file:
  - src/components/ui/button/Button.vue
```

**Acceptance Criteria:**

- src/components/ui/button/ directory exists with Button.vue
- src/components/ui/card/ directory exists with Card.vue
- src/components/ui/input/ directory exists with Input.vue
- Components use Tailwind classes

---

#### 5.3 Verify component files

- [ ] Check that components were added correctly:
  ```bash
  ls src/components/ui/
  ```
- [ ] Should show: button/, card/, input/
- [ ] Open one component file and verify:
  - Uses `cn()` utility from `@/lib/utils`
  - Uses Tailwind CSS classes
  - Written in TypeScript with Vue 3 Composition API

**Acceptance Criteria:**

- All three components exist
- Components import from `@/lib/utils`
- Components use proper TypeScript types

---

## Task 6: Create Main Export File

Set up the main entry point that exports all components.

### Sub-tasks

#### 6.1 Create index.ts

- [ ] Create `packages/vue/src/index.ts`:

  ```typescript
  /**
   * MeldUI Vue Component Library
   *
   * This package provides Vue 3 components built on shadcn-vue.
   * Components are customized for the MeldUI design system.
   */

  // Export utility functions
  export { cn } from './lib/utils'

  // Export UI components
  export { default as Button } from './components/ui/button/Button.vue'
  export { default as Card } from './components/ui/card/Card.vue'
  export { default as CardHeader } from './components/ui/card/CardHeader.vue'
  export { default as CardTitle } from './components/ui/card/CardTitle.vue'
  export { default as CardDescription } from './components/ui/card/CardDescription.vue'
  export { default as CardContent } from './components/ui/card/CardContent.vue'
  export { default as CardFooter } from './components/ui/card/CardFooter.vue'
  export { default as Input } from './components/ui/input/Input.vue'

  // Export composite components (none yet, but ready for future)
  // export { default as Example } from './composites/Example.vue'

  // Re-export types from dependencies if needed
  export type { ClassValue } from 'clsx'
  ```

**Note:** You may need to adjust the export names based on how shadcn-vue structures its components.

**Acceptance Criteria:**

- src/index.ts exists
- Exports all added components
- Exports cn utility
- Has descriptive header comment

---

## Task 7: Build and Test the Package

Build the package and verify it works.

### Sub-tasks

#### 7.1 Build the package

- [ ] Run build command:
  ```bash
  cd packages/vue
  pnpm build
  ```
- [ ] This should:
  - Compile TypeScript
  - Process Tailwind CSS v4
  - Bundle components
  - Generate type definitions
  - Output CSS file

**Expected Output:**

```
vite v5.x.x building for production...
✓ XX modules transformed.
dist/index.mjs         XX.XX kB │ gzip: XX.XX kB
dist/index.cjs         XX.XX kB │ gzip: XX.XX kB
dist/styles/index.css  XX.XX kB │ gzip: XX.XX kB
✓ built in XXXXms
```

**Acceptance Criteria:**

- Build completes without errors
- dist/index.mjs exists
- dist/index.cjs exists
- dist/styles/index.css exists (Tailwind CSS output)
- dist/index.d.ts exists

---

#### 7.2 Verify build outputs

- [ ] Check dist/ directory structure:
  ```bash
  ls -la dist/
  ```
- [ ] Should contain:
  - index.mjs (ESM build)
  - index.cjs (CJS build)
  - index.d.ts (TypeScript types)
  - styles/index.css (Tailwind CSS)
  - Source maps

**Acceptance Criteria:**

- All expected files exist
- CSS file contains compiled Tailwind styles (check with `cat dist/styles/index.css`)
- TypeScript definitions include all exports

---

#### 7.3 Test imports (optional)

- [ ] Create a quick test to verify imports work:

  ```bash
  # In packages/vue, create test-import.mjs
  cat > test-import.mjs << 'EOF'
  import { cn } from './dist/index.mjs'

  console.log('cn utility:', typeof cn)
  console.log('Test merge:', cn('px-2 py-1', 'px-4'))

  console.log('✅ Import test passed')
  EOF

  node test-import.mjs
  ```

**Expected Output:**

```
cn utility: function
Test merge: py-1 px-4
✅ Import test passed
```

**Acceptance Criteria:**

- Import works without errors
- cn function is available
- Tailwind classes merge correctly

---

## Task 8: Add Package Documentation

Create README for the Vue package.

### Sub-tasks

#### 8.1 Create README.md

- [ ] Create `packages/vue/README.md`:

  ```markdown
  # @meldui/vue

  MeldUI Vue 3 component library built on shadcn-vue.

  ## Installation

  \`\`\`bash
  pnpm add @meldui/vue @meldui/tabler-vue vue
  \`\`\`

  ## Setup

  ### 1. Import styles in your main.ts

  \`\`\`typescript
  import '@meldui/vue/styles'
  import { createApp } from 'vue'
  import App from './App.vue'

  createApp(App).mount('#app')
  \`\`\`

  ### 2. Use components

  \`\`\`vue

  <script setup lang="ts">
  import { Button, Card, Input } from '@meldui/vue'
  import { IconX } from '@meldui/tabler-vue'
  </script>

  <template>
    <Card>
      <CardHeader>
        <CardTitle>Welcome to MeldUI</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter your name..." />
        <Button>
          <IconX :size="20" />
          Submit
        </Button>
      </CardContent>
    </Card>
  </template>
  \`\`\`

  ## Available Components

  ### UI Components (shadcn-vue)

  - Button
  - Card (with CardHeader, CardTitle, CardContent, CardFooter)
  - Input
  - (More will be added via shadcn CLI)

  ### Utilities

  - `cn()` - Class name merge utility

  ## Theming

  Components use Tailwind CSS v4 with CSS variables for theming.

  Customize the theme by overriding CSS variables:

  \`\`\`css
  :root {
  --color-primary: #your-color;
  --color-background: #your-color;
  /_ See src/styles/index.css for all variables _/
  }
  \`\`\`

  ## Dark Mode

  Add the `dark` class to enable dark mode:

  \`\`\`html

  <html class="dark">
  \`\`\`

  ## Adding More Components

  Use shadcn-vue CLI to add more components:

  \`\`\`bash
  cd packages/vue
  npx shadcn-vue@latest add [component-name]
  \`\`\`

  Then export the component in `src/index.ts`.

  ## Development

  \`\`\`bash

  # Build the package

  pnpm build

  # Watch mode for development

  pnpm dev
  \`\`\`

  ## License

  MIT (internal use only)
  \`\`\`
  ```

**Acceptance Criteria:**

- README.md exists with usage examples
- Installation and setup instructions are clear
- Shows how to use with icon package
- Includes theming information

---

## Phase 3 Completion Checklist

Verify all tasks are complete:

- [ ] Package directory structure created
- [ ] package.json configured with dependencies
- [ ] Tailwind CSS v4 configured (styles/index.css with @import and @theme)
- [ ] Utility functions created (lib/utils.ts with cn)
- [ ] Vite configured with @tailwindcss/vite plugin
- [ ] TypeScript configuration created
- [ ] shadcn-vue configured (components.json)
- [ ] Initial components added (Button, Card, Input)
- [ ] Main export file created (src/index.ts)
- [ ] Package builds successfully
- [ ] CSS is compiled and exported
- [ ] TypeScript types are generated
- [ ] README documentation created

**Test Commands:**

```bash
cd packages/vue
pnpm build  # Should complete without errors

# Check outputs
ls dist/index.mjs dist/index.cjs dist/styles/index.css dist/index.d.ts

# Check Tailwind compilation
grep "@tailwindcss" dist/styles/index.css  # Should be compiled (no @import)
```

**File Structure Verification:**

```
packages/vue/
├── dist/
│   ├── index.mjs
│   ├── index.cjs
│   ├── index.d.ts
│   └── styles/
│       └── index.css
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button/
│   │       ├── card/
│   │       └── input/
│   ├── composites/      (empty for now)
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── index.css
│   └── index.ts
├── components.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Next Steps:**
Proceed to [04-vue-storybook-setup.md](./04-vue-storybook-setup.md) to create documentation with Storybook.
