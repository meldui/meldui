# Phase 2: Tabler Icon Package Setup

**Goal:** Create `@meldui/tabler-vue` package that wraps Tabler Icons with custom defaults.

**Estimated Time:** 3-4 hours

**Prerequisites:** Phase 1 must be complete

---

## Task 1: Create Package Structure

Set up the directory structure for the icon package.

### Sub-tasks

#### 1.1 Create package directory
- [ ] Create the package directory:
  ```bash
  mkdir -p packages/tabler-vue/src/custom
  mkdir -p packages/tabler-vue/scripts
  ```
- [ ] This creates:
  - `src/` for icon code
  - `src/custom/` for custom company icons (future)
  - `scripts/` for the icon generation script

**Acceptance Criteria:**
- Directory `packages/tabler-vue/` exists
- Subdirectories `src/`, `src/custom/`, and `scripts/` exist

---

#### 1.2 Create package.json
- [ ] Create `packages/tabler-vue/package.json`:
  ```json
  {
    "name": "@meldui/tabler-vue",
    "version": "0.1.0",
    "description": "Tabler Icons for Vue with MeldUI defaults",
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
    "files": [
      "dist"
    ],
    "scripts": {
      "dev": "vite build --watch",
      "build": "vite build && tsc --emitDeclarationOnly",
      "generate-icons": "tsx scripts/generate.ts"
    },
    "dependencies": {
      "@tabler/icons-vue": "^3.0.0"
    },
    "peerDependencies": {
      "vue": "^3.4.0"
    },
    "devDependencies": {
      "@vitejs/plugin-vue": "^5.0.0",
      "typescript": "^5.3.0",
      "vite": "^5.0.0",
      "vue": "^3.4.0",
      "tsx": "^4.7.0"
    },
    "keywords": ["vue", "icons", "tabler", "design-system"],
    "publishConfig": {
      "access": "public"
    }
  }
  ```

**Key Points:**
- `@tabler/icons-vue` is a regular dependency (gets bundled)
- `vue` is a peer dependency (user must install)
- `exports` field provides proper ESM/CJS support

**Acceptance Criteria:**
- package.json exists with correct configuration
- name is `@meldui/tabler-vue`
- exports field is properly configured

---

#### 1.3 Install package dependencies
- [ ] Navigate to the package:
  ```bash
  cd packages/tabler-vue
  ```
- [ ] Install dependencies:
  ```bash
  pnpm install
  ```
- [ ] This installs Tabler Icons and dev dependencies

**Acceptance Criteria:**
- node_modules exists in packages/tabler-vue
- @tabler/icons-vue is installed
- pnpm-lock.yaml is updated

---

## Task 2: Create Icon Defaults Configuration

Define the default icon properties.

### Sub-tasks

#### 2.1 Create defaults.ts
- [ ] Create `packages/tabler-vue/src/defaults.ts`:
  ```typescript
  /**
   * Default configuration for all MeldUI icons.
   * These values can be overridden per-instance via props.
   */
  export const ICON_DEFAULTS = {
    size: 24,           // 24px base size
    strokeWidth: 1.5,   // Medium stroke weight
  } as const

  export type IconDefaults = typeof ICON_DEFAULTS
  ```

**Why these defaults?**
- `size: 24` - Standard icon size that works well at typical UI scales
- `strokeWidth: 1.5` - Medium weight that balances clarity and aesthetics

**Acceptance Criteria:**
- defaults.ts exists in src/
- ICON_DEFAULTS is exported as const
- TypeScript type is exported

---

## Task 3: Create Icon Wrapper Component

Build the wrapper that applies defaults to Tabler icons.

### Sub-tasks

