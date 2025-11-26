<script setup lang="ts">
import { computed, inject } from 'vue'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { FileUploadItemContext, FileUploadItemProgressProps } from './types'

const props = withDefaults(defineProps<FileUploadItemProgressProps>(), {
  variant: 'default',
})

const itemContext = inject<FileUploadItemContext>('fileUploadItemContext')
if (!itemContext) {
  throw new Error('FileUploadItemProgress must be used within a FileUploadItem component')
}

const progress = computed(() => itemContext.progress.value)
const showProgress = computed(() => progress.value !== undefined)
</script>

<template>
  <Progress
    v-if="showProgress"
    data-slot="file-upload-item-progress"
    :model-value="progress"
    :variant="variant"
    :class="cn('h-1', props.class)"
    :aria-label="`Upload progress: ${progress}%`"
  />
</template>
