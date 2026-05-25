<script setup lang="ts">
/**
 * MeldHighlightTooltip — floating affordance shown over a selected highlight.
 *
 * Mounted inside `<AnnotationLayer>`'s `#selection-menu` scoped slot. The
 * plugin positions us automatically (respecting page rotation). Renders:
 *
 *   1. Five colour preset swatches (re-colour the highlight)
 *   2. A comment-plus icon — click expands an inline reply form below
 *      the swatch row
 *   3. A view-thread icon, rendered only when the highlight already has
 *      replies. Shows a count badge, previews the latest reply on hover
 *      (author + ~100-char excerpt), and on click asks the host to open
 *      the side annotations panel focused on this thread
 *   4. A delete button
 *
 * The component reads the annotation's reply thread directly via inject so
 * it can render the hover preview and count without prop drilling. The
 * host listens for `add-reply` / `view-thread` and routes them through
 * `useAnnotationThreads.addReply` / panel-focus state respectively.
 */
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'
import { Button } from '../../components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip'
import { IconMessageCircle, IconMessageCirclePlus, IconTrash } from '@meldui/tabler-vue'
import { HIGHLIGHT_COLORS } from './types'
import type { MeldThread } from './types'
import { MELD_THREADS_INJECT_KEY } from './injectionKeys'

interface Props {
  /** UUID of the highlight annotation this tooltip is anchored to. */
  annotationId: string
  /** Current `color` value on the annotation — drives the active-swatch ring. */
  currentColor: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'change-color', color: string): void
  (e: 'add-reply', content: string): void
  /**
   * User clicked the view-thread icon. The host should open the annotations
   * side panel and focus the row for this annotation (typically also
   * deselects the highlight so the floating tooltip unmounts).
   */
  (e: 'view-thread'): void
  (e: 'delete'): void
}>()

// ─── Active-swatch detection ───────────────────────────────────────────────
function normalize(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase()
}
const normalizedCurrent = computed(() => normalize(props.currentColor))
function isActive(value: string): boolean {
  return normalizedCurrent.value === normalize(value)
}

// ─── Hover preview: read the annotation's thread via inject ────────────────
//
// MeldViewer.vue provides a reactive Map<annotationId, MeldThread>. We pull
// the latest reply out for the hover tooltip on the comment icon. This is the
// same pattern `MeldCommentMarker.vue` uses for sticky-note pins.
const threadsByAnnotationId = inject<Ref<ReadonlyMap<string, MeldThread>> | null>(
  MELD_THREADS_INJECT_KEY,
  null,
)
const thread = computed(() => threadsByAnnotationId?.value?.get(props.annotationId) ?? null)
const replyCount = computed<number>(() => thread.value?.replies.length ?? 0)
const hasReplies = computed<boolean>(() => replyCount.value > 0)
const replyCountLabel = computed<string>(() =>
  replyCount.value > 9 ? '9+' : String(replyCount.value),
)
const latestReply = computed(() => {
  const t = thread.value
  if (!t || t.replies.length === 0) return null
  return t.replies[t.replies.length - 1]
})
const previewText = computed<string>(() => {
  const raw = latestReply.value?.content ?? ''
  return raw.length > 100 ? `${raw.slice(0, 100)}…` : raw
})
const previewAuthor = computed<string>(() => latestReply.value?.authorName ?? 'Anonymous')

// ─── Inline comment form state ─────────────────────────────────────────────
const isCommentFormOpen = ref(false)
const draft = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function toggleCommentForm() {
  if (isCommentFormOpen.value) {
    cancelCommentForm()
    return
  }
  isCommentFormOpen.value = true
  draft.value = ''
}

function cancelCommentForm() {
  isCommentFormOpen.value = false
  draft.value = ''
}

function submitCommentForm() {
  const trimmed = draft.value.trim()
  if (!trimmed) {
    cancelCommentForm()
    return
  }
  emit('add-reply', trimmed)
  // Host will deselect the annotation in response, which unmounts this slot;
  // local state reset is defensive in case the host changes that behaviour.
  cancelCommentForm()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    cancelCommentForm()
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    submitCommentForm()
  }
}

// Autofocus textarea every time the form opens.
watch(isCommentFormOpen, (open) => {
  if (!open) return
  void nextTick().then(() => textareaRef.value?.focus())
})

