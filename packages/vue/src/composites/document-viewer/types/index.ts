/**
 * DocumentViewer — public types
 *
 * A reusable, framework-agnostic document viewer composite for `@meldui/vue`.
 * Built on EmbedPDF (PDFium WASM, headless plugin architecture).
 *
 * See the docs site at `apps/docs/src/content/docs/document-viewer/` for full reference.
 */

/* ────────────────────────────────────────────────────────────────────────── */
/* Document & source                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

/** A document source — URL, File object, or raw bytes. */
export type DocumentSource = string | File | ArrayBuffer | Blob

/**
 * Document type the viewer dispatches on. Determines which renderer is used
 * and which feature flags are honoured (e.g., annotations are PDF-only).
 */
export type DocumentType = 'pdf' | 'image' | 'text' | 'markdown' | 'unknown'

/* ────────────────────────────────────────────────────────────────────────── */
/* Zoom & view modes                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

/** Named zoom presets supported by the toolbar. */
export type ZoomPreset = 'fit-page' | 'fit-width' | 'actual-size'

/** Either a fractional scale (e.g. 1.5 = 150%) or a named preset. */
export type Scale = number | ZoomPreset

/** View mode for multi-page documents. */
/**
 * View mode for the PDF renderer.
 *
 * `single` is intentionally omitted in Phase 1 — EmbedPDF has no built-in
 * single-page mode (only `ScrollStrategy.Vertical | Horizontal` on the Scroll
 * plugin and `SpreadMode.None | Odd | Even` on the Spread plugin), so we
 * stick to what EmbedPDF supports natively.
 */
export type ViewMode = 'continuous' | 'spread'

/** Two-page spread mode (only honoured when `viewMode` is `'spread'`). */
export type SpreadMode = 'none' | 'odd' | 'even'

/** Interaction mode for the viewport (cursor behaviour). */
export type InteractionMode = 'text' | 'hand'

/* ────────────────────────────────────────────────────────────────────────── */
/* Feature opt-in                                                             */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Capability flags that toggle EmbedPDF plugins and toolbar groups.
 *
 * Disabled features do NOT register their corresponding plugin, so the plugin's
 * package is tree-shaken from the consumer's bundle. The minimum required
 * plugins (DocumentManager, Viewport, Scroll, Render, Tiling) are always registered.
 */
export interface ViewerFeatures {
  // Navigation / view controls
  /** Zoom controls (in/out, fit presets, pinch). */
  zoom?: boolean
  /** Rotation (CW/CCW per 90°). */
  rotate?: boolean
  /** Two-page spread view mode. */
  spread?: boolean
  /** Hand-tool (pan) interaction mode. */
  pan?: boolean
  /** Fullscreen toggle. */
  fullscreen?: boolean

  // Search / selection
  /** Full-text search with case/whole-word toggles. */
  search?: boolean
  /** Text selection + copy-to-clipboard. */
  selection?: boolean

  // Side panels
  /** Outline / bookmark side panel. */
  outline?: boolean
  /** Thumbnails side panel. */
  thumbnails?: boolean

  // Export
  /** Native print dialog. */
  print?: boolean
  /** Download (with optional re-encoded copy via `saveAsCopy`). */
  download?: boolean

  // Annotations & editing (Phase 1)
  /** Native EmbedPDF annotations (highlight + pin-style comment). */
  annotations?: boolean
  /** Threaded comments overlay (replies + resolved state). Requires `annotations`. */
  commentThreads?: boolean
  /** Undo/redo (auto-enabled when annotations are on). */
  undoRedo?: boolean

  // Editing (Phase 2)
  /** Stamps (custom stamp libraries). */
  stamps?: boolean
  /** Digital signature. */
  signature?: boolean
  /** Redaction (with `saveAsCopy` for compliance burn-in). */
  redaction?: boolean
  /** Interactive form fields. */
  forms?: boolean
  /** Attachments panel (subject to upstream plugin availability). */
  attachments?: boolean

  // Interaction
  /** Keyboard shortcuts (arrows, +/-, R, Ctrl+F, F11, Esc, C/O/T). */
  keyboardShortcuts?: boolean
  /** Touch gestures (swipe page-nav, double-tap zoom). */
  touchGestures?: boolean

