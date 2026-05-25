# Implementation Tasks

## Phase 1 — Parity & Annotations

## 1. Scaffolding

- [ ] 1.1 Create `packages/vue/src/composites/document-viewer/` directory
- [ ] 1.2 Create `index.ts` barrel export
- [ ] 1.3 Create `types/index.ts` with public types: `DocumentViewerProps`, `ViewerFeatures`, `FeatureConfig`, `Annotation`, `CommentReply`, `Thread`, `DocumentViewerInstance`
- [ ] 1.4 Add EmbedPDF core deps as peer + optional: `@embedpdf/core`, `@embedpdf/engines`
- [ ] 1.5 Add `peerDependenciesMeta` entries marking EmbedPDF packages as optional
- [ ] 1.6 Document `pdfium.wasm` self-hosting in `README.md`
- [ ] 1.7 Update `packages/vue/src/index.ts` barrel to export `document-viewer`

## 2. Minimum PDF Renderer

- [ ] 2.1 Create `plugins/pluginRegistry.ts` — pure function from `features` → `PluginRegistration[]` with correct dependency order
- [ ] 2.2 Create `renderers/PdfViewer.vue` with DocumentManager + Viewport + Scroll + Render + Tiling registered
- [ ] 2.3 Wire `usePdfiumEngine` with `wasmUrl` prop
- [ ] 2.4 Add `defineAsyncComponent` wrapper so the PDF renderer is its own Vite chunk
- [ ] 2.5 Expose a `worker` prop on `DocumentViewer` (default `true`) that forwards to `usePdfiumEngine({ worker })` — documents the relative-`wasmUrl` caveat when consumers opt back to `worker={false}`

## 3. Multi-format Dispatch & Toolbar Shell

