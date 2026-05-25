<script setup lang="ts">
/**
 * MeldPdfController — internal slot child that lives inside `<EmbedPDF>` so
 * the EmbedPDF plugin composables can access their providers.
 *
 * Responsibilities:
 *   1. Call every view-control plugin composable for the active document
 *   2. Expose a stable imperative API via `defineExpose`
 *   3. Emit reactive state up to MeldPdfRenderer for the toolbar
 *
 * This component renders nothing — it's pure orchestration. Layout lives
 * in MeldPdfRenderer's `<Scroller>` slot.
 */
import { computed, onBeforeUnmount, watch } from 'vue'
import {
  MatchFlag,
  PdfAnnotationSubtype,
  type PdfAnnotationObject,
  type PdfTextAnnoObject,
  Rotation,
} from '@embedpdf/models'
import { useZoom, ZoomMode, type ZoomLevel } from '@embedpdf/plugin-zoom/vue'
import { useRotate } from '@embedpdf/plugin-rotate/vue'
import { useSpread } from '@embedpdf/plugin-spread/vue'
import { usePan } from '@embedpdf/plugin-pan/vue'
import { useFullscreen } from '@embedpdf/plugin-fullscreen/vue'
import { useSelectionCapability } from '@embedpdf/plugin-selection/vue'
import { useScroll } from '@embedpdf/plugin-scroll/vue'
import { useDocumentState } from '@embedpdf/core/vue'
import { useSearch } from '@embedpdf/plugin-search/vue'
import { useExportCapability } from '@embedpdf/plugin-export/vue'
import { usePrint } from '@embedpdf/plugin-print/vue'
import { useCommandsCapability } from '@embedpdf/plugin-commands/vue'
import { useHistoryCapability } from '@embedpdf/plugin-history/vue'
import {
  createRenderer,
  useAnnotation,
  useRegisterRenderers,
} from '@embedpdf/plugin-annotation/vue'
import MeldCommentMarker from './MeldCommentMarker.vue'
import type { AnnotationTransferItem } from '@embedpdf/plugin-annotation'
import { SpreadMode } from '@embedpdf/plugin-spread'
import { meldToPdf, pdfToMeld } from '../utils/annotationMapping'
import { buildMeldCommands, type MeldCommandCallbacks } from '../composables/useMeldCommands'
import type {
  AnnotationFilter,
  AnnotationTransferItem as MeldAnnotationTransferItem,
  CreateAnnotationInput,
  InteractionMode,
  MeldAnnotation,
  ViewMode,
} from '../types'

interface Props {
  documentId: string
  /**
   * Callbacks for every shortcut-bound command MeldViewer registers. The
   * controller is inside the EmbedPDF tree (so it has access to the
   * Commands plugin capability), but most of the actions need MeldViewer-
   * level state (search popover open, panel toggles), so the host passes
   * the callbacks in.
   */
  commandCallbacks?: MeldCommandCallbacks
  /** Toggle the keyboard binder. Defaults to enabled. */
  keyboardShortcutsEnabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'page-change', payload: { currentPage: number; totalPages: number }): void
  (e: 'zoom-change', payload: { scale: number }): void
  (e: 'rotation-change', payload: { rotation: number }): void
  (e: 'view-mode-change', payload: { viewMode: ViewMode }): void
  (e: 'interaction-mode-change', payload: { mode: InteractionMode }): void
  (e: 'fullscreen-change', payload: { isFullscreen: boolean }): void
  (
    e: 'search-state-change',
    payload: {
      total: number
      activeResultIndex: number
      matchCase: boolean
      wholeWord: boolean
    },
  ): void
  (e: 'annotation-created', payload: { annotation: MeldAnnotation }): void
  (
    e: 'annotation-updated',
    payload: { annotation: MeldAnnotation; patch: Partial<MeldAnnotation> },
  ): void
  (e: 'annotation-deleted', payload: { annotationId: string }): void
  (e: 'annotation-selected', payload: { annotation: MeldAnnotation | null }): void
  (e: 'active-annotation-tool-change', payload: { toolId: string | null }): void
}>()