  // Screenshot protection
  /**
   * Client-side screen-capture deterrents against a casual viewer. When on, the
   * viewer: blurs the document content on window blur / tab-hide, intercepts
   * common screenshot/snip/devtools hotkeys (showing a persistent "Protected
   * content" panel with a "Back to document" button), blanks the page on print
   * (`@media print`), and blocks the right-click menu and drag-out.
   *
   * This is purely ADDITIVE and orthogonal: it does NOT change `selection`,
   * `print`, or `download` — compose those flags yourself (e.g. set
   * `selection: false` to also prevent copying). Reads live, so toggling at
   * runtime takes effect without a `:key` remount.
   *
   * IMPORTANT: this is a deterrent, NOT a guarantee. Every behaviour is
   * removable via browser DevTools / by disabling JavaScript, and it does NOT
   * stop OS screenshots (Linux/macOS/Windows grab the key before the page),
   * screen recorders, or a phone photo of the screen.
   */
  screenshotProtection?: boolean
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Per-feature configuration                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

/** Configuration for the zoom plugin. */
export interface ZoomFeatureConfig {
  min?: number
  max?: number
  defaultMode?: ZoomPreset
  step?: number
}

/**
 * The 5 canonical highlight preset colours, as solid hex codes.
 *
 * Yellow uses EmbedPDF's default highlight colour (`#FFCD45`) so the first
 * swatch matches the highlight produced by the default `'highlight'` tool.
 * The other four are light pastel tones picked at roughly the same HSL
 * lightness (~70-75%) so the whole palette reads as a coherent set of
 * highlighter-marker colours.
 *
 * EmbedPDF paints highlights with `blendMode: Multiply`. Over the white
 * page background, Multiply leaves the source colour unchanged, so a solid
 * hex value renders the same on the page as it does on a swatch. Over the
 * document's dark text, Multiply darkens the highlight just enough to keep
 * the text readable.
 *
 * `value` can be passed directly into `updateAnnotation(..., { color: value })`
 * and is also valid as a CSS `background-color` on swatches.
 */
export const HIGHLIGHT_COLORS: ReadonlyArray<{ readonly name: string; readonly value: string }> = [
  { name: 'Yellow', value: '#FFCD45' },
  { name: 'Green', value: '#92E89E' },
  { name: 'Blue', value: '#8FCFEF' },
  { name: 'Pink', value: '#FFA0BD' },
  { name: 'Purple', value: '#C8A5DD' },
] as const

export const DEFAULT_HIGHLIGHT_COLOR = HIGHLIGHT_COLORS[0].value

/** A registered highlight tool (one per preset colour). */
export interface AnnotationToolConfig {
  id: string
  label: string
  color: string
  opacity: number
}

/** Configuration for the annotation plugin. */
export interface AnnotationsFeatureConfig {
  /** Author attached to created annotations. */
  author?: string
  /** Whether new redactions are stored as PDF REDACT annotations (pending) vs. applied immediately. */
  useAnnotationMode?: boolean
  /** Override the default 5 highlight tools (yellow/green/blue/pink/purple at 0.4 alpha). */
  defaultTools?: AnnotationToolConfig[]
}

/** A preloaded stamp library. */
export interface StampLibraryConfig {
  id: string
  name: string
  url?: string
  data?: ArrayBuffer
  categories?: string[]
}

/** Configuration for the stamp plugin. */
export interface StampsFeatureConfig {
  libraries?: StampLibraryConfig[]
  defaultLibrary?: { id: string; name: string; categories?: string[] } | false
}

/** Configuration for the signature plugin. */
export interface SignatureFeatureConfig {
  mode?: 'signature-only' | 'signature-and-initials'
  defaultSize?: { width: number; height: number }
}

/** Configuration for the redaction plugin. */
export interface RedactionFeatureConfig {
  useAnnotationMode?: boolean
}

/**
 * Per-plugin configuration passed through to `createPluginRegistration`.
 *
 * Each key corresponds to a `ViewerFeatures` flag. Consumers can omit
 * keys to accept defaults; advanced consumers override per plugin.
 */
export interface FeatureConfig {
  zoom?: ZoomFeatureConfig
  annotations?: AnnotationsFeatureConfig
  stamps?: StampsFeatureConfig
  signature?: SignatureFeatureConfig
  redaction?: RedactionFeatureConfig
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Toolbar customisation                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

/** Built-in toolbar groups, in canonical left-to-right order. */
export type ToolbarGroup =
  | 'pageNav'
  | 'zoom'
  | 'rotate'
  | 'viewMode'
  | 'interactionMode'
  | 'search'
  | 'panels'
  | 'annotate'
  | 'stamp'
  | 'sign'
  | 'redact'
  | 'actions'

/** A custom button injected into the toolbar. */
export interface CustomToolbarButton {
  id: string
  label: string
  /** Tabler icon name (without the `Icon` prefix). */
  icon?: string
  group?: ToolbarGroup
  onClick: () => void
  isActive?: () => boolean
  isDisabled?: () => boolean
}

/** Toolbar customisation passed via the `toolbar` prop. */
export interface ToolbarConfig {
  /** Restrict / reorder the visible groups. Defaults to all-enabled in canonical order. */
  groups?: ToolbarGroup[]
  /** Built-in button IDs to hide. */
  hide?: string[]
  /** Custom buttons to inject. */
  customButtons?: CustomToolbarButton[]
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Annotations                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Rectangle in PDF page coordinates (1/72-inch points).
 *
 * `origin` is the **top-left** corner of the rect measured from the **top-left
 * of the page** (EmbedPDF / DOM convention — NOT the PDF spec's bottom-left
 * origin). `size.width` and `size.height` extend right and down respectively.
 *
 * For a Letter-sized page (612×792 pt), `origin.y = 0` is the top of the page
 * and `origin.y = 792` is the bottom.
 */
export interface PdfRect {
  origin: { x: number; y: number }
  size: { width: number; height: number }
}

/** Annotation subtype discriminator (mirrors EmbedPDF's `PdfAnnotationSubtype`). */
export type AnnotationType =
  | 'highlight'
  | 'underline'
  | 'strikeout'
  | 'squiggly'
  | 'free-text'
  | 'ink'
  | 'comment'
  | 'stamp'
  | 'signature'
  | 'redaction'
  | 'square'
  | 'circle'
  | 'polygon'
  | 'polyline'
  | 'line'

/** Shared base for all annotation objects. */
export interface AnnotationBase {
  /** Stable UUID (v4) generated by EmbedPDF or supplied by the caller. */
  id: string
  type: AnnotationType
  pageIndex: number
  rect: PdfRect
  /** Optional author display name. */
  author?: string
  /** ISO-8601 creation timestamp. */
  createdAt?: string
  /** ISO-8601 last-modified timestamp. */
  modifiedAt?: string
  /** Free-form metadata (e.g., `is_ephemeral` for AI citations). */
  metadata?: Record<string, unknown>
}

/** Highlight annotation — covers one or more text segments. */
export interface HighlightAnnotation extends AnnotationBase {
  type: 'highlight'
  segmentRects: PdfRect[]
  color: string
  opacity: number
  selectedText?: string
}

/**
 * Pin-style comment anchored to a point on the page. The discriminator
 * matches the user-facing feature name ("Add comment" toolbar tool,
 * `CommentMarker` renderer, `commentThreads` feature flag). Maps to
 * PDF 1.7's `TEXT` annotation subtype on the wire (`saveAsCopy` /
 * `exportAnnotations`), preserving spec compliance.
 */
export interface CommentAnnotation extends AnnotationBase {
  type: 'comment'
  contents: string
  color?: string
}

/** Free-text typewriter annotation. */
export interface FreeTextAnnotation extends AnnotationBase {
  type: 'free-text'
  contents: string
  fontSize: number
  fontColor: string
  fontFamily?: string
  backgroundColor?: string
  opacity: number
}

/** Freehand ink annotation (multiple strokes). */
export interface InkAnnotation extends AnnotationBase {
  type: 'ink'
  inkList: { points: { x: number; y: number }[] }[]
  strokeWidth: number
  color: string
  opacity: number
}

/** Stamp annotation. */
export interface StampAnnotation extends AnnotationBase {
  type: 'stamp'
  name?: string
  subject?: string
}

/** Signature annotation. */
export interface SignatureAnnotation extends AnnotationBase {
  type: 'signature'
  imageDataUrl?: string
}

/** Redaction annotation (pending or applied). */
export interface RedactionAnnotation extends AnnotationBase {
  type: 'redaction'
  pending: boolean
  fillColor?: string
}

/** Discriminated union of all annotation shapes. */
export type Annotation =
  | HighlightAnnotation
  | CommentAnnotation
  | FreeTextAnnotation
  | InkAnnotation
  | StampAnnotation
  | SignatureAnnotation
  | RedactionAnnotation

/**
 * Input for `createAnnotation`.
 *
 * Distributes over the `Annotation` union (via the naked `T` in the
 * conditional) so each variant keeps its own discriminated fields — e.g.
 * `contents` for `comment`, `segmentRects`/`color`/`opacity` for `highlight`.
 * A non-distributive `Omit<Annotation, …>` would collapse the union to its
 * common base keys and silently drop those fields. `id`, `createdAt`, and
 * `modifiedAt` are auto-assigned by the viewer; `id` may be supplied to pin a
 * stable id.
 */
type CreateAnnotationInputFor<T> = T extends Annotation
  ? Omit<T, 'id' | 'createdAt' | 'modifiedAt'> & Partial<Pick<T, 'id'>>
  : never

export type CreateAnnotationInput = CreateAnnotationInputFor<Annotation>

/** Item passed to `importAnnotations`. Includes optional binary context for stamps/signatures. */
export interface AnnotationTransferItem {
  annotation: Annotation
  ctx?: { data: ArrayBuffer; mimeType?: string }
}

/** Filter passed to `getAnnotations` / `exportAnnotations`. */
export interface AnnotationFilter {
  pageIndex?: number
  types?: AnnotationType[]
  authorId?: string
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Threaded comments overlay                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

/** A reply within an annotation thread. */
export interface CommentReply {
  id: string
  annotationId: string
  authorUserId: string
  authorName?: string
  authorAvatarUrl?: string
  content: string
  createdAt: string
  updatedAt?: string
}

/** Thread metadata anchored to an EmbedPDF annotation UUID. */
export interface CommentThread {
  annotationId: string
  isResolved: boolean
  resolvedByUserId?: string
  resolvedAt?: string
  replies: CommentReply[]
}

/* ────────────────────────────────────────────────────────────────────────── */
/* User identity (for comment authorship)                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/** Minimal user shape used for comment authorship. */
export interface CommentAuthor {
  id: string
  name: string
  email?: string
  avatarUrl?: string
}

/* ────────────────────────────────────────────────────────────────────────── */
/* DocumentViewer component props                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * Props for the top-level `DocumentViewer` component.
 *
 * See `getting-started.mdx` in the docs site for examples.
 */
export interface DocumentViewerProps {
  /** Document source. Required. */
  source: DocumentSource
  /** MIME type override (e.g., `'application/pdf'`). Auto-detected from `source` if omitted. */
  mimeType?: string
  /** Custom download URL — overrides the source for download/print. */
  downloadUrl?: string
  /** Stable identifier used for annotation namespacing. */
  documentId?: string

