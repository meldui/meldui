# MeldUI Documentation Site — TODO

## Phase 1: Foundation

- [x] Initialize `apps/docs/` with Astro (empty template)
- [x] Create `package.json` with all dependencies
- [x] Configure `astro.config.ts` (Vue, MDX, sitemap, Tailwind v4, Vue dedupe)
- [x] Create `tsconfig.json`
- [x] Set up `src/styles/global.css` (Tailwind v4 + MeldUI theme + `@source` directives)
- [x] Create `src/vue-app.ts` (Vue app entrypoint for `@astrojs/vue`)
- [x] Build `src/layouts/BaseLayout.astro` (HTML shell, `<head>`, dark mode inline script, fonts)
- [x] Build `src/layouts/DocsLayout.astro` (3-column responsive grid)
- [x] Build `src/components/Header.astro` (logo, search trigger, theme toggle, GitHub link)
- [x] Build `src/components/Sidebar.astro` (left navigation container)
- [x] Build `src/components/SidebarNav.astro` (recursive nav items with active state)
- [x] Build `src/components/Footer.astro`
- [x] Create `src/data/navigation.ts` (full sidebar navigation structure)
- [x] Set up content collection schema `src/content.config.ts`
- [x] Build dynamic route `src/pages/docs/[...slug].astro`
- [x] Build `src/components/ThemeToggle.vue` (dark/light toggle, localStorage, prefers-color-scheme)
- [x] Create landing page `src/pages/index.astro`
- [x] Add `"docs:dev"` and `"docs:build"` scripts to root `package.json`
- [x] Run `pnpm install` and verify dev server starts

## Phase 2: Content Infrastructure + Getting Started

- [ ] Build `src/components/ComponentPreview.vue` (Preview/Code tabs, slot for demo, code prop)
- [ ] Build `src/components/CopyButton.vue` (copy to clipboard with feedback)
- [ ] Build `src/components/ApiTable.astro` (renders props/events/slots tables from frontmatter)
- [ ] Build `src/components/Breadcrumbs.astro`
- [ ] Build `src/components/PrevNext.astro`
- [ ] Build `src/components/TableOfContents.astro` (right-side heading links)
- [ ] Create `src/content/docs/getting-started/index.mdx` (Introduction)
- [ ] Create `src/content/docs/getting-started/installation.mdx`
- [ ] Create `src/content/docs/getting-started/theming.mdx`
- [ ] Create `src/content/docs/getting-started/dark-mode.mdx`
- [ ] Create `src/content/docs/getting-started/icons.mdx`
- [ ] Verify all 5 pages render correctly with layout, nav, breadcrumbs, TOC

## Phase 3: Component Pages

### 3.1 Interactive (7 components)

- [ ] Button — demo + MDX + API
- [ ] ButtonGroup — demo + MDX + API
- [ ] Toggle — demo + MDX + API
- [ ] ToggleGroup — demo + MDX + API
- [ ] Command — demo + MDX + API
- [ ] Carousel — demo + MDX + API
- [ ] Combobox — demo + MDX + API

### 3.2 Form & Input (17 components)

- [ ] Input — demo + MDX + API
- [ ] Select — demo + MDX + API
- [ ] Checkbox — demo + MDX + API
- [ ] RadioGroup — demo + MDX + API
- [ ] Switch — demo + MDX + API
- [ ] Textarea — demo + MDX + API
- [ ] Slider — demo + MDX + API
- [ ] NumberField — demo + MDX + API
- [ ] Label — demo + MDX + API
- [ ] Field — demo + MDX + API
- [ ] Form — demo + MDX + API
- [ ] NativeSelect — demo + MDX + API
- [ ] InputGroup — demo + MDX + API
- [ ] InputOtp — demo + MDX + API
- [ ] PinInput — demo + MDX + API
- [ ] TagsInput — demo + MDX + API
- [ ] FileUpload — demo + MDX + API

### 3.3 Layout (9 components)

- [ ] Accordion — demo + MDX + API
- [ ] Table — demo + MDX + API
- [ ] Tabs — demo + MDX + API
- [ ] Separator — demo + MDX + API
- [ ] ScrollArea — demo + MDX + API
- [ ] Resizable — demo + MDX + API
- [ ] AspectRatio — demo + MDX + API
- [ ] Collapsible — demo + MDX + API
- [ ] Sidebar — demo + MDX + API

