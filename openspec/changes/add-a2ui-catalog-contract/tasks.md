## 1. Scaffold the `@meldui/a2ui` package

- [x] 1.1 Create `packages/a2ui/` mirroring the `charts-vue`/`tabler-vue` template: `package.json` (`@meldui/a2ui`, `type: module`, `main`/`module`/`types`, `files: ["dist","README.md"]`, `publishConfig` → `npm.pkg.github.com`), `tsconfig.json` extending `../../tsconfig.json`, `README.md`.
- [x] 1.2 Add scripts to `package.json`: `build`, `typecheck`, and `generate-catalog` (`tsx scripts/generate-catalog.ts`). Do NOT add `@a2ui/web_core` or any Vue renderer deps (deferred to `add-a2ui-vue-renderer`).
- [x] 1.3 Confirm the workspace picks up `packages/a2ui` (`pnpm-workspace.yaml` globs `packages/*`); run `pnpm install`.

## 2. Define catalog identity and shared constants

- [x] 2.1 Add a single source for `CATALOG_ID` (`https://meldui.dipayanb.com/a2ui/v1/catalog.json`, hosted by the docs site) and the `A2UI_VERSION = "v0.9"` literal; export from one module and reference everywhere.
- [x] 2.2 Define the `CatalogComponentDef` metadata type (component name + A2UI v0.9 JSON-Schema of its properties + notes) used as the single source of truth for codegen.

## 3. Author per-component schema definitions (A2UI v0.9)

- [x] 3.1 Basic primitives: `Row`, `Column`, `List`, `Card`, `Modal`, `Tabs`, `Text`, `Image`, `Icon`, `Divider`, `Button`, `TextField`, `CheckBox`, `Slider`, `ChoicePicker`, `DateTimeInput` — using exact A2UI spec names and v0.9 property names (`variant`, `justify`/`align`, `value`, `min`/`max`, etc.).
- [x] 3.2 Structural & display: `Avatar`, `AvatarGroup`, `Kbd`, `Alert`, `Badge`, `Stepper`, `ButtonGroup`, `Carousel`, `ToggleGroup`, `Accordion`, `ScrollArea`, `Separator`, `Table`.
- [x] 3.3 Rich: `Markdown` (accepts streamed/partial content), `Timeline`, `Sidebar`, `Combobox`, `MultiSelect`, `Chart` — keep `Table`/`Combobox`/`Sidebar`/`Chart` schemas tight and well-`description`'d.
- [x] 3.4 Confirm `DataTable` is NOT defined anywhere.
- [x] 3.5 (Open question, decide while authoring) Declare `functions` (e.g. `required`, `email`, regex) and/or a `theme` token shape, or explicitly defer — record the decision in `design.md` Open Questions.

## 4. Codegen and published artifact

- [x] 4.1 Implement `scripts/generate-catalog.ts` to assemble `src/schema/meldui-v1.catalog.json` from the per-component definitions (`catalogId`, `components`, optional `functions`/`theme`).
- [x] 4.2 Run codegen and commit the generated `meldui-v1.catalog.json`.
- [x] 4.3 Add the `"./catalog"` package export pointing at the built catalog JSON; ensure importing `@meldui/a2ui/catalog` pulls in no Vue code.

## 5. Validation and drift guard

- [x] 5.1 Validate `meldui-v1.catalog.json` against the A2UI v0.9 catalog meta-schema (fetch from `google/A2UI`); fix any errors.
- [x] 5.2 Add a sync check (script/CI step) that regenerates the catalog and fails on any diff with the committed artifact.
- [x] 5.3 Assert programmatically that all components named in the spec are present and `DataTable` is absent.

## 6. Build, release, and docs

- [x] 6.1 `pnpm --filter @meldui/a2ui build` produces dist (catalog JSON + schema type defs); `pnpm --filter @meldui/a2ui typecheck` passes.
- [x] 6.2 `pnpm check:fix` (Biome) clean.
- [x] 6.3 Add a changeset introducing `@meldui/a2ui` at `0.1.0`.
- [x] 6.4 README: document the `catalogId`, the component set, the `@meldui/a2ui/catalog` export, and note the Vue renderer ships in `add-a2ui-vue-renderer`.

## 7. Documentation (docs site + Storybook + llms.txt)

- [x] 7.1 Add `renderCatalogMarkdown()` to `@meldui/a2ui` — generates a Markdown catalog reference from the component definitions (single source of truth).
- [x] 7.2 Extend the docs content schema (`apps/docs/src/content.config.ts`) with an `a2ui` category and the `@meldui/a2ui` package; add `@meldui/a2ui` as a docs dependency.
- [x] 7.3 Add the Astro docs A2UI section: narrative `index.mdx` (what A2UI is, catalogId/negotiation, consuming the contract) and an auto-generated `reference.mdx` via `apps/docs/scripts/generate-a2ui-reference.ts`, wired into the docs `build`.
- [x] 7.4 Add a Storybook A2UI intro page (`apps/vue-storybook/src/stories/A2UI.mdx`) linking to the docs reference; note interactive stories arrive with the renderer (Change B).
- [x] 7.5 Confirm the A2UI pages are picked up by the existing `generate-llms.ts` (appear in `llms.txt`); exclude generated/vendored JSON from oxfmt/oxlint so codegen output is stable.
