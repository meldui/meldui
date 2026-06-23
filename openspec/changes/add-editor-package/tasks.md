# Implementation Tasks

## 1. Scaffold `packages/editor`

- [x] 1.1 `package.json` — name `@meldui/editor`, `type: module`,
      `sideEffects: ["**/*.css"]`, `main`/`module`/`types`, `exports` (`.` + `./styles`),
      `files: ["dist","README.md"]`, `publishConfig` (GitHub registry), scripts
      (`dev`/`build`/`typecheck`). Version set to `0.0.0` so the changeset resolves the
      first release to `0.1.0`.
- [x] 1.2 `dependencies`: `@tiptap/*` suite (`^3.x`), `tippy.js@^6`. **`nanoid` dropped** —
      it was a doqo dep, not imported by the editor source.
- [x] 1.3 `peerDependencies`: `vue ^3.5`, `@meldui/vue workspace:*`,
      `@meldui/tabler-vue workspace:*`, `@meldui/charts-vue workspace:*`
- [x] 1.4 `devDependencies`: build toolchain copied from `packages/vue` (vite,
      @vitejs/plugin-vue, vite-plugin-dts, @tailwindcss/vite, tailwindcss, typescript, vue,
      vue-tsc)
- [x] 1.5 `vite.config.ts` — library mode (es+cjs, `preserveModules`), dts plugin,
      tailwind plugin, `lib.name: 'MeldUIEditor'`, `@/` alias, externals = vue + `@meldui/*` +
      `/^@tiptap\//` + `tippy.js` (no theme-copy plugin); CSS asset mapped to `editor.css`
- [x] 1.6 `tsconfig.json` — extend root, `outDir`/`rootDir`/`composite`/`jsx preserve`/
      `jsxImportSource vue`/`paths @/*`. Added `lib: ES2023` (lifted code uses
      `Array.prototype.toReversed`, absent from the root's ES2020 lib).
- [x] 1.7 `biome.json` — copy `packages/vue/biome.json`
- [x] 1.8 `src/styles/index.css` — `@import 'tailwindcss'` + `@source` glob over `src/**`
- [x] 1.9 `README.md`

## 2. Lift-and-shift editor source

- [x] 2.1 Copied all 30 files from doqo `frontend/src/components/editor/` to
      `packages/editor/src/` preserving folder structure (incl. `docs/architecture.md`)
- [x] 2.2 Imports: `@meldui/*` kept as-is; internal relatives left as-is (all shallow `./`,
      no doqo-app paths to rewrite). Removed 5 genuinely-unused vars/imports flagged by the
      stricter root `noUnusedLocals`/`noUnusedParameters`.
- [x] 2.3 `src/index.ts` re-exports `MeldEditor`, `createCustomNodeExtension`, `ChartNode`,
      `createDefaultToolbarItems`, `resolveSlashCommands`, `defaultSlashCommands`, and all
      public types (lifted verbatim from doqo's `editor/index.ts`)
- [x] 2.4 Grep-verified no import resolves into doqo app code

## 3. Build & wire into workspace

- [x] 3.1 `pnpm install`
- [x] 3.2 `pnpm --filter @meldui/editor build` — ESM/CJS/types emitted; TipTap/tippy/
      `@meldui/*`/vue NOT bundled (26 files import `@tiptap/*`, 24 import `@meldui/*`)
- [x] 3.3 `pnpm --filter @meldui/editor typecheck` passes
- [x] 3.4 `pnpm check:fix` — 0 errors (53 pre-existing-style warnings from lifted code)

## 4. Storybook + docs

- [x] 4.1 Added `@meldui/editor workspace:*` to `apps/vue-storybook`; added it to
      `optimizeDeps.include` in `.storybook/main.ts` and imported `@meldui/editor/styles`
      in `.storybook/preview.ts` (charts-vue already a storybook dep)
- [x] 4.2 `MeldEditor.stories.ts` (CSF3, autodocs): Default, With Toolbar, Read-only,
      Mentions, Image Upload, Kitchen Sink (tables/columns/charts via the `/` menu)
- [x] 4.3 MDX `Overview.mdx` (install/usage, props/emits tables, feature list)
- [x] 4.4 Editor dist built before the Storybook build (Storybook consumes dist)

## 5. Changeset

- [x] 5.1 `.changeset/lemon-editors-begin.md` → `@meldui/editor` minor (resolves to
      `0.1.0`). `changeset status` confirms. NOT versioned/published.

## 6. Astro docs site (`apps/docs`)

- [x] 6.1 Add `@meldui/editor workspace:*` to `apps/docs`; add `@meldui/editor` to the
      `package` enum in `src/content.config.ts`
- [x] 6.2 Add `@source "…/packages/editor/dist/**/*.mjs"` to `src/styles/global.css` so the
      editor's Tailwind utilities are generated with the MeldUI theme (parallel to the
      existing `@meldui/vue` dist scan)
- [x] 6.3 Add an **Editor** section to `src/data/navigation.ts` (Overview, Getting Started,
      Features, Extensions, API)
- [x] 6.4 Demo islands in `src/demos/editor/` (Basic, Toolbar, Mention) — each imports
      `@meldui/editor/styles`
- [x] 6.5 Content pages in `src/content/docs/editor/` (`index`, `getting-started`,
      `features`, `extensions`, `api` — the API page uses the `props`/`events`/`slots`
      frontmatter so the site auto-renders the ApiTable)
- [x] 6.6 Document the Tailwind `@source` requirement for consumers (getting-started + README)
- [x] 6.7 `pnpm --filter docs build` succeeds (all 5 editor pages built; editor scoped CSS
      and utilities present in output)

## 7. Verification

- [x] 7.1 Built and inspected `dist/` (esm `.mjs` + cjs `.cjs` + `index.d.ts` + `editor.css`;
      externals imported, not inlined)
- [x] 7.2 `pnpm --filter vue-storybook build` succeeds — stories + MDX compile, the editor
      dist and `@meldui/editor/styles` resolve. (Interactive in-browser exercise of slash
      menu / mentions / charts is left for manual run via `pnpm storybook:vue`.)
- [x] 7.3 `pnpm --filter docs build` succeeds — 5 editor pages + demo islands render
- [ ] 7.4 Optional: `npm pack` and inspect tarball contents (dist + types only)
