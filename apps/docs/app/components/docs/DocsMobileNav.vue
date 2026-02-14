<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const route = useRoute()

// Close on navigation
watch(
  () => route.path,
  () => {
    open.value = false
  },
)
</script>

<template>
  <div>
    <button
      class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      @click="open = !open"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
      </svg>
    </button>

    <!-- Mobile sidebar overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="open"
          class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          @click="open = false"
        />
      </Transition>
      <Transition name="slide">
        <div
          v-if="open"
          class="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background overflow-y-auto"
        >
          <div class="flex h-14 items-center border-b border-border px-4">
            <NuxtLink to="/" class="font-semibold" @click="open = false">MeldUI</NuxtLink>
          </div>
          <DocsSidebar />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
