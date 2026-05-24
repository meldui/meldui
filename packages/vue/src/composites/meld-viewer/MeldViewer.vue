<script setup lang="ts">
/**
 * MeldViewer — top-level entry component.
 *
 * Dispatches to a type-specific renderer (PDF / image / text / markdown).
 * The PDF renderer is lazy-loaded so non-PDF documents do not pay the EmbedPDF
 * / PDFium WASM cost.
 *
 * For PDFs, view-control toolbar events are forwarded to the renderer's
 * exposed controller. For non-PDF types, the toolbar's local state (scale /
 * rotation) drives the renderer props directly.
 *
 * Side panels (outline, thumbnails) for PDFs live inside the renderer (next to
 * the EmbedPDF tree). MeldViewer holds the open-state and forwards it as a prop.
 *
 * Keyboard shortcuts and touch gestures are wired here via the dedicated
 * composables (`useMeldKeyboard`, `useMeldTouch`).
 */
import { computed, defineAsyncComponent, onMounted, provide, ref, watch } from 'vue'
import { MELD_THREADS_INJECT_KEY } from './injectionKeys'
import { resolveFeatures } from './plugins/pluginRegistry'
import { detectDocumentType } from './utils/documentType'
import type { MeldCommandCallbacks } from './composables/useMeldCommands'
import { useMeldTouch } from './composables/useMeldTouch'
import { useAnnotationThreads } from './composables/useAnnotationThreads'
import { printImage, printText, resolveSourceToText } from './composables/useMeldPrint'
import { sourceToUrl } from './utils/documentType'
import MeldViewerToolbar from './MeldViewerToolbar.vue'
import MeldImageRenderer from './renderers/MeldImageRenderer.vue'
import MeldTextRenderer from './renderers/MeldTextRenderer.vue'
import MeldMarkdownRenderer from './renderers/MeldMarkdownRenderer.vue'
import MeldSearchPopover from './MeldSearchPopover.vue'
import MeldViewerSidePanel from './MeldViewerSidePanel.vue'
import MeldAnnotationsPanel from './panels/MeldAnnotationsPanel.vue'
import { cn } from '../../lib/utils'
import type {
  AnnotationFilter,
  AnnotationTransferItem,
  CreateAnnotationInput,
  DocumentType,
  InteractionMode,
  MeldAnnotation,
  MeldReply,
  MeldThread,
  MeldViewerInstance,
  MeldViewerProps,
  ViewMode,
} from './types'

const props = withDefaults(defineProps<MeldViewerProps>(), {
  features: () => ({}),
  featureConfig: () => ({}),
  toolbar: () => ({}),
  initialPage: 1,
  initialScale: 'fit-width',
  initialViewMode: 'continuous',
  initialAnnotations: () => [],
  initialThreads: () => [],
  worker: true,
})

const emit = defineEmits<{
  (e: 'page-change', payload: { page: number }): void
  (e: 'zoom-change', payload: { scale: number }): void
  (e: 'rotation-change', payload: { rotation: number }): void
  (e: 'view-mode-change', payload: { viewMode: ViewMode }): void
  (e: 'document-loaded', payload: { pages: number; title: string | null }): void
  (e: 'document-error', payload: { error: string }): void
  (
    e: 'panel-toggle',
    payload: { panel: 'outline' | 'thumbnails' | 'comments' | 'search'; open: boolean },
  ): void
  (e: 'annotation-created', payload: { annotation: MeldAnnotation }): void
  (
    e: 'annotation-updated',
    payload: { annotation: MeldAnnotation; patch: Partial<MeldAnnotation> },
  ): void
  (e: 'annotation-deleted', payload: { annotationId: string }): void
  (e: 'annotation-selected', payload: { annotation: MeldAnnotation | null }): void
  (
    e: 'thread-update',
    payload: {
      thread: MeldThread
      action: 'reply-added' | 'reply-deleted' | 'resolved' | 'unresolved'
    },
  ): void
}>()

// Lazy-load the PDF renderer so non-PDF consumers don't pull in EmbedPDF.
const MeldPdfRenderer = defineAsyncComponent(() => import('./renderers/MeldPdfRenderer.vue'))

const documentType = computed<DocumentType>(() => detectDocumentType(props.source, props.mimeType))
const isPdf = computed(() => documentType.value === 'pdf')
const resolvedFeatures = computed(() => resolveFeatures(props.features))

// View state — for PDFs this is driven by the renderer's controller events.
// For non-PDFs this is the source of truth (toolbar mutates it directly).
const currentPage = ref(props.initialPage)
const totalPages = ref(1)
const currentScale = ref(typeof props.initialScale === 'number' ? props.initialScale : 1)
const currentRotation = ref(0)
const viewMode = ref<ViewMode>(props.initialViewMode)
const interactionMode = ref<InteractionMode>('text')
const isFullscreen = ref(false)

const isOutlineOpen = ref(false)
const isThumbnailsOpen = ref(false)
const isCommentsOpen = ref(false)
const isSearchOpen = ref(false)
const activeAnnotationTool = ref<string | null>(null)