  /**
   * URL where `pdfium.wasm` is served from. Required for PDF rendering.
   *
   * Resolved against `document.baseURI` before being handed to the engine,
   * so bare relative paths (`"pdfium.wasm"`), `./`/`../` paths, root-relative
   * paths (`"/pdfium.wasm"`), and fully-qualified URLs all work. For sites
   * deployed under a subpath (e.g. GitHub Pages project sites), prefer a bare
   * relative path or a fully-qualified URL — per URL spec a leading `/` always
   * resolves from the origin root regardless of base.
   */
  wasmUrl?: string

  /**
   * Run PDFium inside a Web Worker (off the main thread).
   *
   * - `true` (default) — heavy operations (rendering, search, decode) run
   *   on a worker thread, keeping the UI responsive on large documents.
   *   Matches EmbedPDF's library default.
   * - `false` — PDFium runs on the main thread. Use when you hit the worker
   *   engine's relative-`wasmUrl` resolution issue (the worker is built
   *   from a blob URL whose base differs from the page's). Absolute paths
   *   like `/pdfium.wasm` and fully-qualified URLs work with either mode.
   */
  worker?: boolean

  /** Capability flags. Disabled features are tree-shaken. */
  features?: ViewerFeatures
  /** Per-plugin configuration. */
  featureConfig?: FeatureConfig
  /** Toolbar groups, hidden buttons, custom buttons. */
  toolbar?: ToolbarConfig

