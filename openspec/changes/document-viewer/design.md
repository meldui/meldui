## Context

MeldUI has no document/PDF viewer today. The `composites/` directory holds heavy multi-file components (DataTable: 18 files, Filters: 13 files with plugin architecture) — `DocumentViewer` follows the same shape. Consuming apps render PDFs today by depending on disparate libraries (`@tato30/vue-pdf` in doqo); centralising on MeldUI removes duplicate engine choices across apps and provides a single, well-documented surface.

The reference design for the look-and-feel is doqo's existing `DocumentViewer.vue` + `ViewerToolbar.vue` (sticky top toolbar, responsive `lg` breakpoint, mobile overflow menu, side panels for outline/thumbnails/comments, MeldUI primitives, Tabler icons). DocumentViewer must match this so doqo's eventual migration is visually non-disruptive.

### Dependencies

**New (peer, opt-in via `peerDependenciesMeta.optional`)**:

- `@embedpdf/core`, `@embedpdf/engines` — required for any PDF rendering
- Core render plugins: `plugin-document-manager`, `plugin-viewport`, `plugin-scroll`, `plugin-render`, `plugin-tiling`
- Phase 1 feature plugins: `plugin-zoom`, `plugin-rotate`, `plugin-spread`, `plugin-pan`, `plugin-fullscreen`, `plugin-interaction-manager`, `plugin-selection`, `plugin-search`, `plugin-bookmark`, `plugin-thumbnail`, `plugin-export`, `plugin-hotkeys`
- Phase 1 annotation plugins: `plugin-annotation`, `plugin-history`
- Phase 2 plugins: `plugin-stamp`, `plugin-signature`, `plugin-redaction`, `plugin-form`

**Reused (already MeldUI deps)**:

- Reka UI / Radix Vue primitives for popovers, tooltips, dialogs in the toolbar/panels
- `@vueuse/core` composables
- `class-variance-authority` (CVA) for toolbar button variants
- `@meldui/tabler-vue` icons

## Goals / Non-Goals

**Goals:**

- Single MeldUI component that consumers configure via a `features` prop
- Tree-shakeable: disabled features must not appear in bundle
- Programmatic annotation API powerful enough for AI citation rendering and document automation
- Loose coupling — no framework, no Inertia, no doqo-specific assumptions
- Look-and-feel matches doqo's existing toolbar layout so doqo's cut-over is non-disruptive
- Phase 1 standalone-usable; Phase 2 purely additive
- Documentation is a first-class deliverable, not an afterthought

**Non-Goals:**

- Server-side / Node PDF generation (burn-in is client-side via `saveAsCopy`)
- Replacing `meld-editor` (in-flight tiptap-based Notion-style editor in doqo) — different scope
- i18n in Phase 1 (English strings only; accept an optional `labels` prop for Phase 2)
- Office document conversion (consumer responsibility — convert to PDF server-side, then pass URL)
- Annotations on non-PDF document types (image/text/markdown render-only)

## Decisions

### D1. Headless EmbedPDF, never the drop-in viewer

Per EmbedPDF docs: headless is "minimal, tree-shakeable" while drop-in is "larger bundle size and limited UI customization". DocumentViewer owns all chrome (toolbar, panels, popovers) using MeldUI primitives.

**Alternatives considered:** Drop-in `<PDFViewer>` — rejected because it brings its own styling and increases bundle for features we may not enable.

### D2. Feature opt-in via `features` prop, not slot composition

Two alternatives considered: (a) consumer registers EmbedPDF plugins themselves and passes them in (maximum flexibility but exposes EmbedPDF internals), (b) DocumentViewer takes a `features` prop and internally resolves plugin registrations (encapsulates EmbedPDF). We chose **(b)** because it preserves MeldUI's API abstraction and lets the toolbar adapt to enabled features automatically. Power users can override per-plugin config via a parallel `featureConfig` prop.

### D3. Native EmbedPDF annotations, threaded comments as overlay

EmbedPDF's annotation model is flat (keyed by UUID). The PDF spec's IRT (in-reply-to) primitive is not surfaced by EmbedPDF. Threaded replies and "resolved" state live in a separate `Map<annotationId, Thread>` managed by `useAnnotationThreads`. Threads are exported/imported separately from PDF annotations and never enter the PDF binary.

**Alternatives considered:** Encode threads inside annotation `contents` JSON — rejected because it pollutes the PDF binary with app-specific metadata.

