# document-viewer Specification

## ADDED Requirements

### Requirement: Multi-format Rendering

The component SHALL render PDF, image, plain-text, and markdown documents. Document type SHALL be auto-detected from MIME type or file extension, with an explicit `mimeType` prop override.

#### Scenario: PDF rendering

- **WHEN** a consumer passes a `source` resolving to a PDF
- **THEN** DocumentViewer renders the PDF using EmbedPDF with continuous virtualized scrolling
- **AND** all enabled toolbar controls operate against the rendered document

#### Scenario: Text or markdown rendering

- **WHEN** a consumer passes a source resolving to a plain-text or markdown document
- **THEN** DocumentViewer renders that document with the matching non-PDF renderer
- **AND** PDF-only toolbar groups (annotations, outline, thumbnails) are hidden
- **AND** search remains available, backed by a DOM-based highlighter instead of EmbedPDF's SearchLayer

#### Scenario: Image rendering

- **WHEN** a consumer passes a source resolving to an image
- **THEN** DocumentViewer renders the image with the image renderer
- **AND** all text-oriented toolbar groups (annotations, outline, thumbnails, search) are hidden because images contain no searchable or annotatable text

### Requirement: Headless EmbedPDF Integration

The component SHALL use EmbedPDF's headless mode exclusively and SHALL NOT import the drop-in `<PDFViewer>` component.

#### Scenario: PDFium WASM loading

- **WHEN** the consumer mounts DocumentViewer for a PDF document
- **THEN** the PDF renderer is loaded as a separate Vite chunk via `defineAsyncComponent`
- **AND** the PDFium WASM is fetched from the URL provided via the `wasmUrl` prop

#### Scenario: Web Worker engine by default

- **WHEN** the consumer mounts DocumentViewer for a PDF document without overriding the `worker` prop
- **THEN** PDFium runs inside a Web Worker so heavy operations (rendering, search, decode) do not block the main thread
- **AND** the consumer MAY pass `worker={false}` to force the direct (main-thread) engine, e.g. to work around the worker engine's blob-URL base resolving relative `wasmUrl` paths against the blob instead of the page

### Requirement: Toolbar Layout

The component SHALL render a sticky toolbar at the top of the viewport with a content viewport below.

#### Scenario: Desktop layout

- **WHEN** the viewport width is >= lg (>= 1024px)
- **THEN** primary controls are inlined in the toolbar with grouping

#### Scenario: Mobile layout

- **WHEN** the viewport width is < lg
- **THEN** secondary controls collapse into a 3-dot overflow menu
- **AND** search and pagination remain visible

### Requirement: Visual Parity with Doqo's Existing DocumentViewer

The component SHALL mirror the look-and-feel of doqo's `DocumentViewer.vue` + `ViewerToolbar.vue` so that doqo's migration is visually non-disruptive. This is the canonical reference design.

#### Scenario: Toolbar structure

- **WHEN** DocumentViewer renders its toolbar
- **THEN** the toolbar is sticky to the top with z-30
- **AND** the toolbar uses MeldUI primitives (Button, Popover, Tooltip) plus Tabler icons (`@meldui/tabler-vue`)
- **AND** button groups appear in the same left-to-right order as `ViewerToolbar.vue` today: page-nav → zoom → rotation → view-mode → interaction-mode → search → panels (thumbnails/outline/comments) → annotation tools → actions (download/print/fullscreen)
- **AND** the responsive lg breakpoint matches Tailwind's 1024px default
- **AND** in mobile (< lg) rotation/view-mode/interaction-mode/panels/actions collapse into a 3-dot Tabler icon overflow menu while page-nav, zoom, and search remain visible

#### Scenario: Side panel layout

- **WHEN** outline, thumbnails, or comments panels open
- **THEN** they render as fixed-width side panels with a header (title + close button) matching the existing `ViewerSidePanel.vue` shape
- **AND** they support left or right placement via a `position` prop (defaulting to right)

#### Scenario: Search popover

- **WHEN** the search button is clicked
- **THEN** a popover opens anchored to the search button with the same input + match counter + prev/next layout as the existing implementation
- **AND** on mobile the popover takes 100vw - 1rem width

#### Scenario: Comment marker and form