### 3.4 Navigation (7 components)

- [ ] Breadcrumb — demo + MDX + API
- [ ] DropdownMenu — demo + MDX + API
- [ ] ContextMenu — demo + MDX + API
- [ ] Menubar — demo + MDX + API
- [ ] NavigationMenu — demo + MDX + API
- [ ] Pagination — demo + MDX + API
- [ ] Tabs (if not already in Layout)

### 3.5 Overlay (7 components)

- [ ] Dialog — demo + MDX + API
- [ ] AlertDialog — demo + MDX + API
- [ ] Sheet — demo + MDX + API
- [ ] Drawer — demo + MDX + API
- [ ] Popover — demo + MDX + API
- [ ] Tooltip — demo + MDX + API
- [ ] HoverCard — demo + MDX + API

### 3.6 Data Display (6 components)

- [ ] Card — demo + MDX + API
- [ ] Avatar — demo + MDX + API
- [ ] Badge — demo + MDX + API
- [ ] Calendar — demo + MDX + API
- [ ] RangeCalendar — demo + MDX + API
- [ ] Kbd — demo + MDX + API

### 3.7 Feedback (10 components)

- [ ] Alert — demo + MDX + API
- [ ] Progress — demo + MDX + API
- [ ] CircularProgress — demo + MDX + API
- [ ] Skeleton — demo + MDX + API
- [ ] Spinner — demo + MDX + API
- [ ] Dot — demo + MDX + API
- [ ] Empty — demo + MDX + API
- [ ] Stepper — demo + MDX + API
- [ ] Sonner — demo + MDX + API
- [ ] Item — demo + MDX + API

## Phase 4: Composites

- [ ] DataTable — basic usage demo
- [ ] DataTable — filtering demo (all filter types)
- [ ] DataTable — selection & bulk actions demo
- [ ] DataTable — column helpers & cell renderers
- [ ] DataTable — column pinning demo
- [ ] DataTable — server-side demo
- [ ] DataTable — full MDX page with all sections + API tables
- [ ] DateRangePicker — demo + MDX + API
- [ ] MultiSelect — demo + MDX + API
- [ ] Mention — demo + MDX + API
- [ ] Timeline — demo + MDX + API
- [ ] AvatarGroup — demo + MDX + API
- [ ] ClipboardCopy — demo + MDX + API
- [ ] RelativeTime — demo + MDX + API

## Phase 5: Charts

- [ ] Charts overview page (chart type selection guide)
- [ ] Charts installation page
- [ ] MeldLineChart — demo + MDX + config options
- [ ] MeldBarChart — demo + MDX + config options
- [ ] MeldAreaChart — demo + MDX + config options
- [ ] MeldPieChart — demo + MDX + config options
- [ ] MeldDonutChart — demo + MDX + config options
- [ ] MeldScatterChart — demo + MDX + config options
- [ ] MeldRadarChart — demo + MDX + config options
- [ ] MeldHeatmapChart — demo + MDX + config options
- [ ] MeldMixedChart — demo + MDX + config options
- [ ] Charts theme customization page
- [ ] Charts events & interactivity page

## Phase 6: Search & LLM Optimization

- [ ] Add Pagefind to build pipeline (`astro build && pagefind --site dist`)
- [ ] Build `src/components/SearchDialog.vue` (command palette, `Ctrl+K`)
- [ ] Wire search trigger in Header
- [ ] Write `scripts/generate-llms.ts`
- [ ] Generate `llms.txt` (summary index)
- [ ] Generate `llms-full.txt` (full API docs)
- [ ] Add `generate-llms` to build pipeline
- [ ] Verify `sitemap.xml` generation
- [ ] Add `public/robots.txt`
- [ ] Add Open Graph meta tags to BaseLayout

## Phase 7: Polish

- [ ] Create examples/common patterns page
- [ ] Link to Task Manager example app
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Accessibility audit (keyboard navigation, screen reader)
- [ ] Performance check (Lighthouse score)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Final review of all pages for consistency
