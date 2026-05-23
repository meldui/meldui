<script setup lang="ts">
/**
 * MeldCommentMarker — custom renderer for sticky-note annotations.
 *
 * Replaces EmbedPDF's default Text-annotation visual (a yellow rectangle)
 * with a doqo-style circular pin + tail + reply-count badge. Mounted in
 * the annotation layer via `createRenderer({ matches, component })` +
 * `useRegisterRenderers([...])` in MeldPdfRenderer.
 *
 * Hover preview: the marker wraps in a MeldUI `<Tooltip>` showing the
 * author and a 100-char excerpt of the comment so users can scan content
 * without opening the side panel.
 *
 * `appearanceActive` (passed by the layer) is true while the PDF's
 * appearance stream is providing the visual; in that case the layer wants
 * us to draw a hit-area only. We always draw the marker visual — the AP
 * stream for sticky notes is a yellow square, which is exactly what we
 * replace.
 */
import { computed, inject, type Ref } from 'vue'
import type { PdfTextAnnoObject } from '@embedpdf/models'
import { IconMessageCircle2Filled } from '@meldui/tabler-vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip'
import type { AnnotationRendererProps } from '@embedpdf/plugin-annotation/vue'
import type { MeldThread } from '../types'
import { MELD_THREADS_INJECT_KEY } from '../injectionKeys'

const props = defineProps<AnnotationRendererProps<PdfTextAnnoObject>>()

/**
 * Reply-count metadata is provided by MeldViewer (the host) via provide/
 * inject — the renderer can't receive arbitrary props through the
 * registry, so we lean on Vue's injection contract instead.
 */
const threadsByAnnotationId = inject<Ref<ReadonlyMap<string, MeldThread>> | null>(
  MELD_THREADS_INJECT_KEY,
  null,
)

const replyCount = computed<number>(() => {
  const id = props.currentObject.id
  const thread = threadsByAnnotationId?.value?.get(id)
  return thread?.replies.length ?? 0
})

const previewText = computed<string>(() => {
  const raw = props.currentObject.contents ?? ''
  const trimmed = raw.length > 100 ? `${raw.slice(0, 100)}…` : raw
  return trimmed || 'No content'
})

const authorText = computed<string>(() => props.currentObject.author ?? 'Anonymous')

const badgeText = computed(() => (replyCount.value > 9 ? '9+' : String(replyCount.value)))

function handlePointerDown(e: PointerEvent) {
  // Forward to the layer's click handler so the plugin's selection flow runs.
  props.onClick?.(e)
}
</script>

<template>
  <TooltipProvider :delay-duration="120">
    <Tooltip>
      <TooltipTrigger as-child>
        <div
          class="meld-comment-marker pointer-events-auto absolute inset-0 flex items-start justify-start"
          :data-annotation-id="currentObject.id"
          :data-selected="isSelected"
          @pointerdown="handlePointerDown"
        >
          <span
            class="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
            :class="{
              'ring-2 ring-primary ring-offset-2 ring-offset-background': isSelected,
            }"
            aria-hidden="true"
          >
            <IconMessageCircle2Filled :size="14" />
            <!-- Tail / pointer beneath the pin -->
            <span
              class="absolute -bottom-1 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent"
              :style="{ borderTopColor: 'var(--primary, currentColor)' }"
              aria-hidden="true"
            />
            <!-- Reply-count badge -->
            <span
              v-if="replyCount > 0"
              class="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold leading-none text-destructive-foreground"
            >
              {{ badgeText }}
            </span>
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="start" class="max-w-xs">
        <p class="text-xs font-semibold">{{ authorText }}</p>
        <p class="mt-1 whitespace-pre-wrap text-xs opacity-80">{{ previewText }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
