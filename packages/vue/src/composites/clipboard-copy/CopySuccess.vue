<script setup lang="ts">
import { inject, type Ref } from 'vue'

interface ClipboardCopyContext {
  isCopied: Ref<boolean>
}

const context = inject<ClipboardCopyContext>('clipboardCopy')

if (!context) {
  throw new Error('CopySuccess must be used within ClipboardCopy')
}

const { isCopied } = context
</script>

<template>
  <template v-if="isCopied">
    <slot />
  </template>
</template>