### D4. PDFium WASM self-hosted by the consumer

Consumers run a build step that copies `pdfium.wasm` from `node_modules/@embedpdf/pdfium/dist/` into their public dir (or use a bundler asset import like Vite's `?url` suffix). DocumentViewer accepts a `wasmUrl` prop pointing to the served location. This avoids CDN dependency, gives consumers full caching/CSP control, works in air-gapped environments, and lets the WASM cache independently of JS bundles.

**Alternatives considered:** CDN auto-fetch — rejected because it adds a third-party domain dependency that fails under corporate firewalls or geo-restrictions.

### D8. Web Worker engine on by default, opt-out via `worker` prop

`usePdfiumEngine` defaults to `worker: true` in EmbedPDF, moving PDFium work (render, search, decode) off the main thread. DocumentViewer surfaces a `worker?: boolean` prop (default `true`) that forwards directly to `usePdfiumEngine`. The default preserves UI responsiveness on large documents, especially with EmbedPDF's tiling/virtualization pipeline.

**Why expose the opt-out:** the worker engine constructs the worker from an inline blob URL (`new Worker(URL.createObjectURL(new Blob([source])))`). The worker's base for resolving relative URLs is therefore the blob URL, not the page — so a relative `wasmUrl` like `./pdfium.wasm` can resolve to `blob:.../pdfium.wasm` and 404. Absolute paths (`/pdfium.wasm`) and fully-qualified URLs work in both modes. Consumers who hit the resolution issue can pass `worker={false}` to fall back to the direct main-thread engine.

**Alternatives considered:** Hardcoding `worker: false` for safety — rejected because it sacrifices UI responsiveness for an edge case that affects only a subset of bundler setups, all of which the consumer can fix at their end by using an absolute `wasmUrl`.

### D5. Per-document-format renderer dispatch

`DocumentViewer.vue` dispatches by content type to `PdfViewer.vue` / `ImageViewer.vue` / `TextViewer.vue` / `MarkdownViewer.vue`. Only the PDF renderer pulls in EmbedPDF; other formats are stateless and lightweight. The PDF renderer is `defineAsyncComponent`-loaded so the EmbedPDF chunk is deferred until first PDF open.

### D6. Programmatic API exposed via `defineExpose`, typed publicly

Consumers obtain a `Ref<InstanceType<typeof DocumentViewer>>` and call methods. The full API is exported as a `DocumentViewerInstance` type. Methods that touch async EmbedPDF operations return Promises.

### D7. Documentation is part of the release definition

The Phase 1 release definition includes an extensive multi-page documentation site under `apps/docs/src/content/docs/document-viewer/` (mirroring the depth of `apps/docs/src/content/docs/data-table/`), per-plugin reference pages, per-use-case end-to-end guides with runnable Vue demos, plus inline TSDoc on every public type. A release without complete documentation is not acceptable.

**Documentation site outline** (`apps/docs/src/content/docs/document-viewer/`):

Top-level guides:

- `index.mdx` — Overview, when to use, when not to use, comparison vs other Vue PDF libs
- `getting-started.mdx` — Install peer deps, copy `pdfium.wasm`, render your first PDF / image / text / markdown
- `features.mdx` — `features` and `featureConfig` prop reference with full table of flags
- `programmatic-api.mdx` — `defineExpose` method reference with example invocations
- `annotations.mdx` — Annotation data model, threaded comments overlay, persistence patterns
- `customization.mdx` — Toolbar groups/hide/customButtons, side panels, slots
- `theming.mdx` — Tailwind dark mode, MeldUI primitives used, override hooks
- `bundle-and-perf.mdx` — Headless rationale, lazy loading, WASM hosting, expected sizes per `features` profile
- `troubleshooting.mdx` — Common issues (WASM 404, CORS, mixed content, large PDFs, browser support matrix)
- `migration.mdx` — Migration from `@tato30/vue-pdf`, `vue-pdf-embed`, raw `pdfjs-dist`, and PDFTron Web Viewer (prop mapping tables, breaking-change notes)

Plugins subdirectory (`plugins/`) — one MDX per EmbedPDF plugin in scope, each documenting: what the plugin does, the `features` flag, default `featureConfig`, the composable it exposes, key events, and a minimum example:

- Phase 1: `document-manager.mdx`, `viewport.mdx`, `scroll.mdx`, `render.mdx`, `tiling.mdx`, `zoom.mdx`, `rotate.mdx`, `spread.mdx`, `pan.mdx`, `fullscreen.mdx`, `interaction-manager.mdx`, `selection.mdx`, `search.mdx`, `bookmark.mdx`, `thumbnail.mdx`, `export.mdx`, `hotkeys.mdx`, `annotation.mdx`, `history.mdx`
- Phase 2: `stamp.mdx`, `signature.mdx`, `redaction.mdx`, `form.mdx`, `attachment.mdx`

Use-cases subdirectory (`use-cases/`) — one MDX per documented end-to-end workflow with an embedded runnable demo:

- `index.mdx` — index page linking all use cases
- `load-saved-annotations.mdx` — load-on-open with backend persistence
- `ai-rag-citations.mdx` — programmatic highlights from AI/RAG responses
- `import-export-annotations.mdx` — round-tripping annotations between systems
- `save-as-copy-burnin.mdx` — generating a baked-in PDF copy
- `compliance-redaction.mdx` — permanent redaction workflow with `saveAsCopy`
- `document-signing.mdx` — signature flow + audit-friendly storage
- `branded-stamps.mdx` — org-level stamp libraries
- `form-automation.mdx` — programmatic form filling
- `share-link-viewer.mdx` — permission-gated read-only viewer (no auth)
- `multi-format-rendering.mdx` — image / text / markdown rendering
- `threaded-comments.mdx` — replies + resolved state with backend sync
- `keyboard-and-touch.mdx` — accessibility + touch device patterns
- `large-documents.mdx` — virtualization and 1000+ page documents
- `dark-mode-integration.mdx` — theming inside a dark-mode app

Demos (`apps/docs/src/demos/document-viewer/`) — one Vue SFC per page that needs an interactive demo. At minimum: `BasicPdfDemo.vue`, `MultiFormatDemo.vue`, `FeaturesProfileDemo.vue`, `ProgrammaticAnnotationDemo.vue`, `LoadSavedAnnotationsDemo.vue`, `RagCitationDemo.vue`, `ImportExportDemo.vue`, `SaveAsCopyDemo.vue`, `ThreadedCommentsDemo.vue`, `ToolbarCustomDemo.vue`, plus one per Phase 2 use case.

The docs MUST follow the existing site conventions: frontmatter with `title`/`description`/`category`/`order`/`package`/`componentName`, MDX with embedded Vue demos via `client:only="vue"`, Pagefind-indexable for the site search.

## Risks / Trade-offs

- **PDFium WASM size (~3-4 MB)** → Mitigated by lazy-loading the PDF renderer chunk and self-hosting the WASM for cache control. Documented in `docs/bundle-and-perf.md`.
- **EmbedPDF plugin breaking changes across versions** → Peer deps so consumers control versions; pin tested versions in MeldUI's exact-version dev deps. CI matrix tests against the pinned range.
- **Threaded comments are not PDF-portable** → If a consumer wants threads to survive a `saveAsCopy` to a third-party reader, those threads are lost. Documented limitation in `docs/annotations.md`.
- **Storybook stories require sample PDFs** → Bundle small test PDFs into `apps/vue-storybook/public/` (~1 MB total) under a clear license.
- **Bundle creep risk in Phase 2** → Mitigated by strict opt-in model + bundle-size CI check that fails the build if all-flags-off baseline grows.
- **Visual-parity drift over time** → Mitigated by a "look-and-feel reference" Storybook story that recreates doqo's exact toolbar configuration, used for visual regression comparisons.

## Migration Plan

This is a new component; no migration of existing MeldUI consumers needed. Doqo's migration is tracked separately in `doqo/openspec/changes/meld-viewer-integration/`. The two changes are coordinated:

1. MeldUI scaffolding (tasks 1-3) — doqo unblocked to start its backend in parallel
2. MeldUI renderer + multi-format (tasks 4-8) — doqo can `workspace:*` link and begin frontend adapter
3. MeldUI annotations + programmatic API (tasks 9-11) — doqo wires its adapter to the API
4. MeldUI visual parity + storybook + docs (tasks 12-14) — doqo validates visual regression
5. MeldUI release (task 15) — doqo switches from workspace link to published version

## Open Questions

- Does `@embedpdf/plugin-attachment` exist as a published package? Verified during task 20.1; if not, Phase 2 ships without attachments.
- Final naming for the `features` prop sub-keys — confirm during task 1.3 type design.
