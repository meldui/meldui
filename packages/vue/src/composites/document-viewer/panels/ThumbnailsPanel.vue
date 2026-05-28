<script setup lang="ts">
/**
 * ThumbnailsPanel — sidebar of page thumbnails backed by EmbedPDF's
 * `ThumbnailsPane` (handles windowing / lazy rendering automatically).
 *
 * Lives inside the `<EmbedPDF>` tree (mounted by PdfViewer).
 *
 * The slot uses **absolute positioning** (`top: meta.top`, fixed
 * `wrapperHeight`) — this is what enables ThumbnailsPane's virtualization.
 * Without it, every rendered thumb consumes layout space, the scrollHeight
 * shifts, and ThumbnailsPane re-evaluates which thumbs are visible, causing
 * an infinite re-render loop. Pattern matches EmbedPDF's official Vue
 * reference (docs/vue/headless/plugins/plugin-thumbnail).
 */
import { ThumbImg, ThumbnailsPane } from '@embedpdf/plugin-thumbnail/vue'
import { cn } from '../../../lib/utils'
import { vMeldScroll } from '../directives/meldScroll'

interface Props {
  documentId: string
  currentPage?: number
}

const props = withDefaults(defineProps<Props>(), { currentPage: 1 })

const emit = defineEmits<{
  (e: 'select-page', page: number): void
}>()

function handleClick(pageIndex: number) {
  emit('select-page', pageIndex + 1) // pageIndex is 0-based, page numbers are 1-based
}
</script>

<template>
  <div class="thumbnails-panel relative h-full overflow-hidden">
    <ThumbnailsPane v-meld-scroll :document-id="documentId">
      <template #default="{ meta }">
        <button
          :key="meta.pageIndex"
          type="button"
          class="absolute flex w-full cursor-pointer flex-col items-center px-2 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          :style="{
            top: `${meta.top}px`,
            height: `${meta.wrapperHeight}px`,
          }"
          :aria-label="`Go to page ${meta.pageIndex + 1}`"
          :aria-current="props.currentPage - 1 === meta.pageIndex ? 'page' : undefined"
          @click="handleClick(meta.pageIndex)"
        >
          <div
            :class="
              cn(
                'overflow-hidden rounded-md transition-all',
                props.currentPage - 1 === meta.pageIndex
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : 'ring-1 ring-border hover:ring-foreground/40',
              )
            "
            :style="{
              width: `${meta.width}px`,
              height: `${meta.height}px`,
            }"
          >
            <ThumbImg
              :document-id="documentId"
              :meta="meta"
              :style="{ width: '100%', height: '100%', objectFit: 'contain' }"
            />
          </div>
          <div
            class="mt-1 flex items-center justify-center"
            :style="{ height: `${meta.labelHeight}px` }"
          >
            <span
              :class="
                cn(
                  'text-xs font-medium tabular-nums',
                  props.currentPage - 1 === meta.pageIndex
                    ? 'text-primary'
                    : 'text-muted-foreground',
                )
              "
            >
              {{ meta.pageIndex + 1 }}
            </span>
          </div>
        </button>
      </template>
    </ThumbnailsPane>
  </div>
</template>
