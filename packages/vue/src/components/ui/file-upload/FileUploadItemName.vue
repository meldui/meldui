<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import type { FileUploadItemContext, FileUploadItemNameProps } from './types'

const props = withDefaults(defineProps<FileUploadItemNameProps>(), {
  as: 'span',
})

const itemContext = inject<FileUploadItemContext>('fileUploadItemContext')
if (!itemContext) {
  throw new Error('FileUploadItemName must be used within a FileUploadItem component')
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="file-upload-item-name"
    :class="cn(props.class)"
    :title="itemContext.file.name"
  >
    <slot>{{ itemContext.file.name }}</slot>
  </Primitive>
</template>
