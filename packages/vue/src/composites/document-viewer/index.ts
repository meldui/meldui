/**
 * DocumentViewer — public exports.
 *
 * The viewer composite is split across many files (~20+ at Phase 1 release).
 * Consumers import the top-level `DocumentViewer` plus any types they need.
 */

export { default as DocumentViewer } from './DocumentViewer.vue'
export { default as ViewerToolbar } from './ViewerToolbar.vue'
export { default as ViewerSidePanel } from './ViewerSidePanel.vue'
export { default as SearchPopover } from './SearchPopover.vue'

export { default as PdfViewer } from './renderers/PdfViewer.vue'
export { default as ImageViewer } from './renderers/ImageViewer.vue'
export { default as TextViewer } from './renderers/TextViewer.vue'
export { default as MarkdownViewer } from './renderers/MarkdownViewer.vue'

export * from './comments'
export * from './highlights'

export { default as OutlinePanel } from './panels/OutlinePanel.vue'
export { default as ThumbnailsPanel } from './panels/ThumbnailsPanel.vue'
export { default as AnnotationsPanel } from './panels/AnnotationsPanel.vue'
export { default as AnnotationRow } from './panels/AnnotationRow.vue'
export { default as OutlineNode } from './panels/OutlineNode.vue'

export { buildCommands } from './composables/useCommands'
export type { CommandCallbacks } from './composables/useCommands'
export { useTouch } from './composables/useTouch'
export type { TouchHandlers, TouchOptions } from './composables/useTouch'
export { useAnnotationThreads } from './composables/useAnnotationThreads'
export type { UseAnnotationThreadsReturn } from './composables/useAnnotationThreads'
export { annotationToPdf, pdfToAnnotation } from './utils/annotationMapping'
export { printImage, printMarkdown, printText, resolveSourceToText } from './composables/usePrint'

export type * from './types'
// HIGHLIGHT_COLORS / DEFAULT_HIGHLIGHT_COLOR are runtime values, so they need
// a separate (non-type) re-export. Consumers seeding programmatic highlights
// or building custom toolbars should reference these so the palette stays in
// sync with the floating tooltip swatches.
export { HIGHLIGHT_COLORS, DEFAULT_HIGHLIGHT_COLOR } from './types'
export { detectDocumentType, isPdfType, sourceToUrl } from './utils/documentType'
export { DEFAULT_FEATURES, resolveFeatures } from './plugins/pluginRegistry'
