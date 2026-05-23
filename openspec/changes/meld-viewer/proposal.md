## Why

Consuming apps (starting with doqo) need a feature-rich PDF/document viewer with a programmatic annotation API. Existing Vue PDF libraries either lack programmatic annotation (`@tato30/vue-pdf`, `vue-pdf-embed`) or ship as opinionated drop-in viewers with large bundles and limited customisation. MeldUI should own this primitive so apps can render PDFs, images, text, and markdown with consistent look-and-feel and a single API surface — including the ability to programmatically create, update, delete, import, and export annotations, and to bake annotations into a downloadable PDF copy.

## What Changes

Add a new `MeldViewer` composite component to `packages/vue/src/composites/meld-viewer/`. Built on EmbedPDF (headless mode, PDFium WASM) for PDF rendering and orchestrated by per-document Vue composables.

**Phase 1 — Parity & Annotations**

- Multi-format renderers: PDF (EmbedPDF), image, text, markdown
- Sticky top toolbar with: page navigation, zoom (in/out/fit-width/fit-page/actual-size/pinch), rotation, view modes (single/continuous/spread), interaction modes (text/hand), search (case/whole-word, prev/next, active match emphasis), outline, thumbnails, fullscreen, print, download
- Native EmbedPDF annotations: 5-colour highlight tools + sticky-note comment tool
- Threaded comment overlay (replies, resolved state) anchored to EmbedPDF annotation UUIDs
- Programmatic API exposed via `defineExpose`: `loadAnnotations`, `createAnnotation`, `updateAnnotation`, `deleteAnnotation`, `selectAnnotation`, `navigateToAnnotation`, `importAnnotations`, `exportAnnotations`, `saveAsCopy`, `goToPage`, `addReply`, `resolveAnnotation`, `getAnnotations`, `getDocumentInfo`
- Keyboard shortcuts (arrows, +/-/0, R, Ctrl+F, F11, Esc, C/O/T) via HotkeysPlugin + custom binds
- Touch gestures: pinch-zoom (built-in), swipe page-nav and double-tap zoom (custom)
- Feature opt-in via `features` prop — disabled plugins are not imported, tree-shaken from bundle
- Visual parity with doqo's existing `DocumentViewer.vue` toolbar layout (reference design)
- **Extensive documentation site under `apps/docs/src/content/docs/meld-viewer/`** (Astro + MDX): top-level guides (overview, getting started, features, programmatic API, annotations, customization, bundle/perf, troubleshooting, migration), a `plugins/` subdirectory with one MDX page per EmbedPDF plugin in scope (~18 plugins Phase 1, +5 Phase 2), and a `use-cases/` subdirectory covering every documented use case end-to-end with runnable Vue demo components under `apps/docs/src/demos/meld-viewer/`
- Inline TSDoc on every public type for IDE hover-help
- Storybook stories: PDF, image, text, markdown, programmatic-annotation, RAG-citation demo, save-as-copy demo, look-and-feel reference story

**Phase 2 — Advanced Editing (opt-in)**

- Stamps (`@embedpdf/plugin-stamp`) — preloaded libraries + writable default library
- Signature (`@embedpdf/plugin-signature`) — signature-only or signature-and-initials modes
- Redaction (`@embedpdf/plugin-redaction`) — pending-redaction workflow paired with `saveAsCopy` for compliance burn-in
- Form filling (`@embedpdf/plugin-form`) — interactive form fields + programmatic field read/write
- Attachments (`@embedpdf/plugin-attachment` if shipped upstream)

## Capabilities

### New Capabilities

- `meld-viewer`: The MeldViewer component — rendering, toolbar, annotations, programmatic API, feature opt-in model, and documentation

### Modified Capabilities

<!-- None. This is a wholly new component in @meldui/vue. -->

## Impact

- **New directory**: `packages/vue/src/composites/meld-viewer/` (~15-20 files Phase 1, +5-10 Phase 2)
- **New peer deps** (added per-feature via `peerDependenciesMeta.optional`): `@embedpdf/core`, `@embedpdf/engines`, `@embedpdf/plugin-*` packages
- **New runtime asset**: `pdfium.wasm` (~3-4 MB) — consumers self-host via build step
- **Storybook**: new stories under `apps/vue-storybook/src/stories/Components/MeldViewer.stories.ts`
- **Bundle impact**: opt-in plugins mean unused features tree-shake. Phase 1 worst-case (all flags on, excluding WASM) estimated < 250 KB gzipped JS. Bundle verification step in tasks.
- **Breaking changes**: none — new component, no API changes to existing exports
- **Released as**: `@meldui/vue` minor version bump on Phase 1 archive
