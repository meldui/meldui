# Implementation Tasks

## 1. Types & defaults

- [x] 1.1 Add `contentProtection?: boolean` to `ViewerFeatures` in `packages/vue/src/composites/document-viewer/types/index.ts` with a JSDoc caveat (deterrent only, DevTools-bypassable, does not block copy/print/download)
- [x] 1.2 Add `contentProtection: false` to `DEFAULT_FEATURES` in `packages/vue/src/composites/document-viewer/plugins/pluginRegistry.ts`

## 2. Composable

- [x] 2.1 Create `composables/useContentProtection.ts` following the `useTouch` structure (getter for live enablement, `watch(elementRef, …, { immediate: true })` + `onCleanup`, `onBeforeUnmount`)
- [x] 2.2 Element listeners: `contextmenu` → `preventDefault`; `dragstart` → `preventDefault`
- [x] 2.3 Window/document listeners: `blur` + `visibilitychange`(hidden) → obscure; `focus`/visible → reveal
- [x] 2.4 PrintScreen handling: `keydown`/`keyup` → obscure + best-effort `navigator.clipboard.writeText('')` (try/catch) + timed reveal
- [x] 2.5 Return `{ isObscured }` and tear down all listeners on unmount

## 3. Wiring

- [x] 3.1 Import + mount `useContentProtection(rootEl, () => resolvedFeatures.value.contentProtection)` next to `useTouch` in `DocumentViewer.vue`
- [x] 3.2 Add `relative` positioning to the viewer root element
- [x] 3.3 Render an obscure overlay (`v-if="isObscured"`, `absolute inset-0`, above the toolbar's `z-30`) with "Protected content" copy
- [x] 3.4 Confirm no changes to `:features` bindings on `ViewerToolbar`/`PdfViewer` (copy/print stay on their own flags)

## 4. Build & lint

- [x] 4.1 `pnpm --filter @meldui/vue build`
- [x] 4.2 `pnpm check:fix`

## 5. Docs

- [x] 5.1 New `apps/docs/src/content/docs/document-viewer/content-protection.mdx` with a prominent limitations callout
- [x] 5.2 Add a `contentProtection` row + warning to `features.mdx`
- [x] 5.3 Add the page to `apps/docs/src/data/navigation.ts`

## 6. Verification (manual)

- [ ] 6.1 In Storybook with `:features="{ contentProtection: true }"`: right-click suppressed; drag-out no-ops; tab/window switch shows overlay and focus restores it; PrintScreen briefly obscures + clears clipboard (Windows/Chromium)
- [ ] 6.2 Confirm independence: copy/print/download still follow their own flags and are unaffected; everything inert when `contentProtection: false`
- [ ] 6.3 Repeat right-click/drag/blur checks on image, text, and markdown sources
