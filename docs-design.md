# MeldUI Documentation Site — Design Document

## 1. Problem Statement

MeldUI's documentation currently lives in Storybook (99 component stories + 9 MDX pages). While Storybook is excellent for interactive component exploration, it has a critical limitation: **AI coding agents cannot effectively crawl JavaScript-heavy Storybook sites**. The rendered content depends on JavaScript execution, making it opaque to LLMs and automated tools.

We need a documentation site that serves two audiences equally:

1. **Human developers** — modern, visually appealing, with live component demos
2. **AI agents/LLMs** — clean static HTML, structured content, machine-readable indexes

## 2. Goals

- Build a modern documentation site covering all MeldUI components, charts, and composites
- Ensure all content is statically rendered (SSG) for LLM crawlability
- Provide live interactive demos of actual MeldUI Vue components
- Auto-generate `llms.txt` and `llms-full.txt` for LLM consumption
- Maintain proper sitemap, semantic HTML, and structured API tables
- Support dark mode matching MeldUI's OKLch theme system
- Include full-text search with zero external dependencies

## 3. Non-Goals

- Replacing Storybook (it remains useful for development-time component testing)
- Supporting React components (Vue-only for now)
- Building a CMS or admin interface for docs authoring
- Hosting/deployment infrastructure (out of scope for initial implementation)

---

## 4. Technology Choices

### 4.1 Framework: Astro

**Choice:** Astro 5 with custom layout (not Starlight)

**Why Astro:**

- Islands architecture — Vue components render client-side as interactive islands, everything else is static HTML
- First-class SSG — produces clean, crawlable HTML with zero JavaScript by default
- MDX support — rich content authoring with component imports
- Built-in Shiki — syntax highlighting at build time, not runtime
- Content Collections — type-safe content with Zod schema validation
- Excellent performance — ships zero JS unless explicitly opted in per component

**Why not Starlight:**
Starlight is a docs template built on Astro. While it provides sidebar/search/navigation out of the box, it enforces a specific layout and theming model. The user wants a custom modern design with "information symmetry" — a bespoke layout inspired by shadcn/ui docs gives full control over the visual experience.

**Why not VitePress:**
VitePress is Vue-native and would work well, but the user specifically chose Astro. Astro's island architecture also produces cleaner static HTML (no full-page hydration) which is better for LLM crawling.

### 4.2 Vue Integration: @astrojs/vue

MeldUI components are Vue 3 SFCs. Astro's Vue integration renders them as interactive islands using directives like `client:visible` (lazy) or `client:load` (eager). Each demo component hydrates independently — no shared state between islands.

**Critical configuration:** Vue must be deduplicated across the workspace to prevent runtime errors. The proven pattern from `apps/vue-storybook/.storybook/main.ts` uses a Vite `resolve.alias` to point to a single Vue ESM bundle.

### 4.3 Styling: Tailwind CSS v4

Matches the monorepo's existing CSS-first approach:

- `@import 'tailwindcss'` (not a JS config file)
- `@tailwindcss/vite` plugin
- MeldUI theme imported via `@import '../../../../packages/vue/src/themes/default.css'`
- `@source` directives to scan MeldUI component source for class names

### 4.4 Search: Pagefind

Post-build search indexing of the static HTML output. Zero runtime cost, no external services. Generates a small JS bundle and search index at `dist/pagefind/`. Triggered via a command palette UI (`Ctrl+K`).

### 4.5 Content: MDX + Astro Content Collections

Each component doc page is an MDX file with Zod-validated frontmatter containing the component's API definition (props, events, slots). This structured data is rendered into semantic HTML tables by an `ApiTable.astro` component.

---

## 5. Architecture

### 5.1 Project Location

```
apps/docs/     # New workspace member in the pnpm monorepo
```

Added to the existing `pnpm-workspace.yaml` pattern (`apps/*`).

### 5.2 Dependency Graph

```
apps/docs/
  ├── @meldui/vue (workspace:*)         # Component library
  ├── @meldui/charts-vue (workspace:*)  # Charts library
  ├── @meldui/tabler-vue (workspace:*)  # Icons
  ├── vue (^3.5.0)                      # Framework (peer dep of above)
  ├── vue-sonner                        # Toast notifications (peer dep)
  ├── @internationalized/date           # Date utilities (peer dep)
  ├── @tanstack/vue-table               # Table headless (peer dep)
  ├── astro                             # Site framework
  ├── @astrojs/vue                      # Vue island integration
  ├── @astrojs/mdx                      # MDX content
  ├── @astrojs/sitemap                  # Sitemap generation
  ├── tailwindcss + @tailwindcss/vite   # Styling
  └── pagefind                          # Search indexing
```

