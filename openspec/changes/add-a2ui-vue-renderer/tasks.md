## 1. Dependencies and spike

- [ ] 1.1 Add `@a2ui/web_core@^0.10` to `@meldui/a2ui`; add peer deps `vue`, `@meldui/vue`, `@meldui/tabler-vue`, `@meldui/charts-vue` (charts optional). `pnpm install`.
- [ ] 1.2 Spike against the installed `@a2ui/web_core/v0_9`: confirm `MessageProcessor(catalogs)`, `model.surfacesMap`/`getSurface`, `componentsModel.onCreated/onDeleted`/`get`, `ComponentModel.onUpdated`, `dataModel.get/set/subscribe`, `ComponentContext(surface,id,basePath)`, `DataContext.resolveSignal/path/nested/set`, `GenericBinder(context,schema).subscribe/snapshot/dispose`, and the client-action type. Record any deltas in `design.md`.

## 2. Reactivity bridge and processor wrapper

- [ ] 2.1 Implement `toVueRef(signal)` (Vue `customRef`/`shallowRef` wrapping a `@a2ui/web_core/v0_9` `effect`), disposing the effect via `onScopeDispose`. Keep all Preact signals inside `src/core/` — never expose raw signals to catalog components.
- [ ] 2.2 Implement `src/core/processor.ts`: wrap the v0.9 `MessageProcessor`, expose `processMessages`, `getSurface(s)`, `dispatch(action)` → `{ version: 'v0.9', action }`, and `onEvent` for the consuming app to forward actions.

## 3. Recursive lazy host

- [ ] 3.1 Implement a `DeferredChild`-style host: subscribe to a single id's create/delete, resolve its `ComponentModel`, look up the catalog entry, render via `<component :is>`; recurse into children by id (`children`/`child`/`trigger`/`content`/`tabs[].child`, and `{componentId,path}` list templates). No eager tree materialization.
- [ ] 3.2 Per host, create `GenericBinder(context, schema)`, expose its resolved `snapshot` to the component, and **dispose** the binder + bridged effects on unmount.
- [ ] 3.3 Implement `<A2UISurface :surface-id>` rendering the `root` component; graceful fallback for unknown component types.

## 4. Public API and provide/inject

- [ ] 4.1 Implement `provideA2UI({ catalog, theme, catalogId })`: build the core catalog, provide config + processor, and advertise `supportedCatalogIds` with the MeldUI `catalogId`.
- [ ] 4.2 Implement `useDynamicComponent`/composables: `sendAction`, resolved-value accessors, data write-back (`setData` at bound path), exposed to catalog components.

## 5. Catalog implementation (name → @meldui/vue) and adapters

- [ ] 5.1 Implement `MELDUI_CATALOG` entries for every component in the `a2ui-catalog` contract; prop adapters map A2UI v0.9 names → MeldUI prop names.
- [ ] 5.2 Thin adapters for primitives MeldUI lacks: `MeldRow.vue`, `MeldColumn.vue`, `MeldText.vue`, `MeldIcon.vue` (→ `@meldui/tabler-vue` lookup).
- [ ] 5.3 Wire `Markdown` → `MarkdownViewer` (`@incremark/vue`); `Chart` → `@meldui/charts-vue`; `Table` → `Table`; interactive components → `sendAction` and data write-back.
- [ ] 5.4 Decide (Open Question) whether the catalog contract needs renderer-facing metadata; if so, author an `a2ui-catalog` delta spec — otherwise leave the contract unchanged.

## 6. Theme bridge

- [ ] 6.1 Implement `src/theme/meldTheme.ts` binding A2UI theme tokens onto `@meldui/vue/themes/default` OKLCH CSS variables; no new colors. Verify light/dark inheritance.

## 7. Storybook + verification

- [ ] 7.1 Add `apps/vue-storybook/stories/A2UI/`: Basic gallery, structural/display gallery, rich gallery, a streaming-markdown story (incremental `updateDataModel` deltas), an action round-trip story, and a JSON playground. Build `@meldui/vue` + `@meldui/a2ui` first.
- [ ] 7.2 Verify fine-grained updates: a data patch re-renders only the bound node (instrument render counts in a story/test).
- [ ] 7.3 Verify no subscription/effect leaks on component/surface removal.
- [ ] 7.4 Verify the streaming-markdown node patches incrementally (does not re-mount per token); special-case if needed.
- [ ] 7.5 Verify the action round-trip envelope matches the A2UI v0.9 client-action shape.

## 8. Build and release

- [ ] 8.1 `pnpm --filter @meldui/a2ui build` (ESM+CJS+dts) and `typecheck` pass with `@a2ui/web_core` external.
- [ ] 8.2 `pnpm check:fix` (Biome) clean.
- [ ] 8.3 Changeset: `@meldui/a2ui` minor bump; README documents `provideA2UI`/`A2UISurface`, the catalog, and the theme bridge.
