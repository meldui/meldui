<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { cn } from '@/lib/utils'
import type {
  FileUploadContext,
  FileUploadDropzoneProps,
  FileUploadDropzoneSlotProps,
} from './types'
import { isValidFileType } from './utils'

const props = defineProps<FileUploadDropzoneProps>()

const context = inject<FileUploadContext>('fileUploadContext')
if (!context) {
  throw new Error('FileUploadDropzone must be used within a FileUpload component')
}

const isDragging = ref(false)
const isValidDrag = ref(true)
let dragCounter = 0

const isDisabled = computed(() => context.disabled.value)

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  if (isDisabled.value) return

  dragCounter++
  isDragging.value = true

  // Check if dragged files match accept criteria
  if (event.dataTransfer?.items) {
    const items = Array.from(event.dataTransfer.items)
    const hasValidFile = items.some((item) => {
      if (item.kind !== 'file') return false
      // During drag, we only have access to type, not the full file
      const mockFile = { type: item.type, name: '', size: 0 } as File
      return isValidFileType(mockFile, context.accept.value)
    })
    isValidDrag.value = hasValidFile || !context.accept.value
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  dragCounter--
  if (dragCounter === 0) {
    isDragging.value = false
    isValidDrag.value = true
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  dragCounter = 0
  isDragging.value = false
  isValidDrag.value = true

  if (isDisabled.value) return

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    context.addFiles(files)
  }
}

const handleClick = () => {
  if (!isDisabled.value) {
    context.openFilePicker()
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (isDisabled.value) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    context.openFilePicker()
  }
}

const slotProps = computed<FileUploadDropzoneSlotProps>(() => ({
  isDragging: isDragging.value,
  isDisabled: isDisabled.value,
  openFilePicker: context.openFilePicker,
}))
</script>

<template>
  <div
    data-slot="file-upload-dropzone"
    role="button"
    tabindex="0"
    :class="cn('cursor-pointer', isDisabled && 'cursor-not-allowed', props.class)"
    :data-dragging="isDragging ? '' : undefined"
    :data-disabled="isDisabled ? '' : undefined"
    :data-accept="isDragging && isValidDrag ? '' : undefined"
    :data-reject="isDragging && !isValidDrag ? '' : undefined"
    :aria-disabled="isDisabled"
    aria-label="Drop files here or click to browse"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
