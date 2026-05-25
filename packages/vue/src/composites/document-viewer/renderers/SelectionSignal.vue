<script setup lang="ts">
/**
 * Internal helper: an invisible component mounted inside the
 * `<AnnotationLayer>` `#selection-menu` slot. The slot only renders when an
 * annotation is selected, so this component's mount/unmount lifecycle is a
 * reliable signal of selection state — useful because EmbedPDF 2.14.2's
 * `getSelectedAnnotationIds()` / `state.selectedUid(s)` do not consistently
 * reflect imported (seeded) annotations even though their selection-menu
 * slot does render correctly.
 *
 * Emits `select` with the annotation's id on mount, and `deselect` on
 * unmount.
 */
import { onBeforeUnmount, onMounted, watch } from 'vue'

interface Props {
  annotationId: string
  /**
   * The PDF annotation subtype (a `PdfAnnotationSubtype` enum value) of the
   * currently-selected annotation. Forwarded with `select` so the host can
   * route on type even when its annotations map can't resolve the id (e.g.
   * during the brief gap between import and create-event hydration).
   */
  annotationSubtype: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'select', payload: { annotationId: string; annotationSubtype: number }): void
  (e: 'deselect', annotationId: string): void
}>()

onMounted(() =>
  emit('select', {
    annotationId: props.annotationId,
    annotationSubtype: props.annotationSubtype,
  }),
)

// If the slot re-renders with a different annotation, emit a fresh select.
watch(
  () => props.annotationId,
  (id, prev) => {
    if (prev) emit('deselect', prev)
    emit('select', { annotationId: id, annotationSubtype: props.annotationSubtype })
  },
)

onBeforeUnmount(() => emit('deselect', props.annotationId))
</script>

<template>
  <span aria-hidden="true" />
</template>
