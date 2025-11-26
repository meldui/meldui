<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import type { FileUploadContext, FileUploadListProps } from './types'

const props = withDefaults(defineProps<FileUploadListProps>(), {
  as: 'div',
})

const context = inject<FileUploadContext>('fileUploadContext')
if (!context) {
  throw new Error('FileUploadList must be used within a FileUpload component')
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="file-upload-list"
    :class="cn(props.class)"
    role="list"
    aria-label="Uploaded files"
  >
    <slot />
  </Primitive>
</template>
