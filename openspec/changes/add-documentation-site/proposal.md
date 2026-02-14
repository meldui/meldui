# Change: Add MeldUI Documentation Site

## Why

MeldUI's current documentation relies on Storybook, which has significant limitations: iframe-heavy rendering makes it difficult for AI coding agents to parse, the Vue integration is suboptimal, and it doesn't effectively showcase the design system for adoption. A dedicated documentation website will provide a better developer experience, improve discoverability of components, and serve as a living showcase of MeldUI's capabilities by using its own components for the site UI (dogfooding).

## What Changes

- **New Nuxt 4 application** in `apps/docs/` using `@nuxt/content` v3 for Markdown-driven documentation with MDC (Markdown Components) syntax
- **3-column layout** inspired by Ark UI: left sidebar navigation, center content area, right table-of-contents
- **Live component preview system** that renders actual Vue examples inline with syntax-highlighted source code and copy buttons
- **Dark/light mode** with system preference detection, toggle, and FOUC prevention
- **Global Cmd+K search** using MeldUI's own CommandDialog component with @nuxt/content full-text search
- **Documentation for all 70+ UI components** and 8 composite component families with live examples and manual API reference tables (props/events/slots)
- **Blocks section** with copy-paste-ready UI patterns (authentication forms, dashboards, settings pages, marketing sections) featuring responsive preview
- **Marketing landing page** with hero section, feature highlights, and component showcase grid
- **Getting Started guides** covering introduction, installation, theming, dark mode, icons, and typography
- **DataTable and Charts sections** with dedicated multi-page documentation
- **Static site generation (SSG)** for deployment on Vercel/Netlify
- **SEO optimization** with per-page meta tags, sitemap generation, and OG images

## Impact

- Affected specs: None (new capability, no existing specs modified)
- Affected code:
  - New `apps/docs/` application (Nuxt 4 project)
  - `pnpm-workspace.yaml` already includes `apps/*` — no changes needed
  - Root `package.json` — add `docs:dev`, `docs:build`, `docs:preview` scripts
  - `turbo.json` — add `.output/**` to build outputs
- Existing Storybook remains operational alongside the docs site
