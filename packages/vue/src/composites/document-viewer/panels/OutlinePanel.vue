<script setup lang="ts">
/**
 * OutlinePanel — hierarchical bookmark tree backed by `useBookmarkCapability`.
 *
 * Lives inside the `<EmbedPDF>` tree (mounted by PdfViewer) so the
 * Bookmark plugin composables resolve their provider.
 */
import { onMounted, ref, watch } from 'vue'
import type { PdfBookmarkObject } from '@embedpdf/models'
import { useBookmarkCapability } from '@embedpdf/plugin-bookmark/vue'
import OutlineNode from './OutlineNode.vue'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  documentId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'navigate', target: PdfBookmarkObject['target']): void
}>()

const bookmarks = ref<PdfBookmarkObject[]>([])
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

const bookmarkCap = useBookmarkCapability()

async function loadBookmarks() {
  const cap = bookmarkCap.provides.value
  if (!cap) return
  isLoading.value = true
  errorMessage.value = null
  try {
    await new Promise<void>((resolve, reject) => {
      cap
        .forDocument(props.documentId)
        .getBookmarks()
        .wait(
          (result) => {
            bookmarks.value = result.bookmarks
            resolve()
          },
          (reason) => reject(reason),
        )
    })
  } catch (e) {
    errorMessage.value = (e as Error)?.message ?? 'Failed to load outline'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (bookmarkCap.provides.value) loadBookmarks()
})

// Re-load if the capability becomes available after mount or the doc changes.
watch(
  () => [bookmarkCap.provides.value, props.documentId] as const,
  ([cap]) => {
    if (cap) loadBookmarks()
  },
)

function handleNavigate(item: PdfBookmarkObject) {
  if (item.target) emit('navigate', item.target)
}
</script>

<template>
  <div class="outline-panel flex h-full flex-col">
    <div v-if="isLoading" class="px-4 py-3 text-sm text-muted-foreground">
      Loading outline&hellip;
    </div>
    <div v-else-if="errorMessage" class="px-4 py-3 text-sm text-destructive">
      {{ errorMessage }}
    </div>
    <div v-else-if="bookmarks.length === 0" class="px-4 py-3 text-sm text-muted-foreground">
      This document has no outline.
    </div>
    <ScrollArea v-else class="min-h-0 flex-1">
      <ul role="tree" class="px-2 py-2">
        <OutlineNode
          v-for="(item, index) in bookmarks"
          :key="index"
          :item="item"
          :level="0"
          @navigate="handleNavigate"
        />
      </ul>
    </ScrollArea>
  </div>
</template>