- **WHEN** a comment annotation is rendered on the page
- **THEN** its visual marker matches the existing `CommentMarker.vue` style (circular icon, tail pointer, reply count badge)
- **AND** the inline `CommentForm` popup uses the same smart placement (right/below click, repositioned on overflow) as today

#### Scenario: Highlight colours

- **WHEN** the user selects a highlight color
- **THEN** the 5 presets render as the same yellow / green / blue / pink / purple rgba values at 0.4 alpha used in `frontend/src/types/viewer.ts` today

#### Scenario: Dark mode

- **WHEN** the consuming app has Tailwind's `dark` class on the document root
- **THEN** DocumentViewer's chrome adapts using `dark:` Tailwind utilities, matching the existing viewer's dark-mode behaviour

### Requirement: Feature Opt-in

The component SHALL accept a `features` prop and SHALL register only the EmbedPDF plugins whose corresponding feature flag is enabled.

#### Scenario: Tree-shakeable plugin set

- **WHEN** a consumer disables `features.search`
- **THEN** the `@embedpdf/plugin-search` package SHALL NOT be present in the consumer's production bundle

#### Scenario: Toolbar adapts to features

- **WHEN** a consumer disables `features.annotations`
- **THEN** the annotation toolbar group SHALL NOT render

### Requirement: View Controls

When enabled, the component SHALL support zoom (in/out/fit-width/fit-page/actual-size/pinch), rotation (CW/CCW per 90 degrees), single/continuous/spread view modes, hand/text interaction modes, and fullscreen.

#### Scenario: Pinch-to-zoom on touch devices

- **WHEN** the user performs a two-finger pinch on the viewport
- **THEN** the zoom level updates continuously and emits `zoom-change` events

#### Scenario: Page navigation

- **WHEN** the user clicks the next or previous page button
- **THEN** the viewport scrolls to the corresponding page
- **AND** the current page indicator updates

### Requirement: Search

When `features.search` is enabled AND the document type is searchable (`pdf`, `text`, or `markdown`), the component SHALL provide full-text search with case-sensitive and whole-word toggles, prev/next match navigation, and visual emphasis on the active match. Search visuals SHALL be consistent across document types: yellow for matches, orange for the active match.

#### Scenario: Active-match emphasis

- **WHEN** matches are highlighted across pages (or, for text/markdown, across the rendered DOM)
- **THEN** the currently active match renders with a distinct emphasised style and the viewport scrolls it into view

#### Scenario: Search hidden for non-searchable types

- **WHEN** the document type is `image` or `unknown`
- **THEN** the search toolbar control is hidden regardless of the `features.search` flag

#### Scenario: Consistent search visuals across document types

- **WHEN** search runs against a PDF and against a text or markdown document with the same query
- **THEN** every match renders with the same yellow highlight and the active match renders with the same orange emphasis, so the visual is interchangeable across renderers

### Requirement: Side Panels

When their respective feature flags are enabled, the component SHALL provide outline (hierarchical bookmarks), thumbnails (lazy-rendered), and threaded-comments side panels.

#### Scenario: Outline panel

- **WHEN** the consumer enables `features.outline` and the PDF has a bookmark tree
- **THEN** the outline panel renders the hierarchy with click-to-navigate

#### Scenario: Thumbnails panel

- **WHEN** the consumer enables `features.thumbnails`
- **THEN** the thumbnails panel lazy-renders only visible thumbnails plus a buffer
- **AND** clicking a thumbnail scrolls the viewport to that page

### Requirement: Native EmbedPDF Annotations

When `features.annotations` is enabled, the component SHALL use EmbedPDF's annotation system for all PDF annotations and SHALL register 5 default highlight tools (yellow, green, blue, pink, purple, opacity 0.4) plus a sticky-note comment tool.

#### Scenario: Highlight creation via drag-select

- **WHEN** the user selects text with the highlight tool active
- **THEN** a highlight annotation is created with `segmentRects` covering the selection and the configured colour
- **AND** an `onAnnotationEvent({ type: 'create', committed: true })` event fires
- **AND** the consumer's `annotation-created` event handler receives the annotation

### Requirement: Programmatic Annotation API

The component SHALL expose, via Vue's `defineExpose`, a programmatic API for annotation CRUD, bulk import/export, navigation, and PDF burn-in.

#### Scenario: Load annotations on open

