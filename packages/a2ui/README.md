# @meldui/a2ui

The **MeldUI [A2UI](https://a2ui.org) catalog** — a portable, framework-agnostic catalog contract that lets any A2UI-speaking agent render UI using MeldUI components.

A2UI is a protocol where an agent streams JSON describing a UI and a client renders it against a **catalog**: a JSON-Schema document that maps abstract component names to a concrete design system. This package _is_ that catalog for MeldUI. It targets **A2UI v0.9**.

This package provides two things:

- **`@meldui/a2ui`** — the portable, framework-agnostic catalog contract (schema + component definitions). Any A2UI agent can target it.
- **`@meldui/a2ui/vue`** — the Vue reference renderer that turns streamed A2UI v0.9 messages into live `@meldui/vue` components (all 35 catalog components).

## Install

```bash
pnpm add @meldui/a2ui
```

## Usage

**Get the portable catalog artifact** (for agents / tooling that consume the raw contract):

```ts
import catalog from '@meldui/a2ui/catalog' // meldui-v1.catalog.json
```

**Typed / programmatic access** from the main entry:

```ts
import { catalog, CATALOG_ID, MELDUI_COMPONENT_NAMES, buildCatalog } from '@meldui/a2ui'
```

A client advertises support for this catalog by id, and the agent targets it:

```jsonc
// client → agent (negotiation)
{
  "a2uiClientCapabilities": {
    "supportedCatalogIds": ["https://meldui.dipayanb.com/a2ui/v1/catalog.json"],
  },
}
```

## Catalog id

```
https://meldui.dipayanb.com/a2ui/v1/catalog.json
```

This is both the stable identifier agents negotiate against (`CATALOG_ID`) and the URL the catalog is hosted at (served as a public asset by the docs site). There is no framework segment in the path — the catalog is the framework-agnostic MeldUI contract, not a renderer.

**Versioning:** `v1` is stable. Backward-compatible changes (new optional props or components) overwrite the `v1` file in place; a breaking revision mints a new id (`.../a2ui/v2/catalog.json`) so agents can pin to a major version.

## Components

One advertised catalog, organized into reliability tiers (not separate catalogs):

- **A2UI Basic primitives** (exact spec names, for ecosystem interop): `Row`, `Column`, `List`, `Card`, `Modal`, `Tabs`, `Text`, `Image`, `Icon`, `Divider`, `Button`, `TextField`, `CheckBox`, `Slider`, `ChoicePicker`, `DateTimeInput`.
- **Structural & display**: `Avatar`, `AvatarGroup`, `Kbd`, `Alert`, `Badge`, `Stepper`, `ButtonGroup`, `Carousel`, `ToggleGroup`, `Accordion`, `ScrollArea`, `Separator`, `Table`.
- **Rich**: `Markdown` (the primary text path; tolerates streamed/partial Markdown), `Timeline`, `Sidebar`, `Combobox`, `MultiSelect`, `Chart`.

`DataTable` is intentionally excluded (too complex for reliable LLM generation); `Table` covers tabular output.

The catalog also declares the A2UI Basic **functions** (`required`, `regex`, `length`, `email`, `formatString`, `formatDate`, …) and a **theme** token shape.

## Vue renderer (`@meldui/a2ui/vue`)

The reference renderer maps the catalog to `@meldui/vue` components and renders streamed A2UI v0.9 messages. It's built on Google's `@a2ui/web_core` with fine-grained, per-component reactivity.

```bash
pnpm add @meldui/a2ui @meldui/vue vue
# optional, for the Icon and Chart components:
pnpm add @meldui/tabler-vue @meldui/charts-vue
```

Call `provideA2UI` in a root `setup()`, feed streamed messages to `processor.processMessages(...)`, and mount `<A2UISurface :surface-id="...">`:

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import '@incremark/theme/styles.css' // for the Markdown component

const { processor } = provideA2UI({
  // forward client actions (e.g. a Button press) back to your agent
  onAction: (action) => sendToAgent(action),
})

onMounted(() => {
  // messages arrive from your transport (SSE / WebSocket / A2A)
  processor.processMessages(incomingMessages)
})
</script>

<template>
  <A2UISurface surface-id="main" />
</template>
```

Consumers also import the MeldUI theme once (`@meldui/vue/themes/default`) so surfaces inherit MeldUI's light/dark design tokens. Interactive components two-way bind to the data model; `Button`/input actions are dispatched through `onAction`.

## Development

```bash
pnpm --filter @meldui/a2ui generate-catalog  # regenerate src/schema/meldui-v1.catalog.json from the TS definitions
pnpm --filter @meldui/a2ui validate-catalog   # drift + schema validity + coverage checks
pnpm --filter @meldui/a2ui build              # generate + bundle (ESM/CJS/d.ts) + copy catalog to dist
```

The per-component TypeScript definitions in `src/catalog` are the **single source of truth**; `meldui-v1.catalog.json` is generated from them and committed. `validate-catalog` fails if the committed artifact drifts from the definitions.

## Attribution

The A2UI Basic primitive definitions, the catalog `functions`, and the `theme` schema are derived from [google/A2UI](https://github.com/google/A2UI) (`specification/v0_9`), licensed under Apache-2.0. MeldUI reuses the shared `common_types.json` `$defs` so its components are structurally interoperable with the wider A2UI ecosystem.
