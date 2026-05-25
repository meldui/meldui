<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Button, DocumentViewer } from '@meldui/vue'
import type { AnnotationTransferItem, DocumentViewerInstance } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const viewer = ref<DocumentViewerInstance | null>(null)
const status = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

async function exportAndDownload() {
  const items = await viewer.value?.exportAnnotations()
  if (!items) return
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'annotations.json'
  a.click()
  URL.revokeObjectURL(url)
  status.value = `Exported ${items.length} annotations to annotations.json`
}

async function triggerImport() {
  fileInput.value?.click()
}

async function onImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const text = await file.text()
  try {
    const items: AnnotationTransferItem[] = JSON.parse(text)
    await viewer.value?.importAnnotations(items)
    status.value = `Imported ${items.length} annotations from ${file.name}`
  } catch (err) {
    status.value = `Failed to import: ${(err as Error).message}`
  }
}

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { DocumentViewer, type AnnotationTransferItem, type DocumentViewerInstance } from '@meldui/vue'

const viewer = ref<DocumentViewerInstance | null>(null)

async function exportToFile() {
  const items = await viewer.value?.exportAnnotations()
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
  // download blob…
}

async function importFromFile(file: File) {
  const items: AnnotationTransferItem[] = JSON.parse(await file.text())
  await viewer.value?.importAnnotations(items)
}
<\/script>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <Button size="sm" @click="exportAndDownload">Export → Download JSON</Button>
        <Button size="sm" variant="outline" @click="triggerImport">Import from JSON…</Button>
        <input ref="fileInput" type="file" accept="application/json" class="hidden" @change="onImport" />
      </div>
      <div v-if="status" class="text-xs text-muted-foreground">{{ status }}</div>
      <div class="h-[500px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          ref="viewer"
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, annotations: true, commentThreads: true }"
        />
      </div>
    </div>
  </DemoBlock>
</template>
