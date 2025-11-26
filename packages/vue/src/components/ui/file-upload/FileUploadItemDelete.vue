<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import type { FileUploadItemContext, FileUploadItemDeleteProps } from './types'

const props = withDefaults(defineProps<FileUploadItemDeleteProps>(), {
  as: 'button',
})

const itemContext = inject<FileUploadItemContext>('fileUploadItemContext')
if (!itemContext) {
  throw new Error('FileUploadItemDelete must be used within a FileUploadItem component')
}

const handleClick = (event: MouseEvent) => {
  event.stopPropagation()
  itemContext.remove()
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    data-slot="file-upload-item-delete"
    :class="cn(props.class)"
    :aria-label="`Remove ${itemContext.file.name}`"
    @click="handleClick"
  >
    <slot />
  </Primitive>
</template>
