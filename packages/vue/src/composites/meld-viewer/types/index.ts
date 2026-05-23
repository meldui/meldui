/**
 * MeldViewer — public types
 *
 * A reusable, framework-agnostic document viewer composite for `@meldui/vue`.
 * Built on EmbedPDF (PDFium WASM, headless plugin architecture).
 *
 * See the docs site at `apps/docs/src/content/docs/meld-viewer/` for full reference.
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
export type ZoomPreset = 'fit-page' | 'fit-width' | 'actual-size' | 'automatic'

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
export interface MeldViewerFeatures {
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
  /** Native EmbedPDF annotations (highlight + sticky-note comment). */
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
 * Each key corresponds to a `MeldViewerFeatures` flag. Consumers can omit
 * keys to accept defaults; advanced consumers override per plugin.
 */
export interface MeldViewerFeatureConfig {
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
export interface MeldViewerToolbarConfig {
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

/** PDF user-space rectangle (origin at bottom-left, points). */
export interface PdfRect {
  origin: { x: number; y: number }
  size: { width: number; height: number }
}

/** Annotation subtype discriminator (mirrors EmbedPDF's `PdfAnnotationSubtype`). */
export type MeldAnnotationType =
  | 'highlight'
  | 'underline'
  | 'strikeout'
  | 'squiggly'
  | 'free-text'
  | 'ink'
  | 'sticky-note'
  | 'stamp'
  | 'signature'
  | 'redaction'
  | 'square'
  | 'circle'
  | 'polygon'
  | 'polyline'
  | 'line'

/** Shared base for all annotation objects. */
export interface MeldAnnotationBase {
  /** Stable UUID (v4) generated by EmbedPDF or supplied by the caller. */
  id: string
  type: MeldAnnotationType
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
export interface MeldHighlightAnnotation extends MeldAnnotationBase {
  type: 'highlight'
  segmentRects: PdfRect[]
  color: string
  opacity: number
  selectedText?: string
}

/** Sticky-note comment anchored to a point on the page. */
export interface MeldStickyNoteAnnotation extends MeldAnnotationBase {
  type: 'sticky-note'
  contents: string
  color?: string
}

/** Free-text typewriter annotation. */
export interface MeldFreeTextAnnotation extends MeldAnnotationBase {
  type: 'free-text'
  contents: string
  fontSize: number
  fontColor: string
  fontFamily?: string
  backgroundColor?: string
  opacity: number
}

/** Freehand ink annotation (multiple strokes). */
export interface MeldInkAnnotation extends MeldAnnotationBase {
  type: 'ink'
  inkList: { points: { x: number; y: number }[] }[]
  strokeWidth: number
  color: string
  opacity: number
}

/** Stamp annotation. */
export interface MeldStampAnnotation extends MeldAnnotationBase {
  type: 'stamp'
  name?: string
  subject?: string
}

/** Signature annotation. */
export interface MeldSignatureAnnotation extends MeldAnnotationBase {
  type: 'signature'
  imageDataUrl?: string
}

/** Redaction annotation (pending or applied). */
export interface MeldRedactionAnnotation extends MeldAnnotationBase {
  type: 'redaction'
  pending: boolean
  fillColor?: string
}

/** Discriminated union of all annotation shapes. */
export type MeldAnnotation =
  | MeldHighlightAnnotation
  | MeldStickyNoteAnnotation
  | MeldFreeTextAnnotation
  | MeldInkAnnotation
  | MeldStampAnnotation
  | MeldSignatureAnnotation
  | MeldRedactionAnnotation

/** Input for `createAnnotation` — `id` is optional; the viewer assigns one if omitted. */
export type CreateAnnotationInput = Omit<MeldAnnotation, 'id' | 'createdAt' | 'modifiedAt'> &
  Partial<Pick<MeldAnnotation, 'id'>>

/** Item passed to `importAnnotations`. Includes optional binary context for stamps/signatures. */
export interface AnnotationTransferItem {
  annotation: MeldAnnotation
  ctx?: { data: ArrayBuffer; mimeType?: string }
}

/** Filter passed to `getAnnotations` / `exportAnnotations`. */
export interface AnnotationFilter {
  pageIndex?: number
  types?: MeldAnnotationType[]
  authorId?: string
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Threaded comments overlay                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

/** A reply within an annotation thread. */
export interface MeldReply {
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
export interface MeldThread {
  annotationId: string
  isResolved: boolean
  resolvedByUserId?: string
  resolvedAt?: string
  replies: MeldReply[]
}

/* ────────────────────────────────────────────────────────────────────────── */
/* User identity (for comment authorship)                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/** Minimal user shape used for comment authorship. */
export interface MeldUser {
  id: string
  name: string
  email?: string
  avatarUrl?: string
}

/* ────────────────────────────────────────────────────────────────────────── */
/* MeldViewer component props                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

/** Permissions shape applied to the viewer (typically computed per-route by the consumer). */
export interface MeldViewerPermissions {
  allowAnnotations?: boolean
  allowDownload?: boolean
  allowPrint?: boolean
  allowRedaction?: boolean
  allowSignature?: boolean
}

/**
 * Props for the top-level `MeldViewer` component.
 *
 * See `getting-started.mdx` in the docs site for examples.
 */
export interface MeldViewerProps {
  /** Document source. Required. */
  source: DocumentSource
  /** MIME type override (e.g., `'application/pdf'`). Auto-detected from `source` if omitted. */
  mimeType?: string
  /** Custom download URL — overrides the source for download/print. */
  downloadUrl?: string
  /** Stable identifier used for annotation namespacing. */
  documentId?: string

