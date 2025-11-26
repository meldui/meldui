<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import type { FileUploadClearProps, FileUploadContext } from './types'

const props = withDefaults(defineProps<FileUploadClearProps>(), {
  as: 'button',
})

const context = inject<FileUploadContext>('fileUploadContext')
if (!context) {
  throw new Error('FileUploadClear must be used within a FileUpload component')
}

const isDisabled = computed(() => context.disabled.value || context.files.value.length === 0)

const handleClick = (event: MouseEvent) => {
  event.stopPropagation()

  if (!isDisabled.value) {
    context.clearFiles()
  }
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="file-upload-clear"
    :class="cn(props.class)"
    :disabled="isDisabled || undefined"
    :data-disabled="isDisabled ? '' : undefined"
    aria-label="Clear all files"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
