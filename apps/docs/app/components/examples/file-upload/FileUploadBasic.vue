<script setup lang="ts">
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemName,
  FileUploadItemSize,
  FileUploadList,
  FileUploadTrigger,
} from '@meldui/vue'
import { IconUpload, IconX } from '@meldui/tabler-vue'
import { ref } from 'vue'

const files = ref<File[]>([])
</script>

<template>
  <FileUpload v-model="files" multiple accept="image/*" :max-files="5">
    <FileUploadDropzone>
      <div class="flex flex-col items-center gap-2 py-6 text-center">
        <IconUpload class="size-8 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Drag and drop files here, or</p>
        <FileUploadTrigger as-child>
          <button class="text-sm font-medium text-primary underline">browse</button>
        </FileUploadTrigger>
      </div>
    </FileUploadDropzone>
    <FileUploadList>
      <FileUploadItem v-for="file in files" :key="file.name" :file="file">
        <FileUploadItemName />
        <FileUploadItemSize />
        <FileUploadItemDelete>
          <IconX class="size-4" />
        </FileUploadItemDelete>
      </FileUploadItem>
    </FileUploadList>
  </FileUpload>
</template>
