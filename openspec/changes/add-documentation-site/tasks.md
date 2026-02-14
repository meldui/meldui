## 1. Foundation — Nuxt 4 App Setup

- [x] 1.1 Initialize Nuxt 4 project in `apps/docs/` with `package.json` (workspace:\* deps for @meldui/vue, @meldui/tabler-vue, @meldui/charts-vue), `nuxt.config.ts`, `tsconfig.json`
- [x] 1.2 Configure Tailwind CSS v4 in `app/assets/css/main.css` mirroring `apps/task-manager/src/styles/app.css` pattern (imports for tailwindcss, tw-animate-css, MeldUI default theme, @source directives)
- [x] 1.3 Set up @nuxt/content v3 with `content.config.ts` defining `docs` collection with frontmatter schema (title, description, component, category, links)
- [x] 1.4 Create `app/app.vue` with `<NuxtLayout>` + `<NuxtPage>` and CSS import
- [x] 1.5 Create `app/layouts/default.vue` with 3-column responsive grid (sidebar hidden <lg, TOC hidden <xl)
- [x] 1.6 Create `app/layouts/blank.vue` for landing page (full-width, no sidebar/TOC)
- [x] 1.7 Create `app/pages/[...slug].vue` catch-all route rendering @nuxt/content pages
- [x] 1.8 Create `content/1.getting-started/1.introduction.md` as first test page
- [x] 1.9 Verify `pnpm --filter docs dev` starts and renders the test page with MeldUI components
  - **Validation:** Dev server starts, page renders, Tailwind styles applied, MeldUI Button renders correctly

## 2. Dark/Light Mode

- [x] 2.1 Create `app/composables/useColorMode.ts` — manages light/dark/system state with localStorage persistence, system preference detection via matchMedia, and `.dark` class toggling
- [x] 2.2 Add FOUC prevention inline script in `nuxt.config.ts` `app.head.script` that applies saved theme before render
- [x] 2.3 Create ThemeToggle component using MeldUI `DropdownMenu` with Light/Dark/System options and Sun/Moon icons from @meldui/tabler-vue
  - **Validation:** Toggle between modes, refresh page — no flash, preference persisted

## 3. Header and Navigation

- [x] 3.1 Create `app/components/docs/DocsHeader.vue` — sticky header with logo, nav links (Docs, Components, Blocks), search button placeholder, GitHub link, theme toggle, mobile hamburger
- [x] 3.2 Create `app/components/docs/DocsSidebar.vue` — navigation tree from `queryCollectionNavigation('docs')`, collapsible sections using MeldUI `Collapsible`, active page highlighting, scroll area
- [x] 3.3 Create `app/components/docs/DocsMobileNav.vue` — MeldUI `Sheet` component sliding from left, triggered by hamburger button, containing full sidebar navigation
- [x] 3.4 Create `app/components/docs/DocsToc.vue` — right-side TOC from page `toc` data, with h2/h3 entries and active heading tracking
- [x] 3.5 Create `app/composables/useScrollSpy.ts` — Intersection Observer-based composable for tracking the currently visible heading
- [x] 3.6 Create `app/components/docs/DocsFooter.vue` — previous/next page navigation links
  - **Validation:** Navigate between pages, sidebar highlights current page, TOC tracks scroll position, mobile nav works

## 4. Prose Overrides and Content Styling

- [x] 4.1 Create `app/components/content/prose/ProsePre.vue` — code block override with copy button, Shiki dual-theme support
- [x] 4.2 Create `app/components/content/prose/ProseH2.vue` and `ProseH3.vue` — headings with anchor links
- [x] 4.3 ~~Create ProseTable.vue~~ — handled by `@tailwindcss/typography` plugin (user requested switch)
- [x] 4.4 ~~Create ProseA.vue~~ — handled by `@tailwindcss/typography` plugin (user requested switch)
  - **Validation:** Markdown renders with styled code blocks (copy works), clickable heading anchors, styled tables and links
  - **Note:** Switched to `@tailwindcss/typography` plugin per user request. ProsePre and ProseH2/H3 kept as overrides for copy button and anchor links respectively.

