## Why

A rich-text editor (`MeldEditor`), built on TipTap v3 and already styled with MeldUI
components and icons, was developed inside the doqo app at
`frontend/src/components/editor/`. It is feature-complete (slash commands, bubble menu,
toolbar, tables, resizable images, mentions, columns, table-of-contents, chart blocks,
drag handle, Notion-style block selection, and a custom-component extension point) and is
almost entirely decoupled from doqo: it has no app imports, API calls, stores, routing, or
env access, and is driven purely through props and callbacks (`onImageUpload`,
`onMentionSearch`, `customComponents`).

Because it is generally useful and self-contained, it should live in the MeldUI design
system as an independently versioned, publish-ready package (`@meldui/editor`) with
Storybook documentation, so it can be reused across products rather than copied per app.

This change is a **lift-and-shift**: the implementation is reproduced verbatim, with only
import paths rewritten for the package context. Refactoring, decoupling, or feature work is
explicitly out of scope.

## What Changes

- Add a new package `@meldui/editor` (Vue 3 library, ESM + CJS + types) under
  `packages/editor`, mirroring the build/tooling conventions of `@meldui/vue`.
- Lift the editor source (30 files across `bubble-menu/`, `toolbar/`, `drag-handle/`,
  `table/`, `image/`, `mention/`, `slash-commands/`, `chart/`, `columns/`, `toc/`,
  `custom-components/`, plus `BlockSelectionPlugin.ts`, `useBlockSelection.ts`,
  `MeldEditor.vue`, `types.ts`, `defaults.ts`, `index.ts`, and `docs/architecture.md`).
- Declare TipTap (`@tiptap/*`), `tippy.js`, and `nanoid` as regular `dependencies` but keep
  them external in the build (installed by the consumer, not bundled — same pattern
  `@meldui/vue` uses for its heavy libraries).
- Declare `vue`, `@meldui/vue`, `@meldui/tabler-vue`, and `@meldui/charts-vue` as peer
  dependencies. The chart node stays registered by default, so `@meldui/charts-vue` is a
  **required** peer (truest to the current implementation).
- Add Storybook stories and an MDX documentation page in `apps/vue-storybook`.

## Capabilities

### New Capabilities

- `editor`: a TipTap-based Vue 3 rich-text editor component (`MeldEditor`) with a default
  extension set, configurable toolbar/slash-commands, bubble menu, callback-driven image
  upload and mention search, and a custom-component extension point — packaged as
  `@meldui/editor`.

### Modified Capabilities

<!-- None. Existing packages are unaffected. -->

## Impact

- **Code**: new `packages/editor/**` (package config + lifted `src/**`); a new story +
  MDX page and a `workspace:*` dependency entry in `apps/vue-storybook`. No changes to
  `@meldui/vue` or other existing packages.
- **Docs**: a `MeldEditor` MDX page (install/usage, props/emits/callbacks, extension model)
  plus comprehensive stories.
- **New deps**: TipTap suite, `tippy.js`, `nanoid` (as deps of the new package); peers on
  `@meldui/vue`, `@meldui/tabler-vue`, `@meldui/charts-vue`, `vue`.
- **Breaking changes**: none — new package only.
- **Released as**: `@meldui/editor@0.1.0` (initial release; not published as part of this
  change — changeset only).

## Out of Scope

- Migrating doqo to consume `@meldui/editor` (separate follow-up; doqo is a different repo).
- Any refactoring or decoupling beyond rewriting import paths.
- Publishing to the registry (a changeset is created; versioning/publishing is left to the
  normal release flow).
