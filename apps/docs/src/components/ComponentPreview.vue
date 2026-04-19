<script setup lang="ts">
import { ref } from 'vue'
import CopyButton from './CopyButton.vue'

const props = defineProps<{
  code: string
  title?: string
}>()

const activeTab = ref<'preview' | 'code'>('preview')
</script>

<template>
  <div class="my-6 overflow-hidden rounded-lg border border-border">
    <!-- Title -->
    <div v-if="title" class="border-b border-border bg-muted/50 px-4 py-2">
      <span class="text-sm font-medium text-foreground">{{ title }}</span>
    </div>

    <!-- Tabs -->
    <div class="flex items-center border-b border-border bg-muted/30 px-4">
      <button
        :class="[
          'border-b-2 px-3 py-2 text-sm font-medium -mb-px transition-colors',
          activeTab === 'preview'
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
        ]"
        @click="activeTab = 'preview'"
      >
        Preview
      </button>
      <button
        :class="[
          'border-b-2 px-3 py-2 text-sm font-medium -mb-px transition-colors',
          activeTab === 'code'
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
        ]"
        @click="activeTab = 'code'"
      >
        Code
      </button>
    </div>

    <!-- Preview pane -->
    <div
      v-show="activeTab === 'preview'"
      class="flex min-h-[200px] items-center justify-center p-6"
    >
      <slot />
    </div>

    <!-- Code pane -->
    <div v-show="activeTab === 'code'" class="relative">
      <div class="absolute top-3 right-3 z-10">
        <CopyButton :text="code" />
      </div>
      <pre
        class="overflow-x-auto bg-muted/50 p-4 text-sm leading-relaxed"
      ><code class="font-mono">{{ code }}</code></pre>
    </div>
  </div>
</template>