  /** Current authenticated user (for annotation authorship). */
  currentUser?: CommentAuthor

  /** Annotations to preload on mount. */
  initialAnnotations?: Annotation[]
  /** Threaded-comment metadata to preload on mount. */
  initialThreads?: CommentThread[]

  /** Initial page (1-based). Defaults to 1. */
  initialPage?: number
  /** Initial scale. Defaults to `'fit-width'`. */
  initialScale?: Scale
  /** Initial view mode. Defaults to `'continuous'`. */
  initialViewMode?: ViewMode

  /** Tailwind class override on the root element. */
  class?: string
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Programmatic API (defineExpose)                                            */
/* ────────────────────────────────────────────────────────────────────────── */

/** Document metadata loaded from the source. */
export interface DocumentInfo {
  pageCount: number
  title: string | null
}

/** Save-as-copy options. */
export interface SaveAsCopyOptions {
  /** Whether to include current annotations in the saved copy. Defaults to `true`. */
  includeAnnotations?: boolean
  /** Whether to flatten editable annotations to fixed content. */
  flatten?: boolean
}

/**
 * The programmatic API exposed by `DocumentViewer` via `defineExpose`.
 *
 * Capture via a template ref typed as `DocumentViewerInstance`:
 * ```ts
 * const viewer = ref<DocumentViewerInstance | null>(null)
 * await viewer.value?.loadAnnotations(saved)
 * ```
 */
export interface DocumentViewerInstance {
  // Document
  getDocumentInfo(): DocumentInfo | null
  getCurrentPage(): number
  goToPage(page: number): void

