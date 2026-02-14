## ADDED Requirements

### Requirement: Documentation Site Application

The system SHALL provide a Nuxt 4 documentation site application at `apps/docs/` within the pnpm monorepo that uses `@nuxt/content` v3 for Markdown-driven documentation with MDC (Markdown Components) syntax.

#### Scenario: Development server startup

- **WHEN** a developer runs `pnpm --filter docs dev`
- **THEN** the Nuxt 4 development server starts and serves the documentation site with hot module replacement

#### Scenario: Workspace integration

- **WHEN** the docs app is initialized in `apps/docs/`
- **THEN** it uses `workspace:*` references for `@meldui/vue`, `@meldui/tabler-vue`, and `@meldui/charts-vue` dependencies, matching the `apps/task-manager/` pattern

### Requirement: Three-Column Documentation Layout

The system SHALL render documentation pages in a responsive 3-column layout: left sidebar navigation, center main content area, and right table-of-contents column.

#### Scenario: Desktop layout (lg+ breakpoint)

- **WHEN** a user views a documentation page on a screen ≥1024px wide
- **THEN** all three columns are visible: sidebar (left), content (center), and TOC (right)

#### Scenario: Tablet layout (md-lg breakpoint)

- **WHEN** a user views a documentation page on a screen between 768px and 1023px
- **THEN** the right TOC column is hidden and the sidebar is accessible via a slide-out sheet

#### Scenario: Mobile layout (<md breakpoint)

- **WHEN** a user views a documentation page on a screen <768px
- **THEN** both sidebar and TOC are hidden, with sidebar accessible via a mobile hamburger menu using MeldUI Sheet component

### Requirement: MeldUI Component Dogfooding

The system SHALL use MeldUI components for all site UI elements, demonstrating the library's own capabilities.

#### Scenario: Site navigation uses MeldUI components

- **WHEN** the docs site renders navigation UI
- **THEN** it uses MeldUI `Collapsible` for sidebar sections, `ScrollArea` for sidebar scrolling, `Sheet` for mobile navigation, `Button` for navigation actions, and `Separator` for visual dividers

#### Scenario: Content UI uses MeldUI components

- **WHEN** the docs site renders content-related UI
- **THEN** it uses MeldUI `Tabs` for code preview toggle, `Table` for API documentation, `Badge` for component status labels, and icons from `@meldui/tabler-vue`

### Requirement: Dark and Light Mode

The system SHALL support dark mode, light mode, and system preference detection with a user-toggleable control.

#### Scenario: System preference detection

- **WHEN** a user visits the site for the first time without a saved preference
- **THEN** the site applies the user's OS-level color scheme preference (dark or light)

#### Scenario: Manual mode toggle

- **WHEN** a user clicks the theme toggle in the header and selects a mode (Light, Dark, or System)
- **THEN** the selected mode is applied immediately, persisted to localStorage, and used on subsequent visits

#### Scenario: No flash of unstyled content (FOUC)

- **WHEN** a page loads
- **THEN** an inline script in `<head>` applies the saved theme class before the page renders, preventing a visible flash between themes

#### Scenario: Dual-theme code highlighting

- **WHEN** a code block is rendered
- **THEN** both light (github-light) and dark (github-dark) Shiki themes are included, with CSS toggling visibility based on the active color mode

### Requirement: Tailwind CSS v4 Integration

The system SHALL use Tailwind CSS v4 with CSS-first configuration, importing the MeldUI default theme, matching the pattern established in `apps/task-manager/src/styles/app.css`.

#### Scenario: CSS configuration matches task-manager pattern

- **WHEN** the docs app CSS is loaded
- **THEN** it imports `tailwindcss`, `tw-animate-css`, and the MeldUI default theme from `packages/vue/src/themes/default.css`, with `@source` directives scanning both the docs app and MeldUI library source files

### Requirement: Sidebar Navigation

The system SHALL render a hierarchical sidebar navigation generated from the content file structure using `queryCollectionNavigation` from @nuxt/content v3.

#### Scenario: Navigation tree rendering

- **WHEN** the sidebar renders
- **THEN** it displays a tree of navigation links grouped by section (Getting Started, Components subcategories, Data Table, Charts, Blocks, Examples) with collapsible sections using MeldUI `Collapsible`

#### Scenario: Active page highlighting

- **WHEN** a user is viewing a specific documentation page
- **THEN** the corresponding sidebar link is visually highlighted with an accent background

#### Scenario: Section memory

- **WHEN** a user expands or collapses a sidebar section and navigates to another page
- **THEN** the section's open/closed state is preserved

### Requirement: Table of Contents

The system SHALL render a right-side table of contents for the current page using heading data from @nuxt/content with active heading tracking via Intersection Observer.

#### Scenario: TOC generation

- **WHEN** a documentation page with h2 and h3 headings renders
- **THEN** a table of contents appears in the right column listing all h2 and h3 headings as anchor links, with h3 entries visually indented

#### Scenario: Scroll spy

- **WHEN** a user scrolls through the page content
- **THEN** the TOC highlights the heading currently visible in the viewport

### Requirement: Prose Component Styling

The system SHALL override default @nuxt/content prose components to style code blocks, headings, tables, and links with MeldUI design tokens and enhanced features.

#### Scenario: Code blocks with copy button

- **WHEN** a fenced code block renders in Markdown
- **THEN** it displays with Shiki syntax highlighting and a copy-to-clipboard button

#### Scenario: Headings with anchor links

- **WHEN** an h2 or h3 heading renders
- **THEN** it includes a clickable anchor link icon for deep-linking

### Requirement: Page Footer Navigation

The system SHALL render previous/next page navigation links at the bottom of each documentation page.

#### Scenario: Previous and next links

- **WHEN** a user reaches the bottom of a documentation page
- **THEN** links to the previous and next pages in the navigation order are displayed

### Requirement: Static Site Generation

The system SHALL support static site generation via `nuxt generate` for deployment to static hosting platforms.

#### Scenario: SSG build

- **WHEN** `pnpm --filter docs build` (which runs `nuxt generate`) is executed
- **THEN** all documentation pages are pre-rendered as static HTML files in `.output/public/` with all assets bundled

#### Scenario: Crawl-based discovery

- **WHEN** the SSG build runs
- **THEN** Nitro's `crawlLinks` option discovers and pre-renders all linked pages starting from the root route

### Requirement: SEO Optimization

The system SHALL generate per-page meta tags, a sitemap, and proper robots.txt for search engine optimization.

#### Scenario: Per-page meta tags

- **WHEN** a documentation page renders
- **THEN** the page has appropriate `<title>`, `<meta description>`, `og:title`, and `og:description` tags derived from the Markdown frontmatter

#### Scenario: Sitemap generation

- **WHEN** the site is built
- **THEN** an XML sitemap is generated listing all documentation pages
