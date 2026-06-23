## Context

The `MeldEditor` component lives in doqo at `frontend/src/components/editor/` — 30 files
built on TipTap v3, already using `@meldui/vue`, `@meldui/tabler-vue`, and
`@meldui/charts-vue`. An exploration confirmed it has **no doqo-specific coupling**: no app
imports, API calls, stores, routing, or env; image upload and mention search are passed in
as callbacks, and custom blocks are registered through a `customComponents` prop. This makes
it a clean candidate to extract into its own MeldUI package essentially unchanged.

The MeldUI monorepo already has well-established conventions for a publishable Vue library
(`@meldui/vue`): Vite library mode with `preserveModules`, dual ESM/CJS output, `vite-plugin-dts`
for types, Tailwind v4 CSS-first, Biome via the root config, Changesets for versioning, and
Storybook (CSF3 + MDX) for docs. The new package mirrors these.

## Goals / Non-Goals

**Goals:**

- A standalone, independently versioned `@meldui/editor` package that builds to ESM + CJS +
  types and is publish-ready.
- Reproduce the editor's behaviour and public API verbatim (lift-and-shift).
- Good Storybook coverage and an MDX docs page.

**Non-Goals:**

- Decoupling the chart node from `@meldui/charts-vue` (kept as a required peer).
- Any refactor, rename, or feature change beyond import-path rewrites.
- Migrating doqo to the new package.
- Publishing (changeset only).

## Decisions

### D1. Lift-and-shift verbatim; only imports change

Files are copied 1:1 from doqo into `packages/editor/src/`. The only edits are import paths:
internal relative imports are preserved (optionally normalised to the `@/` alias per MeldUI
convention), and the `@meldui/*` imports stay as-is (now resolved via peer deps). No logic,
prop, or styling changes. This keeps the diff reviewable and the behaviour identical.

### D2. TipTap / tippy.js / nanoid as dependencies, external in the build

These are the editor's engine and must be present at runtime, so they are real
`dependencies` (auto-installed for consumers). But they are marked `external` in
`vite.config.ts` so they are not bundled into `dist` — mirroring how `@meldui/vue`
externalises radix/tanstack/unovis/etc. This avoids duplicate copies in a consumer app and
keeps the package small. `@tiptap/*` is matched with a `/^@tiptap\//` regex.

### D3. `@meldui/charts-vue` is a required peer dependency

The chart block (`chart/ChartNodeExtension.ts` + views) imports `MeldChart` from
`@meldui/charts-vue`, and the chart node is registered by default. Per the lift-and-shift
goal we keep it default-registered, which makes `@meldui/charts-vue` a **required** peer
dependency (not optional). `@meldui/vue` (Button, Dialog, Tabs, etc.) and
`@meldui/tabler-vue` (icons) are likewise peers, alongside `vue`. Using peers (not bundling)
matches every other MeldUI package and lets the consumer share a single copy.

### D4. `@/` alias for internal imports

`tsconfig.json` and `vite.config.ts` define `@ -> ./src`, matching `@meldui/vue`. Internal
imports are normalised to `@/...` where practical, consistent with the documented MeldUI
preference for alias imports over deep relative paths.

### D5. Styles via a `@meldui/editor/styles` export (build-only Tailwind entry)

The editor styling is component-scoped (`:deep()` on `.tiptap`) plus Tailwind utility
classes that resolve against the consumer's own theme/`@meldui/vue` tokens — it ships no
theme of its own. `src/styles/index.css` (`@import 'tailwindcss'` + `@source` globs) exists
mainly so the package can build/typecheck standalone; a `./styles` export is provided for
parity with `@meldui/vue`, but consumers normally already import `@meldui/vue/themes/default`.
(No theme-copy plugin is needed — unlike `@meldui/vue`, the editor has no `themes/` dir.)

## Risks / Trade-offs

- **Required charts-vue peer** means every consumer installs `@meldui/charts-vue` even if
  they never use the chart block. Accepted for now to stay faithful to the current
  implementation; an opt-in chart node could be a future change if the weight matters.
- **Version drift across `@meldui/*` peers** — the editor expects compatible versions of
  vue/tabler-vue/charts-vue. Declared with `workspace:*` in-repo; published peer ranges
  should track the current majors.
- **TipTap v3 API** — pinned to `^3.x`; a future TipTap major would need a follow-up.

## Migration Plan

New package only; nothing to migrate. A changeset marks `@meldui/editor@0.1.0`; the normal
release flow versions/publishes it later. doqo continues to use its local editor until a
separate migration change swaps it for `@meldui/editor`.

## Open Questions

- Should the chart node become opt-in (making `@meldui/charts-vue` an optional peer)?
  Deferred — current decision is required-peer per the lift-and-shift intent.
- Does the package need its own theme tokens, or is relying on `@meldui/vue`'s theme
  sufficient? Currently the latter; revisit if the editor is used without `@meldui/vue`.