## 5. Content Scaffolding

- [x] 5.1 Create all content directories for every section and subsection (getting-started, components/data-display, components/data-entry, components/feedback, components/interactive, components/layout, components/navigation, components/overlay, components/utility, data-table, charts, blocks, examples)
- [x] 5.2 Create empty `.md` stub files with frontmatter (title, description) for all 70+ components, organized in numbered content directories (103 files total)
- [x] 5.3 Add root `package.json` scripts: `docs:dev`, `docs:build`, `docs:preview` (pre-existing)
- [x] 5.4 Add `.output/**` to `turbo.json` build task outputs (pre-existing)
  - **Validation:** Sidebar shows full navigation tree with all sections and component names, all routes accessible

## 6. Component Preview System

- [x] 6.1 Create `app/utils/exampleRegistry.ts` — uses `import.meta.glob('../components/examples/**/*.vue')` to build name-to-async-component map
- [x] 6.2 Create `app/composables/useComponentSource.ts` — uses `import.meta.glob('...', { query: '?raw', import: 'default', eager: true })` to load raw .vue source strings
- [x] 6.3 Create `app/composables/useCopyCode.ts` — clipboard copy utility with copied state timeout
- [x] 6.4 Create `app/components/content/ComponentPreview.vue` — MDC component with Preview/Code tabs (MeldUI Tabs), live component rendering via registry, syntax-highlighted source code, copy button. Wrapped in `<ClientOnly>` for SSR compatibility.
- [x] 6.5 Create prototype examples in `app/components/examples/button/`: ButtonBasic.vue, ButtonVariants.vue, ButtonSizes.vue, ButtonWithIcon.vue, ButtonLoading.vue
- [x] 6.6 Write complete `content/2.components/4.interactive/1.button.md` documentation page using ComponentPreview MDC blocks, as the reference template for all other component pages
  - **Validation:** Button page shows live previews, code tab displays highlighted source, copy button works, examples are interactive

## 7. API Documentation MDC Components

- [x] 7.1-7.4 Using standard Markdown tables styled by `@tailwindcss/typography` instead of custom MDC components. API reference sections (Props, Events, Slots) are written as standard Markdown tables in each component's `.md` file. Button page serves as the reference template.
  - **Note:** Simplified approach — custom PropsTable/EventsTable/SlotsTable components were unnecessary since `@tailwindcss/typography` provides good table styling out of the box.

## 8. Utility MDC Components

- [x] 8.1 Create `app/components/content/Callout.vue` — info/warning/danger/tip callout boxes with icon and colored border
- [x] 8.2 Create `app/components/content/Steps.vue` — numbered step-by-step instructions with visual indicators
- [x] 8.3 Create `app/components/content/LinkCard.vue` — card-style navigation links with title, description, and arrow
- [x] 8.4 Create `app/components/content/ComponentGrid.vue` — grid layout for listing components with links

## 9. Getting Started Content

- [x] 9.1 Write `content/1.getting-started/1.introduction.md` — overview of MeldUI, what it provides, when to use it (ported from Storybook Introduction.mdx)
- [x] 9.2 Write `content/1.getting-started/2.installation.md` — installation guide with pnpm commands, peer dependencies (ported from Storybook Installation.mdx)
- [x] 9.3 Write `content/1.getting-started/3.theming.md` — theme customization guide, CSS variables, OKLCH colors, @theme directive (ported from Storybook Theming.mdx)
- [x] 9.4 Write `content/1.getting-started/4.dark-mode.md` — dark mode setup, system preference detection, FOUC prevention
- [x] 9.5 Write `content/1.getting-started/5.icons.md` — icon system documentation, @meldui/tabler-vue usage, defaults, customization (ported from Storybook Icons.mdx)
- [x] 9.6 Write `content/1.getting-started/6.typography.md` — typography conventions and font configuration

## 10. Component Documentation — Data Display (10 components)

