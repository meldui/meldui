# @meldui/a2ui

## 0.1.2

### Patch Changes

- Updated dependencies [ab6255e]
- Updated dependencies [bef9a70]
- Updated dependencies [2d56b56]
  - @meldui/vue@0.3.5
  - @meldui/charts-vue@0.3.5

## 0.1.1

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @meldui/charts-vue@0.3.4
  - @meldui/vue@0.3.4

## 0.1.0

### Minor Changes

- 98435df: Introduce `@meldui/a2ui` — the portable MeldUI A2UI catalog contract. Adds a stable `catalogId`, A2UI v0.9 JSON-Schema definitions for the Basic primitives plus MeldUI structural/display and rich components, the A2UI Basic functions and theme shape, and a codegen pipeline that keeps the published `meldui-v1.catalog.json` (exported via `@meldui/a2ui/catalog`) in sync with the component definitions. Catalog contract only; the Vue renderer ships separately.
- 81ba363: Add the Vue reference renderer at `@meldui/a2ui/vue`. Renders streamed A2UI v0.9 messages into live `@meldui/vue` components for all 35 catalog components, built on `@a2ui/web_core` with fine-grained per-component reactivity. Exposes `provideA2UI`, `<A2UISurface>`, and the `MELDUI_CATALOG`; supports data binding, client-action dispatch, incremental Markdown streaming, and inherits MeldUI's OKLCH theming. `@meldui/tabler-vue` (Icon) and `@meldui/charts-vue` (Chart) are optional peers. The framework-agnostic `@meldui/a2ui` contract entry stays Vue-free.

### Patch Changes

- Updated dependencies [46a849a]
  - @meldui/vue@0.3.3
  - @meldui/charts-vue@0.3.3
