<script setup lang="ts">
import { ClipboardCopyButton } from '@meldui/vue'

const command = 'pnpm add @meldui/vue @meldui/tabler-vue'
</script>

<template>
  <div class="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5">
    <code class="flex-1 text-sm font-mono text-foreground">{{ command }}</code>
    <ClipboardCopyButton :text="command" variant="ghost" size="icon-sm" label="" copied-label="" />
  </div>
</template>