// Search state — forwarded from the controller via the PDF renderer
const searchTotal = ref(0)
const searchActiveIndex = ref(-1)
const searchMatchCase = ref(false)
const searchWholeWord = ref(false)

// Renderer ref — typed surface for the methods we call.
interface PdfRendererInstance {
  zoomIn: () => void
  zoomOut: () => void
  rotateClockwise: () => void
  rotateCounterClockwise: () => void
  setViewMode: (mode: ViewMode) => void
  setInteractionMode: (mode: InteractionMode) => void
  toggleFullscreen: (targetElement?: string) => void
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  requestZoom: (level: number | 'fit-page' | 'fit-width' | 'actual-size' | 'automatic') => void
  searchKeyword: (keyword: string) => void
  nextMatch: () => void
  previousMatch: () => void
  setMatchCase: (enabled: boolean) => void
  setWholeWord: (enabled: boolean) => void
  clearSearch: () => void
  downloadDocument: () => void
  saveAsCopy: () => Promise<ArrayBuffer>
  printDocument: () => Promise<void>
  setActiveTool: (toolId: string | null) => void
  createAnnotation: (input: CreateAnnotationInput) => MeldAnnotation
  updateAnnotation: (id: string, patch: Partial<MeldAnnotation>) => void
  deleteAnnotation: (id: string) => void
  selectAnnotationById: (id: string) => void
  deselectAll: () => void
  getAnnotations: (filter?: AnnotationFilter) => MeldAnnotation[]
  importAnnotations: (items: AnnotationTransferItem[]) => void
  exportAnnotations: (filter?: AnnotationFilter) => Promise<AnnotationTransferItem[]>
  loadAnnotations: (annotations: MeldAnnotation[]) => void
  undoLastAction: () => void
  redoLastAction: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}
const pdfRendererRef = ref<PdfRendererInstance | null>(null)

/**
 * Search surface implemented by every renderer that supports text search
 * (PDF via EmbedPDF, plus text & markdown via `useMeldTextSearch`). Keeps
 * the dispatch in `handleSearchInput` etc. polymorphic over document type.
 */
interface SearchableRenderer {
  searchKeyword: (keyword: string) => void
  nextMatch: () => void
  previousMatch: () => void
  setMatchCase: (enabled: boolean) => void
  setWholeWord: (enabled: boolean) => void
  clearSearch: () => void
}

const markdownRendererRef = ref<
  (SearchableRenderer & { printDocument: () => Promise<void> }) | null
>(null)
const textRendererRef = ref<SearchableRenderer | null>(null)

function activeSearchRenderer(): SearchableRenderer | null {
  if (isPdf.value) return pdfRendererRef.value
  if (documentType.value === 'text') return textRendererRef.value
  if (documentType.value === 'markdown') return markdownRendererRef.value
  return null
}

const rootEl = ref<HTMLElement | null>(null)

// ─────────────────────────────────────────────────────────────────────────
// Annotation + thread state
// ─────────────────────────────────────────────────────────────────────────
//
// Authoritative copy of all annotations is stored here so the comments
// panel + programmatic getters work without re-querying the engine.
// Updates flow from the renderer's onAnnotationEvent → MeldViewer's
// annotation-created / -updated / -deleted handlers.

/**
 * `annotations` is populated by the EmbedPDF plugin's create events — not
 * by mirroring `initialAnnotations` directly. The plugin assigns its own
 * UUIDs during `importAnnotations`, so trusting the plugin as the source
 * of truth avoids duplicate rows (one with the consumer-provided seed id,
 * one with the plugin-assigned id) and ensures the panel id matches the
 * id the plugin reports when the user selects an annotation on the page.
 *
 * Initial seeding happens via `renderer.loadAnnotations(initialAnnotations)`
 * in the watcher below; the plugin then replays `create` events that flow
 * back through `handleRendererAnnotationCreated`.
 */
const annotations = ref<MeldAnnotation[]>([])
const selectedAnnotation = ref<MeldAnnotation | null>(null)
/**
 * When the user clicks "Add comment" on a highlight's floating tooltip we
 * stash the annotation id here so the annotations panel can auto-open its
 * row and focus the inline reply form. Cleared by the panel once it's
 * consumed the focus.
 */
const focusedAnnotationId = ref<string | null>(null)

/**
 * Comment-add flow state (doqo-style "single modal that moves").
 *
 * `pendingCommentMode` is on while the user has activated the comment tool
 * but hasn't yet committed a comment. While on, MeldPdfRenderer captures
 * page clicks instead of forwarding to EmbedPDF and emits
 * `comment-position-picked`. We stash the click coord here and render a
 * single `<MeldCommentForm>` at the spot — clicking elsewhere just updates
 * the same form's coord. Submit calls `createAnnotation`; cancel/Escape
 * clears the ref.
 */
const pendingCommentMode = ref(false)
const pendingCommentPosition = ref<{
  pageIndex: number
  x: number
  y: number
  pageWidth: number
  pageHeight: number
} | null>(null)

