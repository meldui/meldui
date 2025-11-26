<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import type {
  FileUploadItemContext,
  FileUploadItemPreviewProps,
  FileUploadItemPreviewSlotProps,
} from './types'

const props = defineProps<FileUploadItemPreviewProps>()

const itemContext = inject<FileUploadItemContext>('fileUploadItemContext')
if (!itemContext) {
  throw new Error('FileUploadItemPreview must be used within a FileUploadItem component')
}

const slotProps = computed<FileUploadItemPreviewSlotProps>(() => ({
  file: itemContext.file,
  previewUrl: itemContext.previewUrl.value,
  isImage: itemContext.isImage.value,
}))
</script>

<template>
  <div
    data-slot="file-upload-item-preview"
    :class="cn('overflow-hidden', props.class)"
  >
    <!-- Render image preview if available -->
    <img
      v-if="itemContext.isImage.value && itemContext.previewUrl.value"
      :src="itemContext.previewUrl.value"
      :alt="`Preview of ${itemContext.file.name}`"
      class="h-full w-full object-cover"
    >
    <!-- Render slot content as fallback for non-images -->
    <slot v-else v-bind="slotProps" />
  </div>
</template>