// ─── Boundary-clamp: keep tooltip inside the visible scroll viewport ──────
//
// The renderer anchors us at `top: highlightHeight + 8; left: 0` relative
// to the highlight rect (so we float just below the highlight). The
// effective boundary is the *intersection* of two rects:
//
//   1. The PDF page (the nearest `[data-page-index]` ancestor) — prevents
//      the tooltip from spilling sideways into the side panel even when
//      the page is fully scrolled into view.
//   2. The scroll container (the nearest ancestor with overflow:auto/scroll)
//      — handles the common case where the page is taller than the
//      visible viewport: even though there's room on the PDF page below,
//      the tooltip would render off-screen for the user.
//
// When the tooltip overflows the bottom of that intersection, we flip it
// to sit above the highlight. If neither below nor above fits, we clamp
// to the top of the intersection.
const rootRef = ref<HTMLElement | null>(null)
const horizontalShift = ref(0)
const verticalShift = ref(0)

function findPageBoundary(el: HTMLElement): HTMLElement | null {
  let cur: HTMLElement | null = el.parentElement
  while (cur) {
    if (cur.hasAttribute('data-page-index')) return cur
    cur = cur.parentElement
  }
  return null
}

function findScrollContainer(el: HTMLElement): HTMLElement | null {
  let cur: HTMLElement | null = el.parentElement
  while (cur && cur !== document.documentElement) {
    const cs = getComputedStyle(cur)
    if (/(auto|scroll|overlay)/.test(cs.overflowY || cs.overflow || '')) {
      return cur
    }
    cur = cur.parentElement
  }
  return null
}

interface BoundaryRect {
  left: number
  right: number
  top: number
  bottom: number
}

function intersectBoundaries(a: BoundaryRect, b: BoundaryRect | null): BoundaryRect {
  if (!b) return a
  return {
    left: Math.max(a.left, b.left),
    right: Math.min(a.right, b.right),
    top: Math.max(a.top, b.top),
    bottom: Math.min(a.bottom, b.bottom),
  }
}

function measureAndClamp() {
  const el = rootRef.value
  if (!el) return
  const page = findPageBoundary(el)
  if (!page) return
  const scroller = findScrollContainer(el)
  const elRect = el.getBoundingClientRect()
  const pageRect = page.getBoundingClientRect()
  const boundary = intersectBoundaries(pageRect, scroller ? scroller.getBoundingClientRect() : null)
  const gutter = 8
  // Subtract the currently-applied shifts to recover the natural rect, so
  // the calculation converges regardless of any previous adjustment.
  const naturalLeft = elRect.left - horizontalShift.value
  const naturalRight = elRect.right - horizontalShift.value
  const naturalTop = elRect.top - verticalShift.value
  const naturalBottom = elRect.bottom - verticalShift.value
  const naturalHeight = naturalBottom - naturalTop

  // Horizontal: shift to keep both edges inside the boundary.
  let hShift = 0
  if (naturalRight > boundary.right - gutter) {
    hShift = boundary.right - gutter - naturalRight
  }
  if (naturalLeft + hShift < boundary.left + gutter) {
    hShift = boundary.left + gutter - naturalLeft
  }
  horizontalShift.value = hShift

  // Vertical: if the tooltip overflows below the boundary, try flipping it
  // above the highlight. Recover the highlight's height from the renderer
  // wrapper's inline `top: ${highlightHeight + 8}px`. A flip places the
  // tooltip at `bottom: highlightHeight + 8` above, which is a vertical
  // delta of -(highlightHeight + 2*gutter + tooltipHeight). The flip is
  // only used if BOTH edges of the flipped tooltip fit inside the
  // boundary — otherwise we clamp to keep the tooltip inside (preferring
  // to align the bottom edge to the boundary, falling back to the top
  // when the tooltip is taller than the boundary slot).
  let vShift = 0
  if (naturalBottom > boundary.bottom - gutter) {
    const wrapper = el.parentElement as HTMLElement | null
    const wrapperTopPx = wrapper ? Number.parseFloat(wrapper.style.top || '0') || 0 : 0
    const highlightHeight = Math.max(0, wrapperTopPx - gutter)
    const flipDelta = -(highlightHeight + naturalHeight + 2 * gutter)
    const flippedTop = naturalTop + flipDelta
    const flippedBottom = naturalBottom + flipDelta
    const flipFits =
      flippedTop >= boundary.top + gutter && flippedBottom <= boundary.bottom - gutter
    if (flipFits) {
      vShift = flipDelta
    } else {
      // Neither below nor above fits. Clamp the bottom edge to the boundary;
      // if that pushes the top out (tooltip taller than the visible slot),
      // fall back to aligning the top instead.
      vShift = boundary.bottom - gutter - naturalBottom
      if (naturalTop + vShift < boundary.top + gutter) {
        vShift = boundary.top + gutter - naturalTop
      }
    }
  }
  verticalShift.value = vShift
}

