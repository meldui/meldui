<script setup lang="ts">
const { open } = useSearch()
</script>

<template>
  <button
    class="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    @click="open = true"
  >
    <span class="hidden sm:inline-block">Search...</span>
    <kbd
      class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
    >
      <span class="text-xs">&#8984;</span>K
    </kbd>
  </button>
</template>