MeldUI's peer dependencies (vue, vue-sonner, @internationalized/date, @tanstack/vue-table) must be direct dependencies of the docs app since we render actual components.

### 5.3 Astro Configuration

```typescript
// apps/docs/astro.config.ts
export default defineConfig({
  site: 'https://docs.meldui.dev', // adjust as needed
  integrations: [vue(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Deduplicate Vue across workspace packages
        vue: resolve(__dirname, '../../node_modules/vue/dist/vue.esm-bundler.js'),
      },
    },
    define: {
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
})
```

### 5.4 Layout System

**Three-column responsive layout:**

```
+--------------------------------------------------+
|  Header                                          |
|  [Logo]  [Search ⌘K]  [Theme] [GitHub]          |
+----------+----------------------------+----------+
|          |                            |          |
| Sidebar  |    Content Area            |   TOC    |
| 240px    |    max-w-3xl               |  200px   |
|          |                            |          |
| - Groups |    [Breadcrumbs]           | On this  |
| - Links  |    [MDX content]           | page:    |
| - Active |    [Component previews]    | - Intro  |
|   state  |    [API tables]            | - Usage  |
|          |    [Prev/Next]             | - API    |
|          |                            |          |
+----------+----------------------------+----------+
```

**Responsive breakpoints:**

- `>1280px`: Full 3-column layout
- `768-1280px`: Sidebar as hamburger overlay, no TOC
- `<768px`: Single column, hamburger sidebar

**Layout components (all Astro — zero JS):**

- `BaseLayout.astro` — HTML shell, `<head>`, dark mode inline script, font loading
- `DocsLayout.astro` — 3-column grid, renders sidebar + content + TOC
- `Header.astro` — Top navigation bar
- `Sidebar.astro` — Left navigation with grouped links
- `SidebarNav.astro` — Recursive nav item renderer
- `TableOfContents.astro` — Right-side heading links
- `Breadcrumbs.astro` — Path breadcrumbs
- `PrevNext.astro` — Previous/next page navigation
- `Footer.astro` — Page footer

### 5.5 Component Demo System

The demo system has three parts:

**1. Demo Vue components** (`src/demos/*.vue`)
Each demo is a self-contained Vue SFC that imports from `@meldui/vue` or `@meldui/charts-vue` and renders a working example:

```vue
<!-- src/demos/ButtonDemo.vue -->
<script setup>
import { Button } from '@meldui/vue'
</script>
<template>
  <div class="flex gap-2">
    <Button>Default</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="outline">Outline</Button>
  </div>
</template>
```

**2. ComponentPreview wrapper** (`src/components/ComponentPreview.vue`)
A Vue island component that provides the Preview/Code tab interface:

- Preview tab: renders the demo component via `<slot />`
- Code tab: displays syntax-highlighted source with copy button
- Source code is passed as a raw string prop (loaded via Vite `?raw` import)
- Styled with the MeldUI theme (border, rounded corners, muted backgrounds)

**3. MDX integration**
In MDX files, demos are imported and rendered as Astro islands:

```mdx
import ButtonDemo from '../../demos/ButtonDemo.vue'
import buttonDemoCode from '../../demos/ButtonDemo.vue?raw'
import ComponentPreview from '../../components/ComponentPreview.vue'

<ComponentPreview code={buttonDemoCode} client:visible>
  <ButtonDemo client:visible />
</ComponentPreview>
```

### 5.6 Content Collection Schema

```typescript
// src/content/config.ts
const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['getting-started', 'components', 'composites', 'charts', 'examples']),
    subcategory: z.string().optional(),
    package: z.enum(['@meldui/vue', '@meldui/charts-vue', '@meldui/tabler-vue']).optional(),
    componentName: z.string().optional(),
    props: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
          default: z.string().optional(),
          description: z.string(),
          required: z.boolean().default(false),
        }),
      )
      .optional(),
    events: z
      .array(
        z.object({
          name: z.string(),
          payload: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
    slots: z
      .array(
        z.object({
          name: z.string(),
          props: z.string().optional(),
          description: z.string(),
        }),
      )
      .optional(),
    subComponents: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          props: z
            .array(
              z.object({
                name: z.string(),
                type: z.string(),
                default: z.string().optional(),
                description: z.string(),
                required: z.boolean().default(false),
              }),
            )
            .optional(),
          slots: z
            .array(
              z.object({
                name: z.string(),
                props: z.string().optional(),
                description: z.string(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
    order: z.number().default(999),
    sourceUrl: z.string().optional(),
    storybookUrl: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
})
```