- **WHEN** a consumer calls `viewer.loadAnnotations(items)` after the document is loaded
- **THEN** all items are imported into the EmbedPDF annotation store
- **AND** the annotations render at their authored coordinates

#### Scenario: AI-generated highlight via createAnnotation

- **WHEN** an external process calls `viewer.createAnnotation({ type: 'highlight', pageIndex, segmentRects, color, opacity })`
- **THEN** a highlight annotation is created with the supplied geometry
- **AND** the returned annotation has a stable UUID `id`

#### Scenario: Round-trip import/export

- **WHEN** a consumer calls `await viewer.exportAnnotations()` to obtain `items` and later calls `await viewer.importAnnotations(items)` on a fresh mount
- **THEN** the rendered annotations match the original geometry, style, and metadata

#### Scenario: Save-as-copy with annotations baked in

- **WHEN** a consumer calls `await viewer.saveAsCopy()`
- **THEN** the returned ArrayBuffer is a valid PDF that contains all current annotations as embedded PDF annotations
- **AND** the resulting PDF opens correctly in third-party readers

### Requirement: Threaded Comments

When `features.commentThreads` is enabled, the component SHALL store reply threads and resolved state in an overlay map keyed by annotation UUID, independent of the PDF binary.

#### Scenario: Adding a reply to an annotation

- **WHEN** a consumer calls `viewer.addReply(annotationId, content)`
- **THEN** the thread for that annotation gains a new reply entry
- **AND** a `thread-update` event fires with the updated thread

#### Scenario: Threads survive annotation update

- **WHEN** an annotation is updated (moved, resized, recoloured)
- **THEN** its thread remains anchored to the same annotation UUID

### Requirement: Annotation Event Stream

The component SHALL emit annotation lifecycle events (`annotation-created`, `annotation-updated`, `annotation-deleted`) only for changes that have been committed to the engine.

#### Scenario: Patch diffs on update

- **WHEN** an annotation property changes
- **THEN** the `annotation-updated` event payload contains a `patch` object with only the changed fields

### Requirement: Keyboard Shortcuts

When `features.keyboardShortcuts` is enabled, the component SHALL support standard viewer shortcuts: arrow keys for page navigation, plus/minus/zero for zoom, R / Shift+R for rotation, Ctrl+F for search, F11 for fullscreen, Escape to close panels, and C/O/T to toggle comments / outline / thumbnails panels.

#### Scenario: Search shortcut

- **WHEN** the user presses Ctrl+F (or Cmd+F on macOS)
- **THEN** the search popover opens with the input focused

#### Scenario: Shortcuts disabled in text inputs

- **WHEN** the user is typing in an input or textarea
- **THEN** viewer shortcuts SHALL NOT trigger

### Requirement: Touch Gestures

When `features.touchGestures` is enabled, the component SHALL support pinch-zoom (handled by EmbedPDF), swipe page-navigation in single-page mode, and double-tap to toggle between fit and 100% zoom.

#### Scenario: Swipe page navigation

- **WHEN** the user swipes left on the viewport in single-page mode
- **THEN** the viewer advances to the next page

### Requirement: Phase 2 Advanced Editing (Opt-in)

When the corresponding feature flags are enabled, the component SHALL provide stamps, digital signatures, redaction, form filling, and attachments, each via its dedicated EmbedPDF plugin.

#### Scenario: Redaction burn-in

- **WHEN** the consumer applies pending redactions and calls `viewer.saveAsCopy()`
- **THEN** the returned ArrayBuffer contains a PDF with redacted regions permanently blacked out at the byte level

#### Scenario: Stamp library preload

- **WHEN** the consumer passes `featureConfig.stamps.libraries`
- **THEN** the stamp tool exposes those libraries in its picker

#### Scenario: Form field programmatic update

- **WHEN** the consumer calls `viewer.setFieldValue(name, value)`
- **THEN** the form field updates and a `field-change` event fires

### Requirement: Loose Coupling

The component SHALL NOT depend on any application-framework primitives (no Inertia, no Vue Router, no app-specific stores) and SHALL NOT contain hard-coded URLs, route helpers, or backend assumptions.

#### Scenario: No framework imports

- **WHEN** a developer audits the `document-viewer` source for imports
- **THEN** no Inertia, Phoenix, Vue Router, or doqo-specific module appears

### Requirement: Component Documentation

