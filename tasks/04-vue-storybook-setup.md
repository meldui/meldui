# Phase 4: Vue Storybook Setup

**Goal:** Create Storybook documentation app for Vue components with MDX guides and interactive examples.

**Estimated Time:** 4-6 hours

**Prerequisites:** Phase 1, 2, and 3 must be complete

---

## Task 1: Initialize Storybook

Set up a new Storybook application for Vue 3.

### Sub-tasks

#### 1.1 Create app directory
- [ ] Create apps directory structure:
  ```bash
  mkdir -p apps/vue-storybook
  cd apps/vue-storybook
  ```

**Acceptance Criteria:**
- Directory apps/vue-storybook/ exists

---

#### 1.2 Initialize Storybook
- [ ] Run Storybook initialization:
  ```bash
  npx storybook@latest init --type vue3
  ```
- [ ] This will:
  - Create .storybook/ configuration directory
  - Install Storybook dependencies
  - Create sample stories
  - Add scripts to package.json

**Interactive Prompts:**
- Choose "vue3" as framework
- Accept installation of required dependencies
- Don't run Storybook yet (we need to configure it first)

**Acceptance Criteria:**
- .storybook/ directory created with main.ts and preview.ts
- Storybook dependencies added to package.json
- Sample stories created (we'll delete these later)

---

#### 1.3 Update package.json
- [ ] Modify generated `apps/vue-storybook/package.json` to add workspace dependencies:
  ```json
  {
    "name": "vue-storybook",
    "version": "0.1.0",
    "private": true,
    "type": "module",
    "scripts": {
      "dev": "storybook dev -p 6006",
      "build": "storybook build",
      "storybook": "storybook dev -p 6006",
      "build-storybook": "storybook build"
    },
    "dependencies": {
      "@meldui/vue": "workspace:*",
      "@meldui/tabler-vue": "workspace:*",
      "vue": "^3.4.0"
    },
    "devDependencies": {
      "@storybook/addon-a11y": "^8.0.0",
      "@storybook/addon-docs": "^8.0.0",
      "@storybook/addon-essentials": "^8.0.0",
      "@storybook/addon-interactions": "^8.0.0",
      "@storybook/addon-links": "^8.0.0",
      "@storybook/addon-measure": "^8.0.0",
      "@storybook/addon-outline": "^8.0.0",
      "@storybook/addon-viewport": "^8.0.0",
      "@storybook/blocks": "^8.0.0",
      "@storybook/test": "^8.0.0",
      "@storybook/vue3": "^8.0.0",
      "@storybook/vue3-vite": "^8.0.0",
      "@tailwindcss/vite": "^4.0.0-alpha.0",
      "@vitejs/plugin-vue": "^5.0.0",
      "storybook": "^8.0.0",
      "tailwindcss": "^4.0.0-alpha.0",
      "typescript": "^5.3.0",
      "vite": "^5.0.0"
    }
  }
  ```

**Key Points:**
- `workspace:*` links to local packages
- Includes all useful Storybook addons
- Includes Tailwind v4 for styling

**Acceptance Criteria:**
- package.json has workspace dependencies
- All Storybook addons are included
- Tailwind CSS v4 is included

---

#### 1.4 Install dependencies
- [ ] Install all dependencies:
  ```bash
  pnpm install
  ```

**Acceptance Criteria:**
- Dependencies installed successfully
- @meldui/vue and @meldui/tabler-vue linked from workspace

---

## Task 2: Configure Tailwind CSS v4 in Storybook

Set up Tailwind CSS v4 so components render correctly.

### Sub-tasks

#### 2.1 Create Tailwind CSS file
- [ ] Create `apps/vue-storybook/src/styles/tailwind.css`:
  ```bash
  mkdir -p src/styles
  ```
- [ ] Create the CSS file:
  ```css
  /**
   * Tailwind CSS v4 for Storybook
   *
   * This imports Tailwind and extends the MeldUI theme.
   */

  @import "tailwindcss";

  /**
   * Import MeldUI theme
   * Re-use the same theme configuration from @meldui/vue
   */
  @theme {
    /* Colors - matching @meldui/vue */
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

    --color-background: #ffffff;
    --color-foreground: #0f172a;

    --color-card: #ffffff;
    --color-card-foreground: #0f172a;

    --color-popover: #ffffff;
    --color-popover-foreground: #0f172a;

    --icon-color: #374151;

    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
  }

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

    --icon-color: #e5e7eb;
  }

  /**
   * Storybook-specific styles
   */
  @layer base {
    * {
      @apply border-border;
    }

    body {
      @apply bg-background text-foreground;
    }
  }
  ```

**Note:** This mirrors the theme from @meldui/vue so components look the same.

**Acceptance Criteria:**
- src/styles/tailwind.css exists
- Uses Tailwind v4 syntax (@import, @theme)
- Includes all theme variables

---

#### 2.2 Configure Storybook preview
- [ ] Update `.storybook/preview.ts` to import Tailwind:
  ```typescript
  import type { Preview } from '@storybook/vue3'
  import '../src/styles/tailwind.css' // Import Tailwind CSS

  const preview: Preview = {
    parameters: {
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/i,
        },
      },
      backgrounds: {
        default: 'light',
        values: [
          {
            name: 'light',
            value: '#ffffff',
          },
          {
            name: 'dark',
            value: '#0f172a',
          },
        ],
      },
      viewport: {
        viewports: {
          mobile: {
            name: 'Mobile',
            styles: { width: '375px', height: '667px' },
          },
          tablet: {
            name: 'Tablet',
            styles: { width: '768px', height: '1024px' },
          },
          desktop: {
            name: 'Desktop',
            styles: { width: '1280px', height: '800px' },
          },
        },
      },
    },
  }

  export default preview
  ```

**What this does:**
- Imports Tailwind CSS globally
- Configures background colors for testing
- Sets up responsive viewports

**Acceptance Criteria:**
- preview.ts imports tailwind.css
- Background and viewport options configured

---

#### 2.3 Configure Storybook main
- [ ] Update `.storybook/main.ts` to use Tailwind Vite plugin:
  ```typescript
  import type { StorybookConfig } from '@storybook/vue3-vite'
  import tailwindcss from '@tailwindcss/vite'
  import { mergeConfig } from 'vite'

  const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
      '@storybook/addon-links',
      '@storybook/addon-essentials',
      '@storybook/addon-interactions',
      '@storybook/addon-a11y',
      '@storybook/addon-measure',
      '@storybook/addon-outline',
      '@storybook/addon-viewport',
    ],
    framework: {
      name: '@storybook/vue3-vite',
      options: {},
    },
    docs: {
      autodocs: 'tag',
    },
    viteFinal: async (config) => {
      // Add Tailwind CSS v4 Vite plugin
      return mergeConfig(config, {
        plugins: [tailwindcss()],
      })
    },
  }

  export default config
  ```

**What this does:**
- Registers all Storybook addons
- Adds Tailwind CSS v4 Vite plugin to Storybook's build
- Enables autodocs for components

**Acceptance Criteria:**
- main.ts includes @tailwindcss/vite plugin
- All addons are registered
- Stories glob pattern includes MDX files

---

## Task 3: Create MDX Documentation Pages

Write guides for users of the design system.

### Sub-tasks

#### 3.1 Create stories directory
- [ ] Create directory structure:
  ```bash
  mkdir -p src/stories/Components
  mkdir -p src/stories/Composites
  mkdir -p src/stories/Examples
  ```

**Acceptance Criteria:**
- src/stories/ directory with subdirectories exists

---

#### 3.2 Create Introduction.mdx
- [ ] Create `src/stories/Introduction.mdx`:
  ```mdx
  import { Meta } from '@storybook/blocks'

  <Meta title="Introduction" />

  # Welcome to MeldUI

  MeldUI is an internal design system built on shadcn components, providing a consistent and beautiful UI across all our applications.

  ## What's Included

  - **UI Components** - Base components from shadcn-vue (Button, Card, Input, etc.)
  - **Composite Components** - Custom combinations built from base components
  - **Icon System** - 5000+ Tabler icons with custom defaults
  - **Theming** - Customizable via CSS variables
  - **TypeScript** - Full type safety
  - **Vue 3** - Built with Composition API

  ## Quick Start

  \`\`\`bash
  # Install packages
  pnpm add @meldui/vue @meldui/tabler-vue vue
  \`\`\`

  \`\`\`typescript
  // Import styles
  import '@meldui/vue/styles'

  // Import components
  import { Button, Card } from '@meldui/vue'
  import { IconX } from '@meldui/tabler-vue'
  \`\`\`

  ## Browse Components

  Use the sidebar to explore available components, see usage examples, and test with interactive controls.

  ## Need Help?

  - Check the [Installation](/?path=/docs/installation--docs) guide
  - Learn about [Theming](/?path=/docs/theming--docs)
  - Explore the [Icon System](/?path=/docs/icons--docs)
  ```

**Acceptance Criteria:**
- Introduction.mdx exists with welcome content
- Includes quick start example
- Links to other documentation pages

---

#### 3.3 Create Installation.mdx
- [ ] Create `src/stories/Installation.mdx`:
  ```mdx
  import { Meta } from '@storybook/blocks'

  <Meta title="Installation" />

  # Installation Guide

  ## Prerequisites

  - Node.js 18+ and pnpm
  - Vue 3.4+
  - Vite or other modern bundler

  ## Step 1: Install Packages

  \`\`\`bash
  pnpm add @meldui/vue @meldui/tabler-vue vue
  \`\`\`

  ## Step 2: Import Styles

  In your main application entry point (usually `main.ts`):

  \`\`\`typescript
  import { createApp } from 'vue'
  import '@meldui/vue/styles' // Import MeldUI styles
  import App from './App.vue'

  createApp(App).mount('#app')
  \`\`\`

  ## Step 3: Use Components

  \`\`\`vue
  <script setup lang="ts">
  import { Button, Card, CardHeader, CardTitle, CardContent } from '@meldui/vue'
  import { IconCheck } from '@meldui/tabler-vue'
  </script>

  <template>
    <Card>
      <CardHeader>
        <CardTitle>Hello MeldUI</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>
          <IconCheck :size="20" />
          Get Started
        </Button>
      </CardContent>
    </Card>
  </template>
  \`\`\`

  ## TypeScript Configuration

  If you're using TypeScript, ensure your `tsconfig.json` includes:

  \`\`\`json
  {
    "compilerOptions": {
      "module": "ESNext",
      "moduleResolution": "Bundler",
      "types": ["vue"]
    }
  }
  \`\`\`

  ## Tailwind CSS (Optional)

  MeldUI includes compiled Tailwind styles, but if your app also uses Tailwind, you can:

  1. Use MeldUI's theme variables in your own Tailwind config
  2. Extend the theme with your custom values

  ## Next Steps

  - Learn about [Theming](/?path=/docs/theming--docs)
  - Explore [Components](/?path=/docs/components-button--docs)
  - Check out the [Icon System](/?path=/docs/icons--docs)
  ```

**Acceptance Criteria:**
- Installation.mdx exists with step-by-step guide
- Includes code examples
- Covers TypeScript setup

---

#### 3.4 Create Theming.mdx
- [ ] Create `src/stories/Theming.mdx`:
  ```mdx
  import { Meta } from '@storybook/blocks'

  <Meta title="Theming" />

  # Customizing the Theme

  MeldUI uses CSS variables for theming, making it easy to customize colors, spacing, and other design tokens.

  ## Theme Variables

  All theme variables are defined with the `--color-*` prefix:

  \`\`\`css
  :root {
    /* Primary colors */
    --color-primary: #3b82f6;
    --color-primary-foreground: #ffffff;

    /* Background */
    --color-background: #ffffff;
    --color-foreground: #0f172a;

    /* Borders and inputs */
    --color-border: #e5e7eb;
    --color-input: #e5e7eb;
    --color-ring: #3b82f6;

    /* Icon color */
    --icon-color: #374151;

    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
  }
  \`\`\`

  ## Customizing Colors

  Override variables in your own CSS:

  \`\`\`css
  /* In your app's CSS file */
  :root {
    --color-primary: #8b5cf6; /* Purple */
    --color-primary-foreground: #ffffff;
  }
  \`\`\`

  ## Dark Mode

  Enable dark mode by adding the `dark` class to your root element:

  \`\`\`vue
  <template>
    <div class="dark">
      <!-- Your app content -->
    </div>
  </template>
  \`\`\`

  Or toggle programmatically:

  \`\`\`typescript
  // Toggle dark mode
  document.documentElement.classList.toggle('dark')
  \`\`\`

  ## Custom Border Radius

  Adjust the roundness of components:

  \`\`\`css
  :root {
    --radius-sm: 0.125rem; /* More square */
    --radius-md: 0.5rem;   /* More rounded */
    --radius-lg: 1rem;     /* Very rounded */
  }
  \`\`\`

  ## Icon Theming

  Icons respect the `--icon-color` variable:

  \`\`\`css
  :root {
    --icon-color: #3b82f6; /* Blue icons */
  }

  .dark {
    --icon-color: #60a5fa; /* Lighter blue in dark mode */
  }
  \`\`\`

  ## Full Variable Reference

  See the complete list of variables in the [MeldUI source code](https://github.com/your-org/meldui/blob/main/packages/vue/src/styles/index.css).
  ```

**Acceptance Criteria:**
- Theming.mdx exists with customization examples
- Shows how to override CSS variables
- Explains dark mode setup

---

#### 3.5 Create Icons.mdx
- [ ] Create `src/stories/Icons.mdx`:
  ```mdx
  import { Meta } from '@storybook/blocks'

  <Meta title="Icons" />

  # Icon System

  MeldUI uses Tabler Icons with custom defaults for size and stroke width.

  ## Installation

  Icons are in a separate package:

  \`\`\`bash
  pnpm add @meldui/tabler-vue
  \`\`\`

  ## Usage

  \`\`\`vue
  <script setup>
  import { IconX, IconCheck, IconAlertCircle } from '@meldui/tabler-vue'
  </script>

  <template>
    <!-- Default (24px, stroke 1.5) -->
    <IconCheck />

    <!-- Custom size -->
    <IconX :size="32" />

    <!-- Custom stroke width -->
    <IconAlertCircle :stroke-width="2" />

    <!-- Custom color -->
    <IconCheck color="#22c55e" />
  </template>
  \`\`\`

  ## Default Values

  All icons have these defaults:
  - **Size:** 24px
  - **Stroke Width:** 1.5
  - **Color:** Inherits from `currentColor` or `--icon-color` CSS variable

  ## Props

  | Prop | Type | Default | Description |
  |------|------|---------|-------------|
  | `size` | number | 24 | Icon size in pixels |
  | `strokeWidth` | number | 1.5 | Stroke thickness |
  | `color` | string | undefined | Explicit color (otherwise uses currentColor) |

  ## Color Inheritance

  Icons inherit text color by default:

  \`\`\`vue
  <template>
    <span class="text-red-500">
      <IconX /> <!-- Red icon -->
    </span>
  </template>
  \`\`\`

  ## Theme Integration

  Override the default icon color globally:

  \`\`\`css
  :root {
    --icon-color: #3b82f6; /* Blue */
  }
  \`\`\`

  ## Available Icons

  Browse all 5000+ icons at [tabler.io/icons](https://tabler.io/icons)

  Or see the [Icon Gallery](/?path=/story/icons-gallery--all-icons) story.

  ## Icon Names

  Tabler icons use the `Icon` prefix:
  - `IconX` - X/close icon
  - `IconCheck` - Checkmark
  - `IconUser` - User profile
  - `IconSettings` - Settings gear
  - And 5000+ more...
  ```

**Acceptance Criteria:**
- Icons.mdx exists with usage guide
- Explains default values and props
- Links to Tabler Icons website

---

## Task 4: Create Component Stories

Write stories for the base components.

### Sub-tasks

#### 4.1 Create Button.stories.ts
- [ ] Create `src/stories/Components/Button.stories.ts`:
  ```typescript
  import type { Meta, StoryObj } from '@storybook/vue3'
  import { Button } from '@meldui/vue'
  import { IconCheck, IconX, IconLoader } from '@meldui/tabler-vue'

  const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      },
      size: {
        control: 'select',
        options: ['default', 'sm', 'lg', 'icon'],
      },
    },
  }

  export default meta
  type Story = StoryObj<typeof Button>

  export const Default: Story = {
    render: () => ({
      components: { Button },
      template: '<Button>Click me</Button>',
    }),
  }

  export const Variants: Story = {
    render: () => ({
      components: { Button },
      template: `
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      `,
    }),
  }

  export const Sizes: Story = {
    render: () => ({
      components: { Button },
      template: `
        <div style="display: flex; gap: 1rem; align-items: center;">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      `,
    }),
  }

  export const WithIcons: Story = {
    render: () => ({
      components: { Button, IconCheck, IconX },
      template: `
        <div style="display: flex; gap: 1rem;">
          <Button>
            <IconCheck :size="20" />
            Confirm
          </Button>
          <Button variant="destructive">
            <IconX :size="20" />
            Cancel
          </Button>
        </div>
      `,
    }),
  }

  export const IconOnly: Story = {
    render: () => ({
      components: { Button, IconX, IconCheck, IconLoader },
      template: `
        <div style="display: flex; gap: 1rem;">
          <Button size="icon">
            <IconCheck :size="20" />
          </Button>
          <Button size="icon" variant="outline">
            <IconX :size="20" />
          </Button>
          <Button size="icon" variant="ghost">
            <IconLoader :size="20" />
          </Button>
        </div>
      `,
    }),
  }
  ```

**Acceptance Criteria:**
- Button.stories.ts exists
- Shows all variants and sizes
- Includes icon examples
- Uses @meldui/tabler-vue icons

---

#### 4.2 Create Card.stories.ts
- [ ] Create `src/stories/Components/Card.stories.ts`:
  ```typescript
  import type { Meta, StoryObj } from '@storybook/vue3'
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    Button
  } from '@meldui/vue'

  const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
  }

  export default meta
  type Story = StoryObj<typeof Card>

  export const Default: Story = {
    render: () => ({
      components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
      template: `
        <Card style="max-width: 400px;">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>This is a card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here.</p>
          </CardContent>
        </Card>
      `,
    }),
  }

  export const WithFooter: Story = {
    render: () => ({
      components: { Card, CardHeader, CardTitle, CardContent, CardFooter, Button },
      template: `
        <Card style="max-width: 400px;">
          <CardHeader>
            <CardTitle>Confirm Action</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Are you sure you want to proceed?</p>
          </CardContent>
          <CardFooter style="display: flex; gap: 0.5rem;">
            <Button variant="default">Confirm</Button>
            <Button variant="outline">Cancel</Button>
          </CardFooter>
        </Card>
      `,
    }),
  }
  ```

**Acceptance Criteria:**
- Card.stories.ts exists
- Shows card with all sub-components
- Includes example with footer and buttons

---

#### 4.3 Test Storybook
- [ ] Start Storybook:
  ```bash
  cd apps/vue-storybook
  pnpm storybook
  ```
- [ ] Storybook should open at http://localhost:6006
- [ ] Verify:
  - MDX pages appear in sidebar (Introduction, Installation, etc.)
  - Component stories appear (Button, Card)
  - Components render correctly with Tailwind styles
  - Controls addon works (can change props)
  - No console errors

**Acceptance Criteria:**
- Storybook runs successfully
- All stories and docs pages visible
- Components styled correctly
- Interactive controls work

---

## Task 5: Create Icon Gallery Story

Build a searchable icon browser.

### Sub-tasks

#### 5.1 Create IconGallery.stories.ts
- [ ] Create `src/stories/Icons/IconGallery.stories.ts`:
  ```typescript
  import type { Meta, StoryObj } from '@storybook/vue3'
  import { ref, computed } from 'vue'
  import * as TablerIcons from '@meldui/tabler-vue'

  const meta: Meta = {
    title: 'Icons/Gallery',
    tags: ['autodocs'],
  }

  export default meta
  type Story = StoryObj

  export const AllIcons: Story = {
    render: () => ({
      setup() {
        const search = ref('')

        // Get all icon components
        const allIcons = Object.entries(TablerIcons)
          .filter(([name]) => name.startsWith('Icon'))
          .map(([name, component]) => ({ name, component }))

        // Filter icons based on search
        const filteredIcons = computed(() => {
          if (!search.value) return allIcons
          const query = search.value.toLowerCase()
          return allIcons.filter(({ name }) =>
            name.toLowerCase().includes(query)
          )
        })

        return {
          search,
          filteredIcons,
        }
      },
      template: `
        <div>
          <div style="margin-bottom: 2rem;">
            <input
              v-model="search"
              type="text"
              placeholder="Search icons..."
              style="
                width: 100%;
                max-width: 400px;
                padding: 0.5rem 1rem;
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
                font-size: 1rem;
              "
            />
            <p style="margin-top: 0.5rem; color: var(--color-muted-foreground);">
              Showing {{ filteredIcons.length }} icons
            </p>
          </div>

          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 1rem;
          ">
            <div
              v-for="{ name, component } in filteredIcons"
              :key="name"
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                border: 1px solid var(--color-border);
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: background-color 0.2s;
              "
              @click="copyIconName(name)"
              :title="'Click to copy: ' + name"
            >
              <component :is="component" :size="32" />
              <span style="
                font-size: 0.75rem;
                text-align: center;
                word-break: break-word;
                color: var(--color-muted-foreground);
              ">
                {{ name }}
              </span>
            </div>
          </div>
        </div>
      `,
      methods: {
        copyIconName(name: string) {
          navigator.clipboard.writeText(name)
          alert(`Copied: ${name}`)
        }
      }
    }),
  }
  ```

**What this does:**
- Displays all available icons in a grid
- Searchable/filterable by name
- Click to copy icon name
- Shows count of displayed icons

**Acceptance Criteria:**
- IconGallery.stories.ts exists
- Displays all icons from @meldui/tabler-vue
- Search functionality works
- Icons are clickable to copy name

---

## Task 6: Build Storybook

Create a production build to verify everything works.

### Sub-tasks

#### 6.1 Build Storybook
- [ ] Run build command:
  ```bash
  cd apps/vue-storybook
  pnpm build-storybook
  ```
- [ ] This creates a static site in `storybook-static/`

**Expected Output:**
```
info => Building manager..
info => Manager built (XXXms)
info => Building preview..
info => Preview built (XXXms)
info => Output directory: storybook-static
```

**Acceptance Criteria:**
- Build completes without errors
- storybook-static/ directory created
- Static HTML files generated

---

#### 6.2 Preview built Storybook
- [ ] Serve the static build:
  ```bash
  npx http-server storybook-static
  ```
- [ ] Open in browser and verify:
  - All pages load
  - Styles applied correctly
  - No 404 errors in console

**Acceptance Criteria:**
- Static build works correctly
- All assets load
- Navigation works

---

## Phase 4 Completion Checklist

Verify all tasks are complete:

- [ ] Storybook initialized for Vue 3
- [ ] package.json has workspace dependencies
- [ ] Tailwind CSS v4 configured in Storybook
- [ ] MDX documentation pages created (Introduction, Installation, Theming, Icons)
- [ ] Component stories created (Button, Card)
- [ ] Icon gallery story created with search
- [ ] Storybook runs in dev mode (pnpm storybook)
- [ ] Components render with correct styles
- [ ] Interactive controls work
- [ ] Storybook builds successfully
- [ ] Static build can be served

**Test Commands:**
```bash
cd apps/vue-storybook
pnpm storybook  # Should open at localhost:6006
pnpm build-storybook  # Should build to storybook-static/
```

**File Structure Verification:**
```
apps/vue-storybook/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── src/
│   ├── stories/
│   │   ├── Introduction.mdx
│   │   ├── Installation.mdx
│   │   ├── Theming.mdx
│   │   ├── Icons.mdx
│   │   ├── Components/
│   │   │   ├── Button.stories.ts
│   │   │   └── Card.stories.ts
│   │   └── Icons/
│   │       └── IconGallery.stories.ts
│   └── styles/
│       └── tailwind.css
├── storybook-static/    (after build)
└── package.json
```

**Next Steps:**
Proceed to [05-publishing-setup.md](./05-publishing-setup.md) to configure versioning and publishing.
