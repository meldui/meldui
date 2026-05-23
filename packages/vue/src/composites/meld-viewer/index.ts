/**
 * MeldViewer — public exports.
 *
 * The viewer composite is split across many files (~20+ at Phase 1 release).
 * Consumers import the top-level `MeldViewer` plus any types they need.
 */

export { default as MeldViewer } from './MeldViewer.vue'
export { default as MeldViewerToolbar } from './MeldViewerToolbar.vue'
export { default as MeldViewerSidePanel } from './MeldViewerSidePanel.vue'
export { default as MeldSearchPopover } from './MeldSearchPopover.vue'
export { default as MeldOutlinePanel } from './panels/MeldOutlinePanel.vue'
export { default as MeldThumbnailsPanel } from './panels/MeldThumbnailsPanel.vue'
export { default as MeldAnnotationsPanel } from './panels/MeldAnnotationsPanel.vue'
export { default as AnnotationRow } from './panels/AnnotationRow.vue'
export { default as CommentReplyForm } from './panels/CommentReplyForm.vue'

export { buildMeldCommands } from './composables/useMeldCommands'
export type { MeldCommandCallbacks } from './composables/useMeldCommands'
export { useMeldTouch } from './composables/useMeldTouch'
export type { MeldTouchHandlers, MeldTouchOptions } from './composables/useMeldTouch'
export { useAnnotationThreads } from './composables/useAnnotationThreads'
export type { UseAnnotationThreadsReturn } from './composables/useAnnotationThreads'
export { meldToPdf, pdfToMeld } from './utils/annotationMapping'
export {
  printImage,
  printMarkdown,
  printText,
  resolveSourceToText,
} from './composables/useMeldPrint'

export type * from './types'
// HIGHLIGHT_COLORS / DEFAULT_HIGHLIGHT_COLOR are runtime values, so they need
// a separate (non-type) re-export. Consumers seeding programmatic highlights
// or building custom toolbars should reference these so the palette stays in
// sync with the floating tooltip swatches.
export { HIGHLIGHT_COLORS, DEFAULT_HIGHLIGHT_COLOR } from './types'
export { detectDocumentType, isPdfType, sourceToUrl } from './utils/documentType'
export { DEFAULT_FEATURES, resolveFeatures } from './plugins/pluginRegistry'