  /** URL where `pdfium.wasm` is served from. Required for PDF rendering. */
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
  features?: MeldViewerFeatures
  /** Per-plugin configuration. */
  featureConfig?: MeldViewerFeatureConfig
  /** Toolbar groups, hidden buttons, custom buttons. */
  toolbar?: MeldViewerToolbarConfig

  /** Current authenticated user (for annotation authorship). */
  currentUser?: MeldUser

  /** Annotations to preload on mount. */
  initialAnnotations?: MeldAnnotation[]
  /** Threaded-comment metadata to preload on mount. */
  initialThreads?: MeldThread[]

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
export interface MeldDocumentInfo {
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
 * The programmatic API exposed by `MeldViewer` via `defineExpose`.
 *
 * Capture via a template ref typed as `MeldViewerInstance`:
 * ```ts
 * const viewer = ref<MeldViewerInstance | null>(null)
 * await viewer.value?.loadAnnotations(saved)
 * ```
 */
export interface MeldViewerInstance {
  // Document
  getDocumentInfo(): MeldDocumentInfo | null
  getCurrentPage(): number
  goToPage(page: number): void

  // Annotation read
  getAnnotations(filter?: AnnotationFilter): MeldAnnotation[]
  getThread(annotationId: string): MeldThread | null

  // Annotation CRUD
  loadAnnotations(annotations: MeldAnnotation[]): Promise<void>
  createAnnotation(input: CreateAnnotationInput): Promise<MeldAnnotation>
  updateAnnotation(id: string, patch: Partial<MeldAnnotation>): Promise<void>
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
  loadThreads(threads: MeldThread[]): void
  addReply(annotationId: string, content: string): Promise<MeldReply>
  resolveAnnotation(annotationId: string, resolved: boolean): Promise<void>
  deleteReply(annotationId: string, replyId: string): Promise<void>
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Events                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

/** Payload for `annotation-updated` — includes only changed fields. */
export interface AnnotationUpdatePayload {
  annotation: MeldAnnotation
  patch: Partial<MeldAnnotation>
}

/** Payload for `thread-update`. */
export interface ThreadUpdatePayload {
  thread: MeldThread
  /** Type of mutation that triggered the update. */
  action: 'reply-added' | 'reply-deleted' | 'resolved' | 'unresolved'
}

/**
 * Events emitted by `MeldViewer`. Consumed via `v-on:event-name` on the component.
 *
 * Events fire only for changes that have been committed to the engine
 * (i.e., not in-flight drag/resize states).
 */
export interface MeldViewerEmits {
  (e: 'document-loaded', payload: MeldDocumentInfo): void
  (e: 'document-error', payload: { error: string }): void
  (e: 'page-change', payload: { page: number }): void
  (e: 'zoom-change', payload: { scale: number }): void
  (e: 'rotation-change', payload: { rotation: number }): void
  (e: 'view-mode-change', payload: { viewMode: ViewMode }): void
  (
    e: 'panel-toggle',
    payload: { panel: 'outline' | 'thumbnails' | 'comments' | 'search'; open: boolean },
  ): void

  (e: 'annotation-created', payload: { annotation: MeldAnnotation }): void
  (e: 'annotation-updated', payload: AnnotationUpdatePayload): void
  (e: 'annotation-deleted', payload: { annotationId: string }): void
  (e: 'annotation-selected', payload: { annotation: MeldAnnotation | null }): void

  (e: 'thread-update', payload: ThreadUpdatePayload): void
}
