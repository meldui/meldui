<script setup lang="ts">
/**
 * MeldAnnotationsPanel — side panel listing every annotation in the
 * document, grouped by page with sticky page headers.
 *
 * Differences from the previous `MeldCommentsPanel`:
 *  - Title text is "Annotations" (set on the host `MeldViewerSidePanel`).
 *  - Shows highlights as well as sticky-notes / free-text, regardless of
 *    whether a thread exists yet — the row previews `selectedText` for
 *    highlights, which surfaces highlighted-but-uncommented content in
 *    the panel for the first time.
 *  - Each row exposes a three-dot menu (Edit + Delete) via `AnnotationRow`.
 *  - Items are grouped by `pageIndex`, ascending, with a sticky "Page N"
 *    header above each group.
 */
import { computed } from 'vue'
import AnnotationRow from './AnnotationRow.vue'
import type { MeldAnnotation, MeldThread } from '../types'

interface Props {
  annotations: MeldAnnotation[]
  threads: MeldThread[]
  currentUserId?: string
  showResolved?: boolean
  /**
   * Transient one-shot id used to scroll a specific row into view and
   * expand it (e.g., after clicking a comment marker on the page). The
   * row emits `focus-consumed` once it's claimed the focus so the host
   * can clear this prop.
   */
  focusedAnnotationId?: string | null
  /**
   * Id of the annotation that is currently selected on the page. The
   * matching row renders with an active visual (border + ring + subtle
   * bg) so users can correlate the on-page selection with the panel.
   */
  selectedAnnotationId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  showResolved: true,
  focusedAnnotationId: null,
  selectedAnnotationId: null,
})

const emit = defineEmits<{
  (e: 'navigate', annotation: MeldAnnotation): void
  (e: 'add-reply', payload: { annotationId: string; content: string }): void
  (e: 'delete-reply', payload: { annotationId: string; replyId: string }): void
  (e: 'toggle-resolved', payload: { annotationId: string; resolved: boolean }): void
  (e: 'update', payload: { annotationId: string; patch: { contents: string } }): void
  (e: 'delete', payload: { annotationId: string }): void
  (e: 'focus-consumed'): void
}>()

// Build a (annotation, thread) pair list. Show every annotation that can
// host a thread — highlights without replies should appear so the user can
// see their selected text in the panel.
const items = computed(() => {
  const threadMap = new Map<string, MeldThread>(props.threads.map((t) => [t.annotationId, t]))
  const COMMENTABLE = new Set<MeldAnnotation['type']>(['highlight', 'sticky-note', 'free-text'])

  const pairs = props.annotations
    .filter((a) => COMMENTABLE.has(a.type))
    .map((a) => ({
      annotation: a,
      thread: threadMap.get(a.id) ?? {
        annotationId: a.id,
        isResolved: false,
        replies: [],
      },
    }))

  if (!props.showResolved) return pairs.filter((p) => !p.thread.isResolved)
  return pairs
})

/**
 * Group annotation rows by `pageIndex`. The Map preserves insertion order,
 * so iterating it gives groups ascending by page index as long as we sort
 * the underlying list first.
 */
const groupedByPage = computed(() => {
  const sorted = [...items.value].toSorted(
    (a, b) => a.annotation.pageIndex - b.annotation.pageIndex,
  )
  const groups = new Map<number, typeof sorted>()
  for (const pair of sorted) {
    const list = groups.get(pair.annotation.pageIndex) ?? []
    list.push(pair)
    groups.set(pair.annotation.pageIndex, list)
  }
  return groups
})
</script>

<template>
  <div class="meld-annotations-panel flex h-full flex-col">
    <div v-if="items.length === 0" class="px-4 py-6 text-center text-sm text-muted-foreground">
      No annotations yet.
    </div>

    <div v-else class="flex flex-1 flex-col overflow-auto">
      <template v-for="[pageIndex, pageItems] in groupedByPage" :key="pageIndex">
        <h3
          role="heading"
          aria-level="3"
          class="sticky top-0 z-10 bg-muted/50 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground backdrop-blur"
        >
          Page {{ pageIndex + 1 }}
        </h3>
        <ul class="flex flex-col divide-y divide-border">
          <li v-for="item in pageItems" :key="item.annotation.id">
            <AnnotationRow
              :annotation="item.annotation"
              :thread="item.thread"
              :current-user-id="currentUserId"
              :focused="item.annotation.id === focusedAnnotationId"
              :selected="item.annotation.id === selectedAnnotationId"
              @navigate="(a) => emit('navigate', a)"
              @add-reply="(p) => emit('add-reply', p)"
              @delete-reply="(p) => emit('delete-reply', p)"
              @toggle-resolved="(p) => emit('toggle-resolved', p)"
              @update="(p) => emit('update', p)"
              @delete="(p) => emit('delete', p)"
              @focus-consumed="emit('focus-consumed')"
            />
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>
