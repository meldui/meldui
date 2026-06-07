## Why

MeldUI components can only be used today by hand-wiring them into a Vue app. To make MeldUI renderable inside _any_ agentic-chat application, MeldUI needs to speak [A2UI](https://a2ui.org) (Google's Agent-Driven UI protocol), where an agent streams JSON describing a UI and a client renders it against a **catalog** — a framework-agnostic JSON-Schema contract mapping abstract component names to a concrete design system. The catalog is the portable asset: any A2UI-speaking agent (Google ADK, CopilotKit, a Phoenix server, etc.) can target it without knowing the design system is Vue. This change delivers that contract first; the Vue reference renderer follows in a separate change (`add-a2ui-vue-renderer`).

## What Changes

- Add a new package `@meldui/a2ui` (`packages/a2ui/`) whose **first and headline deliverable is the catalog contract** — not yet the renderer.
- Define a stable `catalogId` URI identifying the MeldUI catalog and its version (`https://meldui.dipayanb.com/a2ui/v1/catalog.json`).
- Define **per-component JSON-Schema definitions** targeting **A2UI v0.9** (flat `component` discriminator, plain-JSON data model, JSON Pointer binding) for:
  - **A2UI Basic primitives** kept under their exact spec names for ecosystem interop: `Row`, `Column`, `List`, `Card`, `Modal`, `Tabs`, `Text`, `Image`, `Icon`, `Divider`, `Button`, `TextField`, `CheckBox`, `Slider`, `ChoicePicker`, `DateTimeInput`.
  - **MeldUI structural & display** components: `Avatar`, `AvatarGroup`, `Kbd`, `Alert`, `Badge`, `Stepper`, `ButtonGroup`, `Carousel`, `ToggleGroup`, `Accordion`, `ScrollArea`, `Separator`, `Table`.
  - **Rich** components: `Markdown` (the primary chat-text path), `Timeline`, `Sidebar`, `Combobox`/`MultiSelect`, `Chart`.
  - `DataTable` is intentionally **excluded** (too complex for reliable LLM generation); the simpler `Table` covers tabular output.
- Establish **single-source-of-truth codegen**: a script derives the published `meldui-v1.catalog.json` from co-located per-component schema metadata, so the contract cannot drift from its definitions (same pattern as `tabler-vue/scripts/generate.ts`).
- Publish the catalog as a package export (`@meldui/a2ui/catalog`) so agents/tooling can fetch the contract directly.
- This change ships **contract artifacts only** — the catalog JSON, the component schema definitions, and the codegen script. No Vue rendering code, no prop adapters, no theme bridge (those belong to `add-a2ui-vue-renderer`).
- Document the catalog: an auto-generated catalog reference (from the definitions) plus a narrative overview in the Astro docs site, a Storybook intro page, and inclusion in `llms.txt` for agent/LLM consumers. Interactive component stories arrive with the renderer in `add-a2ui-vue-renderer`.

## Capabilities

### New Capabilities

- `a2ui-catalog`: The MeldUI A2UI catalog contract — `catalogId` identity and versioning, the set of supported components and their A2UI v0.9 JSON-Schema property definitions, the generated `catalog.json` artifact and its package export, and the codegen that keeps the published contract in sync with the per-component definitions.

### Modified Capabilities

<!-- None. This is a wholly new package and capability. -->

## Impact

- **New package**: `packages/a2ui/` (`@meldui/a2ui`) — initially containing only the schema definitions, generated `catalog.json`, and codegen script. Mirrors the `charts-vue`/`tabler-vue` sibling package template (package.json fields, tsconfig, publishConfig to `npm.pkg.github.com`).
- **New dependency consideration**: targets A2UI **v0.9**; pin the `version: "v0.9"` literal in one place. (`@a2ui/web_core` is a renderer-side dependency and is deferred to `add-a2ui-vue-renderer`.)
- **Workspace**: `pnpm-workspace.yaml` already globs `packages/*`; confirm pickup.
- **Versioning**: introduce `@meldui/a2ui` at `0.1.0` via a changeset.
- **Open item**: the `catalogId` URI needs a canonical hostable home; until decided, ship the file in-package and use a consistent placeholder URI.
- **Breaking changes**: none — wholly new package; no changes to existing `@meldui/*` exports.
- **Follow-on**: `add-a2ui-vue-renderer` depends on this contract.