const threads = useAnnotationThreads()
threads.loadThreads(props.initialThreads)

// Surface thread changes upward.
threads.subscribe((payload) => emit('thread-update', payload))

// When the consumer mutates `initialAnnotations` later (e.g. swapping
// documents), re-seed through the renderer rather than overwriting
// `annotations.value`. The plugin's create events will repopulate the panel.
watch(
  () => props.initialAnnotations,
  (next) => {
    annotations.value = []
    if (next.length > 0 && pdfRendererRef.value) {
      pdfRendererRef.value.loadAnnotations(next)
    }
  },
)
watch(
  () => props.initialThreads,
  (next) => threads.loadThreads(next),
)

// Once the PDF renderer mounts (lazy), push `initialAnnotations` into it.
// The plugin replays `create` events for each loaded annotation, which fill
// `annotations.value` via `handleRendererAnnotationCreated`.
watch(pdfRendererRef, (renderer) => {
  if (renderer && props.initialAnnotations.length > 0) {
    renderer.loadAnnotations(props.initialAnnotations)
  }
})

// ─────────────────────────────────────────────────────────────────────────
// Toolbar handlers — forward to the renderer controller for PDFs;
// mutate local state for non-PDF renderers.
// ─────────────────────────────────────────────────────────────────────────

function handleZoomIn() {
  if (isPdf.value) {
    pdfRendererRef.value?.zoomIn()
  } else {
    currentScale.value = Math.min(currentScale.value * 1.1, 5)
  }
}
function handleZoomOut() {
  if (isPdf.value) {
    pdfRendererRef.value?.zoomOut()
  } else {
    currentScale.value = Math.max(currentScale.value / 1.1, 0.25)
  }
}
function handleRotate(direction: 'cw' | 'ccw') {
  if (isPdf.value) {
    if (direction === 'cw') pdfRendererRef.value?.rotateClockwise()
    else pdfRendererRef.value?.rotateCounterClockwise()
  } else {
    const next = (currentRotation.value + (direction === 'cw' ? 90 : -90) + 360) % 360
    currentRotation.value = next
  }
}
function handleViewModeChange(mode: ViewMode) {
  viewMode.value = mode
  if (isPdf.value) pdfRendererRef.value?.setViewMode(mode)
  emit('view-mode-change', { viewMode: mode })
}
function handleInteractionModeChange(mode: InteractionMode) {
  interactionMode.value = mode
  if (isPdf.value) pdfRendererRef.value?.setInteractionMode(mode)
}
function handlePageChange(page: number) {
  if (isPdf.value) {
    pdfRendererRef.value?.goToPage(page)
  } else {
    currentPage.value = page
  }
  emit('page-change', { page })
}
function handleTogglePanel(panel: 'outline' | 'thumbnails' | 'comments' | 'search') {
  switch (panel) {
    case 'outline':
      isOutlineOpen.value = !isOutlineOpen.value
      emit('panel-toggle', { panel, open: isOutlineOpen.value })
      break
    case 'thumbnails':
      isThumbnailsOpen.value = !isThumbnailsOpen.value
      emit('panel-toggle', { panel, open: isThumbnailsOpen.value })
      break
    case 'comments':
      isCommentsOpen.value = !isCommentsOpen.value
      emit('panel-toggle', { panel, open: isCommentsOpen.value })
      break
    case 'search':
      isSearchOpen.value = !isSearchOpen.value
      if (!isSearchOpen.value) pdfRendererRef.value?.clearSearch()
      emit('panel-toggle', { panel, open: isSearchOpen.value })
      break
  }
}
function handleSetTool(tool: string | null) {
  // The "comment" tool no longer activates EmbedPDF's auto-create sticky-note
  // path. Instead we flip MeldViewer into `pendingCommentMode` and capture
  // the next page click ourselves so we can render a single comment-form
  // anchored to the click (doqo's pattern). Other tools (highlight, etc.)
  // still go through the EmbedPDF annotation capability unchanged.
  if (tool === 'comment') {
    activeAnnotationTool.value = pendingCommentMode.value ? null : 'comment'
    pendingCommentMode.value = !pendingCommentMode.value
    if (!pendingCommentMode.value) pendingCommentPosition.value = null
    // Make sure no other EmbedPDF tool is also active.
    if (isPdf.value) pdfRendererRef.value?.setActiveTool(null)
    return
  }
  // Switching to a different tool cancels any pending comment.
  if (pendingCommentMode.value) {
    pendingCommentMode.value = false
    pendingCommentPosition.value = null
  }
  activeAnnotationTool.value = tool
  if (isPdf.value) pdfRendererRef.value?.setActiveTool(tool)
}
function handleDownload() {
  // Prefer a consumer-provided URL (e.g., re-encoded copy) before falling back
  // to the EmbedPDF Export plugin.
  if (props.downloadUrl) {
    const a = document.createElement('a')
    a.href = props.downloadUrl
    a.download = ''
    a.click()
    return
  }
  if (isPdf.value) pdfRendererRef.value?.downloadDocument()
}
async function handlePrint() {
  // PDF prints go through the EmbedPDF print plugin, which auto-injects a
  // hidden `<PrintFrame>` and bakes current annotations into the print job
  // (`includeAnnotations` defaults to `true`). Image / text / markdown have
  // no plugin equivalent — they still use our local iframe-print helpers.
  try {
    if (isPdf.value && pdfRendererRef.value) {
      await pdfRendererRef.value.printDocument()
      return
    }
    if (documentType.value === 'image') {
      const { url, revoke } = sourceToUrl(props.source)
      try {
        await printImage(url)
      } finally {
        revoke()
      }
      return
    }
    if (documentType.value === 'text') {
      const text = await resolveSourceToText(props.source)
      await printText(text)
      return
    }
    if (documentType.value === 'markdown') {
      if (markdownRendererRef.value) {
        await markdownRendererRef.value.printDocument()
      }
      return
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to print document'
    // eslint-disable-next-line no-console
    console.error('[MeldViewer] print failed:', message)
  }
}
function handleFullscreen() {
  // Always fullscreen the MeldViewer root so the toolbar stays visible. The
  // FullscreenPluginPackage auto-mounts a `<FullscreenProvider>` wrapper
  // *inside* the EmbedPDF tree (below our toolbar), so routing through its
  // `toggleFullscreen()` would only fullscreen the renderer. Use the native
  // API on the root element instead; the plugin's `fullscreenchange`
  // listener keeps its `isFullscreen` state in sync, so toolbar bindings
  // continue to reflect the live state.
  if (!document.fullscreenElement) rootEl.value?.requestFullscreen()
  else document.exitFullscreen()
}

// ─────────────────────────────────────────────────────────────────────────
// Search popover handlers
// ─────────────────────────────────────────────────────────────────────────

function handleSearchInput(keyword: string) {
  activeSearchRenderer()?.searchKeyword(keyword)
}
function handleNextMatch() {
  activeSearchRenderer()?.nextMatch()
}
function handlePreviousMatch() {
  activeSearchRenderer()?.previousMatch()
}
function handleSetMatchCase(enabled: boolean) {
  activeSearchRenderer()?.setMatchCase(enabled)
}
function handleSetWholeWord(enabled: boolean) {
  activeSearchRenderer()?.setWholeWord(enabled)
}
function handleCloseSearch() {
  isSearchOpen.value = false
  activeSearchRenderer()?.clearSearch()
  emit('panel-toggle', { panel: 'search', open: false })
}

// ─────────────────────────────────────────────────────────────────────────
// Renderer → MeldViewer state updates (PDF only)
// ─────────────────────────────────────────────────────────────────────────

function handleRendererPageChange(payload: { currentPage: number; totalPages: number }) {
  currentPage.value = payload.currentPage
  totalPages.value = payload.totalPages
  emit('page-change', { page: payload.currentPage })
}
function handleRendererZoomChange(payload: { scale: number }) {
  currentScale.value = payload.scale
  emit('zoom-change', { scale: payload.scale })
}
function handleRendererRotationChange(payload: { rotation: number }) {
  currentRotation.value = payload.rotation
  emit('rotation-change', { rotation: payload.rotation })
}
function handleRendererViewModeChange(payload: { viewMode: ViewMode }) {
  viewMode.value = payload.viewMode
  emit('view-mode-change', { viewMode: payload.viewMode })
}
function handleRendererInteractionModeChange(payload: { mode: InteractionMode }) {
  interactionMode.value = payload.mode
}
function handleRendererFullscreenChange(payload: { isFullscreen: boolean }) {
  isFullscreen.value = payload.isFullscreen
}
function handleRendererSearchStateChange(payload: {
  total: number
  activeResultIndex: number
  matchCase: boolean
  wholeWord: boolean
}) {
  searchTotal.value = payload.total
  searchActiveIndex.value = payload.activeResultIndex
  searchMatchCase.value = payload.matchCase
  searchWholeWord.value = payload.wholeWord
}

// Annotation events from the renderer — keep our authoritative list in sync.
function handleRendererAnnotationCreated(payload: { annotation: MeldAnnotation }) {
  // Avoid duplicates if we're hearing back about an annotation we just pushed in.
  if (!annotations.value.some((a) => a.id === payload.annotation.id)) {
    annotations.value = [...annotations.value, payload.annotation]
  }
  emit('annotation-created', payload)
}
function handleRendererAnnotationUpdated(payload: {
  annotation: MeldAnnotation
  patch: Partial<MeldAnnotation>
}) {
  annotations.value = annotations.value.map((a) =>
    a.id === payload.annotation.id ? payload.annotation : a,
  )
  emit('annotation-updated', payload)
}
function handleRendererAnnotationDeleted(payload: { annotationId: string }) {
  annotations.value = annotations.value.filter((a) => a.id !== payload.annotationId)
  threads.removeThread(payload.annotationId)
  emit('annotation-deleted', payload)
}
function handleRendererAnnotationSelected(payload: { annotation: MeldAnnotation | null }) {
  selectedAnnotation.value = payload.annotation
  emit('annotation-selected', payload)
  // Clicking a comment-pin on the page should surface that comment in the
  // annotations panel (doqo's behaviour). For highlights we leave the
  // panel state alone — the floating tooltip handles their UX in place.
  if (payload.annotation?.type === 'sticky-note' && resolvedFeatures.value.commentThreads) {
    focusedAnnotationId.value = payload.annotation.id
    if (!isCommentsOpen.value) {
      isCommentsOpen.value = true
      emit('panel-toggle', { panel: 'comments', open: true })
    }
  }
}
function handleRendererActiveToolChange(payload: { toolId: string | null }) {
  activeAnnotationTool.value = payload.toolId
}
/**
 * Inline reply submitted from the highlight's floating tooltip
 * (`MeldHighlightTooltip` add-reply event). Posts to the same thread store
 * the side panel reads, then deselects the annotation so the tooltip closes.
 *
 * The side panel does **not** auto-open here — the inline tooltip is the
 * primary surface for adding a highlight comment now. Users open the side
 * panel from the toolbar Annotations button when they want the broader
 * thread view.
 */
function handleHighlightReplyAdded(payload: { annotationId: string; content: string }) {
  const user = props.currentUser
  threads.addReply({
    annotationId: payload.annotationId,
    authorUserId: user?.id ?? 'anonymous',
    authorName: user?.name,
    authorAvatarUrl: user?.avatarUrl,
    content: payload.content,
  })
  pdfRendererRef.value?.deselectAll()
}
/**
 * View-thread icon clicked on a highlight's floating tooltip. Open the
 * annotations side panel (if closed), set `focusedAnnotationId` so the
 * matching row scrolls into view and expands, then deselect the
 * highlight so the tooltip unmounts and focus moves to the panel. This
 * mirrors the sticky-note auto-open in `handleRendererAnnotationSelected`
 * but is triggered explicitly by the user rather than by selection.
 */
function handleHighlightThreadOpened(payload: { annotationId: string }) {
  if (!resolvedFeatures.value.commentThreads) return
  focusedAnnotationId.value = payload.annotationId
  if (!isCommentsOpen.value) {
    isCommentsOpen.value = true
    emit('panel-toggle', { panel: 'comments', open: true })
  }
  pdfRendererRef.value?.deselectAll()
}
/** Renderer captured a click while the comment tool is active. */
function handleCommentPositionPicked(payload: {
  pageIndex: number
  x: number
  y: number
  pageWidth: number
  pageHeight: number
}) {
  pendingCommentPosition.value = payload
}
/** Comment form submit → create the sticky-note via the programmatic API. */
async function handleCommentFormSubmit(content: string) {
  const pos = pendingCommentPosition.value
  if (!pos) return
  // EmbedPDF expects `rect` in PDF coords; we passed screen pixels because
  // the page wrapper at scale=1 maps 1:1 to PDF points. For other zoom
  // levels we'd convert by the current scale here — TODO when we
  // generalise to non-100% creation.
  if (isPdf.value && pdfRendererRef.value) {
    await pdfRendererRef.value.createAnnotation({
      type: 'sticky-note',
      pageIndex: pos.pageIndex,
      rect: { origin: { x: pos.x, y: pos.y }, size: { width: 24, height: 24 } },
      contents: content,
      author: props.currentUser?.name,
    })
  }
  cancelPendingComment()
}
/** Cancel the pending comment (Escape, outside cancel, or after submit). */
function cancelPendingComment() {
  pendingCommentPosition.value = null
  pendingCommentMode.value = false
  activeAnnotationTool.value = null
}

// Thread-panel handlers — wire to the threads composable.
function handleAddReply(payload: { annotationId: string; content: string }) {
  const user = props.currentUser
  threads.addReply({
    annotationId: payload.annotationId,
    authorUserId: user?.id ?? 'anonymous',
    authorName: user?.name,
    authorAvatarUrl: user?.avatarUrl,
    content: payload.content,
  })
}
function handleDeleteReply(payload: { annotationId: string; replyId: string }) {
  threads.deleteReply(payload.annotationId, payload.replyId)
}
function handleToggleResolved(payload: { annotationId: string; resolved: boolean }) {
  threads.setResolved(payload.annotationId, payload.resolved, props.currentUser?.id)
}
function handleNavigateToAnnotation(annotation: MeldAnnotation) {
  if (isPdf.value) {
    pdfRendererRef.value?.goToPage(annotation.pageIndex + 1)
    pdfRendererRef.value?.selectAnnotationById(annotation.id)
  }
}
/**
 * "Edit" pressed in a panel row's three-dot menu. We update the annotation's
 * `contents` field — same field for highlights (note text), sticky-notes,
 * and free-text — through the renderer, which routes to `updateAnnotation`
 * on the EmbedPDF annotation capability.
 */
function handlePanelUpdate(payload: { annotationId: string; patch: { contents: string } }) {
  if (isPdf.value) {
    pdfRendererRef.value?.updateAnnotation(
      payload.annotationId,
      payload.patch as Partial<MeldAnnotation>,
    )
  }
}
/** "Delete" pressed in a panel row's three-dot menu. */
function handlePanelDelete(payload: { annotationId: string }) {
  if (isPdf.value) {
    pdfRendererRef.value?.deleteAnnotation(payload.annotationId)
  }
}

// Thread list reactive snapshot for the panel (Map → array).
const threadList = computed<MeldThread[]>(() => Array.from(threads.threads.values()))

/**
 * Inject the live thread map into descendants so the custom annotation
 * renderer (MeldCommentMarker — registered deep inside the EmbedPDF tree
 * via the renderer registry) can read reply counts and render the badge.
 */
const threadsByAnnotationId = computed<ReadonlyMap<string, MeldThread>>(
  () => new Map(threads.threads.entries()),
)
provide(MELD_THREADS_INJECT_KEY, threadsByAnnotationId)

// ─────────────────────────────────────────────────────────────────────────
// Keyboard + touch
// ─────────────────────────────────────────────────────────────────────────

/**
 * Command catalog passed to `MeldPdfRenderer → MeldPdfController`. The
 * controller registers each entry with `@embedpdf/plugin-commands`, which
 * owns the shortcut registry. `useCommandsKeyboard` (inside the controller)
 * bridges `document.keydown` → `getCommandByShortcut → execute`.
 */
const commandCallbacks: MeldCommandCallbacks = {
  prevPage: () => handlePageChange(Math.max(1, currentPage.value - 1)),
  nextPage: () => handlePageChange(Math.min(totalPages.value, currentPage.value + 1)),
  firstPage: () => handlePageChange(1),
  lastPage: () => handlePageChange(totalPages.value),
  zoomIn: handleZoomIn,
  zoomOut: handleZoomOut,
  resetZoom: () => {
    if (isPdf.value) pdfRendererRef.value?.requestZoom('actual-size')
    else currentScale.value = 1
  },
  rotateClockwise: () => handleRotate('cw'),
  rotateCounterClockwise: () => handleRotate('ccw'),
  toggleFullscreen: handleFullscreen,
  openSearch: () => {
    if (!resolvedFeatures.value.search) return
    isSearchOpen.value = true
    emit('panel-toggle', { panel: 'search', open: true })
  },
  escape: () => {
    if (isSearchOpen.value) handleCloseSearch()
    else if (isOutlineOpen.value) isOutlineOpen.value = false
    else if (isThumbnailsOpen.value) isThumbnailsOpen.value = false
    else if (isCommentsOpen.value) isCommentsOpen.value = false
  },
  toggleComments: () => {
    if (resolvedFeatures.value.commentThreads) handleTogglePanel('comments')
  },
  toggleOutline: () => {
    if (resolvedFeatures.value.outline && isPdf.value) handleTogglePanel('outline')
  },
  toggleThumbnails: () => {
    if (resolvedFeatures.value.thumbnails && isPdf.value) handleTogglePanel('thumbnails')
  },
  undo: () => {
    if (isPdf.value) pdfRendererRef.value?.undoLastAction()
  },
  redo: () => {
    if (isPdf.value) pdfRendererRef.value?.redoLastAction()
  },
}

useMeldTouch(
  rootEl,
  {
    onSwipeLeft: () => {
      if (viewMode.value !== 'continuous') {
        handlePageChange(Math.min(totalPages.value, currentPage.value + 1))
      }
    },
    onSwipeRight: () => {
      if (viewMode.value !== 'continuous') {
        handlePageChange(Math.max(1, currentPage.value - 1))
      }
    },
    onDoubleTap: () => {
      if (isPdf.value) pdfRendererRef.value?.requestZoom('fit-width')
    },
  },
  {
    enabled: resolvedFeatures.value.touchGestures,
  },
)

// ─────────────────────────────────────────────────────────────────────────
// Programmatic API — full implementation
// ─────────────────────────────────────────────────────────────────────────
//
// Methods are non-blocking and safe to call before the engine is ready.
// PDF-only operations no-op for non-PDF documents.

defineExpose<MeldViewerInstance>({
  getDocumentInfo: () =>
    totalPages.value > 0 ? { pageCount: totalPages.value, title: null } : null,
  getCurrentPage: () => currentPage.value,
  goToPage: (page) => handlePageChange(page),

  getAnnotations: (filter?: AnnotationFilter): MeldAnnotation[] => {
    let result = annotations.value
    if (filter?.pageIndex !== undefined)
      result = result.filter((a) => a.pageIndex === filter.pageIndex)
    if (filter?.types) {
      const set = new Set(filter.types)
      result = result.filter((a) => set.has(a.type))
    }
    if (filter?.authorId) result = result.filter((a) => a.author === filter.authorId)
    return result
  },
  getThread: (annotationId: string) => threads.getThread(annotationId),

  loadAnnotations: async (incoming: MeldAnnotation[]) => {
    // Reset local state and let the plugin's create events repopulate it —
    // the plugin assigns its own IDs so we trust it as the source of truth.
    annotations.value = []
    if (isPdf.value && pdfRendererRef.value) {
      pdfRendererRef.value.loadAnnotations(incoming)
    } else {
      // No PDF renderer (image / text / markdown): just store the seed.
      annotations.value = [...incoming]
    }
  },

  createAnnotation: async (input: CreateAnnotationInput): Promise<MeldAnnotation> => {
    if (isPdf.value && pdfRendererRef.value) {
      const created = pdfRendererRef.value.createAnnotation(input)
      // The renderer's onAnnotationEvent will push this into `annotations` —
      // return synchronously to the caller so AI flows can chain immediately.
      return created
    }
    const id = input.id ?? crypto.randomUUID()
    const annotation = { ...input, id } as MeldAnnotation
    annotations.value = [...annotations.value, annotation]
    return annotation
  },

  updateAnnotation: async (id: string, patch: Partial<MeldAnnotation>) => {
    if (isPdf.value && pdfRendererRef.value) {
      pdfRendererRef.value.updateAnnotation(id, patch)
      return
    }
    annotations.value = annotations.value.map((a) =>
      a.id === id ? ({ ...a, ...patch } as MeldAnnotation) : a,
    )
  },

  deleteAnnotation: async (id: string) => {
    if (isPdf.value && pdfRendererRef.value) {
      pdfRendererRef.value.deleteAnnotation(id)
      return
    }
    annotations.value = annotations.value.filter((a) => a.id !== id)
    threads.removeThread(id)
  },

  selectAnnotation: (id: string) => {
    if (isPdf.value && pdfRendererRef.value) {
      pdfRendererRef.value.selectAnnotationById(id)
    }
  },

  navigateToAnnotation: (id: string) => {
    const annotation = annotations.value.find((a) => a.id === id)
    if (!annotation) return
    handleNavigateToAnnotation(annotation)
  },

  importAnnotations: async (items: AnnotationTransferItem[]) => {
    annotations.value = [...annotations.value, ...items.map((i) => i.annotation)]
    if (isPdf.value && pdfRendererRef.value) {
      pdfRendererRef.value.importAnnotations(items)
    }
  },

  exportAnnotations: async (filter?: AnnotationFilter): Promise<AnnotationTransferItem[]> => {
    if (isPdf.value && pdfRendererRef.value) {
      return pdfRendererRef.value.exportAnnotations(filter)
    }
    let result = annotations.value
    if (filter?.pageIndex !== undefined)
      result = result.filter((a) => a.pageIndex === filter.pageIndex)
    return result.map((a) => ({ annotation: a }))
  },

  saveAsCopy: async (): Promise<ArrayBuffer> => {
    if (isPdf.value && pdfRendererRef.value) return pdfRendererRef.value.saveAsCopy()
    return new ArrayBuffer(0)
  },

  undo: () => {
    if (isPdf.value) pdfRendererRef.value?.undoLastAction()
  },
  redo: () => {
    if (isPdf.value) pdfRendererRef.value?.redoLastAction()
  },
  canUndo: () => (isPdf.value ? (pdfRendererRef.value?.canUndo() ?? false) : false),
  canRedo: () => (isPdf.value ? (pdfRendererRef.value?.canRedo() ?? false) : false),

  loadThreads: (incoming: MeldThread[]) => threads.loadThreads(incoming),

  addReply: async (annotationId: string, content: string): Promise<MeldReply> => {
    const user = props.currentUser
    return threads.addReply({
      annotationId,
      authorUserId: user?.id ?? 'anonymous',
      authorName: user?.name,
      authorAvatarUrl: user?.avatarUrl,
      content,
    })
  },

  resolveAnnotation: async (annotationId: string, resolved: boolean) => {
    threads.setResolved(annotationId, resolved, props.currentUser?.id)
  },

  deleteReply: async (annotationId: string, replyId: string) => {
    threads.deleteReply(annotationId, replyId)
  },
})
</script>

<template>
  <div
    ref="rootEl"
    :class="cn('meld-viewer flex h-full flex-col bg-background text-foreground', props.class)"
    data-meld-viewer
  >
    <MeldViewerToolbar
      :features="resolvedFeatures"
      :document-type="documentType"
      :config="toolbar"
      :current-page="currentPage"
      :total-pages="totalPages"
      :current-scale="currentScale"
      :view-mode="viewMode"
      :interaction-mode="interactionMode"
      :is-outline-open="isOutlineOpen"
      :is-thumbnails-open="isThumbnailsOpen"
      :is-comments-open="isCommentsOpen"
      :is-search-open="isSearchOpen"
      :active-annotation-tool="activeAnnotationTool"
      @page-change="handlePageChange"
      @zoom-in="handleZoomIn"
      @zoom-out="handleZoomOut"
      @rotate="handleRotate"
      @view-mode-change="handleViewModeChange"
      @interaction-mode-change="handleInteractionModeChange"
      @toggle-panel="handleTogglePanel"
      @set-annotation-tool="handleSetTool"
      @print="handlePrint"
      @download="handleDownload"
      @fullscreen="handleFullscreen"
    >
      <template #search-content>
        <MeldSearchPopover
          :total="searchTotal"
          :active-result-index="searchActiveIndex"
          :match-case="searchMatchCase"
          :whole-word="searchWholeWord"
          @search="handleSearchInput"
          @next-match="handleNextMatch"
          @previous-match="handlePreviousMatch"
          @set-match-case="handleSetMatchCase"
          @set-whole-word="handleSetWholeWord"
          @close="handleCloseSearch"
        />
      </template>
    </MeldViewerToolbar>

    <div class="flex flex-1 overflow-hidden">
      <div class="relative flex-1 overflow-hidden">
        <MeldPdfRenderer
          v-if="isPdf"
          ref="pdfRendererRef"
          :source="source"
          :wasm-url="wasmUrl"
          :worker="worker"
          :features="resolvedFeatures"
          :feature-config="featureConfig"
          :is-outline-open="isOutlineOpen"
          :is-thumbnails-open="isThumbnailsOpen"
          :current-page="currentPage"
          :command-callbacks="commandCallbacks"
          :keyboard-shortcuts-enabled="resolvedFeatures.keyboardShortcuts"
          :pending-comment-mode="pendingCommentMode"
          :pending-comment-position="pendingCommentPosition"
          @page-change="handleRendererPageChange"
          @zoom-change="handleRendererZoomChange"
          @rotation-change="handleRendererRotationChange"
          @view-mode-change="handleRendererViewModeChange"
          @interaction-mode-change="handleRendererInteractionModeChange"
          @fullscreen-change="handleRendererFullscreenChange"
          @search-state-change="handleRendererSearchStateChange"
          @annotation-created="handleRendererAnnotationCreated"
          @annotation-updated="handleRendererAnnotationUpdated"
          @annotation-deleted="handleRendererAnnotationDeleted"
          @annotation-selected="handleRendererAnnotationSelected"
          @active-annotation-tool-change="handleRendererActiveToolChange"
          @highlight-reply-added="handleHighlightReplyAdded"
          @highlight-thread-opened="handleHighlightThreadOpened"
          @comment-position-picked="handleCommentPositionPicked"
          @comment-submit="handleCommentFormSubmit"
          @comment-cancel="cancelPendingComment"
          @close-outline="isOutlineOpen = false"
          @close-thumbnails="isThumbnailsOpen = false"
        />
        <MeldImageRenderer
          v-else-if="documentType === 'image'"
          :source="source"
          :scale="currentScale"
          :rotation="currentRotation as 0 | 90 | 180 | 270"
        />
        <MeldTextRenderer
          v-else-if="documentType === 'text'"
          ref="textRendererRef"
          :source="source"
          :scale="currentScale"
          @search-state-change="handleRendererSearchStateChange"
        />
        <MeldMarkdownRenderer
          v-else-if="documentType === 'markdown'"
          ref="markdownRendererRef"
          :source="source"
          :scale="currentScale"
          @search-state-change="handleRendererSearchStateChange"
        />
        <div v-else class="flex h-full items-center justify-center text-sm text-muted-foreground">
          Unable to render document of unknown type.
        </div>
      </div>

      <!-- Annotations panel (works for all renderers since it's overlay metadata) -->
      <MeldViewerSidePanel
        v-if="resolvedFeatures.commentThreads"
        title="Annotations"
        position="right"
        width="320px"
        :is-open="isCommentsOpen"
        @close="isCommentsOpen = false"
      >
        <MeldAnnotationsPanel
          :annotations="annotations"
          :threads="threadList"
          :current-user-id="currentUser?.id"
          :focused-annotation-id="focusedAnnotationId"
          :selected-annotation-id="selectedAnnotation?.id ?? null"
          @navigate="handleNavigateToAnnotation"
          @add-reply="handleAddReply"
          @delete-reply="handleDeleteReply"
          @toggle-resolved="handleToggleResolved"
          @update="handlePanelUpdate"
          @delete="handlePanelDelete"
          @focus-consumed="focusedAnnotationId = null"
        />
      </MeldViewerSidePanel>

      <!-- Extra side panels can be slotted in here by consumers -->
      <slot name="side-panels" />
    </div>
  </div>
</template>

<style>
/*
 * Search highlights for text & markdown renderers. Colours match the PDF
 * SearchLayer (`@embedpdf/plugin-search`) so the visual is consistent
 * across document types. Unscoped because the `<mark>` elements are
 * created at runtime by `useMeldTextSearch` and won't carry a Vue scope
 * attribute.
 */
mark.meld-search-highlight {
  background-color: rgba(255, 235, 59, 0.4);
  color: inherit;
  border-radius: 2px;
  padding: 0;
}
mark.meld-search-highlight-current {
  background-color: rgba(255, 152, 0, 0.6);
  outline: 1px solid rgba(255, 152, 0, 0.9);
  outline-offset: -1px;
}
</style>
