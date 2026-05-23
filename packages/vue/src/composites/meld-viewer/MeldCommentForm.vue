<script setup lang="ts">
/**
 * MeldCommentForm — single-modal comment composer anchored to a page click.
 *
 * Ported from doqo's `CommentForm.vue`. The form is rendered absolute over
 * the page; the host (MeldViewer) computes the click coord in page-local
 * pixel space and passes it via `x`/`y`. Smart placement flips the form
 * horizontally / vertically if it would overflow the page bounds.
 *
 * Only one of these is mounted at a time — the host tracks a single
 * `pendingCommentPosition` ref and clicking elsewhere updates that ref
 * rather than spawning a new form.
 */
import { computed, nextTick, ref, watch } from 'vue'
import { Button } from '../../components/ui/button'

interface Props {
  /** Click X in page-local CSS pixels (origin = page wrapper top-left). */
  x: number
  /** Click Y in page-local CSS pixels. */
  y: number
  /** Page wrapper rendered width in CSS pixels (clamps the form). */
  pageWidth: number
  /** Page wrapper rendered height in CSS pixels (clamps the form). */
  pageHeight: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', content: string): void
  (e: 'cancel'): void
}>()

const FORM_WIDTH = 288
const FORM_HEIGHT = 180
const EDGE_PADDING = 8
const CLICK_OFFSET = 10

const content = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const formStyle = computed(() => {
  let left = props.x + CLICK_OFFSET
  let top = props.y + CLICK_OFFSET

  // Flip horizontally if the form would overflow the right edge.
  if (left + FORM_WIDTH > props.pageWidth - EDGE_PADDING) {
    left = props.x - FORM_WIDTH - CLICK_OFFSET
    if (left < EDGE_PADDING) left = EDGE_PADDING
  }
  // Flip vertically if it would overflow the bottom edge.
  if (top + FORM_HEIGHT > props.pageHeight - EDGE_PADDING) {
    top = props.y - FORM_HEIGHT - CLICK_OFFSET
    if (top < EDGE_PADDING) top = EDGE_PADDING
  }
  // Final clamp.
  left = Math.max(EDGE_PADDING, Math.min(left, props.pageWidth - FORM_WIDTH - EDGE_PADDING))
  top = Math.max(EDGE_PADDING, Math.min(top, props.pageHeight - FORM_HEIGHT - EDGE_PADDING))

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${FORM_WIDTH}px`,
  }
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    emit('cancel')
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    submit()
  }
}

function submit() {
  const trimmed = content.value.trim()
  if (!trimmed) {
    emit('cancel')
    return
  }
  emit('submit', trimmed)
}

// Auto-focus the textarea every time the coords change (i.e. when the host
// moves the same modal to a new click point).
watch(
  () => [props.x, props.y],
  () => {
    void nextTick().then(() => textareaRef.value?.focus())
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="meld-comment-form absolute z-30 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-lg"
    :style="formStyle"
    role="dialog"
    aria-label="Add comment"
    @keydown="handleKeydown"
    @pointerdown.stop
  >
    <textarea
      ref="textareaRef"
      v-model="content"
      class="min-h-[80px] w-full resize-none rounded border border-input bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      placeholder="Add a comment…"
    />
    <div class="mt-2 flex items-center justify-end gap-2">
      <Button variant="ghost" size="sm" @click="emit('cancel')">Cancel</Button>
      <Button size="sm" :disabled="!content.trim()" @click="submit">Add</Button>
    </div>
  </div>
</template>