### 5.7 API Tables

The `ApiTable.astro` component reads the current page's frontmatter and renders semantic HTML tables:

```html
<h2>API Reference</h2>

<!-- Props Table -->
<h3>Props</h3>
<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>variant</code></td>
      <td><code>'default' | 'destructive' | ...</code></td>
      <td><code>'default'</code></td>
      <td>Visual style variant</td>
    </tr>
    ...
  </tbody>
</table>

<!-- Events Table -->
<!-- Slots Table -->
<!-- Sub-component tables -->
```

This produces clean, LLM-readable HTML. No JavaScript required to render API documentation.

### 5.8 Navigation Data

Manually maintained in `src/data/navigation.ts`. Automatic file-system navigation produces poor UX for 70+ components without manual categorization:

```typescript
export const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/getting-started' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
      ...
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Interactive', items: [
        { title: 'Button', href: '/docs/components/button' },
        ...
      ]},
      { title: 'Form & Input', items: [...] },
      { title: 'Layout', items: [...] },
      { title: 'Navigation', items: [...] },
      { title: 'Overlay', items: [...] },
      { title: 'Data Display', items: [...] },
      { title: 'Feedback', items: [...] },
    ],
  },
  { title: 'Composites', items: [...] },
  { title: 'Charts', items: [...] },
  { title: 'Examples', items: [...] },
]
```

### 5.9 Dark Mode

MeldUI uses class-based dark mode with the `.dark` class on `<html>`. The docs site:

1. Adds an inline `<script>` in `BaseLayout.astro` that reads `localStorage.theme` and sets the class **before first paint** (prevents flash of wrong theme)
2. Respects `prefers-color-scheme` as the default
3. Provides a `ThemeToggle.vue` island for manual switching
4. All theme colors resolve via CSS custom properties from the MeldUI theme

### 5.10 Search

**Pagefind integration:**

- Build step: `astro build && pagefind --site dist`
- Search UI: `SearchDialog.vue` (Vue island, `client:idle`)
- Trigger: `Ctrl+K` / `Cmd+K` keyboard shortcut or header button
- Built using MeldUI's own `Command` component for visual consistency
- Pagefind indexes the static HTML, producing a `dist/pagefind/` directory with the search index

### 5.11 LLM Optimization

**`llms.txt` / `llms-full.txt`:**
A build script (`scripts/generate-llms.ts`) reads all content collection entries and generates:

- `llms.txt` — summary index with component names, categories, and descriptions
- `llms-full.txt` — full API documentation (props, events, slots, usage examples)

Format matches the existing `apps/vue-storybook/public/llms.txt`.

**Structured HTML:**

- `<h1>` = page title, `<h2>` = sections, `<h3>` = subsections
- `<table>` with `<thead>`/`<tbody>` for all API docs
- `<code>` with language class for code blocks
- `<article data-component="Button">` wrapper for component pages
- Descriptive `<meta name="description">` and `<title>` tags

**Sitemap:**
`@astrojs/sitemap` generates `sitemap.xml` automatically from all static routes.

---

## 6. Component Inventory

### 6.1 Base UI Components (63)

| Category          | Components                                                                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Interactive (7)   | Button, ButtonGroup, Toggle, ToggleGroup, Command, Carousel, Combobox                                                                                               |
| Form & Input (17) | Input, Select, Checkbox, RadioGroup, Switch, Textarea, Slider, NumberField, PinInput, TagsInput, InputOtp, FileUpload, NativeSelect, InputGroup, Label, Field, Form |
| Layout (8)        | Accordion, Table, Tabs, Separator, ScrollArea, Resizable, AspectRatio, Collapsible, Sidebar                                                                         |
| Navigation (7)    | Breadcrumb, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Pagination                                                                                          |
| Overlay (7)       | Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, HoverCard                                                                                                     |
| Data Display (6)  | Card, Avatar, Badge, Calendar, RangeCalendar, Kbd                                                                                                                   |
| Feedback (10)     | Alert, Progress, CircularProgress, Skeleton, Spinner, Dot, Empty, Stepper, Sonner, Item                                                                             |

