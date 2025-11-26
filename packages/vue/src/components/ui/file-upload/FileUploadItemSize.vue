<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import type { FileUploadItemContext, FileUploadItemSizeProps } from './types'
import { formatFileSize } from './utils'

const props = withDefaults(defineProps<FileUploadItemSizeProps>(), {
  as: 'span',
  precision: 1,
})

const itemContext = inject<FileUploadItemContext>('fileUploadItemContext')
if (!itemContext) {
  throw new Error('FileUploadItemSize must be used within a FileUploadItem component')
}

const formattedSize = computed(() => formatFileSize(itemContext.file.size, props.precision))
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="file-upload-item-size"
    :class="cn(props.class)"
  >
    <slot>{{ formattedSize }}</slot>
  </Primitive>
</template>
