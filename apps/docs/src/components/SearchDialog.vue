<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Dialog, DialogContent, DialogTitle } from '@meldui/vue'
import { IconSearch } from '@meldui/tabler-vue'

const open = ref(false)
const query = ref('')
const results = ref<any[]>([])
const pagefind = ref<any>(null)
const searchUnavailable = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

async function loadPagefind() {
  if (pagefind.value) return
  try {
    const url = `${window.location.origin}/pagefind/pagefind.js`
    pagefind.value = await import(/* @vite-ignore */ url)
    await pagefind.value.init()
  } catch {
    searchUnavailable.value = true
  }
}

async function search(q: string) {
  if (!pagefind.value || !q.trim()) {
    results.value = []
    return
  }
  const searchResult = await pagefind.value.search(q)
  const data = await Promise.all(
    searchResult.results.slice(0, 8).map((r: any) => r.data())
  )
  results.value = data
}

watch(query, (q) => search(q))

watch(open, async (isOpen) => {
  if (isOpen) {
    await loadPagefind()
    await nextTick()
    inputRef.value?.focus()
  } else {
    query.value = ''
    results.value = []
  }
})

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  // Wire up the header search button
  const trigger = document.getElementById('search-trigger')
  if (trigger) {
    trigger.addEventListener('click', () => { open.value = true })
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

function navigate(url: string) {
  open.value = false
  window.location.href = url
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="top-[20%] translate-y-0 p-0 gap-0 max-w-lg">
      <DialogTitle class="sr-only">Search documentation</DialogTitle>
      <div class="flex items-center border-b px-3">
        <IconSearch class="size-4 shrink-0 text-muted-foreground" />
        <input
          ref="inputRef"
          v-model="query"
          placeholder="Search documentation..."
          class="flex h-11 w-full bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div class="max-h-[300px] overflow-y-auto p-2">
        <div v-if="searchUnavailable" class="py-6 text-center text-sm text-muted-foreground">
          Search is only available in the production build.<br />
          <span class="text-xs">Run <code class="rounded bg-muted px-1 py-0.5">pnpm docs:build</code> then <code class="rounded bg-muted px-1 py-0.5">pnpm --filter docs preview</code></span>
        </div>
        <div v-else-if="query && results.length === 0" class="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </div>
        <div v-else-if="!query" class="py-6 text-center text-sm text-muted-foreground">
          Type to search...
        </div>
        <div v-else class="space-y-1">
          <button
            v-for="result in results"
            :key="result.url"
            class="flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
            @click="navigate(result.url)"
          >
            <span class="font-medium text-foreground">{{ result.meta?.title || result.url }}</span>
            <span
              v-if="result.excerpt"
              class="text-xs text-muted-foreground line-clamp-2"
              v-html="result.excerpt"
            />
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