### 6.2 Composites (8)

| Component       | Complexity | Notes                                                               |
| --------------- | ---------- | ------------------------------------------------------------------- |
| DataTable       | Very High  | 23 files, filters, sorting, pagination, column pinning, server-side |
| DateRangePicker | High       | Calendar, presets, trigger components                               |
| Mention         | High       | Highlighter, portal, serialization utilities                        |
| MultiSelect     | Medium     | Grouping, create option, search                                     |
| Timeline        | Medium     | Vertical/horizontal, status variants                                |
| AvatarGroup     | Low        | Orientation, spacing, reverse                                       |
| ClipboardCopy   | Low        | Copy button, composable                                             |
| RelativeTime    | Low        | Single component                                                    |

### 6.3 Charts (9 types + infrastructure)

Line, Bar, Area, Pie, Donut, Scatter, Radar, Heatmap, Mixed — all built on ECharts with a unified config API.

Each chart page needs: basic demo, config options, events, color palettes.

### 6.4 Page Count Estimate

- Getting Started: 5 pages
- Components: 63 pages
- Composites: 8 pages
- Charts: 13 pages (overview + install + 9 types + theme + events)
- Examples: 1 page
- **Total: ~90 pages**

---

## 7. Content Authoring Workflow

For each component:

1. **Create demo(s):** Write `src/demos/<Name>Demo.vue` importing from `@meldui/vue`
2. **Write MDX:** Create `src/content/docs/<category>/<name>.mdx` with:
   - Frontmatter: title, description, category, props[], events[], slots[]
   - Prose: description, use cases, accessibility notes
   - Demo imports with `client:visible`
   - `<ApiTable />` for structured API reference
3. **Add to nav:** Update `src/data/navigation.ts` with the new page link
4. **Verify:** Check page renders in dev server, demo is interactive, API table is correct

**Content migration:** The 9 existing Storybook MDX pages (Introduction, Installation, Theming, Icons, DataTable Overview, Charts Overview/Installation/ThemeCustomization) provide the prose content foundation. Stories provide demo code templates.

---

## 8. Build & Dev Scripts

**Root `package.json`:**

```json
{
  "scripts": {
    "docs:dev": "pnpm --filter docs dev",
    "docs:build": "pnpm --filter docs build"
  }
}
```

**`apps/docs/package.json`:**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "generate-llms": "tsx scripts/generate-llms.ts"
  }
}
```

**Turbo:** No changes needed to `turbo.json` — the existing `build` task definition (`dependsOn: ["^build"]`) will automatically include `apps/docs` since it depends on `@meldui/vue` and `@meldui/charts-vue`.

---

## 9. Known Challenges & Mitigations

| Challenge                                                | Mitigation                                                                                                                                |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Vue hydration in Astro islands with shared state         | Each island is independent. Use `client:visible` for simple demos, `client:load` for interactive ones. Don't share state between islands. |
| ECharts SSR (ECharts doesn't support SSR)                | Charts render only client-side via `client:visible`. `MeldChartSkeleton` provides loading state.                                          |
| Tailwind v4 class scanning across workspace              | `@source` directive in global.css points to MeldUI package source, not just dist. Mirrors Storybook pattern.                              |
| Vue deduplication (multiple Vue copies = runtime errors) | `resolve.alias` to single Vue ESM bundle. Proven pattern from Storybook config.                                                           |
| Showing source code of demo components                   | Vite's `?raw` suffix import loads `.vue` files as strings at build time.                                                                  |
| 90 pages of content                                      | Phased approach — foundation first, then components by category. Structured frontmatter + `ApiTable.astro` reduces per-page boilerplate.  |

---

## 10. Design Principles

1. **Information symmetry** — consistent layout, spacing, and information density across all pages. Every component page follows the same structure.
2. **Content-first** — minimal chrome, maximum content area. No decorative elements that don't serve information delivery.
3. **Static by default** — JavaScript only where interactivity is required (demos, search, theme toggle).
4. **Machine-readable** — every piece of structured data (props, events, slots) rendered as semantic HTML, not hidden in JS.
5. **Consistent with MeldUI** — uses MeldUI's own theme system and components where possible (search dialog, code blocks, buttons).