// All composables tied to the active document id
const documentIdRef = () => props.documentId

const zoom = useZoom(documentIdRef)
const rotate = useRotate(documentIdRef)
const spread = useSpread(documentIdRef)
const pan = usePan(documentIdRef)
const scroll = useScroll(documentIdRef)
const docState = useDocumentState(documentIdRef)
const fullscreen = useFullscreen()
const selectionCap = useSelectionCapability()
const search = useSearch(documentIdRef)
const exportCap = useExportCapability()
const print = usePrint(documentIdRef)
const commandsCap = useCommandsCapability()
const historyCap = useHistoryCapability()
const annotation = useAnnotation(documentIdRef)

// Register the custom sticky-note renderer so the on-page comment marker
// uses our doqo-style pin + reply badge + hover preview instead of the
// default Text-annotation visual.
const commentRenderer = createRenderer<PdfTextAnnoObject>({
  id: 'meld-comment',
  matches: (a): a is PdfTextAnnoObject => a.type === PdfAnnotationSubtype.TEXT,
  component: MeldCommentMarker,
  // Hint: the marker is anchored at the annotation's origin and doesn't need
  // resize handles; keep it interactive (clickable) but not draggable.
  interactionDefaults: { isDraggable: false, isResizable: false, isRotatable: false },
})
useRegisterRenderers([commentRenderer])

// ───────────────────────────────────────────────────────────────────────
// State watchers — emit upward so toolbar reflects current state
// ───────────────────────────────────────────────────────────────────────

// Page-state emission — combines the scroll plugin's reactive state with the
// document's `pageCount`. The scroll plugin updates `totalPages` lazily (only
// when `onPageChange` fires), so we fall back to the loaded document's
// `pageCount` to make sure the toolbar reflects the right total right after
// the engine finishes parsing the PDF.
const effectiveTotalPages = computed(() => {
  const fromScroll = scroll.state.value.totalPages
  if (fromScroll && fromScroll > 1) return fromScroll
  return docState.value?.document?.pageCount ?? fromScroll
})

watch(
  () => ({
    currentPage: scroll.state.value.currentPage,
    totalPages: effectiveTotalPages.value,
  }),
  (s) => emit('page-change', { currentPage: s.currentPage, totalPages: s.totalPages }),
  { deep: true, immediate: true },
)

watch(
  () => zoom.state.value.currentZoomLevel,
  (scale) => emit('zoom-change', { scale }),
  { immediate: true },
)

watch(
  () => rotate.rotation.value,
  (rotation) => {
    const degrees = rotation * 90
    emit('rotation-change', { rotation: degrees })
  },
  { immediate: true },
)

watch(
  () => spread.spreadMode.value,
  (mode) => {
    const viewMode: ViewMode = mode === SpreadMode.None ? 'continuous' : 'spread'
    emit('view-mode-change', { viewMode })
  },
  { immediate: true },
)

watch(
  () => pan.isPanning.value,
  (isPanning) => emit('interaction-mode-change', { mode: isPanning ? 'hand' : 'text' }),
  { immediate: true },
)

watch(
  () => fullscreen.state.value.isFullscreen,
  (isFullscreen) => emit('fullscreen-change', { isFullscreen }),
  { immediate: true },
)

// Search state — combine flags + result count + active index into one event
const matchCase = computed(() => (search.state.value.flags ?? []).includes(MatchFlag.MatchCase))
const wholeWord = computed(() =>
  (search.state.value.flags ?? []).includes(MatchFlag.MatchWholeWord),
)

watch(
  () => ({
    total: search.state.value.total,
    activeResultIndex: search.state.value.activeResultIndex,
    matchCase: matchCase.value,
    wholeWord: wholeWord.value,
  }),
  (payload) => emit('search-state-change', payload),
  { deep: true, immediate: true },
)

