## Status: core + per-component docs/story harness landed

The core renderer + slice (Text, Markdown, Column, Card, Button, TextField) + `Alert`
are implemented and **verified end-to-end** (full tree render; data binding; action
round-trip; incremental Markdown streaming — all confirmed via Playwright in Storybook).

**Per-component documentation harness (new requirement) is built and verified on both
surfaces:** canonical example messages live once in `@meldui/a2ui` (`examples`), a
Storybook helper (`stories/A2UI/_a2ui.ts`) renders each component live + a code block,
and a docs island (`demos/a2ui/A2uiDemo.vue` over the shared `DemoBlock`) shows the same
live render + code tab. `Alert` is done on both (story `A2UI/Components` + docs page
`/docs/a2ui/components/alert`, both verified). Each remaining component now costs:
renderer `.ts` + an `examples` entry + a story line + an MDX page + a nav line.

Remaining: the other 28 catalog components (each with story + docs), per-component
story/docs for the original slice 6, the full theme bridge, and the changeset/README.

## 1. Dependencies and spike

- [x] 1.1 Add `@a2ui/web_core@^0.10` to `@meldui/a2ui`; peer deps `vue`, `@meldui/vue` added (+ deps `zod`, `@incremark/vue`, `@incremark/theme`). `@meldui/tabler-vue`/`@meldui/charts-vue` deferred to the Icon/Chart components.
- [x] 1.2 Spike against installed `@a2ui/web_core/v0_9` — confirmed the API and recorded deltas in `design.md` ("Spike findings"): `DataContext(surface, path)`; `MessageProcessor(catalogs, actionHandler)` + `getClientCapabilities()`; **catalog/binder are Zod-driven**; reuse `basic_catalog` `*Api` + common-type Zod schemas.

## 2. Reactivity bridge and processor wrapper

- [x] 2.1 `toVueRef(signal)` implemented (`customRef` + web_core `effect`, disposed via `onScopeDispose`). Per-component reactivity uses `GenericBinder.subscribe` → `shallowRef`; Preact signals stay inside `src/vue`.
- [x] 2.2 Processor handled directly via `provideA2UI` (web_core `MessageProcessor`); actions flow through `ComponentContext.dispatchAction` → `MessageProcessor` `actionHandler` (the `onAction` option). No separate wrapper needed.

## 3. Recursive lazy host

- [x] 3.1 `DeferredChild` host: subscribes to a single id's create/delete, resolves the model, looks up the catalog entry, renders via `h(api.render)`. Children recursion: `children` (ChildList, static + `{path,componentId}` template) and `child` (ComponentId) done; `trigger`/`content`/`tabs[]` arrive with Modal/Tabs.
- [x] 3.2 Per host: `GenericBinder(context, schema)` → reactive snapshot; binder + subscriptions disposed on scope teardown.
- [x] 3.3 `<A2UISurface :surface-id>` renders `root`, resolves the surface reactively, graceful loading/unknown fallbacks.

## 4. Public API and provide/inject

- [x] 4.1 `provideA2UI({ catalog?, onAction? })` builds the core catalog (guarded against contract drift) and provides it; `catalogId` negotiation works (surfaces created with the MeldUI `catalogId` resolve the catalog); `processor.getClientCapabilities()` exposes `supportedCatalogIds`.
- [x] 4.2 Action dispatch + data write-back work via the binder (`action` → `() => void`, `set<Prop>` setters); a dedicated `useDynamicComponent` composable was unnecessary given `GenericBinder`.

## 5. Catalog implementation (name → @meldui/vue) and adapters

- [ ] 5.1 Slice only (6/35): `Text`, `Markdown`, `Column`, `Card`, `Button`, `TextField`. Remaining 29 contract components pending (`pendingRendererComponents()` reports them).
- [ ] 5.2 Adapters: `MeldText`, `MeldColumn` done; `MeldRow`, `MeldIcon` (→ `@meldui/tabler-vue`) pending.
- [ ] 5.3 `Markdown` → `@incremark/vue` done; interactive write-back/actions done (Button, TextField). `Chart` → `@meldui/charts-vue`, `Table` pending.
- [x] 5.4 Decided: the catalog contract needs **no** renderer-facing metadata — the Zod renderer catalog is separate from the JSON contract, kept consistent by the `buildVueCatalog` guard. No `a2ui-catalog` delta.

## 6. Theme bridge

- [ ] 6.1 `meldTheme` placeholder exported; surfaces already inherit MeldUI tokens via component classes. Full A2UI-theme-token → CSS-var bridge pending (with the broader component set).

## 7. Storybook + verification

- [ ] 7.1 `A2UI/Renderer` stories added (Gallery + StreamingMarkdown). Full per-tier galleries + JSON playground pending. Dev needs source-aliasing + `optimizeDeps` (added to `.storybook/main.ts`).
- [x] 7.2 Fine-grained reactivity verified — editing the bound input updated only the bound greeting node.
- [x] 7.3 Disposal wired (`onScopeDispose` for binder + subscriptions + `toVueRef` effect). (Explicit leak instrumentation deferred.)
- [x] 7.4 Incremental Markdown streaming verified — content grew token-by-token (list + code block) without remount.
- [x] 7.5 Action round-trip verified — Button click dispatched the client action; `onAction` updated the data model; bound Markdown re-rendered.

## 8. Build and release

- [x] 8.1 `build` (ESM+CJS+dts, two entries) and `vue-tsc` typecheck pass with peers external.
- [x] 8.2 `oxlint`/`oxfmt` clean for the renderer + story.
- [ ] 8.3 Changeset + README for the `@meldui/a2ui/vue` renderer — pending (do with the full component set).
