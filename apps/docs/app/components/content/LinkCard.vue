<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  to: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="not-prose group my-2 flex items-center justify-between rounded-lg border border-border p-4 no-underline transition-colors hover:bg-accent/50"
  >
    <div>
      <p class="font-medium text-foreground group-hover:text-foreground">{{ title }}</p>
      <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </NuxtLink>
</template>
