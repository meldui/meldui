<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import type { FileUploadContext, FileUploadTriggerProps } from './types'

const props = withDefaults(defineProps<FileUploadTriggerProps>(), {
  as: 'button',
})

const context = inject<FileUploadContext>('fileUploadContext')
if (!context) {
  throw new Error('FileUploadTrigger must be used within a FileUpload component')
}

const isDisabled = computed(() => context.disabled.value)

const handleClick = (event: MouseEvent) => {
  // Prevent the click from bubbling to dropzone
  event.stopPropagation()

  if (!isDisabled.value) {
    context.openFilePicker()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (isDisabled.value) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    event.stopPropagation()
    context.openFilePicker()
  }
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="file-upload-trigger"
    :class="cn(props.class)"
    :disabled="isDisabled || undefined"
    :data-disabled="isDisabled ? '' : undefined"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <slot />
  </Primitive>
</template>