let resizeObserver: ResizeObserver | null = null
let scrollContainer: HTMLElement | null = null
const onScrollOrResize = () => measureAndClamp()

onMounted(() => {
  void nextTick().then(measureAndClamp)
  if (!rootRef.value) return
  const page = findPageBoundary(rootRef.value)
  scrollContainer = findScrollContainer(rootRef.value)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onScrollOrResize)
    if (page) resizeObserver.observe(page)
    if (scrollContainer) resizeObserver.observe(scrollContainer)
  }
  // Scroll within the viewport changes the visible boundary even if no
  // element resizes — re-measure on scroll to keep the flip in sync.
  scrollContainer?.addEventListener('scroll', onScrollOrResize, {
    passive: true,
  })
})
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  scrollContainer?.removeEventListener('scroll', onScrollOrResize)
  scrollContainer = null
})

// Re-measure when the form open/close toggles — that changes our height
// and (with the textarea) our width.
watch(isCommentFormOpen, () => {
  void nextTick().then(measureAndClamp)
})
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <div
      ref="rootRef"
      class="meld-highlight-tooltip flex flex-col gap-1 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
      role="toolbar"
      aria-label="Highlight actions"
      :style="
        horizontalShift !== 0 || verticalShift !== 0
          ? {
              transform: `translate(${horizontalShift}px, ${verticalShift}px)`,
            }
          : undefined
      "
    >
      <!-- Row 1: colour swatches + actions -->
      <div class="flex items-center gap-1">
        <div class="flex items-center gap-1 px-1" role="radiogroup" aria-label="Highlight color">
          <button
            v-for="color in HIGHLIGHT_COLORS"
            :key="color.name"
            type="button"
            role="radio"
            :aria-checked="isActive(color.value)"
            :aria-label="`${color.name} highlight`"
            :title="color.name"
            class="h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
            :class="isActive(color.value) ? 'border-foreground' : 'border-transparent'"
            :style="{ backgroundColor: color.value }"
            @click="emit('change-color', color.value)"
          />
        </div>

        <div class="h-5 w-px bg-border" aria-hidden="true" />

        <!--
          Comment-plus icon: click toggles the inline reply form below the
          swatch row. Hover preview was moved to the view-thread icon since
          this button's job is "add", not "view".
        -->
        <Button
          variant="ghost"
          size="icon-sm"
          :aria-pressed="isCommentFormOpen"
          aria-label="Add comment to highlight"
          title="Add comment"
          @click="toggleCommentForm"
        >
          <IconMessageCirclePlus :size="14" />
        </Button>

        <!--
          View-thread icon: only present when the highlight has at least one
          reply. Hover previews the latest reply (author + excerpt); click
          asks the host to open the side annotations panel focused on this
          thread. The count badge sits on the top-right of the icon.
        -->
        <Tooltip v-if="hasReplies">
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon-sm"
              :aria-label="`View ${replyCount} comment${replyCount === 1 ? '' : 's'}`"
              @click="emit('view-thread')"
            >
              <!--
                Badge is anchored to a span hugging the icon (not the Button)
                so the Button's padding doesn't push it away. Styling matches
                `MeldCommentMarker.vue`'s reply-count badge for consistency.
              -->
              <span class="relative inline-flex">
                <IconMessageCircle :size="14" />
                <span
                  aria-hidden="true"
                  class="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold leading-none text-white"
                >
                  {{ replyCountLabel }}
                </span>
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end" class="max-w-xs">
            <p class="text-xs font-semibold">{{ previewAuthor }}</p>
            <p class="mt-1 whitespace-pre-wrap text-xs opacity-80">
              {{ previewText }}
            </p>
          </TooltipContent>
        </Tooltip>

        <Button
          variant="ghost"
          size="icon-sm"
          class="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete highlight"
          title="Delete highlight"
          @click="emit('delete')"
        >
          <IconTrash :size="14" />
        </Button>
      </div>

      <!--
        Row 2: inline reply form. Sibling-stacked under the action row so the
        floating wrapper grows downward without disturbing the row alignment.
        `@pointerdown.stop` and the `.meld-highlight-tooltip` class on the
        outer wrapper keep MeldPdfController's outside-click-deselect handler
        from firing while the user is typing.
      -->
      <div v-if="isCommentFormOpen" class="flex flex-col gap-2 p-1" @keydown="handleKeydown">
        <textarea
          ref="textareaRef"
          v-model="draft"
          class="min-h-[72px] w-64 resize-none rounded border border-input bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Add a comment…"
        />
        <div class="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" @click="cancelCommentForm">Cancel</Button>
          <Button size="sm" :disabled="!draft.trim()" @click="submitCommentForm">Add</Button>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>
