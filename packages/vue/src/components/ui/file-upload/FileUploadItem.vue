<script setup lang="ts">
import { computed, inject, provide, toRef } from 'vue'
import { cn } from '@/lib/utils'
import type {
  FileUploadContext,
  FileUploadItemContext,
  FileUploadItemProps,
  FileUploadItemSlotProps,
} from './types'
import { useFilePreview } from './useFilePreview'

const props = withDefaults(defineProps<FileUploadItemProps>(), {
  status: 'pending',
})

const context = inject<FileUploadContext>('fileUploadContext')
if (!context) {
  throw new Error('FileUploadItem must be used within a FileUpload component')
}

const { previewUrl, isImage } = useFilePreview(toRef(props, 'file'))

const remove = () => {
  context.removeFile(props.file)
}

// Provide item context to children
const itemContext: FileUploadItemContext = {
  file: props.file,
  progress: computed(() => props.progress),
  status: computed(() => props.status),
  error: computed(() => props.error),
  previewUrl,
  isImage,
  remove,
}

provide('fileUploadItemContext', itemContext)

const slotProps = computed<FileUploadItemSlotProps>(() => ({
  file: props.file,
  progress: props.progress,
  status: props.status,
  error: props.error,
  previewUrl: previewUrl.value,
  isImage: isImage.value,
  remove,
}))
</script>

<template>
  <div
    data-slot="file-upload-item"
    role="listitem"
    :class="cn(props.class)"
    :data-status="status"
    :aria-label="`File: ${file.name}`"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