#### 3.1 Create wrapper.ts
- [ ] Create `packages/tabler-vue/src/wrapper.ts`:
  ```typescript
  import { defineComponent, h, type Component } from 'vue'
  import { ICON_DEFAULTS } from './defaults'

  /**
   * Wraps a Tabler icon component with MeldUI defaults.
   *
   * This wrapper:
   * - Applies default size and strokeWidth from ICON_DEFAULTS
   * - Allows props to override defaults
   * - Integrates with CSS variables for theming (--icon-color)
   * - Preserves all original icon functionality
   *
   * @param OriginalIcon - The original Tabler icon component
   * @returns A wrapped component with MeldUI defaults
   */
  export function createIcon(OriginalIcon: Component) {
    return defineComponent({
      name: OriginalIcon.name || 'Icon',
      props: {
        size: {
          type: Number,
          default: ICON_DEFAULTS.size
        },
        strokeWidth: {
          type: Number,
          default: ICON_DEFAULTS.strokeWidth
        },
        color: {
          type: String,
          default: undefined
        },
      },
      setup(props, { attrs }) {
        return () => h(OriginalIcon, {
          ...props,
          style: {
            color: props.color ?? 'var(--icon-color, currentColor)',
            ...(attrs.style as any)
          },
          ...attrs
        })
      }
    })
  }
  ```

**What this does:**
- Takes any Tabler icon component
- Wraps it with default props
- Adds CSS variable integration for theming
- Preserves all attrs and functionality

**Acceptance Criteria:**
- wrapper.ts exists in src/
- createIcon function is exported
- Code has proper TypeScript types
- JSDoc comments explain the purpose

---

## Task 4: Create Icon Generation Script

Build a script to auto-generate icon re-exports.

### Sub-tasks

#### 4.1 Create generate.ts script
- [ ] Create `packages/tabler-vue/scripts/generate.ts`:
  ```typescript
  #!/usr/bin/env tsx
  import { writeFileSync } from 'fs'
  import { resolve } from 'path'

  /**
   * Icon generation script for @meldui/tabler-vue
   *
   * This script:
   * 1. Imports all icons from @tabler/icons-vue
   * 2. Generates re-exports that wrap each icon with createIcon()
   * 3. Writes the result to src/index.ts
   *
   * Run this script whenever @tabler/icons-vue is updated to sync new icons.
   *
   * Usage: pnpm generate-icons
   */

  async function generateIcons() {
    console.log('🔄 Generating icon re-exports...')

    // Import all Tabler icons
    const tablerIcons = await import('@tabler/icons-vue')

    // Get all icon names (exports starting with 'Icon')
    const iconNames = Object.keys(tablerIcons).filter(name =>
      name.startsWith('Icon') && name !== 'Icon'
    )

    console.log(`📦 Found ${iconNames.length} icons from @tabler/icons-vue`)

    // Generate import statements
    const imports = `import { ${iconNames.join(', ')} } from '@tabler/icons-vue'`

    // Generate re-exports with wrapper
    const exports = iconNames.map(name =>
      `export const ${name} = createIcon(${name})`
    ).join('\n')

    // Build the complete file content
    const fileContent = `/**
   * Auto-generated icon exports for @meldui/tabler-vue
   *
   * DO NOT EDIT THIS FILE MANUALLY!
   * Generated by: pnpm generate-icons
   * Generated on: ${new Date().toISOString()}
   *
   * This file re-exports all Tabler icons with MeldUI defaults applied.
   * Icons are wrapped using createIcon() to provide consistent sizing,
   * stroke width, and theme integration.
   */

  import { createIcon } from './wrapper'
  ${imports}

  // Re-export all icons with MeldUI defaults
  ${exports}

  // Re-export utilities
  export { createIcon } from './wrapper'
  export { ICON_DEFAULTS } from './defaults'
  export type { IconDefaults } from './defaults'
  `

    // Write to src/index.ts
    const outputPath = resolve(__dirname, '../src/index.ts')
    writeFileSync(outputPath, fileContent, 'utf-8')

    console.log(`✅ Generated ${iconNames.length} icon exports`)
    console.log(`📝 Written to: src/index.ts`)
  }

  // Run the generator
  generateIcons().catch(console.error)
  ```

**What this does:**
- Reads all exports from @tabler/icons-vue
- Generates wrapped re-exports for each icon
- Writes to src/index.ts
- Adds helpful comments and metadata

**Acceptance Criteria:**
- generate.ts exists in scripts/
- Script has proper imports and error handling
- Script logs progress to console
- Script is executable with tsx

---

#### 4.2 Run the generation script
- [ ] Run the script to generate icons:
  ```bash
  cd packages/tabler-vue
  pnpm generate-icons
  ```
