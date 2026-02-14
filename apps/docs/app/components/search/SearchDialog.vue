<script setup lang="ts">
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@meldui/vue'
import { IconFileText } from '@meldui/tabler-vue'

const { open, grouped, select } = useSearch()

// Keyboard shortcut: Cmd+K / Ctrl+K
function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <CommandDialog
    v-model:open="open"
    title="Search Documentation"
    description="Search for pages across the MeldUI documentation."
  >
    <template #default>
      <CommandInput placeholder="Type to search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup v-for="(pages, section) in grouped" :key="section" :heading="String(section)">
          <CommandItem
            v-for="page in pages"
            :key="page.path"
            :value="page.title ?? page.path"
            @select="select(page.path)"
          >
            <IconFileText class="mr-2 size-4 shrink-0" />
            <span>{{ page.title }}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </template>
  </CommandDialog>
</template>
