<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<template>
  <h2
    :id="id"
    class="group mt-10 mb-4 scroll-mt-20 border-b border-border pb-2 text-2xl font-semibold tracking-tight first:mt-0"
  >
    <a v-if="id" :href="`#${id}`" class="no-underline hover:underline">
      <slot />
      <span
        class="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
        >#</span
      >
    </a>
    <slot v-else />
  </h2>
</template>
