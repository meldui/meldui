<script setup lang="ts">
/**
 * MeldPdfRenderer — wraps EmbedPDF with the plugins resolved from
 * MeldViewer's feature config. Lazy-loaded by MeldViewer for PDF documents
 * so non-PDF consumers never pay the PDFium WASM cost.
 *
 * Hosts a `<MeldPdfController>` inside the `<EmbedPDF>` slot so plugin
 * composables can resolve their providers. The controller is re-exposed
 * via `defineExpose` so MeldViewer can drive it from toolbar events.
 *
 * Side panels (outline, thumbnails) are mounted INSIDE the EmbedPDF tree
 * because they rely on plugin composables. MeldViewer controls their
 * visibility via the `isOutlineOpen` / `isThumbnailsOpen` props.
 */
import { computed, ref, watch } from 'vue'
import { EmbedPDF } from '@embedpdf/core/vue'
import { usePdfiumEngine } from '@embedpdf/engines/vue'
import { DocumentContent } from '@embedpdf/plugin-document-manager/vue'
import { Viewport } from '@embedpdf/plugin-viewport/vue'
import { Scroller } from '@embedpdf/plugin-scroll/vue'
import { RenderLayer } from '@embedpdf/plugin-render/vue'
import { TilingLayer } from '@embedpdf/plugin-tiling/vue'
import { SearchLayer } from '@embedpdf/plugin-search/vue'
import { SelectionLayer } from '@embedpdf/plugin-selection/vue'
import { AnnotationLayer } from '@embedpdf/plugin-annotation/vue'
import { Rotate } from '@embedpdf/plugin-rotate/vue'
import {
  GlobalPointerProvider,
  PagePointerProvider,
} from '@embedpdf/plugin-interaction-manager/vue'
import { PdfAnnotationSubtype, type PdfBookmarkObject } from '@embedpdf/models'

import MeldPdfController from './MeldPdfController.vue'
import MeldHighlightTooltip from '../MeldHighlightTooltip.vue'
import MeldCommentForm from '../MeldCommentForm.vue'
import SelectionSignal from './SelectionSignal.vue'
import MeldOutlinePanel from '../panels/MeldOutlinePanel.vue'
import MeldThumbnailsPanel from '../panels/MeldThumbnailsPanel.vue'
import MeldViewerSidePanel from '../MeldViewerSidePanel.vue'
import { buildPlugins, resolveFeatures } from '../plugins/pluginRegistry'
import type {
  AnnotationFilter,
  AnnotationTransferItem,
  CreateAnnotationInput,
  DocumentSource,
  InteractionMode,
  MeldAnnotation,
  MeldViewerFeatureConfig,
  MeldViewerFeatures,
  ViewMode,
} from '../types'
import type { MeldCommandCallbacks } from '../composables/useMeldCommands'

interface Props {
  source: DocumentSource
  wasmUrl?: string
  /** Run PDFium in a Web Worker. Defaults to `true` — see `MeldViewerProps.worker`. */
  worker?: boolean
  features?: MeldViewerFeatures
  featureConfig?: MeldViewerFeatureConfig
  // Panel visibility (driven by MeldViewer)
  isOutlineOpen?: boolean
  isThumbnailsOpen?: boolean
  currentPage?: number
  // Shortcut-bound command callbacks (driven by MeldViewer).
  commandCallbacks?: MeldCommandCallbacks
  keyboardShortcutsEnabled?: boolean
  /**
   * When true, clicks on the page are captured for the "add comment" flow:
   * we compute the page-local coords and emit `comment-position-picked`
   * instead of forwarding the click to EmbedPDF. MeldViewer then renders a
   * single `MeldCommentForm` at the coord.
   */
  pendingCommentMode?: boolean
  /**
   * Current pending-comment-form coord, owned by MeldViewer. When set, we
   * render exactly one form inside the matching page wrapper.
   */
  pendingCommentPosition?: {
    pageIndex: number
    x: number
    y: number
    pageWidth: number
    pageHeight: number
  } | null
}

