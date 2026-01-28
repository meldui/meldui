<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'
import { computed, type HTMLAttributes, provide } from 'vue'
import { cn } from '@/lib/utils'
import { useCopyToClipboard } from './useCopyToClipboard'

export interface ClipboardCopyProps extends PrimitiveProps {
  /**
   * Text to copy to clipboard
   * Can be a string or a function that returns a string
   */
  text: string | (() => string)
  /**
   * Duration in milliseconds to show copied state
   * @default 2000
   */
  copiedDuration?: number
  /**
   * Custom CSS classes
   */
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ClipboardCopyProps>(), {
  copiedDuration: 2000,
  as: 'button',
})

const emit = defineEmits<{
  success: []
  error: [error: Error]
}>()

const { isCopied, isError, error, copy } = useCopyToClipboard({
  copiedDuration: props.copiedDuration,
  onSuccess: () => emit('success'),
  onError: (err) => emit('error', err),
})

const handleClick = async () => {
  const textToCopy = typeof props.text === 'function' ? props.text() : props.text
  await copy(textToCopy)
}

// Provide state to child components (CopyIdle, CopySuccess)
provide('clipboardCopy', {
  isCopied,
  isError,
  error,
  copy: handleClick,
})

// Slot scope for parent access
const slotScope = computed(() => ({
  isCopied: isCopied.value,
  isError: isError.value,
  error: error.value,
  copy: handleClick,
}))
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="cn(props.class)" @click="handleClick">
    <slot v-bind="slotScope" />
  </Primitive>
</template>
