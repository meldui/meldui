<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import { cn } from '@/lib/utils'
import type { FileUploadContext, FileUploadProps } from './types'
import { validateFiles } from './utils'

const props = withDefaults(defineProps<FileUploadProps>(), {
  maxFiles: Infinity,
  multiple: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [files: File[]]
  'file-accept': [file: File]
  'file-reject': [file: File, errors: import('./types').FileError[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const files = computed({
  get: () => props.modelValue ?? [],
  set: (value: File[]) => emit('update:modelValue', value),
})

const addFiles = (newFiles: FileList | File[]) => {
  if (props.disabled) return

  const fileArray = Array.from(newFiles)
  const effectiveMaxFiles = props.multiple ? props.maxFiles : 1

  const { accepted, rejected } = validateFiles(fileArray, {
    accept: props.accept,
    maxSize: props.maxSize,
    maxFiles: effectiveMaxFiles,
    currentFileCount: files.value.length,
  })

  // Emit reject events
  for (const { file, errors } of rejected) {
    emit('file-reject', file, errors)
  }

  // Emit accept events and update files
  if (accepted.length > 0) {
    for (const file of accepted) {
      emit('file-accept', file)
    }

    if (props.multiple) {
      files.value = [...files.value, ...accepted]
    } else {
      files.value = [accepted[0]]
    }
  }

  // Reset input value so same file can be selected again
  if (inputRef.value) {
    inputRef.value.value = ''
  }
}

const removeFile = (file: File) => {
  files.value = files.value.filter((f) => f !== file)
}

const clearFiles = () => {
  files.value = []
}

const openFilePicker = () => {
  if (props.disabled) return
  inputRef.value?.click()
}

const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    addFiles(target.files)
  }
}

// Provide context to children
const context: FileUploadContext = {
  files,
  disabled: toRef(props, 'disabled'),
  accept: toRef(props, 'accept'),
  maxFiles: computed(() => props.maxFiles),
  maxSize: toRef(props, 'maxSize'),
  multiple: toRef(props, 'multiple'),
  addFiles,
  removeFile,
  clearFiles,
  openFilePicker,
  inputRef,
}

provide('fileUploadContext', context)
</script>

<template>
  <div data-slot="file-upload" :class="cn(props.class)" :data-disabled="disabled ? '' : undefined">
    <input
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="sr-only"
      tabindex="-1"
      @change="handleInputChange"
    />
    <slot />
  </div>
</template>
