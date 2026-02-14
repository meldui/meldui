## Context

MeldUI needs a documentation site that replaces Storybook as the primary documentation platform. The site must use MeldUI itself for UI (dogfooding), render live Vue component examples alongside source code, and document 70+ components comprehensively. The existing `apps/task-manager/` app demonstrates the proven pattern for integrating MeldUI with Tailwind CSS v4 in a Vite-based application.

**Stakeholders:** MeldUI consumers (internal engineering teams), design system maintainers

**Constraints:**

- Must use Tailwind CSS v4 (CSS-first, no `tailwind.config.js`)
- Must integrate with existing pnpm monorepo workspace
- Must render real Vue components as live examples (not static screenshots)
- Must support static site generation for simple hosting

## Goals / Non-Goals

- **Goals:**
  - Comprehensive documentation for all 70+ components with live interactive examples
  - 3-column layout (sidebar, content, TOC) inspired by Ark UI
  - Dogfood MeldUI components for all site UI (sidebar, tabs, search, tables, etc.)
  - Dark/light mode with system preference support
  - Copy-paste-ready "Blocks" section with responsive preview
  - Cmd+K global search
  - SSG deployment to Vercel/Netlify
  - Marketing landing page for internal adoption

- **Non-Goals:**
  - Replacing Storybook for component development/testing (keep both)
  - Multi-framework support (Vue only, unlike Ark UI which supports React/Solid/Svelte)
  - Auto-generated API docs from TypeScript types (manual Markdown tables chosen for control)
  - Versioned documentation (single version reflecting current release)
  - User authentication or gated content
  - i18n/localization

## Decisions

### 1. Nuxt 4 + @nuxt/content v3

**Decision:** Use Nuxt 4 with `@nuxt/content` v3 for the documentation framework.

**Why:** @nuxt/content v3 provides MDC syntax (Markdown Components) which allows embedding Vue components directly in Markdown files. This is critical for the live example system. Built-in Shiki code highlighting supports dual themes (light/dark). `queryCollectionNavigation` auto-generates sidebar navigation from the content file structure. Full-text search via `queryCollectionSearchSections` eliminates the need for external search services.

**Alternatives considered:**

- VitePress: Simpler but less flexible for custom layouts and MDC-level component embedding
- Nuxt 3 + @nuxt/content v2: Older, v3 has better performance and collection-based content management
- Custom Vite + vue-router: Too much boilerplate for a docs site

### 2. Live Example System via import.meta.glob

**Decision:** Example components live in `app/components/examples/{component}/` as self-contained `.vue` files. A registry (`exampleRegistry.ts`) uses `import.meta.glob` to dynamically resolve components by name. Source code is loaded via `import.meta.glob('...', { query: '?raw' })` for display.

**Why:** This approach gives each example a real `.vue` file that can be independently tested and linted. The `import.meta.glob` pattern avoids manual registration. Source code display matches exactly what's rendered since both come from the same file.

**Alternatives considered:**

- Inline code in Markdown with runtime compilation: Fragile, no linting, poor DX
- Storybook embeds via iframe: Defeats the purpose of replacing Storybook
- Build-time extraction from story files: Complex tooling, tight coupling to Storybook

### 3. Tailwind CSS v4 Integration

**Decision:** Mirror the exact CSS configuration pattern from `apps/task-manager/src/styles/app.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import '../../../../packages/vue/src/themes/default.css';
@source "../**/*.{vue,js,ts,jsx,tsx}";
@source "../../../../packages/vue/src/**/*.{vue,ts,tsx,js,jsx}";
```

**Why:** This pattern is proven to work in the monorepo. Using `@tailwindcss/vite` directly (not `@tailwindcss/nuxt`) provides more control and matches the existing setup. The `@source` directives ensure Tailwind scans both docs-site components and MeldUI library components for class usage.

### 4. Manual API Documentation

**Decision:** Props, events, and slots are documented manually in YAML blocks within Markdown, rendered by custom `PropsTable`, `EventsTable`, and `SlotsTable` MDC components.

**Why:** Manual documentation gives full control over descriptions, defaults, and examples. For an internal library with 70+ components, the overhead of setting up vue-docgen or similar tools outweighs the benefit. Manual tables also allow documenting nuanced usage patterns that auto-generation misses.

### 5. MeldUI Component Usage in Docs Site

**Decision:** The docs site UI uses MeldUI components directly as workspace dependencies:

- `Sidebar` / `Collapsible` for left navigation
- `Tabs` / `TabsList` / `TabsTrigger` / `TabsContent` for preview/code toggle
- `CommandDialog` for Cmd+K search
- `Table` for API reference tables
- `Button`, `Badge`, `Separator`, `ScrollArea`, `Sheet` for layout/UI
- `DropdownMenu` for theme toggle
- Icons from `@meldui/tabler-vue`

**Why:** Dogfooding validates the library, demonstrates real usage, and ensures the docs always reflect the current component behavior.

### 6. Content Organization

**Decision:** Content files are organized using numbered prefix directories for ordering, matching the Storybook category structure:

```
content/
  1.getting-started/    (6 pages)
  2.components/         (70+ pages across 8 subcategories)
  3.data-table/         (9 pages)
  4.charts/             (12 pages)
  5.blocks/             (6 pages)
  6.examples/           (2 pages)
```

Components are grouped by: Data Display, Data Entry, Feedback, Interactive, Layout, Navigation, Overlay, Utility — matching the existing Storybook organization.

**Why:** Consistent with Storybook for familiarity. Numbered prefixes control @nuxt/content navigation order while being stripped from URLs. Dedicated sections for DataTable and Charts reflect their complexity (multiple pages each).

## Risks / Trade-offs

| Risk                                                        | Impact                            | Mitigation                                                                                                              |
| ----------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Nuxt 4 + @nuxt/content v3 + Tailwind v4 stack compatibility | High — could block entire project | Validate the full stack in Phase 1 before writing content. Fallback: use @tailwindcss/vite directly in nuxt vite config |
| SSR hydration mismatches with interactive examples          | Medium — broken previews          | Wrap `ComponentPreview` live rendering in `<ClientOnly>` components                                                     |
| Content volume (70+ component pages, ~250+ example files)   | Medium — large effort             | Template-driven approach: Button page is the reference. Port patterns from existing 111+ Storybook stories              |
| Shiki highlighting for raw .vue source in ComponentPreview  | Low — cosmetic                    | Use `shiki` package directly or `codeToHtml()` at build time. Fallback: use @nuxt/content's built-in highlight API      |
| Large example registry slowing dev/build                    | Low — performance                 | `import.meta.glob` with lazy loading (non-eager for components, eager only for raw source strings)                      |

## Migration Plan

No migration needed — this is a new application. Storybook continues to run alongside.

**Incremental rollout:**

1. Phase 1-3: Infrastructure (site, navigation, preview system)
2. Phase 4: All component documentation (can be authored incrementally)
3. Phase 5-6: Search, DataTable, Charts, Blocks, Landing Page
4. Phase 7: SSG build, SEO, deployment

## Open Questions

None — all key decisions have been made through user discussion:

- Landing page: Marketing-style (confirmed)
- Initial scope: All components at once (confirmed)
- API docs: Manual in Markdown (confirmed)
- Deployment: SSG on Vercel/Netlify (confirmed)
- Theme: Dark/light with system preference (confirmed)
- Blocks: Include from the start (confirmed)
- Storybook: Keep both for now (confirmed)
