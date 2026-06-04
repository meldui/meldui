# @meldui/a2ui

The **MeldUI [A2UI](https://a2ui.org) catalog** — a portable, framework-agnostic catalog contract that lets any A2UI-speaking agent render UI using MeldUI components.

A2UI is a protocol where an agent streams JSON describing a UI and a client renders it against a **catalog**: a JSON-Schema document that maps abstract component names to a concrete design system. This package _is_ that catalog for MeldUI. It targets **A2UI v0.9**.

> **Scope:** this package, today, is the **catalog contract only** — the schema and the component definitions. The Vue reference renderer (`provideA2UI`, `<A2UISurface>`, the `@meldui/vue` component mapping) ships separately in a follow-up release.

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
    "supportedCatalogIds": ["https://meldui.dev/catalogs/vue/v1/catalog.json"],
  },
}
```

## Catalog id

```
https://meldui.dev/catalogs/vue/v1/catalog.json
```

This is the stable identifier agents negotiate against (`CATALOG_ID`). A future incompatible revision will use a new versioned id (e.g. `.../v2/catalog.json`).

## Components

One advertised catalog, organized into reliability tiers (not separate catalogs):

- **A2UI Basic primitives** (exact spec names, for ecosystem interop): `Row`, `Column`, `List`, `Card`, `Modal`, `Tabs`, `Text`, `Image`, `Icon`, `Divider`, `Button`, `TextField`, `CheckBox`, `Slider`, `ChoicePicker`, `DateTimeInput`.
- **Structural & display**: `Avatar`, `AvatarGroup`, `Kbd`, `Alert`, `Badge`, `Stepper`, `ButtonGroup`, `Carousel`, `ToggleGroup`, `Accordion`, `ScrollArea`, `Separator`, `Table`.
- **Rich**: `Markdown` (the primary text path; tolerates streamed/partial Markdown), `Timeline`, `Sidebar`, `Combobox`, `MultiSelect`, `Chart`.

`DataTable` is intentionally excluded (too complex for reliable LLM generation); `Table` covers tabular output.

The catalog also declares the A2UI Basic **functions** (`required`, `regex`, `length`, `email`, `formatString`, `formatDate`, …) and a **theme** token shape.

## Development

```bash
pnpm --filter @meldui/a2ui generate-catalog  # regenerate src/schema/meldui-v1.catalog.json from the TS definitions
pnpm --filter @meldui/a2ui validate-catalog   # drift + schema validity + coverage checks
pnpm --filter @meldui/a2ui build              # generate + bundle (ESM/CJS/d.ts) + copy catalog to dist
```

The per-component TypeScript definitions in `src/catalog` are the **single source of truth**; `meldui-v1.catalog.json` is generated from them and committed. `validate-catalog` fails if the committed artifact drifts from the definitions.

## Attribution

The A2UI Basic primitive definitions, the catalog `functions`, and the `theme` schema are derived from [google/A2UI](https://github.com/google/A2UI) (`specification/v0_9`), licensed under Apache-2.0. MeldUI reuses the shared `common_types.json` `$defs` so its components are structurally interoperable with the wider A2UI ecosystem.