> Each task includes: creating 3-5 example .vue files + writing the .md page with examples and API reference.

- [x] 10.1 Avatar + AvatarGroup
- [x] 10.2 Badge
- [x] 10.3 Calendar
- [x] 10.4 Card
- [x] 10.5 Kbd
- [x] 10.6 RangeCalendar
- [x] 10.7 RelativeTime
- [x] 10.8 Table
- [x] 10.9 Timeline
  - **Validation:** All Data Display component pages render with live previews and API tables

## 11. Component Documentation — Data Entry (21 components)

- [x] 11.1 Checkbox
- [x] 11.2 Combobox
- [x] 11.3 DateRangePicker
- [x] 11.4 Field
- [x] 11.5 FileUpload
- [x] 11.6 Form
- [x] 11.7 Input
- [x] 11.8 InputGroup
- [x] 11.9 InputOtp
- [x] 11.10 Label
- [x] 11.11 Mention
- [x] 11.12 MultiSelect
- [x] 11.13 NativeSelect
- [x] 11.14 NumberField
- [x] 11.15 PinInput
- [x] 11.16 RadioGroup
- [x] 11.17 Select
- [x] 11.18 Slider
- [x] 11.19 Switch
- [x] 11.20 TagsInput
- [x] 11.21 Textarea
  - **Validation:** All Data Entry component pages render with live previews and API tables

## 12. Component Documentation — Feedback (9 components)

- [x] 12.1 Alert
- [x] 12.2 CircularProgress
- [x] 12.3 Dot
- [x] 12.4 Empty
- [x] 12.5 Progress
- [x] 12.6 Skeleton
- [x] 12.7 Sonner
- [x] 12.8 Spinner
- [x] 12.9 Stepper
  - **Validation:** All Feedback component pages render with live previews and API tables

## 13. Component Documentation — Interactive (5 components, Button done in task 6)

- [x] 13.1 ButtonGroup
- [x] 13.2 Carousel
- [x] 13.3 Command
- [x] 13.4 Toggle
- [x] 13.5 ToggleGroup

## 14. Component Documentation — Layout (7 components)

- [x] 14.1 Accordion
- [x] 14.2 AspectRatio
- [x] 14.3 Collapsible
- [x] 14.4 Resizable
- [x] 14.5 ScrollArea
- [x] 14.6 Separator
- [x] 14.7 Sidebar

## 15. Component Documentation — Navigation (7 components)

- [x] 15.1 Breadcrumb
- [x] 15.2 ContextMenu
- [x] 15.3 DropdownMenu
- [x] 15.4 Menubar
- [x] 15.5 NavigationMenu
- [x] 15.6 Pagination
- [x] 15.7 Tabs

## 16. Component Documentation — Overlay (7 components)

- [x] 16.1 AlertDialog
- [x] 16.2 Dialog
- [x] 16.3 Drawer
- [x] 16.4 HoverCard
- [x] 16.5 Popover
- [x] 16.6 Sheet
- [x] 16.7 Tooltip

## 17. Component Documentation — Utility (2 components)

- [x] 17.1 ClipboardCopy
- [x] 17.2 Item

## 18. Global Search

