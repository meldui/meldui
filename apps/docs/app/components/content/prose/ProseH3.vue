<script setup lang="ts">
defineProps<{ id?: string }>()
</script>

<template>
  <h3 :id="id" class="group mt-8 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight">
    <a v-if="id" :href="`#${id}`" class="no-underline hover:underline">
      <slot />
      <span
        class="ml-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
        >#</span
      >
    </a>
    <slot v-else />
  </h3>
</template>
