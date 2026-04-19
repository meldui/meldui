<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { FileUpload, FileUploadDropzone, FileUploadTrigger, Button } from '@meldui/vue'

const code = `\u003cscript setup>
import { FileUpload, FileUploadDropzone, FileUploadTrigger } from '@meldui/vue'
<\/script>

<template>
  <FileUpload accept="image/*" :max-files="5">
    <FileUploadDropzone>
      <p>Drag & drop files here, or</p>
      <FileUploadTrigger>Browse Files</FileUploadTrigger>
    </FileUploadDropzone>
  </FileUpload>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <FileUpload accept="image/*" :max-files="5" class="w-full max-w-sm">
      <FileUploadDropzone class="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center">
        <p class="text-sm text-muted-foreground">Drag & drop files here, or</p>
        <Button variant="outline" as-child>
          <FileUploadTrigger>Browse Files</FileUploadTrigger>
        </Button>
      </FileUploadDropzone>
    </FileUpload>
  </DemoBlock>
</template>
