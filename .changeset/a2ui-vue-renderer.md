---
"@meldui/a2ui": minor
---

Add the Vue reference renderer at `@meldui/a2ui/vue`. Renders streamed A2UI v0.9 messages into live `@meldui/vue` components for all 35 catalog components, built on `@a2ui/web_core` with fine-grained per-component reactivity. Exposes `provideA2UI`, `<A2UISurface>`, and the `MELDUI_CATALOG`; supports data binding, client-action dispatch, incremental Markdown streaming, and inherits MeldUI's OKLCH theming. `@meldui/tabler-vue` (Icon) and `@meldui/charts-vue` (Chart) are optional peers. The framework-agnostic `@meldui/a2ui` contract entry stays Vue-free.
