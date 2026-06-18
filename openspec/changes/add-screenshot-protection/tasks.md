# Implementation Tasks

## 1. Types & defaults

- [x] 1.1 Add `screenshotProtection?: boolean` to `ViewerFeatures` in `packages/vue/src/composites/document-viewer/types/index.ts` with a JSDoc caveat (additive deterrent; runtime-live; does NOT change selection/print/download; bypassable)
- [x] 1.2 Add `screenshotProtection: false` to `DEFAULT_FEATURES` in `packages/vue/src/composites/document-viewer/plugins/pluginRegistry.ts`

## 2. Composable

- [x] 2.1 Create `composables/useScreenshotProtection.ts` following the `useTouch` structure (getter for live enablement, `watch(elementRef, …, { immediate: true })` + `onCleanup`, `onBeforeUnmount`)
- [x] 2.2 Element listeners: `contextmenu` → `preventDefault`; `dragstart` → `preventDefault`
- [x] 2.3 Layer 1 (frosted blur): `blur` + `visibilitychange`(hidden) → `isBlurred = true`; `focus`/visible → `isBlurred = false` (no message)
- [x] 2.4 Layer 2 (persistent panel): `matchesScreenshotHotkey` matcher (PrintScreen ±mods, `Win+Shift+S`, `Win+G`, `Cmd+Shift+3/4/5`, `F12`, `Ctrl/Cmd+Shift+I/C/J`) → `preventDefault`/`stopPropagation`, `isCaptureBlocked = true` (stays until `dismiss()`). No clipboard clobber (intrusive permission prompt; no benefit on Linux/macOS)
- [x] 2.5 Scoped `@media print` `<style>` injection keyed by `data-screenshot-protected`; sync on enable/disable; teardown on unmount; reset both layers when toggled off
- [x] 2.6 Return `{ isBlurred, isCaptureBlocked, dismiss }` and tear down all listeners on unmount

## 3. Wiring

- [x] 3.1 Import + mount `useScreenshotProtection(rootEl, () => resolvedFeatures.value.screenshotProtection)` next to `useTouch` in `DocumentViewer.vue`
- [x] 3.2 Add `relative` positioning, `data-screenshot-protected` attr, and the `meld-screenshot-protected` hardening class to the viewer root
- [x] 3.3 Apply the Layer 1 frosted blur (`blur-xl` + `transition-all`) to the content row when `isBlurred`; render the Layer 2 panel (`v-if="isCaptureBlocked"`, `absolute inset-0`, above `z-30`) with "Protected content" + a "Back to document" button calling `dismiss`
- [x] 3.4 Add the `.meld-screenshot-protected img` CSS hardening (`-webkit-touch-callout`/`-webkit-user-drag: none`; NOT `user-select`)
- [x] 3.5 Confirm NO `effectiveFeatures` / NO changes to `:features` bindings on `ViewerToolbar`/`PdfViewer` — selection/print/download stay on their own flags

## 4. Build & lint

- [x] 4.1 `pnpm --filter @meldui/vue build`
- [x] 4.2 `pnpm check:fix`

## 5. Docs / demo / story

- [x] 5.1 New `apps/docs/src/content/docs/document-viewer/screenshot-protection.mdx` (limitations callout + text-layer note + orthogonality)
- [x] 5.2 Update the `screenshotProtection` row + warning in `features.mdx`
- [x] 5.3 Update `apps/docs/src/data/navigation.ts` entry
- [x] 5.4 `ScreenshotProtectionDemo.vue` + `ScreenshotProtection.stories.ts`

## 6. Verification (manual)

- [ ] 6.1 In Storybook with `:features="{ screenshotProtection: true }"`: right-click suppressed; drag-out no-ops; tab/window switch shows "Protected content" overlay and focus restores it; `Ctrl+P`/print-to-PDF blanks the viewer; a delivered hotkey (e.g. `F12`) flashes "Screenshot is not allowed"
- [ ] 6.2 Confirm additivity: `selection`/`print`/`download`/`annotations` still follow their own flags and are unaffected; everything inert when `screenshotProtection: false`
- [ ] 6.3 Repeat right-click/drag/blur checks on image, text, and markdown sources
