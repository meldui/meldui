## Why

`add-a2ui-catalog-contract` delivers the portable MeldUI A2UI catalog — the framework-agnostic contract any agent can target. But a contract renders nothing on its own. Vue consuming apps (agentic chat UIs) need a **reference renderer** that turns A2UI v0.9 messages into live MeldUI components, so a stream of `createSurface`/`updateComponents`/`updateDataModel` messages becomes real UI built from `@meldui/vue`. This change adds that renderer to `@meldui/a2ui`, built on Google's official `@a2ui/web_core` protocol core — making MeldUI a first-class, drop-in A2UI design system for Vue.

## What Changes

- Add the Vue **reference renderer** to `@meldui/a2ui`, built on **`@a2ui/web_core@^0.10` (`/v0_9` entry)** — its `MessageProcessor`, `SurfaceModel`/`ComponentModel`/`DataModel`, `ComponentContext`/`DataContext`, and `GenericBinder`. web_core owns message processing, surface state, and JSON-Pointer data binding; the renderer is a thin Vue layer on top.
- **Reactivity bridge (fine-grained, official-renderer parity):** a `toVueRef` adapter wrapping web_core's Preact signals via Vue `customRef`/`shallowRef`, so only the node whose bound data changed re-renders — matching the React (`useSyncExternalStore`) and Angular (`toAngularSignal`) renderers, not the community lib's coarse single-counter approach.
- **Per-component prop resolution via web_core's `GenericBinder`** (as the official React renderer does), rather than reimplementing DynamicValue / JSON-pointer / function-call resolution.
- **Lazy, recursive component host:** an `A2UISurface` entry plus a `DeferredChild`-style host that resolves children by id from the flat adjacency model on demand (no eager tree materialization), with explicit binder/effect **dispose on unmount** to prevent DataModel subscription leaks.
- **Catalog implementation:** map each catalog component name from `add-a2ui-catalog-contract` to a `@meldui/vue` component, with thin adapter wrappers where the MeldUI API must be reshaped (`MeldRow`, `MeldColumn`, `MeldText`, `MeldIcon`); wire interactive components' actions back through `sendAction` → web_core client-action envelope (`{ version: 'v0.9', action }`).
- **Public API:** `provideA2UI({ catalog, theme, catalogId })`, `<A2UISurface :surface-id>`, the `MELDUI_CATALOG`, and supporting composables/types. Advertise `supportedCatalogIds` with the stable MeldUI `catalogId` for agent negotiation.
- **Theme bridge:** a default A2UI `theme` object binding A2UI theme tokens onto MeldUI's existing OKLCH CSS variables (`@meldui/vue/themes/default`) so surfaces inherit MeldUI light/dark.
- **Storybook stories** that replay canned v0.9 message sequences (component galleries, streaming-markdown, action round-trip, JSON playground) for documentation and manual verification.

## Capabilities

### New Capabilities

- `a2ui-vue-renderer`: The Vue reference renderer — web_core integration, the fine-grained Preact→Vue reactivity bridge, the recursive lazy component host, the catalog→`@meldui/vue` component implementation and prop adapters, action dispatch, the theme bridge, and the public `provideA2UI`/`A2UISurface` API.

### Modified Capabilities

- `a2ui-catalog`: Only if the catalog must expose renderer-facing metadata (e.g. attach Vue component references or a `theme` token shape to existing component definitions). If the contract from `add-a2ui-catalog-contract` already suffices unchanged, this is empty and no delta is created.

## Impact

- **Package**: extends `packages/a2ui/` (`@meldui/a2ui`) with `src/core/` (processor wrapper, `toVueRef`, `A2UISurface`, `DeferredChild`/host, `useDynamicComponent`, `provideA2UI`), `src/catalog/` (entries + adapters), and `src/theme/`.
- **New dependency**: `@a2ui/web_core@^0.10` (uses the `/v0_9` subpath export; transitively `@preact/signals-core`).
- **New peer deps**: `vue`, `@meldui/vue`, `@meldui/tabler-vue`, `@meldui/charts-vue` (charts optional).
- **Reuse**: `MarkdownViewer` (`@incremark/vue`) for the `Markdown` component; `@meldui/vue/themes/default` OKLCH tokens for the theme bridge; `@meldui/tabler-vue` for `Icon`; `@meldui/charts-vue` for `Chart`.
- **Storybook**: new `apps/vue-storybook/stories/A2UI/` stories. (`vue-storybook` consumes built dist — build `@meldui/vue` and `@meldui/a2ui` before it picks up changes.)
- **Versioning**: `@meldui/a2ui` minor bump via changeset.
- **Depends on**: `add-a2ui-catalog-contract` (the catalog contract + `catalogId`).
- **Breaking changes**: none — additive within the new package.
