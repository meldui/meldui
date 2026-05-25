/**
 * Vue provide/inject keys used to bridge DocumentViewer-level state into
 * components deep inside the EmbedPDF tree (e.g., the custom annotation
 * renderers registered via the plugin-annotation renderer registry).
 *
 * Renderers can't receive arbitrary props from the registry — they get
 * `AnnotationRendererProps` only — so we use injection for any extra
 * context (the live thread map, focused-row coordination, etc.).
 */
import type { InjectionKey, Ref } from 'vue'
import type { CommentThread } from './types'

/**
 * Reactive map of annotation id → thread metadata. Provided by DocumentViewer
 * from the threads composable; consumed by `CommentMarker` to render
 * the reply-count badge.
 */
export const THREADS_INJECT_KEY: InjectionKey<Ref<ReadonlyMap<string, CommentThread>>> = Symbol(
  'threads-by-annotation-id',
)