- [ ] 3.1 Create `DocumentViewer.vue` with content-type detection (utils ported from doqo's `utils.ts`)
- [ ] 3.2 Create `renderers/ImageViewer.vue`, `TextViewer.vue`, `MarkdownViewer.vue`
- [ ] 3.3 Create `ViewerToolbar.vue` — sticky top, z-30, responsive lg breakpoint, mobile overflow menu
- [ ] 3.4 Create `ViewerSidePanel.vue` — generic side container

## 4. View Controls (opt-in)

- [ ] 4.1 Zoom plugin + toolbar buttons + fit presets + pinch
- [ ] 4.2 Rotate plugin + CW/CCW toolbar buttons
- [ ] 4.3 Spread plugin + view-mode toolbar toggle
- [ ] 4.4 Pan plugin + hand/text toolbar toggle (+ InteractionManager)
- [ ] 4.5 Fullscreen plugin + toolbar button
- [ ] 4.6 Selection plugin + copy-to-clipboard

## 5. Search

- [ ] 5.1 Register SearchPlugin
- [ ] 5.2 Create `useSearch` composable wrapping plugin
- [ ] 5.3 Build search popover in toolbar with case/whole-word toggles, prev/next, match counter
- [ ] 5.4 Implement active-match emphasis styling

## 6. Side Panels

- [ ] 6.1 BookmarkPlugin → `panels/OutlinePanel.vue` (hierarchical tree with keyboard nav)
- [ ] 6.2 ThumbnailPlugin → `panels/ThumbnailsPanel.vue` (click-to-navigate, lazy)
- [ ] 6.3 Wire panel toggle buttons in toolbar

## 7. Export

- [ ] 7.1 Register ExportPlugin
- [ ] 7.2 Print + Download toolbar buttons
- [ ] 7.3 Support custom `downloadUrl` prop for re-encoded copies

## 8. Keyboard & Touch

- [ ] 8.1 HotkeysPlugin + custom binds for C/O/T panel toggles
- [ ] 8.2 Create `composables/useTouch.ts` — swipe page-nav, double-tap zoom, wired to Viewport DOM

## 9. Annotation System

- [ ] 9.1 Register annotation deps: InteractionManager, Selection, History
- [ ] 9.2 Register AnnotationPluginPackage with author config
- [ ] 9.3 Create `composables/useAnnotations.ts` wrapping `useAnnotation` + exposing programmatic API
- [ ] 9.4 Register 5 default highlight tools (yellow/green/blue/pink/purple, opacity 0.4) — overridable via `featureConfig.annotations.defaultTools` — **design revised 2026-05-23**: per doqo's UX, do NOT split into 5 toolbar tools. Keep the single default EmbedPDF `highlight` tool; the 5 colours live in `HighlightTooltip.vue` (post-create floating affordance). Spec scenario "Highlight colours" should be re-read as "the floating tooltip exposes 5 swatches", not "the toolbar exposes 5 buttons". See [[F7]] in follow-ups.
- [ ] 9.5 Register sticky-note comment tool
- [ ] 9.6 Wire toolbar comment/highlight buttons to `setActiveTool`

## 10. Threaded Comments Overlay

- [ ] 10.1 Create `composables/useAnnotationThreads.ts` — `Map<annotationId, Thread>` with `addReply`, `resolveAnnotation`, `loadThreads`, `exportThreads`
- [ ] 10.2 Create `panels/CommentsPanel.vue` — list of threaded comments anchored to annotation IDs
- [ ] 10.3 Create `panels/CommentThreadItem.vue` + `CommentReplyForm.vue`
- [ ] 10.4 Wire `onAnnotationEvent` subscription with `committed===true` filter; emit annotation events

## 11. Programmatic API

- [ ] 11.1 Implement `defineExpose` block on `DocumentViewer.vue`
- [ ] 11.2 Implement `loadAnnotations(annotations)` — waits for `loaded` event then `importAnnotations`
- [ ] 11.3 Implement `createAnnotation(input)`, `updateAnnotation(id, patch)`, `deleteAnnotation(id)`
- [ ] 11.4 Implement `selectAnnotation(id)`, `navigateToAnnotation(id)`, `getAnnotations(filter)`
- [ ] 11.5 Implement `importAnnotations(items)`, `exportAnnotations(filter)`
- [ ] 11.6 Implement `saveAsCopy(options)` — returns ArrayBuffer with annotations baked in
- [ ] 11.7 Implement `addReply(annotationId, content)`, `resolveAnnotation(annotationId, resolved)`
- [ ] 11.8 Export `DocumentViewerInstance` type from `types/index.ts`

## 12. Visual Parity with Doqo DocumentViewer

- [ ] 12.1 Build toolbar layout against `frontend/src/components/viewer/ViewerToolbar.vue` (doqo) as reference — match button order, grouping, dividers
- [ ] 12.2 Match icon set: `@meldui/tabler-vue` icons mirror doqo's existing ones (Search, Print, Download, ZoomIn/Out, Rotate, ChevronLeft/Right, etc.)
- [ ] 12.3 Match responsive `lg:` breakpoint behaviour: identical mobile overflow menu contents
- [ ] 12.4 Match side panel chrome (`ViewerSidePanel.vue` shape: header + close button, fixed widths)
- [ ] 12.5 Match search popover layout (input + match counter + prev/next, mobile width)
- [ ] 12.6 Match comment marker visual (`CommentMarker.vue`) and `CommentForm` smart placement
- [ ] 12.7 Match 5 highlight preset colours exactly: yellow/green/blue/pink/purple at 0.4 alpha rgba (port values from `frontend/src/types/viewer.ts`)
- [ ] 12.8 Verify dark mode adapts via `dark:` Tailwind classes
- [ ] 12.9 Side-by-side visual regression: open the same PDF in both doqo's `DocumentViewer` and the new `DocumentViewer` storybook story; capture screenshots; resolve discrepancies before release

## 13. Storybook

- [ ] 13.1 Create `DocumentViewer.stories.ts` with stories: PDF basic, multi-page, image, text, markdown
- [ ] 13.2 Add stories: programmatic-annotation, RAG-citation demo, save-as-copy demo, import/export round-trip
- [ ] 13.3 Add "look-and-feel reference" story replicating doqo's exact toolbar configuration
- [ ] 13.4 Bundle audit: `pnpm build` → verify per-plugin chunks; verify all-flags-off bundle excludes plugin packages
- [ ] 13.5 Update `apps/vue-storybook/public/` with sample PDFs (small, license-clear)

## 14. Documentation — Top-Level Guides (apps/docs)

The DocumentViewer docs site lives at `apps/docs/src/content/docs/document-viewer/` (top-level, mirroring the depth of `data-table/`). All pages use the existing Astro + MDX conventions with frontmatter (`title`, `description`, `category`, `order`, `package`, `componentName`) and embedded Vue demos via `client:only="vue"`.

- [ ] 14.1 Create `document-viewer/index.mdx` — overview, when to use, when not to use, comparison vs other Vue PDF libs
- [ ] 14.2 Create `document-viewer/getting-started.mdx` — install peer deps, copy `pdfium.wasm`, render first PDF / image / text / markdown
- [ ] 14.3 Create `document-viewer/features.mdx` — `features` and `featureConfig` prop reference, full flag table, defaults
- [ ] 14.4 Create `document-viewer/programmatic-api.mdx` — `defineExpose` method reference with example invocations
- [ ] 14.5 Create `document-viewer/annotations.mdx` — annotation data model, threaded comments overlay, persistence patterns
- [ ] 14.6 Create `document-viewer/customization.mdx` — toolbar groups/hide/customButtons, side panels, slot reference
- [ ] 14.7 Create `document-viewer/theming.mdx` — Tailwind dark mode, MeldUI primitives used, override hooks
- [ ] 14.8 Create `document-viewer/bundle-and-perf.mdx` — headless rationale, lazy loading, WASM hosting, expected sizes per `features` profile
- [ ] 14.9 Create `document-viewer/troubleshooting.mdx` — common issues (WASM 404, CORS, mixed content, large PDFs, browser support matrix)
- [ ] 14.10 Create `document-viewer/migration.mdx` — migration guides from `@tato30/vue-pdf`, `vue-pdf-embed`, raw `pdfjs-dist`, PDFTron Web Viewer (prop mapping tables, breaking-change notes)

## 15. Documentation — Per-Plugin Reference Pages (Phase 1 plugins)

Each plugin gets its own MDX page in `apps/docs/src/content/docs/document-viewer/plugins/<slug>.mdx`. Each page documents: what the plugin does, which `features` flag enables it, its `featureConfig` options, the composable it exposes, key events, dependencies on other plugins, and a minimum example.

- [ ] 15.1 `plugins/document-manager.mdx` — DocumentManagerPluginPackage
- [ ] 15.2 `plugins/viewport.mdx` — ViewportPluginPackage
- [ ] 15.3 `plugins/scroll.mdx` — ScrollPluginPackage (continuous + page mode)
- [ ] 15.4 `plugins/render.mdx` — RenderPluginPackage
- [ ] 15.5 `plugins/tiling.mdx` — TilingPluginPackage (virtualization)
- [ ] 15.6 `plugins/zoom.mdx` — ZoomPluginPackage (incl. fit modes, pinch)
- [ ] 15.7 `plugins/rotate.mdx` — RotatePluginPackage
- [ ] 15.8 `plugins/spread.mdx` — SpreadPluginPackage (two-page spread)
- [ ] 15.9 `plugins/pan.mdx` — PanPluginPackage (hand tool)
- [ ] 15.10 `plugins/fullscreen.mdx` — FullscreenPluginPackage
- [ ] 15.11 `plugins/interaction-manager.mdx` — InteractionManagerPluginPackage
- [ ] 15.12 `plugins/selection.mdx` — SelectionPluginPackage (text select + copy)
- [ ] 15.13 `plugins/search.mdx` — SearchPluginPackage
- [ ] 15.14 `plugins/bookmark.mdx` — BookmarkPluginPackage (outline)
- [ ] 15.15 `plugins/thumbnail.mdx` — ThumbnailPluginPackage
- [ ] 15.16 `plugins/export.mdx` — ExportPluginPackage (print + download + saveAsCopy)
- [ ] 15.17 `plugins/hotkeys.mdx` — HotkeysPluginPackage + custom binds
- [ ] 15.18 `plugins/annotation.mdx` — AnnotationPluginPackage (Phase 1 core annotation API)
- [ ] 15.19 `plugins/history.mdx` — HistoryPluginPackage (undo/redo)

## 16. Documentation — Use-Case Guides

Each use case gets its own MDX page in `apps/docs/src/content/docs/document-viewer/use-cases/<slug>.mdx` with an embedded runnable demo from `apps/docs/src/demos/document-viewer/`.

- [ ] 16.1 `use-cases/index.mdx` — index page linking all use cases
- [ ] 16.2 `use-cases/load-saved-annotations.mdx` — load-on-open with backend persistence pattern
- [ ] 16.3 `use-cases/ai-rag-citations.mdx` — programmatic highlights from AI/RAG responses, ephemeral citation pattern
- [ ] 16.4 `use-cases/import-export-annotations.mdx` — round-tripping annotations between systems
- [ ] 16.5 `use-cases/save-as-copy-burnin.mdx` — generating a baked-in PDF copy with `saveAsCopy()`
- [ ] 16.6 `use-cases/share-link-viewer.mdx` — permission-gated read-only viewer (no auth, anonymous visitor)
- [ ] 16.7 `use-cases/multi-format-rendering.mdx` — image / text / markdown rendering
- [ ] 16.8 `use-cases/threaded-comments.mdx` — replies + resolved state with backend sync
- [ ] 16.9 `use-cases/keyboard-and-touch.mdx` — accessibility + touch device patterns
- [ ] 16.10 `use-cases/large-documents.mdx` — virtualization and 1000+ page documents
- [ ] 16.11 `use-cases/dark-mode-integration.mdx` — theming inside a dark-mode app
- [ ] 16.12 `use-cases/toolbar-customization.mdx` — custom buttons, hidden groups, reordering

## 17. Documentation — Demos (Vue SFCs)

Each MDX page that needs an interactive demo gets a Vue SFC in `apps/docs/src/demos/document-viewer/`.

- [ ] 17.1 `BasicPdfDemo.vue` — minimal PDF viewer
- [ ] 17.2 `MultiFormatDemo.vue` — PDF / image / text / markdown switcher
- [ ] 17.3 `FeaturesProfileDemo.vue` — interactive `features` flag toggles showing toolbar adapt
- [ ] 17.4 `ProgrammaticAnnotationDemo.vue` — buttons that call `createAnnotation` / `updateAnnotation` / `deleteAnnotation`
- [ ] 17.5 `LoadSavedAnnotationsDemo.vue` — pre-seeded annotations on mount
- [ ] 17.6 `RagCitationDemo.vue` — simulates an AI citation creating an ephemeral highlight
- [ ] 17.7 `ImportExportDemo.vue` — round-trip with downloadable JSON
- [ ] 17.8 `SaveAsCopyDemo.vue` — downloads a baked PDF
- [ ] 17.9 `ThreadedCommentsDemo.vue` — replies + resolve
- [ ] 17.10 `ToolbarCustomDemo.vue` — reordered groups, hidden buttons, custom action
- [ ] 17.11 `LargeDocumentDemo.vue` — 500+ page PDF for virtualization showcase
- [ ] 17.12 `DarkModeDemo.vue` — toggle dark class on the root

## 18. Documentation — In-Package & Pagefind

- [ ] 18.1 Create `packages/vue/src/composites/document-viewer/README.md` as a short "see the docs site" pointer plus minimum quick start
- [ ] 18.2 Add inline TSDoc comments on every public type (`DocumentViewerProps`, `ViewerFeatures`, `FeatureConfig`, `DocumentViewerInstance`, `Annotation`, `CommentReply`, `Thread`, etc.)
- [ ] 18.3 Add DocumentViewer entry to `packages/vue/README.md` component index linking to docs site
- [ ] 18.4 Verify Pagefind indexes all new MDX pages (run `pnpm build` in `apps/docs/`; check `dist/pagefind/`)
- [ ] 18.5 Verify `generate-llms.ts` script picks up DocumentViewer pages so the LLM-friendly text export is complete
- [ ] 18.6 Smoke-test the docs site nav: every demo loads, every internal link resolves, DocumentViewer appears in sidebar grouping

## 19. Storybook

- [ ] 19.1 Create `DocumentViewer.stories.ts` with stories: PDF basic, multi-page, image, text, markdown
- [ ] 19.2 Add stories: programmatic-annotation, RAG-citation demo, save-as-copy demo, import/export round-trip
- [ ] 19.3 Add "look-and-feel reference" story replicating doqo's exact toolbar configuration
- [ ] 19.4 Bundle audit: `pnpm build` → verify per-plugin chunks; verify all-flags-off bundle excludes plugin packages
- [ ] 19.5 Update `apps/vue-storybook/public/` with sample PDFs (small, license-clear)

## 20. Release Prep

- [ ] 20.1 Update `packages/vue/CHANGELOG.md`
- [ ] 20.2 Update `apps/docs/CHANGELOG.md` with DocumentViewer doc additions
- [ ] 20.3 Bump version minor
- [ ] 20.4 Publish to GitHub Packages registry
- [ ] 20.5 Tag release

## Phase 2 — Advanced Editing (Opt-in)

## 21. Stamps

- [ ] 21.1 Register StampPlugin behind `features.stamps`
- [ ] 21.2 Build stamp toolbar group (stamp library picker, custom library uploader)
- [ ] 21.3 Programmatic stamp creation API: `createStamp(input)`, `createStampFromAnnotation(annotation)`
- [ ] 21.4 Add Storybook story
- [ ] 21.5 Add docs site page `plugins/stamp.mdx`
- [ ] 21.6 Add use-case `use-cases/branded-stamps.mdx` (org-level stamp libraries)
- [ ] 21.7 Add demo `StampLibraryDemo.vue`

## 22. Signature

- [ ] 22.1 Register SignaturePlugin behind `features.signature`
- [ ] 22.2 Build signature toolbar group + signature pad dialog (MeldUI Dialog)
- [ ] 22.3 Programmatic API: `requestSignature()`, `placeSignature(image, position)`
- [ ] 22.4 Add Storybook story
- [ ] 22.5 Add docs site page `plugins/signature.mdx`
- [ ] 22.6 Add use-case `use-cases/document-signing.mdx`
- [ ] 22.7 Add demo `SignatureDemo.vue`

## 23. Redaction

- [ ] 23.1 Register RedactionPlugin behind `features.redaction` with `useAnnotationMode: true`
- [ ] 23.2 Build redaction toolbar group (text-redact + area-redact tools)
- [ ] 23.3 Programmatic API: `createRedaction(input)`, `applyAllRedactions()`
- [ ] 23.4 Add Storybook story
- [ ] 23.5 Add docs site page `plugins/redaction.mdx`
- [ ] 23.6 Add use-case `use-cases/compliance-redaction.mdx` covering burn-in workflow with `saveAsCopy`
- [ ] 23.7 Add demo `RedactionDemo.vue`

## 24. Forms

- [ ] 24.1 Register FormPlugin behind `features.forms`
- [ ] 24.2 Programmatic API: `getFormFields()`, `setFieldValue(name, value)`, `getFieldValues()`
- [ ] 24.3 Form-related events: `field-change`, `form-submit`
- [ ] 24.4 Add Storybook story
- [ ] 24.5 Add docs site page `plugins/form.mdx`
- [ ] 24.6 Add use-case `use-cases/form-automation.mdx`
- [ ] 24.7 Add demo `FormFillingDemo.vue`

## 25. Attachments (if upstream supports)

- [ ] 25.1 Verify `@embedpdf/plugin-attachment` exists as a published package
- [ ] 25.2 Register AttachmentPlugin behind `features.attachments`
- [ ] 25.3 Build attachments panel
- [ ] 25.4 Programmatic API: `getAttachments()`, `downloadAttachment(name)`
- [ ] 25.5 Add docs site page `plugins/attachment.mdx`
- [ ] 25.6 Add demo `AttachmentDemo.vue`

## 26. Phase 2 Release

- [ ] 26.1 Bundle audit per advanced feature
- [ ] 26.2 Update top-level docs (`features.mdx`, `programmatic-api.mdx`, `index.mdx`) with Phase 2 capabilities
- [ ] 26.3 Update `apps/docs/CHANGELOG.md`
- [ ] 26.4 CHANGELOG + version bump + publish

## Follow-ups identified during audit (2026-05-23)

Findings from a post-implementation audit against the EmbedPDF headless plugin-annotation docs. 9.4 is now done; the items below remain.

- [ ] F1 Route the sticky-note "comment" tool through EmbedPDF's `'textComment'` tool instead of the custom `pendingCommentMode` overlay, OR register a real custom tool via `addTool` so `activeToolId` reflects "comment" and `deactivateToolAfterCreate` works. Current path bypasses the plugin's tool system entirely. Closes spec task 9.5.
- [ ] F2 `loadAnnotations` should gate on the plugin's `'loaded'` event rather than only waiting for `provides.value` to become truthy. Closes spec task 11.2 verbatim.
- [ ] F3 Reconcile `DEFAULT_FEATURES.annotations = false` (in `pluginRegistry.ts`) with the comment "Phase 1 annotations — always registered" — either truly gate registration on the flag, or flip the default to `true` and update the TSDoc to make it clear the flag only gates toolbar visibility.
- [ ] F4 Re-evaluate the `<SelectionSignal>` workaround in `PdfController.vue` now that 2.14.2 `selectedUids[]` is confirmed in the installed `.d.ts`. Try removing the slot-based fallback; if imported-annotation selection still misbehaves, file upstream and keep the workaround with a version-bounded TODO.
- [ ] F5 Fix `DocumentViewer.handleCommentFormSubmit` to convert screen-pixel click coordinates to PDF points at the current zoom (and rotation) before calling `createAnnotation` — currently only correct at scale 1.
- [ ] F6 Pre-existing TS error: `CreateAnnotationInput` is `Omit<Annotation, …>` over a discriminated union, which flattens the per-variant fields like `contents` (sticky-note) so `createAnnotation({ type: 'sticky-note', contents })` does not type-check. Refactor `CreateAnnotationInput` to a distributive `Omit` so per-variant fields survive.
- [ ] F7 Update OpenSpec `specs/document-viewer/spec.md` to rephrase the "Highlight colours" scenario and the proposal section to describe the single-tool + floating-tooltip UX explicitly (rather than implying 5 toolbar tools). Aligns the written spec with the agreed UX from 2026-05-23.