const props = withDefaults(defineProps<Props>(), {
  wasmUrl: undefined,
  worker: true,
  features: () => ({}),
  featureConfig: () => ({}),
  isOutlineOpen: false,
  isThumbnailsOpen: false,
  currentPage: 1,
  commandCallbacks: undefined,
  keyboardShortcutsEnabled: true,
  pendingCommentMode: false,
  pendingCommentPosition: null,
})

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
  (e: 'engine-error', payload: { error: string }): void
  (e: 'close-outline'): void
  (e: 'close-thumbnails'): void
  /**
   * "Add comment" pressed on a highlight's floating tooltip. MeldViewer
   * listens and opens the annotations panel scrolled to / focused on that
   * annotation's reply form.
   */
  (
    e: 'highlight-add-comment-requested',
    payload: { annotationId: string; pageIndex: number },
  ): void
  /**
   * Fired when `pendingCommentMode` is true and the user clicks on a page.
   * Coords are in page-local CSS pixels (origin = page wrapper top-left)
   * along with the page wrapper's rendered width/height so MeldViewer can
   * place the form within bounds.
   */
  (
    e: 'comment-position-picked',
    payload: {
      pageIndex: number
      x: number
      y: number
      pageWidth: number
      pageHeight: number
    },
  ): void
  /** Pending comment form submitted; MeldViewer creates the annotation. */
  (e: 'comment-submit', content: string): void
  /** Pending comment form cancelled (Escape or Cancel button). */
  (e: 'comment-cancel'): void
}>()

/** Subtype enum value used in the `#selection-menu` template (HIGHLIGHT = 9). */
const HIGHLIGHT_SUBTYPE = PdfAnnotationSubtype.HIGHLIGHT

function handleHighlightColorChange(_pageIndex: number, id: string, color: string) {
  controllerRef.value?.updateAnnotation(id, { color } as Partial<MeldAnnotation>)
}

function handleHighlightDelete(_pageIndex: number, id: string) {
  controllerRef.value?.deleteAnnotation(id)
}

function handleHighlightAddComment(pageIndex: number, annotationId: string) {
  emit('highlight-add-comment-requested', { annotationId, pageIndex })
}

/**
 * Driven by `<SelectionSignal>` inside the `#selection-menu` slot. The
 * slot only renders when an annotation is selected by EmbedPDF, so this
 * is our most reliable source of "which annotation is currently active",
 * independent of the plugin's deprecated state.selectedUid reactivity or
 * its `getSelectedAnnotationIds()` capability (which doesn't reflect
 * imported annotations in 2.14.2). MeldViewer pipes the resulting id
 * into the panel's active-row state.
 */
function handleSlotSelection(annotationId: string, annotationSubtype: number) {
  controllerRef.value?.emitSlotSelection(annotationId, annotationSubtype)
}
function handleSlotDeselection(annotationId: string) {
  controllerRef.value?.emitSlotDeselection(annotationId)
}

/**
 * Capture-phase pointerdown handler for the per-page overlay used during
 * the comment-add flow. Computes page-local coords and emits upward so
 * MeldViewer can render a single `<MeldCommentForm>` at the spot.
 *
 * Returning `e.stopPropagation()` keeps EmbedPDF's annotation tools from
 * also reacting to the click — we own the interaction while in pending
 * mode.
 */
function handleCommentOverlayDown(e: PointerEvent, pageIndex: number) {
  if (!props.pendingCommentMode) return
  const overlay = e.currentTarget as HTMLElement
  const rect = overlay.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  emit('comment-position-picked', {
    pageIndex,
    x,
    y,
    pageWidth: rect.width,
    pageHeight: rect.height,
  })
  e.stopPropagation()
  e.preventDefault()
}

const resolvedFeatures = computed(() => resolveFeatures(props.features))
const plugins = computed(() =>
  buildPlugins({
    features: resolvedFeatures.value,
    config: props.featureConfig,
    source: props.source,
  }),
)

/**
 * Promote a root-relative or scheme-relative `wasmUrl` (e.g. `/pdfium.wasm`)
 * to a fully-qualified absolute URL before handing it to the engine.
 *
 * The worker engine inlines its source into a `Blob` and instantiates the
 * worker from `URL.createObjectURL(blob)`. Inside that worker,
 * `self.location.href` is `blob:http://host/<uuid>` — a non-base URL — so a
 * raw `fetch('/pdfium.wasm')` throws "Failed to parse URL". Resolving here
 * against `window.location.origin` keeps the call site identical for
 * consumers (they still pass `/pdfium.wasm`) while the worker receives a
 * URL it can fetch unconditionally.
 *
 * Fully-qualified URLs are returned unchanged. Undefined falls through to
 * EmbedPDF's CDN default.
 */
