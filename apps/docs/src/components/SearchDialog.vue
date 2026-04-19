<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@meldui/vue'
import { IconFileText } from '@meldui/tabler-vue'

const open = ref(false)
const query = ref('')
const results = ref<{ url: string; title: string; excerpt: string }[]>([])
const pagefind = ref<any>(null)
const searchUnavailable = ref(false)

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
  const data = await Promise.all(searchResult.results.slice(0, 10).map((r: any) => r.data()))
  results.value = data.map((d: any) => ({
    url: d.url,
    title: d.meta?.title || d.url,
    excerpt: d.excerpt || '',
  }))
}

watch(query, (q) => search(q))

watch(open, async (isOpen) => {
  if (isOpen) {
    await loadPagefind()
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

function navigate(url: string) {
  open.value = false
  window.location.href = url
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  const trigger = document.getElementById('search-trigger')
  if (trigger) {
    trigger.addEventListener('click', () => {
      open.value = true
    })
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <CommandDialog
    v-model:open="open"
    title="Search Documentation"
    description="Search across all component pages, guides, and API docs."
  >
    <CommandInput v-model="query" placeholder="Search documentation..." />
    <CommandList>
      <div v-if="searchUnavailable" class="py-6 text-center text-sm text-muted-foreground">
        Search is only available in the production build.<br />
        <span class="text-xs">
          Run <code class="rounded bg-muted px-1 py-0.5">pnpm docs:build</code> then
          <code class="rounded bg-muted px-1 py-0.5">pnpm --filter docs preview</code>
        </span>
      </div>
      <CommandEmpty v-else-if="query">No results found.</CommandEmpty>
      <CommandGroup v-if="results.length > 0" heading="Results">
        <CommandItem
          v-for="result in results"
          :key="result.url"
          :value="result.title"
          @select="navigate(result.url)"
        >
          <IconFileText class="mr-2 size-4 shrink-0" />
          <div class="flex flex-col gap-0.5 overflow-hidden">
            <span class="truncate font-medium">{{ result.title }}</span>
            <span
              v-if="result.excerpt"
              class="truncate text-xs text-muted-foreground"
              v-html="result.excerpt"
            />
          </div>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>