The package SHALL ship an extensive documentation site under `apps/docs/src/content/docs/document-viewer/` covering overview, getting started, every supported feature/plugin, every documented use case, customization, theming, bundle and performance, troubleshooting, and migration. Documentation is part of the Phase 1 release definition; an undocumented release is not acceptable.

#### Scenario: Top-level guides present

- **WHEN** the Phase 1 release is published
- **THEN** the following pages exist and render under `apps/docs/src/content/docs/document-viewer/`: `index.mdx`, `getting-started.mdx`, `features.mdx`, `programmatic-api.mdx`, `annotations.mdx`, `customization.mdx`, `theming.mdx`, `bundle-and-perf.mdx`, `troubleshooting.mdx`, `migration.mdx`

#### Scenario: Per-plugin reference pages

- **WHEN** the Phase 1 release is published
- **THEN** the `document-viewer/plugins/` subdirectory contains one MDX page for every EmbedPDF plugin in scope (Phase 1: document-manager, viewport, scroll, render, tiling, zoom, rotate, spread, pan, fullscreen, interaction-manager, selection, search, bookmark, thumbnail, export, hotkeys, annotation, history)
- **AND** each page documents: what the plugin does, the `features` flag, the `featureConfig` options, the composable it exposes, key events, dependencies on other plugins, and a minimum example
- **WHEN** Phase 2 ships
- **THEN** the same subdirectory ALSO contains `stamp.mdx`, `signature.mdx`, `redaction.mdx`, `form.mdx`, and (if upstream supports) `attachment.mdx`

#### Scenario: Use-case guides with runnable demos

- **WHEN** the Phase 1 release is published
- **THEN** the `document-viewer/use-cases/` subdirectory contains at minimum: `index.mdx`, `load-saved-annotations.mdx`, `ai-rag-citations.mdx`, `import-export-annotations.mdx`, `save-as-copy-burnin.mdx`, `share-link-viewer.mdx`, `multi-format-rendering.mdx`, `threaded-comments.mdx`, `keyboard-and-touch.mdx`, `large-documents.mdx`, `dark-mode-integration.mdx`, `toolbar-customization.mdx`
- **AND** each use case page embeds a runnable Vue demo via `client:only="vue"` from `apps/docs/src/demos/document-viewer/`
- **WHEN** Phase 2 ships
- **THEN** additional use-case pages `branded-stamps.mdx`, `document-signing.mdx`, `compliance-redaction.mdx`, `form-automation.mdx` are present

#### Scenario: Programmatic API documented

- **WHEN** a consumer needs to use the programmatic annotation API
- **THEN** `programmatic-api.mdx` documents every method exposed via `defineExpose` (`loadAnnotations`, `createAnnotation`, `updateAnnotation`, `deleteAnnotation`, `selectAnnotation`, `navigateToAnnotation`, `getAnnotations`, `importAnnotations`, `exportAnnotations`, `saveAsCopy`, `addReply`, `resolveAnnotation`, `getDocumentInfo`, `goToPage`) with example invocations and TypeScript signatures

#### Scenario: TSDoc on public types

- **WHEN** a consumer hovers a public type in their IDE
- **THEN** TSDoc descriptions appear for `DocumentViewerProps`, `ViewerFeatures`, `FeatureConfig`, `DocumentViewerInstance`, `Annotation`, `CommentReply`, `Thread`, and every other exported type

#### Scenario: Pagefind indexing

- **WHEN** a docs reader uses the on-site search
- **THEN** every DocumentViewer page is indexed and surfaces via Pagefind

#### Scenario: LLM-friendly export

- **WHEN** the `generate-llms.ts` script runs as part of `apps/docs/` build
- **THEN** every DocumentViewer page is included in the output

#### Scenario: Storybook docs page

- **WHEN** the consumer browses the Storybook for `@meldui/vue`
- **THEN** an MDX docs page for DocumentViewer renders with embedded live stories
- **AND** the page links out to the full `apps/docs/` DocumentViewer site for deeper reference

#### Scenario: Migration guides

- **WHEN** a consumer migrating from another Vue PDF library reads the docs
- **THEN** `migration.mdx` provides prop mapping tables for `@tato30/vue-pdf`, `vue-pdf-embed`, raw `pdfjs-dist`, and PDFTron Web Viewer
- **AND** each mapping lists breaking-change notes and behaviour differences