const resolvedWasmUrl = computed<string | undefined>(() => {
  const raw = props.wasmUrl
  if (!raw) return undefined
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return raw
  if (typeof window === 'undefined') return raw
  return new URL(raw, window.location.origin).href
})

const { engine, isLoading, error } = usePdfiumEngine({
  wasmUrl: resolvedWasmUrl.value,
  worker: props.worker,
})

// Capture controller ref so MeldViewer can drive it via this renderer's
// re-exposed defineExpose.
const controllerRef = ref<InstanceType<typeof MeldPdfController> | null>(null)

// Stash for `loadAnnotations` calls that arrive before the controller is
// mounted (the most common case — MeldViewer pushes `initialAnnotations`
// the moment its `pdfRendererRef` becomes truthy, but the EmbedPDF slot
// is still loading at that point). Flushed by the watcher below.
let pendingLoadAnnotations: MeldAnnotation[] | null = null

watch(controllerRef, (controller) => {
  if (controller && pendingLoadAnnotations) {
    const queued = pendingLoadAnnotations
    pendingLoadAnnotations = null
    controller.loadAnnotations(queued)
  }
})

function handleBookmarkNavigate(target: PdfBookmarkObject['target']) {
  if (!target) return
  if (target.type === 'destination') {
    const dest = target.destination
    if (dest && typeof dest === 'object' && 'pageIndex' in dest) {
      const pageIndex = (dest as { pageIndex: number }).pageIndex
      controllerRef.value?.goToPage(pageIndex + 1)
    }
  }
}

defineExpose({
  controller: controllerRef,
  // Convenience methods that proxy to the controller — safe even when null.
  zoomIn: () => controllerRef.value?.zoomIn(),
  zoomOut: () => controllerRef.value?.zoomOut(),
  requestZoom: (level: number | 'fit-page' | 'fit-width' | 'actual-size' | 'automatic') => {
    if (level === 'actual-size') return controllerRef.value?.actualSize()
    if (level === 'fit-width') return controllerRef.value?.fitWidth()
    if (level === 'fit-page') return controllerRef.value?.fitPage()
    if (level === 'automatic') return controllerRef.value?.requestZoom('automatic' as never)
    return controllerRef.value?.requestZoom(level)
  },
  rotateClockwise: () => controllerRef.value?.rotateClockwise(),
  rotateCounterClockwise: () => controllerRef.value?.rotateCounterClockwise(),
  setRotationDegrees: (deg: 0 | 90 | 180 | 270) => controllerRef.value?.setRotationDegrees(deg),
  setViewMode: (mode: ViewMode) => controllerRef.value?.setViewMode(mode),
  setInteractionMode: (mode: InteractionMode) => controllerRef.value?.setInteractionMode(mode),
  togglePan: () => controllerRef.value?.togglePan(),
  toggleFullscreen: (targetElement?: string) =>
    controllerRef.value?.toggleFullscreen(targetElement),
  exitFullscreen: () => controllerRef.value?.exitFullscreen(),
  goToPage: (page: number) => controllerRef.value?.goToPage(page),
  nextPage: () => controllerRef.value?.nextPage(),
  prevPage: () => controllerRef.value?.prevPage(),
  copySelection: () => controllerRef.value?.copySelection(),
  // Search
  searchKeyword: (keyword: string) => controllerRef.value?.searchKeyword(keyword),
  nextMatch: () => controllerRef.value?.nextMatch(),
  previousMatch: () => controllerRef.value?.previousMatch(),
  setMatchCase: (enabled: boolean) => controllerRef.value?.setMatchCase(enabled),
  setWholeWord: (enabled: boolean) => controllerRef.value?.setWholeWord(enabled),
  clearSearch: () => controllerRef.value?.clearSearch(),
  // Export
  downloadDocument: () => controllerRef.value?.downloadDocument(),
  saveAsCopy: (): Promise<ArrayBuffer> =>
    controllerRef.value?.saveAsCopy() ?? Promise.resolve(new ArrayBuffer(0)),
  printDocument: (): Promise<void> =>
    controllerRef.value?.printDocument() ?? Promise.resolve(),
  // Annotations
  setActiveTool: (toolId: string | null) => controllerRef.value?.setActiveTool(toolId),
  createAnnotation: (input: CreateAnnotationInput): MeldAnnotation => {
    const created = controllerRef.value?.createAnnotation(input)
    if (!created) throw new Error('MeldPdfRenderer: controller not ready')
    return created
  },
  updateAnnotation: (id: string, patch: Partial<MeldAnnotation>) =>
    controllerRef.value?.updateAnnotation(id, patch),
  deleteAnnotation: (id: string) => controllerRef.value?.deleteAnnotation(id),
  selectAnnotationById: (id: string) => controllerRef.value?.selectAnnotationById(id),
  deselectAll: () => controllerRef.value?.deselectAll(),
  getAnnotations: (filter?: AnnotationFilter): MeldAnnotation[] =>
    controllerRef.value?.getAnnotations(filter) ?? [],
  importAnnotations: (items: AnnotationTransferItem[]) =>
    controllerRef.value?.importAnnotations(items),
  exportAnnotations: (filter?: AnnotationFilter): Promise<AnnotationTransferItem[]> =>
    controllerRef.value?.exportAnnotations(filter) ?? Promise.resolve([]),
  // MeldViewer calls this as soon as the renderer mounts, but the controller
  // (mounted inside the EmbedPDF slot once `activeDocumentId` exists) may
  // still be null. Queue the load so it fires the moment the controller is
  // ready — see the corresponding watcher below.
  loadAnnotations: (annotations: MeldAnnotation[]) => {
    if (controllerRef.value) controllerRef.value.loadAnnotations(annotations)
    else pendingLoadAnnotations = annotations
  },
  undoLastAction: () => controllerRef.value?.undoLastAction(),
  redoLastAction: () => controllerRef.value?.redoLastAction(),
  canUndo: (): boolean => controllerRef.value?.canUndo() ?? false,
  canRedo: (): boolean => controllerRef.value?.canRedo() ?? false,
})
</script>

