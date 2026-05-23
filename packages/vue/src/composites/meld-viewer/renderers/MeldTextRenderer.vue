<script setup lang="ts">
/**
 * MeldTextRenderer — renders a plain-text source as a monospace preformatted
 * block. Supports zoom via font size scaling.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useMeldTextSearch } from '../composables/useMeldTextSearch'
import type { DocumentSource } from '../types'

interface Props {
  source: DocumentSource
  /** Scale factor applied to font size (1 = 14px). */
  scale?: number
}

const props = withDefaults(defineProps<Props>(), { scale: 1 })

const emit = defineEmits<{
  (e: 'loaded'): void
  (e: 'error', payload: { error: string }): void
  (
    e: 'search-state-change',
    payload: { total: number; activeResultIndex: number; matchCase: boolean; wholeWord: boolean },
  ): void
}>()

const content = ref<string>('')
const isLoading = ref(true)
const contentRef = ref<HTMLElement | null>(null)
let abortController: AbortController | null = null

const search = useMeldTextSearch(contentRef)

watch(
  [search.totalMatches, search.currentMatchIndex, search.matchCase, search.wholeWord],
  () => {
    emit('search-state-change', {
      total: search.totalMatches.value,
      activeResultIndex: search.currentMatchIndex.value - 1,
      matchCase: search.matchCase.value,
      wholeWord: search.wholeWord.value,
    })
  },
)

defineExpose({
  searchKeyword: search.searchKeyword,
  nextMatch: search.nextMatch,
  previousMatch: search.previousMatch,
  setMatchCase: search.setMatchCase,
  setWholeWord: search.setWholeWord,
  clearSearch: search.clearSearch,
})

async function loadContent(source: DocumentSource) {
  isLoading.value = true
  abortController?.abort()
  abortController = new AbortController()

  try {
    if (typeof source === 'string') {
      const response = await fetch(source, { signal: abortController.signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      content.value = await response.text()
    } else if (typeof File !== 'undefined' && source instanceof File) {
      content.value = await source.text()
    } else if (typeof Blob !== 'undefined' && source instanceof Blob) {
      content.value = await source.text()
    } else {
      content.value = new TextDecoder().decode(source as ArrayBuffer)
    }
    isLoading.value = false
    emit('loaded')
  } catch (err) {
    if ((err as Error).name === 'AbortError') return
    isLoading.value = false
    emit('error', { error: (err as Error).message })
  }
}

watch(() => props.source, loadContent, { immediate: false })
onMounted(() => loadContent(props.source))
onBeforeUnmount(() => abortController?.abort())
</script>

<template>
  <div
    class="meld-text-renderer h-full w-full overflow-auto bg-muted/30 flex items-start justify-center p-4"
  >
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <div class="flex flex-col items-center gap-2">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
        />
        <span class="text-sm text-muted-foreground">Loading text file&hellip;</span>
      </div>
    </div>

    <div v-else class="relative shadow-lg bg-background max-w-4xl w-full">
      <pre
        ref="contentRef"
        :style="{ fontSize: `${0.875 * scale}rem` }"
        class="whitespace-pre-wrap font-mono p-6 leading-relaxed text-foreground"
        >{{ content }}</pre
      >
    </div>
  </div>
</template>