// Scroll the active search match into view. EmbedPDF's SearchLayer paints
// highlights at the right page coordinates but does not scroll the viewport —
// without this, clicking "Next match" past the current page leaves the
// active highlight invisible somewhere below.
let unsubscribeActiveResultChange: (() => void) | undefined

watch(
  () => search.provides.value,
  (scope) => {
    unsubscribeActiveResultChange?.()
    if (!scope) return
    unsubscribeActiveResultChange = scope.onActiveResultChange((index) => {
      const state = scope.getState()
      const result = state.results?.[index]
      if (!result) return
      const firstRect = result.rects?.[0]
      const scrollScope = scroll.provides.value
      if (!scrollScope) return
      scrollScope.scrollToPage({
        pageNumber: result.pageIndex + 1,
        pageCoordinates: firstRect ? { x: firstRect.origin.x, y: firstRect.origin.y } : undefined,
        // Center the match vertically when possible — feels less jarring
        // than top-aligning when a single keystroke skips many pages.
        alignY: 30,
        behavior: 'smooth',
      })
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => unsubscribeActiveResultChange?.())

// ───────────────────────────────────────────────────────────────────────
// Annotation lifecycle subscription
// ───────────────────────────────────────────────────────────────────────
//
// `onAnnotationEvent` fires on every create / update / delete with a
// `committed` boolean. We only emit upward for committed changes so the
// consumer's persistence layer doesn't see in-flight drag/resize states.
//
// For HIGHLIGHT creates, EmbedPDF doesn't populate the annotation's
// `contents` with the highlighted text — but the selection plugin does
// extract it whenever something asks for it (the annotation plugin calls
// `getSelectedText()` internally while building the highlight, which fires
// the `onTextRetrieved` event). We subscribe to that event and snapshot
// the most recent payload into `lastSelectedText`, then use it as the
// fallback when a highlight `create` event arrives without contents.
// `onTextRetrieved` is synchronous, so the cache is populated before the
// `create` event fires in the same call stack.

let lastSelectedText = ''
let unsubscribeTextRetrieved: (() => void) | undefined

watch(
  () => selectionCap.provides.value,
  (cap) => {
    unsubscribeTextRetrieved?.()
    if (!cap) return
    unsubscribeTextRetrieved = cap.onTextRetrieved((event) => {
      const pages = event?.text
      lastSelectedText = Array.isArray(pages)
        ? pages
            .map((p) => (p ?? '').trim())
            .filter(Boolean)
            .join(' ')
            .trim()
        : ''
    })
  },
  { immediate: true },
)

let unsubscribeAnnotationEvent: (() => void) | undefined

watch(
  () => annotation.provides.value,
  (scope) => {
    unsubscribeAnnotationEvent?.()
    if (!scope) return
    unsubscribeAnnotationEvent = scope.onAnnotationEvent((event) => {
      // The `'loaded'` variant fires once when stored annotations finish
      // hydrating — it has no `committed` field; ignore here.
      if (event.type === 'loaded') return
      if (!event.committed) return
      if (event.type === 'create') {
        const meld = pdfToMeld(event.annotation)
        if (meld) {
          // Manually-created highlights arrive without `selectedText`
          // (EmbedPDF doesn't pass the selection text through). Fall back
          // to the snapshot we captured on the last `onEndSelection`.
          if (meld.type === 'highlight' && !meld.selectedText && lastSelectedText) {
            meld.selectedText = lastSelectedText
            lastSelectedText = ''
          }
          emit('annotation-created', { annotation: meld })
        }
      } else if (event.type === 'update') {
        const meld = pdfToMeld(event.annotation)
        if (meld) {
          const patch = pdfToMeld({
            ...event.annotation,
            ...event.patch,
          } as PdfAnnotationObject) as Partial<MeldAnnotation>
          emit('annotation-updated', { annotation: meld, patch })
        }
      } else if (event.type === 'delete') {
        emit('annotation-deleted', { annotationId: event.annotation.id })
      }
    })
  },
  { immediate: true },
)

watch(
  () => annotation.state.value.activeToolId,
  (toolId) => emit('active-annotation-tool-change', { toolId: toolId ?? null }),
  { immediate: true },
)

// Selection tracking is driven by `<SelectionSignal>` inside the
// AnnotationLayer `#selection-menu` slot rather than by reading EmbedPDF's
// `state.selectedUid(s)` / `getSelectedAnnotationIds()` — those don't
// reflect imported (seeded) annotations consistently in 2.14.2, while
// the selection slot itself is positioned correctly by the plugin for
// every selected annotation. MeldPdfRenderer's slot relays select /
// deselect events into these methods.
let lastSelectedUid: string | null = null

/**
 * Map an EmbedPDF subtype to the MeldAnnotation discriminator so the host
 * can route on `type` even when a full annotation can't be resolved.
 */
function subtypeToMeldType(subtype: number | undefined): MeldAnnotation['type'] | null {
  if (subtype === PdfAnnotationSubtype.HIGHLIGHT) return 'highlight'
  if (subtype === PdfAnnotationSubtype.TEXT) return 'comment'
  if (subtype === PdfAnnotationSubtype.FREETEXT) return 'free-text'
  if (subtype === PdfAnnotationSubtype.INK) return 'ink'
  return null
}

function emitSlotSelection(uid: string, subtype: number) {
  if (uid === lastSelectedUid) return
  lastSelectedUid = uid
  // Prefer a full resolved annotation from the plugin when available, but
  // fall back to a minimal `{ id, type }` stub so MeldViewer can match its
  // panel rows AND route on type even when `getAnnotationById` returns
  // null for the imported annotation (a 2.14.2 quirk for some load paths).
  // The host only needs the id + type to drive the active-row state and
  // the comment-panel-auto-open branch.
  const tracked = annotation.provides.value?.getAnnotationById(uid)
  if (tracked) {
    const meld = pdfToMeld(tracked.object)
    if (meld) {
      emit('annotation-selected', { annotation: meld })
      return
    }
  }
  const meldType = subtypeToMeldType(subtype)
  emit('annotation-selected', {
    annotation: { id: uid, type: meldType ?? 'highlight' } as unknown as MeldAnnotation,
  })
}

function emitSlotDeselection(uid: string) {
  // Only clear when the deselect matches the currently-tracked uid (avoid a
  // stale signal from a slot that swapped to a different annotation).
  if (uid !== lastSelectedUid) return
  lastSelectedUid = null
  emit('annotation-selected', { annotation: null })
}

onBeforeUnmount(() => {
  unsubscribeAnnotationEvent?.()
  unsubscribeTextRetrieved?.()
})

// Click-outside-to-deselect for annotations.
//
// EmbedPDF leaves the selection outline up after the user clicks somewhere
// else on the page, which the user explicitly flagged as confusing. While an
// annotation is selected we attach a capture-phase `pointerdown` listener on
// the document; the listener runs BEFORE the plugin's own select handlers
// (capture phase = outermost-in), so:
//   - click on empty page area → we deselect, plugin doesn't re-select → final
//     state: nothing selected (correct).
//   - click on a different annotation → we deselect, plugin's bubble-phase
//     handler then selects the new annotation → final state: new annotation
//     selected (correct).
//   - click inside the floating tooltip → guarded by `.meld-highlight-tooltip`,
//     we leave the selection alone.
const HIGHLIGHT_TOOLTIP_SELECTOR = '.meld-highlight-tooltip'
let outsideClickHandler: ((e: PointerEvent) => void) | null = null

function detachOutsideClick() {
  if (!outsideClickHandler) return
  document.removeEventListener('pointerdown', outsideClickHandler, true)
  outsideClickHandler = null
}

watch(
  () => annotation.state.value.selectedUids.length,
  (count) => {
    detachOutsideClick()
    if (count === 0) return
    outsideClickHandler = (e) => {
      const target = e.target as HTMLElement | null
      if (target?.closest(HIGHLIGHT_TOOLTIP_SELECTOR)) return
      annotation.provides.value?.deselectAnnotation()
    }
    document.addEventListener('pointerdown', outsideClickHandler, true)
  },
)

onBeforeUnmount(detachOutsideClick)

// ───────────────────────────────────────────────────────────────────────
// Imperative controller — invoked by MeldViewer in response to toolbar events
// ───────────────────────────────────────────────────────────────────────

function zoomIn() {
  zoom.provides.value?.zoomIn()
}

function zoomOut() {
  zoom.provides.value?.zoomOut()
}

function requestZoom(level: ZoomLevel) {
  zoom.provides.value?.requestZoom(level)
}

function fitWidth() {
  zoom.provides.value?.requestZoom(ZoomMode.FitWidth)
}

function fitPage() {
  zoom.provides.value?.requestZoom(ZoomMode.FitPage)
}

function actualSize() {
  zoom.provides.value?.requestZoom(1)
}

function rotateClockwise() {
  rotate.provides.value?.rotateForward()
}

function rotateCounterClockwise() {
  rotate.provides.value?.rotateBackward()
}

function setRotationDegrees(deg: 0 | 90 | 180 | 270) {
  const rotationMap: Record<number, Rotation> = {
    0: Rotation.Degree0,
    90: Rotation.Degree90,
    180: Rotation.Degree180,
    270: Rotation.Degree270,
  }
  rotate.provides.value?.setRotation(rotationMap[deg])
}

function setSpreadMode(mode: 'none' | 'odd' | 'even') {
  const map: Record<string, SpreadMode> = {
    none: SpreadMode.None,
    odd: SpreadMode.Odd,
    even: SpreadMode.Even,
  }
  spread.provides.value?.setSpreadMode(map[mode])
}

function setViewMode(mode: ViewMode) {
  if (mode === 'spread') {
    setSpreadMode('odd')
  } else {
    setSpreadMode('none')
  }
}

function togglePan() {
  pan.provides.value?.togglePan()
}

function setInteractionMode(mode: InteractionMode) {
  if (mode === 'hand') {
    pan.provides.value?.enablePan()
  } else {
    pan.provides.value?.disablePan()
  }
}

function toggleFullscreen(targetElement?: string) {
  fullscreen.provides.value?.toggleFullscreen(targetElement)
}

function exitFullscreen() {
  fullscreen.provides.value?.exitFullscreen()
}

function goToPage(page: number) {
  scroll.provides.value?.scrollToPage({ pageNumber: page })
}

function nextPage() {
  scroll.provides.value?.scrollToNextPage()
}

function prevPage() {
  scroll.provides.value?.scrollToPreviousPage()
}

async function copySelection() {
  // SelectionCapability is wrapped in a `CapabilityState<C>` ({ provides, isLoading, ready })
  const cap = selectionCap.provides.value
  if (!cap) return
  const text = (cap as unknown as { getSelectedText?: () => string }).getSelectedText?.()
  if (text) await navigator.clipboard.writeText(text)
}

// ──── Search ────

function searchKeyword(keyword: string) {
  const scope = search.provides.value
  if (!scope) return
  if (!keyword) {
    scope.stopSearch()
    return
  }
  scope.startSearch()
  scope.searchAllPages(keyword)
}

function nextMatch() {
  search.provides.value?.nextResult()
}

function previousMatch() {
  search.provides.value?.previousResult()
}

function setMatchCase(enabled: boolean) {
  const scope = search.provides.value
  if (!scope) return
  const flags = search.state.value.flags ?? []
  const next = enabled
    ? Array.from(new Set([...flags, MatchFlag.MatchCase]))
    : flags.filter((f) => f !== MatchFlag.MatchCase)
  scope.setFlags(next)
}

function setWholeWord(enabled: boolean) {
  const scope = search.provides.value
  if (!scope) return
  const flags = search.state.value.flags ?? []
  const next = enabled
    ? Array.from(new Set([...flags, MatchFlag.MatchWholeWord]))
    : flags.filter((f) => f !== MatchFlag.MatchWholeWord)
  scope.setFlags(next)
}

function clearSearch() {
  search.provides.value?.stopSearch()
}

// ──── Export ────

function downloadDocument() {
  exportCap.provides.value?.download()
}

async function saveAsCopy(): Promise<ArrayBuffer> {
  const cap = exportCap.provides.value
  if (!cap) return new ArrayBuffer(0)
  // saveAsCopy returns a Task<ArrayBuffer> — await its promise form
  return new Promise((resolve, reject) => {
    cap.saveAsCopy().wait(resolve, (err) => reject(err))
  })
}

/**
 * Print the active PDF document using the EmbedPDF print plugin. The plugin
 * auto-injects a hidden `<PrintFrame>` so we don't need to mount one. With
 * `includeAnnotations` defaulting to `true`, current annotations are baked
 * into the print job natively — no `saveAsCopy()` round-trip needed.
 */
async function printDocument(): Promise<void> {
  const scope = print.provides.value
  if (!scope) return
  return new Promise((resolve, reject) => {
    scope.print().wait(
      () => resolve(),
      (err) => reject(err),
    )
  })
}

// ──── Annotations ────

function setActiveTool(toolId: string | null) {
  annotation.provides.value?.setActiveTool(toolId)
}

function getActiveTool(): string | null {
  return annotation.provides.value?.getActiveTool()?.id ?? null
}

function createAnnotation(input: CreateAnnotationInput): MeldAnnotation {
  const id =
    input.id ??
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `ann_${Date.now()}_${Math.random().toString(36).slice(2)}`)
  const meld = { ...input, id } as MeldAnnotation
  const pdf = meldToPdf(meld)
  annotation.provides.value?.createAnnotation(pdf.pageIndex, pdf)
  return meld
}

function updateAnnotation(id: string, patch: Partial<MeldAnnotation>): void {
  const scope = annotation.provides.value
  if (!scope) return
  const existing = scope.getAnnotationById(id)
  if (!existing) return
  const merged = { ...pdfToMeld(existing.object), ...patch } as MeldAnnotation
  const pdfPatch = meldToPdf(merged) as Partial<PdfAnnotationObject>
  scope.updateAnnotation(existing.object.pageIndex, id, pdfPatch)
}

function deleteAnnotation(id: string): void {
  const scope = annotation.provides.value
  if (!scope) return
  const existing = scope.getAnnotationById(id)
  if (!existing) return
  scope.deleteAnnotation(existing.object.pageIndex, id)
}

function selectAnnotationById(id: string): void {
  const scope = annotation.provides.value
  if (!scope) return
  const existing = scope.getAnnotationById(id)
  if (!existing) return
  scope.selectAnnotation(existing.object.pageIndex, id)
}

function deselectAll(): void {
  annotation.provides.value?.deselectAnnotation()
}

function getAnnotations(filter?: AnnotationFilter): MeldAnnotation[] {
  const scope = annotation.provides.value
  if (!scope) return []
  const tracked = scope.getAnnotations(
    filter?.pageIndex !== undefined ? { pageIndex: filter.pageIndex } : undefined,
  )
  const out: MeldAnnotation[] = []
  for (const t of tracked) {
    const meld = pdfToMeld(t.object)
    if (!meld) continue
    if (filter?.types && !filter.types.includes(meld.type)) continue
    if (filter?.authorId && meld.author !== filter.authorId) continue
    out.push(meld)
  }
  return out
}

function importAnnotations(items: MeldAnnotationTransferItem[]): void {
  const scope = annotation.provides.value
  if (!scope) return
  // Strip Vue reactive proxies before mapping — see the comment on
  // `loadAnnotations` for why this matters. `meldToPdf` does shallow
  // copies, so without cloning here a proxied annotation would still
  // hand proxied inner objects to `scope.importAnnotations`.
  const mapped: AnnotationTransferItem[] = items.map((item) => ({
    annotation: meldToPdf(JSON.parse(JSON.stringify(item.annotation)) as MeldAnnotation),
    ctx: item.ctx,
  })) as AnnotationTransferItem[]
  scope.importAnnotations(mapped)
}

async function exportAnnotations(filter?: AnnotationFilter): Promise<MeldAnnotationTransferItem[]> {
  const scope = annotation.provides.value
  if (!scope) return []
  return new Promise((resolve, reject) => {
    scope
      .exportAnnotations(filter?.pageIndex !== undefined ? { pageIndex: filter.pageIndex } : {})
      .wait(
        (items) => {
          const out: MeldAnnotationTransferItem[] = []
          for (const it of items) {
            const meld = pdfToMeld(it.annotation)
            if (!meld) continue
            if (filter?.types && !filter.types.includes(meld.type)) continue
            if (filter?.authorId && meld.author !== filter.authorId) continue
            out.push({ annotation: meld, ctx: it.ctx as never })
          }
          resolve(out)
        },
        (err) => reject(err),
      )
  })
}

/**
 * Load saved annotations. Equivalent to `importAnnotations` but accepts the
 * plain `MeldAnnotation[]` shape consumers usually persist (rather than the
 * transfer-item wrapper).
 *
 * `MeldViewer` calls this as soon as the renderer mounts, but the EmbedPDF
 * annotation capability isn't always ready by that point (engine + document
 * + plugins are still booting). When the capability is null we stash the
 * annotations in `pendingLoad` and flush them in a watcher below as soon as
 * the capability becomes available — otherwise the seeded annotations
 * would silently disappear (the import call to a null scope is a no-op).
 */
const pendingLoad: { ref: MeldAnnotation[] | null } = { ref: null }

function loadAnnotations(annotations: MeldAnnotation[]): void {
  // JSON round-trip to strip any Vue reactive proxies the consumer might
  // have wrapped the annotations in (e.g., `ref(SEEDED_ANNOTATIONS)` in a
  // story). `annotationMapping.meldToPdf` is shallow, so without this
  // clone the proxy-wrapped inner properties (rect, segmentRects,
  // metadata) leak into `scope.importAnnotations` — EmbedPDF's plugin
  // then silently suppresses the per-annotation `create` events
  // (annotations still render on the page, but consumers never see them
  // surfaced as events). Annotation data is plain JSON, so the
  // round-trip is safe; `structuredClone` would fail because Proxy
  // objects aren't cloneable.
  const plain = JSON.parse(JSON.stringify(annotations)) as MeldAnnotation[]
  if (!annotation.provides.value) {
    pendingLoad.ref = plain
    return
  }
  importAnnotations(plain.map((a) => ({ annotation: a })))
}

watch(
  () => annotation.provides.value,
  (scope) => {
    if (!scope || !pendingLoad.ref) return
    const queued = pendingLoad.ref
    pendingLoad.ref = null
    importAnnotations(queued.map((a) => ({ annotation: a })))
  },
)

// ──── History (undo / redo) ────

function undoLastAction(): void {
  historyCap.provides.value?.forDocument(props.documentId).undo()
}

function redoLastAction(): void {
  historyCap.provides.value?.forDocument(props.documentId).redo()
}

function canUndo(): boolean {
  return historyCap.provides.value?.forDocument(props.documentId).canUndo() ?? false
}

function canRedo(): boolean {
  return historyCap.provides.value?.forDocument(props.documentId).canRedo() ?? false
}

// ──── Commands plugin: register shortcut-bound commands & keyboard binder ────

const registeredCommandIds: string[] = []

watch(
  [commandsCap.provides, () => props.commandCallbacks, () => props.keyboardShortcutsEnabled],
  ([cap, callbacks, enabled]) => {
    if (!cap) return
    // Re-register cleanly whenever a dep changes
    for (const id of registeredCommandIds) cap.unregisterCommand(id)
    registeredCommandIds.length = 0
    // Honour the host's feature flag by skipping registration when disabled.
    // The Commands plugin auto-mounts a `<KeyboardShortcuts>` listener; with
    // no commands registered, keystrokes pass through untouched.
    if (!callbacks || enabled === false) return
    for (const command of buildMeldCommands(callbacks)) {
      cap.registerCommand(command)
      registeredCommandIds.push(command.id)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  const cap = commandsCap.provides.value
  if (!cap) return
  for (const id of registeredCommandIds) cap.unregisterCommand(id)
})

// Keyboard binding is handled by `<KeyboardShortcuts>` — a utility component
// that the Commands plugin package auto-mounts when registered. It listens
// on `document.keydown`, normalises the event into the plugin's shortcut
// format, and calls `execute()` for any matching registered command. No
// custom binder needed here.

defineExpose({
  // zoom
  zoomIn,
  zoomOut,
  requestZoom,
  fitWidth,
  fitPage,
  actualSize,
  // rotate
  rotateClockwise,
  rotateCounterClockwise,
  setRotationDegrees,
  // spread / view mode
  setSpreadMode,
  setViewMode,
  // pan / interaction
  togglePan,
  setInteractionMode,
  // fullscreen
  toggleFullscreen,
  exitFullscreen,
  // page nav
  goToPage,
  nextPage,
  prevPage,
  // selection
  copySelection,
  // search
  searchKeyword,
  nextMatch,
  previousMatch,
  setMatchCase,
  setWholeWord,
  clearSearch,
  // export
  downloadDocument,
  saveAsCopy,
  printDocument,
  // annotations
  setActiveTool,
  getActiveTool,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  selectAnnotationById,
  deselectAll,
  getAnnotations,
  importAnnotations,
  exportAnnotations,
  loadAnnotations,
  // history
  undoLastAction,
  redoLastAction,
  canUndo,
  canRedo,
  // selection signal (driven by SelectionSignal in MeldPdfRenderer)
  emitSlotSelection,
  emitSlotDeselection,
})

export type MeldPdfControllerApi = {
  zoomIn: typeof zoomIn
  zoomOut: typeof zoomOut
  requestZoom: typeof requestZoom
  fitWidth: typeof fitWidth
  fitPage: typeof fitPage
  actualSize: typeof actualSize
  rotateClockwise: typeof rotateClockwise
  rotateCounterClockwise: typeof rotateCounterClockwise
  setRotationDegrees: typeof setRotationDegrees
  setSpreadMode: typeof setSpreadMode
  setViewMode: typeof setViewMode
  togglePan: typeof togglePan
  setInteractionMode: typeof setInteractionMode
  toggleFullscreen: typeof toggleFullscreen
  exitFullscreen: typeof exitFullscreen
  goToPage: typeof goToPage
  nextPage: typeof nextPage
  prevPage: typeof prevPage
  copySelection: typeof copySelection
  searchKeyword: typeof searchKeyword
  nextMatch: typeof nextMatch
  previousMatch: typeof previousMatch
  setMatchCase: typeof setMatchCase
  setWholeWord: typeof setWholeWord
  clearSearch: typeof clearSearch
  downloadDocument: typeof downloadDocument
  saveAsCopy: typeof saveAsCopy
  printDocument: typeof printDocument
  setActiveTool: typeof setActiveTool
  getActiveTool: typeof getActiveTool
  createAnnotation: typeof createAnnotation
  updateAnnotation: typeof updateAnnotation
  deleteAnnotation: typeof deleteAnnotation
  selectAnnotationById: typeof selectAnnotationById
  deselectAll: typeof deselectAll
  getAnnotations: typeof getAnnotations
  importAnnotations: typeof importAnnotations
  exportAnnotations: typeof exportAnnotations
  loadAnnotations: typeof loadAnnotations
  undoLastAction: typeof undoLastAction
  redoLastAction: typeof redoLastAction
  canUndo: typeof canUndo
  canRedo: typeof canRedo
  emitSlotSelection: typeof emitSlotSelection
  emitSlotDeselection: typeof emitSlotDeselection
}
</script>

<template>
  <!-- pure orchestration; renders nothing -->
</template>