- [ ] This creates `src/index.ts` with ~5000+ icon exports

**Expected Output:**
```
🔄 Generating icon re-exports...
📦 Found 5234 icons from @tabler/icons-vue
✅ Generated 5234 icon exports
📝 Written to: src/index.ts
```

**Acceptance Criteria:**
- src/index.ts is created
- File contains wrapped icon exports
- File includes header comment with generation date
- File exports createIcon and ICON_DEFAULTS

---

## Task 5: Configure Vite Build

Set up Vite to build the package as a library.

### Sub-tasks

#### 5.1 Create vite.config.ts
- [ ] Create `packages/tabler-vue/vite.config.ts`:
  ```typescript
  import { defineConfig } from 'vite'
  import vue from '@vitejs/plugin-vue'
  import { resolve } from 'path'

  export default defineConfig({
    plugins: [vue()],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'MeldUITablerVue',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`
      },
      rollupOptions: {
        // Externalize dependencies that shouldn't be bundled
        external: ['vue'],
        output: {
          // Provide globals for UMD build (if needed later)
          globals: {
            vue: 'Vue'
          },
          // Preserve the structure for better tree-shaking
          preserveModules: false,
        }
      },
      sourcemap: true,
      // Clear output directory before build
      emptyOutDir: true
    }
  })
  ```

**Key Configuration:**
- `lib` mode creates a library (not an app)
- `external: ['vue']` - Vue is not bundled (peer dependency)
- `@tabler/icons-vue` IS bundled (regular dependency)
- Outputs both ESM (.mjs) and CJS (.cjs)
- Source maps enabled for debugging

**Acceptance Criteria:**
- vite.config.ts exists
- Configuration is for library mode
- External dependencies are correct

---

#### 5.2 Create tsconfig.json
- [ ] Create `packages/tabler-vue/tsconfig.json`:
  ```json
  {
    "extends": "../../tsconfig.json",
    "compilerOptions": {
      "outDir": "./dist",
      "rootDir": "./src",
      "composite": true,
      "jsx": "preserve",
      "jsxImportSource": "vue"
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist", "scripts"]
  }
  ```

**Acceptance Criteria:**
- tsconfig.json extends root config
- Includes src/ directory
- Excludes scripts/ from compilation

---

#### 5.3 Build the package
- [ ] Run the build command:
  ```bash
  pnpm build
  ```
- [ ] This should:
  - Build ESM and CJS versions
  - Generate TypeScript declarations
  - Create source maps
  - Output to `dist/` directory

**Expected Output:**
```
vite v5.x.x building for production...
✓ 5234 modules transformed.
dist/index.mjs         X.XX MB │ gzip: Y.YY MB
dist/index.cjs         X.XX MB │ gzip: Y.YY MB
✓ built in XXXXms
```

**Acceptance Criteria:**
- dist/ directory is created
- dist/index.mjs exists (ESM build)
- dist/index.cjs exists (CJS build)
- dist/index.d.ts exists (TypeScript types)
- dist/index.mjs.map exists (source map)
- No build errors

---

## Task 6: Test the Package

Verify the icon package works correctly.

### Sub-tasks

#### 6.1 Create a test file
- [ ] Create `packages/tabler-vue/test.html` for manual testing:
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Icon Package Test</title>
    <script type="module">
      import { createApp } from 'vue'
      import { IconX, IconUser, IconSettings, ICON_DEFAULTS } from './src/index.ts'

      console.log('Icon defaults:', ICON_DEFAULTS)

      const app = createApp({
        components: { IconX, IconUser, IconSettings },
        template: `
          <div style="padding: 20px; font-family: sans-serif;">
            <h2>Icon Package Test</h2>
            <div style="display: flex; gap: 20px; margin: 20px 0;">
              <div>
                <p>Default (24px, stroke 1.5)</p>
                <IconX />
              </div>
              <div>
                <p>Large (48px)</p>
                <IconUser :size="48" />
              </div>
              <div>
                <p>Thick stroke (stroke 2.5)</p>
                <IconSettings :stroke-width="2.5" />
              </div>
              <div style="color: red;">
                <p>Colored (inherits color)</p>
                <IconX />
              </div>
            </div>
          </div>
        `
      })

      app.mount('#app')
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
  ```

**Note:** This is just for development testing. Delete after verification.

---

#### 6.2 Verify icon properties
- [ ] Check that generated icons have correct defaults:
  - Default size should be 24
  - Default strokeWidth should be 1.5
- [ ] Check TypeScript types are working
- [ ] Check that icons can be imported

**Manual Testing:**
```bash
# In packages/tabler-vue
pnpm dev
# Open test.html in browser using Vite's dev server
```

**Acceptance Criteria:**
- Icons render correctly
- Default size is 24px
- Props can override defaults
- No console errors
- TypeScript autocomplete works for icon names

---

## Task 7: Add Package README

Document how to use the icon package.

### Sub-tasks

#### 7.1 Create README.md
- [ ] Create `packages/tabler-vue/README.md`:
  ```markdown
  # @meldui/tabler-vue

  Tabler Icons for Vue 3 with MeldUI design system defaults.

  ## Installation

  \`\`\`bash
  pnpm add @meldui/tabler-vue vue
  \`\`\`

  ## Usage

  \`\`\`vue
  <script setup>
  import { IconX, IconUser, IconSettings } from '@meldui/tabler-vue'
  </script>

  <template>
    <div>
      <!-- Default size (24px) and strokeWidth (1.5) -->
      <IconX />

      <!-- Override size -->
      <IconUser :size="32" />

      <!-- Override stroke width -->
      <IconSettings :stroke-width="2" />

      <!-- Color inherits from parent text color -->
      <span class="text-red-500">
        <IconX />
      </span>

      <!-- Explicit color -->
      <IconX color="#ff0000" />
    </div>
  </template>
  \`\`\`

  ## Default Configuration

  All icons use these defaults (can be overridden via props):
  - `size`: 24px
  - `strokeWidth`: 1.5

  ## Theme Integration

  Icons respect the CSS variable `--icon-color` for theming:

  \`\`\`css
  :root {
    --icon-color: #374151; /* gray-700 */
  }

  .dark {
    --icon-color: #e5e7eb; /* gray-200 */
  }
  \`\`\`

  ## Available Icons

  This package re-exports all 5000+ icons from [@tabler/icons-vue](https://tabler.io/icons).

  Browse all available icons at: https://tabler.io/icons

  ## For Maintainers

  ### Syncing with Tabler Updates

  When @tabler/icons-vue releases new icons:

  \`\`\`bash
  cd packages/tabler-vue
  pnpm update @tabler/icons-vue
  pnpm generate-icons  # Regenerate src/index.ts
  pnpm build
  # Review changes, then publish new version
  \`\`\`

  ## License

  MIT (internal use only)
  \`\`\`

**Acceptance Criteria:**
- README.md exists with usage examples
- Installation instructions are clear
- Maintainer instructions are included

---

## Phase 2 Completion Checklist

Verify all tasks are complete:

- [ ] Package directory structure created
- [ ] package.json configured with correct exports
- [ ] Dependencies installed (@tabler/icons-vue, Vue as peer)
- [ ] defaults.ts created with ICON_DEFAULTS
- [ ] wrapper.ts created with createIcon function
- [ ] Generation script (scripts/generate.ts) created
- [ ] Icons generated (src/index.ts created with 5000+ exports)
- [ ] Vite configuration created for library build
- [ ] TypeScript configuration created
- [ ] Package builds successfully (dist/ directory created)
- [ ] Package exports work (can import icons)
- [ ] README documentation created

**Test Commands:**
```bash
cd packages/tabler-vue
pnpm build  # Should complete without errors
pnpm generate-icons  # Should regenerate icons

# Check outputs exist
ls dist/index.mjs dist/index.cjs dist/index.d.ts
```

**File Structure Verification:**
```
packages/tabler-vue/
├── dist/
│   ├── index.mjs
│   ├── index.cjs
│   ├── index.d.ts
│   └── index.mjs.map
├── scripts/
│   └── generate.ts
├── src/
│   ├── custom/        (empty for now)
│   ├── defaults.ts
│   ├── wrapper.ts
│   └── index.ts       (auto-generated)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Next Steps:**
Proceed to [03-vue-package-setup.md](./03-vue-package-setup.md) to create the Vue component library.
