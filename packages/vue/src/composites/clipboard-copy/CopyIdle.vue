<script setup lang="ts">
import { inject, type Ref } from 'vue'

interface ClipboardCopyContext {
  isCopied: Ref<boolean>
  isError: Ref<boolean>
}

const context = inject<ClipboardCopyContext>('clipboardCopy')

if (!context) {
  throw new Error('CopyIdle must be used within ClipboardCopy')
}

const { isCopied, isError } = context
</script>

<template>
  <template v-if="!isCopied && !isError">
    <slot />
  </template>
</template>