<template>
  <div class="meld-pdf-renderer relative flex h-full flex-1 overflow-hidden">
    <div
      v-if="isLoading"
      class="flex h-full w-full items-center justify-center text-sm text-muted-foreground"
    >
      Loading PDF engine&hellip;
    </div>

    <div
      v-else-if="error"
      class="flex h-full w-full items-center justify-center text-sm text-destructive"
      role="alert"
    >
      Error loading PDF engine: {{ error.message }}
    </div>

    <EmbedPDF v-else-if="engine" :engine="engine" :plugins="plugins" class="h-full w-full">
      <template #default="{ coreState }">
        <template v-if="coreState && coreState.activeDocumentId">
          <MeldPdfController
            ref="controllerRef"
            :document-id="coreState.activeDocumentId"
            :command-callbacks="commandCallbacks"
            :keyboard-shortcuts-enabled="keyboardShortcutsEnabled"
            @page-change="(p) => emit('page-change', p)"
            @zoom-change="(p) => emit('zoom-change', p)"
            @rotation-change="(p) => emit('rotation-change', p)"
            @view-mode-change="(p) => emit('view-mode-change', p)"
            @interaction-mode-change="(p) => emit('interaction-mode-change', p)"
            @fullscreen-change="(p) => emit('fullscreen-change', p)"
            @search-state-change="(p) => emit('search-state-change', p)"
            @annotation-created="(p) => emit('annotation-created', p)"
            @annotation-updated="(p) => emit('annotation-updated', p)"
            @annotation-deleted="(p) => emit('annotation-deleted', p)"
            @annotation-selected="(p) => emit('annotation-selected', p)"
            @active-annotation-tool-change="(p) => emit('active-annotation-tool-change', p)"
          />

          <DocumentContent :document-id="coreState.activeDocumentId">
            <template #default="{ isLoaded }">
              <div v-if="isLoaded" class="flex h-full w-full">
                <!-- Thumbnails side panel (left) -->
                <MeldViewerSidePanel
                  v-if="resolvedFeatures.thumbnails"
                  title="Thumbnails"
                  position="left"
                  width="180px"
                  :is-open="isThumbnailsOpen"
                  @close="emit('close-thumbnails')"
                >
                  <!--
                    `v-if="isThumbnailsOpen"` prevents ThumbnailsPane (and
                    PDFium thumbnail rasterization) from running while the
                    side panel is hidden. `MeldViewerSidePanel` uses `v-show`
                    for its open/close transition, so without this guard the
                    pane would mount inside a `display: none` container and
                    still rasterize every thumbnail on document load.
                  -->
                  <MeldThumbnailsPanel
                    v-if="isThumbnailsOpen"
                    :document-id="coreState.activeDocumentId"
                    :current-page="currentPage"
                    @select-page="(p) => controllerRef?.goToPage(p)"
                  />
                </MeldViewerSidePanel>

                <!--
                  `<GlobalPointerProvider>` and `<PagePointerProvider>` bridge
                  browser pointer events into the EmbedPDF InteractionManager.
                  Without these, registered handlers (Selection, Pan, Annotation
                  tools) never fire — pointer events have nowhere to go.
                -->
                <GlobalPointerProvider :document-id="coreState.activeDocumentId">
                  <Viewport
                    :document-id="coreState.activeDocumentId"
                    class="h-full flex-1 bg-muted"
                  >
                    <Scroller :document-id="coreState.activeDocumentId">
                      <template #default="{ page }">
                        <!--
                          `@dragstart.prevent` stops the browser's HTML5 native
                          drag-and-drop kicking in on the rendered <img> bitmaps.
                          Without it, pointer-down on the page launches a drag
                          ghost preview and pointermove/up are hijacked into
                          drag-and-drop events.

                          `<Rotate>` from @embedpdf/plugin-rotate/vue applies a
                          CSS matrix transform so the page content visually
                          rotates with the rotate plugin's state. It's the
                          canonical headless-Vue pattern from EmbedPDF's docs.
                          The Scroller slot already sizes its wrapper to
                          `rotatedWidth/rotatedHeight`, so `<Rotate>` only needs
                          to apply the transform — it doesn't need our outer div
                          to also use rotated dims.
                        -->
                        <div
                          class="meld-pdf-page relative bg-white shadow-sm select-none"
                          :data-page-index="page.pageIndex"
                          :style="{
                            width: `${page.rotatedWidth}px`,
                            height: `${page.rotatedHeight}px`,
                          }"
                          @dragstart.prevent
                        >
                          <!--
                            Click-capture overlay used by the "add comment"
                            flow. Active only when MeldViewer flips us into
                            `pendingCommentMode`; otherwise it's untouchable
                            so normal annotation/selection clicks pass
                            through to the layers below.
                          -->
                          <div
                            v-if="pendingCommentMode"
                            class="meld-comment-overlay absolute inset-0 z-20 cursor-crosshair"
                            :data-page-index="page.pageIndex"
                            @pointerdown.capture="(e) => handleCommentOverlayDown(e, page.pageIndex)"
                          />
                          <!--
                            Single-modal comment form, anchored to the latest
                            click coord. Sibling-to-overlay so its pointerdown
                            (in `MeldCommentForm` itself) can `stopPropagation`
                            to prevent the overlay from re-targeting the form.
                          -->
                          <MeldCommentForm
                            v-if="
                              pendingCommentPosition &&
                              pendingCommentPosition.pageIndex === page.pageIndex
                            "
                            :x="pendingCommentPosition.x"
                            :y="pendingCommentPosition.y"
                            :page-width="pendingCommentPosition.pageWidth"
                            :page-height="pendingCommentPosition.pageHeight"
                            @submit="(c: string) => emit('comment-submit', c)"
                            @cancel="emit('comment-cancel')"
                          />
                          <Rotate
                            :document-id="coreState.activeDocumentId"
                            :page-index="page.pageIndex"
                          >
                            <PagePointerProvider
                              :document-id="coreState.activeDocumentId"
                              :page-index="page.pageIndex"
                            >
                              <RenderLayer
                                :document-id="coreState.activeDocumentId"
                                :page-index="page.pageIndex"
                              />
                              <TilingLayer
                                :document-id="coreState.activeDocumentId"
                                :page-index="page.pageIndex"
                              />
                              <SearchLayer
                                v-if="resolvedFeatures.search"
                                :document-id="coreState.activeDocumentId"
                                :page-index="page.pageIndex"
                                highlight-color="rgba(255, 235, 59, 0.4)"
                                active-highlight-color="rgba(255, 152, 0, 0.6)"
                              />
                              <SelectionLayer
                                v-if="resolvedFeatures.selection"
                                :document-id="coreState.activeDocumentId"
                                :page-index="page.pageIndex"
                              />
                              <AnnotationLayer
                                :document-id="coreState.activeDocumentId"
                                :page-index="page.pageIndex"
                              >
                                <!--
                                  Floating actions over a selected annotation.
                                  Plugin positions this slot for us (the
                                  `menuWrapperProps` carry pointer-event guards
                                  and absolute positioning style). We render
                                  the highlight tooltip only for highlight
                                  annotations; other types fall through to the
                                  default selection outline only.
                                -->
                                <template
                                  #selection-menu="{
                                    selected,
                                    context,
                                    menuWrapperProps,
                                    rect,
                                  }"
                                >
                                  <!--
                                    `menuWrapperProps` give an absolutely-positioned
                                    wrapper laid over the annotation's bounding
                                    rect, with `pointer-events: none` so page
                                    clicks pass through. To render the tooltip
                                    *below* the highlight and re-enable clicks,
                                    we add an inner positioned div per the
                                    EmbedPDF docs pattern.
                                  -->
                                  <div v-if="selected" v-bind="menuWrapperProps">
                                    <!--
                                      Invisible signal component — emits
                                      select/deselect lifecycle events so
                                      MeldViewer can track the active row in
                                      the panel without relying on EmbedPDF's
                                      `getSelectedAnnotationIds()` (which
                                      doesn't reflect imported annotations
                                      reliably in 2.14.2). Lives outside the
                                      positioned inner div so it has no visual
                                      footprint of its own.
                                    -->
                                    <SelectionSignal
                                      :annotation-id="context.annotation.object.id"
                                      :annotation-subtype="
                                        context.annotation.object.type
                                      "
                                      @select="
                                        (payload) =>
                                          handleSlotSelection(
                                            payload.annotationId,
                                            payload.annotationSubtype,
                                          )
                                      "
                                      @deselect="
                                        (id) => handleSlotDeselection(id)
                                      "
                                    />
                                    <div
                                      v-if="
                                        context.annotation.object.type ===
                                        HIGHLIGHT_SUBTYPE
                                      "
                                      :style="{
                                        position: 'absolute',
                                        top: `${rect.size.height + 8}px`,
                                        left: '0',
                                        pointerEvents: 'auto',
                                      }"
                                      @pointerdown.stop
                                      @mousedown.stop
                                    >
                                      <MeldHighlightTooltip
                                        :current-color="
                                          (context.annotation.object as any).color ?? ''
                                        "
                                        @change-color="
                                          (color) =>
                                            handleHighlightColorChange(
                                              context.pageIndex,
                                              context.annotation.object.id,
                                              color,
                                            )
                                        "
                                        @add-comment="
                                          handleHighlightAddComment(
                                            context.pageIndex,
                                            context.annotation.object.id,
                                          )
                                        "
                                        @delete="
                                          handleHighlightDelete(
                                            context.pageIndex,
                                            context.annotation.object.id,
                                          )
                                        "
                                      />
                                    </div>
                                  </div>
                                </template>
                              </AnnotationLayer>
                            </PagePointerProvider>
                          </Rotate>
                        </div>
                      </template>
                    </Scroller>
                  </Viewport>
                </GlobalPointerProvider>

                <!-- Outline side panel (right) -->
                <MeldViewerSidePanel
                  v-if="resolvedFeatures.outline"
                  title="Outline"
                  position="right"
                  width="280px"
                  :is-open="isOutlineOpen"
                  @close="emit('close-outline')"
                >
                  <MeldOutlinePanel
                    :document-id="coreState.activeDocumentId"
                    @navigate="handleBookmarkNavigate"
                  />
                </MeldViewerSidePanel>
              </div>
            </template>
          </DocumentContent>
        </template>
      </template>
    </EmbedPDF>
  </div>
</template>

