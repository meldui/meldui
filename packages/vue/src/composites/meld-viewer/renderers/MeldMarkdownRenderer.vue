<script setup lang="ts">
/**
 * MeldMarkdownRenderer — renders a markdown source as styled HTML using
 * `@incremark/vue` (GFM-enabled). Mirrors the doqo MarkdownViewer setup:
 * IncremarkContent inside a ThemeProvider, with shadcn CSS variables mapped
 * onto the `--incremark-*` tokens so the rendered prose follows the active
 * light/dark theme.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { IncremarkContent, ThemeProvider, type UseIncremarkOptions } from '@incremark/vue'
import '@incremark/theme/styles.css'
import { printMarkdown } from '../composables/useMeldPrint'
import { useMeldTextSearch } from '../composables/useMeldTextSearch'
import type { DocumentSource } from '../types'

interface Props {
  source: DocumentSource
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

const incremarkOptions: UseIncremarkOptions = { gfm: true }

const content = ref<string>('')
const isLoading = ref(true)
const contentRef = ref<HTMLElement | null>(null)

async function printDocument(): Promise<void> {
  if (!contentRef.value) return
  await printMarkdown(contentRef.value, 'Markdown Document')
}

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
  printDocument,
  searchKeyword: search.searchKeyword,
  nextMatch: search.nextMatch,
  previousMatch: search.previousMatch,
  setMatchCase: search.setMatchCase,
  setWholeWord: search.setWholeWord,
  clearSearch: search.clearSearch,
})
let abortController: AbortController | null = null

const isDarkMode = ref(false)
let darkModeObserver: MutationObserver | null = null

function syncDarkMode() {
  if (typeof document === 'undefined') return
  isDarkMode.value = document.documentElement.classList.contains('dark')
}

const incremarkTheme = computed<'default' | 'dark'>(() =>
  isDarkMode.value ? 'dark' : 'default',
)
const fontSize = computed(() => `${props.scale}rem`)

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

onMounted(() => {
  syncDarkMode()
  if (typeof document !== 'undefined') {
    darkModeObserver = new MutationObserver(syncDarkMode)
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  }
  loadContent(props.source)
})

onBeforeUnmount(() => {
  abortController?.abort()
  darkModeObserver?.disconnect()
  darkModeObserver = null
})
</script>

<template>
  <div class="meld-markdown-renderer h-full w-full overflow-auto bg-muted/30 flex items-start justify-center p-4">
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <div class="flex flex-col items-center gap-2">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
        />
        <span class="text-sm text-muted-foreground">Loading markdown file&hellip;</span>
      </div>
    </div>

    <div v-else class="relative shadow-lg bg-background max-w-4xl w-full">
      <article
        ref="contentRef"
        class="markdown-content prose prose-neutral dark:prose-invert max-w-none p-6"
        :style="{ fontSize }"
      >
        <ThemeProvider :theme="incremarkTheme">
          <IncremarkContent
            :content="content"
            :is-finished="true"
            :incremark-options="incremarkOptions"
          />
        </ThemeProvider>
      </article>
    </div>
  </div>
</template>

<style scoped>
/*
 * Override @incremark/vue theme with shadcn CSS variables so the markdown
 * viewer matches the host app's light/dark theme.
 */
.markdown-content {
  --incremark-color-text-primary: var(--primary);
  --incremark-color-text-secondary: var(--secondary);
  --incremark-color-text-tertiary: var(--muted-foreground);
  --incremark-color-background-base: var(--background);
  --incremark-color-background-elevated: var(--card);
  --incremark-color-border-default: var(--border);
  --incremark-color-border-subtle: var(--border);
  --incremark-color-interactive-link: var(--primary);
  --incremark-color-interactive-link-hover: var(--primary);
  --incremark-color-brand-primary: var(--primary);
}

.markdown-content :deep(.incremark) {
  font-family: inherit;
  color: var(--foreground);
}

.markdown-content :deep(blockquote) {
  color: var(--muted-foreground);
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6),
.markdown-content :deep(p),
.markdown-content :deep(strong),
.markdown-content :deep(em) {
  color: var(--foreground);
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  color: var(--foreground);
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.markdown-content :deep(ul) {
  list-style-type: disc;
}

.markdown-content :deep(ul ul) {
  list-style-type: circle;
}

.markdown-content :deep(ul ul ul) {
  list-style-type: square;
}

.markdown-content :deep(ol) {
  list-style-type: decimal;
}

.markdown-content :deep(a > img),
.markdown-content :deep(a img) {
  display: inline-block;
}

.markdown-content :deep(a) {
  color: var(--primary);
  text-decoration: underline;
}
</style>
