<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="min-h-screen">
    <DocsHeader />
    <div class="mx-auto flex w-full max-w-screen-2xl">
      <!-- Left sidebar: hidden on mobile -->
      <aside
        class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-border lg:block"
      >
        <DocsSidebar />
      </aside>

      <!-- Main content area -->
      <main class="min-w-0 flex-1 px-6 py-8 lg:px-8">
        <slot />
      </main>

      <!-- Right TOC: hidden on mobile and tablet -->
      <aside
        class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto xl:block"
      >
        <DocsToc />
      </aside>
    </div>
  </div>
</template>