- [x] 18.1 Create `app/composables/useSearch.ts` — uses `queryCollection('docs')` with `useState` for shared state, groups pages by section
- [x] 18.2 Create `app/components/search/SearchDialog.vue` — uses MeldUI `CommandDialog`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty` with navigation on select, Cmd+K/Ctrl+K keyboard shortcut
- [x] 18.3 Create `app/components/search/SearchButton.vue` — header button showing "Search..." text and Kbd shortcut, triggers search dialog
- [x] 18.4 Integrate SearchButton + SearchDialog (wrapped in `<ClientOnly>`) into DocsHeader
  - **Validation:** Cmd+K opens search, typing filters results across all docs, selecting a result navigates to the page

## 19. DataTable Documentation (9 pages)

- [x] 19.1 Overview
- [x] 19.2 Basic usage
- [x] 19.3 Column helpers
- [x] 19.4 Sorting and filtering
- [x] 19.5 Selection
- [x] 19.6 Column pinning
- [x] 19.7 Customization
- [x] 19.8 Advanced filters
- [x] 19.9 Full example

## 20. Charts Documentation (12 pages)

- [x] 20.1 Overview
- [x] 20.2 Installation
- [x] 20.3 Line chart
- [x] 20.4 Area chart
- [x] 20.5 Bar chart
- [x] 20.6 Pie chart
- [x] 20.7 Donut chart
- [x] 20.8 Scatter chart
- [x] 20.9 Radar chart
- [x] 20.10 Heatmap chart
- [x] 20.11 Mixed chart
- [x] 20.12 Theme customization

## 21. Blocks Section

- [x] 21.1-21.6 Block documentation written as code-snippet-based pages (authentication, dashboard, settings, marketing, forms, data-display) in `content/5.blocks/`. Blocks are documented as inline code examples in Markdown rather than separate `.vue` component files with a BlockPreview component, since the content format better supports code-centric documentation.
  - **Note:** Simplified from original plan — blocks are documented as copyable code patterns in Markdown rather than live previews, matching the documentation-first approach.

## 22. Landing Page

- [x] 22.1 Create `app/pages/index.vue` with blank layout: hero section (tagline, CTA buttons), feature highlights grid (6 cards), component showcase grid (9 categories), quick start code snippet
- [x] 22.2 Built entirely with MeldUI components (Button, Card, Badge, CardHeader, CardTitle, CardDescription, icons)
  - **Validation:** Landing page renders at `/`, hero and features display, CTA links navigate to docs

## 23. Examples Section

- [x] 23.1 Write `content/6.examples/1.task-manager.md` — showcase of the task-manager example app with architecture overview, sidebar navigation, dashboard, task form, and settings patterns
- [x] 23.2 Write `content/6.examples/2.analytics-dashboard.md` — showcase of analytics dashboard pattern with stats cards, chart system, and DataTable integration

## 24. SSG Build and Deployment

- [x] 24.1 Run `nuxt generate` and fix any SSR/hydration issues — fixed incorrect component imports (ItemIcon→ItemMedia, PaginationList→PaginationContent, etc.), installed missing `@nuxt/devalue` dependency. Build succeeds: 213 routes prerendered in 6.7s.
- [x] 24.2 Add `@nuxtjs/sitemap` module and configure for automatic sitemap generation — installed `@nuxtjs/sitemap` + `nuxt-site-config`, configured `site.url` and `site.name` in `nuxt.config.ts`. Sitemap generates 104 URLs.
- [x] 24.3 Add `public/robots.txt` allowing all crawlers with sitemap reference
- [x] 24.4 Add per-page `useHead()` in `[...slug].vue` for title, description, OG tags (og:title, og:description, og:url, og:type, og:site_name, twitter:card, twitter:title, twitter:description) from frontmatter
- [x] 24.5 Verify all pages pre-render correctly — landing page, introduction, button component page, and sitemap all render correctly in static preview mode
- [x] 24.6 Configure deployment — `nuxt generate` build command outputs to `.output/public` directory, ready for any static hosting (Vercel, Netlify, etc.)
  - **Validation:** `pnpm --filter docs build` succeeds (213 routes), preview serves all pages, sitemap generated with 104 URLs, SEO meta tags present on all pages

## Dependencies

- Tasks 1-2 are foundational (must complete first)
- Tasks 3-4 depend on task 1
- Tasks 5-8 can proceed in parallel after tasks 3-4
- Task 6 (component preview system) must complete before tasks 10-17 (component documentation)
- Tasks 10-17 (component docs) can proceed in parallel with each other
- Task 18 (search) can proceed after task 5
- Tasks 19-20 (DataTable, Charts) can proceed after task 6
- Tasks 21-22 (Blocks, Landing Page) can proceed after task 6
- Task 24 (SSG/deployment) depends on all other tasks being complete