  // Annotation read
  getAnnotations(filter?: AnnotationFilter): Annotation[]
  getThread(annotationId: string): CommentThread | null

  // Annotation CRUD
  loadAnnotations(annotations: Annotation[]): Promise<void>
  createAnnotation(input: CreateAnnotationInput): Promise<Annotation>
  updateAnnotation(id: string, patch: Partial<Annotation>): Promise<void>
  deleteAnnotation(id: string): Promise<void>
  selectAnnotation(id: string): void
  navigateToAnnotation(id: string): void

  // Bulk
  importAnnotations(items: AnnotationTransferItem[]): Promise<void>
  exportAnnotations(filter?: AnnotationFilter): Promise<AnnotationTransferItem[]>

  // History
  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean

  // PDF binary
  saveAsCopy(options?: SaveAsCopyOptions): Promise<ArrayBuffer>

  // Threads
  loadThreads(threads: CommentThread[]): void
  addReply(annotationId: string, content: string): Promise<CommentReply>
  resolveAnnotation(annotationId: string, resolved: boolean): Promise<void>
  deleteReply(annotationId: string, replyId: string): Promise<void>
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Events                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/** Payload for `annotation-updated` — includes only changed fields. */
export interface AnnotationUpdatePayload {
  annotation: Annotation
  patch: Partial<Annotation>
}

/** Payload for `thread-update`. */
export interface ThreadUpdatePayload {
  thread: CommentThread
  /** Type of mutation that triggered the update. */
  action: 'reply-added' | 'reply-deleted' | 'resolved' | 'unresolved'
}

/**
 * Events emitted by `DocumentViewer`. Consumed via `v-on:event-name` on the component.
 *
 * Events fire only for changes that have been committed to the engine
 * (i.e., not in-flight drag/resize states).
 */
export interface DocumentViewerEmits {
  (e: 'document-loaded', payload: DocumentInfo): void
  (e: 'document-error', payload: { error: string }): void
  (e: 'page-change', payload: { page: number }): void
  (e: 'zoom-change', payload: { scale: number }): void
  (e: 'rotation-change', payload: { rotation: number }): void
  (e: 'view-mode-change', payload: { viewMode: ViewMode }): void
  (e: 'interaction-mode-change', payload: { mode: InteractionMode }): void
  (e: 'fullscreen-change', payload: { isFullscreen: boolean }): void
  (
    e: 'panel-toggle',
    payload: { panel: 'outline' | 'thumbnails' | 'comments' | 'search'; open: boolean },
  ): void

  /**
   * The user invoked download. Notify-only — the built-in download (consumer
   * `downloadUrl`, PDF Export plugin, or non-PDF source fallback) always runs;
   * this event cannot cancel it. Use for analytics / side-effects.
   */
  (e: 'download'): void
  /** The user invoked print. Notify-only — the built-in print always runs. */
  (e: 'print'): void

  (e: 'annotation-created', payload: { annotation: Annotation }): void
  (e: 'annotation-updated', payload: AnnotationUpdatePayload): void
  (e: 'annotation-deleted', payload: { annotationId: string }): void
  (e: 'annotation-selected', payload: { annotation: Annotation | null }): void

  (e: 'thread-update', payload: ThreadUpdatePayload): void
  /**
   * The user asked to open the conversation for an annotation — from a
   * sticky-note pin (`source: 'comment-marker'`) or a highlight tooltip's
   * view-thread icon (`source: 'highlight-tooltip'`). Emitted regardless of
   * `features.commentThreads` so consumers hosting their own annotation panel
   * can react even when the built-in panel is disabled.
   */
  (
    e: 'thread-open-requested',
    payload: { annotationId: string; source: 'highlight-tooltip' | 'comment-marker' },
  ): void
}
