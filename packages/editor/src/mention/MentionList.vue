<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  MENTION_INJECTION_KEY,
  MentionContent,
  MentionEmpty,
  MentionItem,
  MentionLoading,
} from '@meldui/vue'
import { IconLoader2 } from '@meldui/tabler-vue'

// Context is provided by createMentionExtension's render() — it drives these
// design-system primitives from Tiptap's suggestion state.
const ctx = inject(MENTION_INJECTION_KEY)
const items = computed(() => ctx?.items.value ?? [])
</script>

<template>
  <MentionContent class="min-w-48 max-h-64 overflow-y-auto p-1">
    <MentionLoading class="flex items-center justify-center gap-2 py-4">
      <IconLoader2 :size="16" class="animate-spin" />
      <span>Searching...</span>
    </MentionLoading>

    <MentionEmpty>No results found</MentionEmpty>

    <MentionItem v-for="item in items" :key="item.value" :item="item" class="gap-2">
      <template #default="{ item: mentionItem }">
        <span class="text-muted-foreground">@</span>
        <span class="font-medium">{{ mentionItem.label }}</span>
      </template>
    </MentionItem>
  </MentionContent>
</template>
