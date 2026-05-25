<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Button, DocumentViewer } from '@meldui/vue'
import type { Annotation, DocumentViewerInstance } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const viewer = ref<DocumentViewerInstance | null>(null)
const lastId = ref<string | null>(null)
const log = ref<string[]>([])

function logEvent(message: string) {
  log.value = [`${new Date().toLocaleTimeString()}  ${message}`, ...log.value].slice(0, 5)
}

// Coordinates for the phrase "Dynamic languages such as JavaScript" inside the
// "1. Introduction" paragraph of the TraceMonkey PDF sample. Two segment rects
// — one per word group — let the highlight hug the actual glyph baseline.
// `origin.y` is measured from the TOP of the page in PDF points (1/72 inch).
// The page is 612×792 pt; y=584.7 puts the highlight at ~74% down the page.
async function addHighlight() {
  const created = await viewer.value?.createAnnotation({
    type: 'highlight',
    pageIndex: 0,
    rect: { origin: { x: 54, y: 584.7 }, size: { width: 139, height: 9 } },
    segmentRects: [
      { origin: { x: 53.94, y: 584.7 }, size: { width: 71, height: 8 } },
      { origin: { x: 127.48, y: 584.7 }, size: { width: 65, height: 9 } },
    ],
    color: '#FFCD45',
    opacity: 0.4,
    selectedText: 'Dynamic languages such as JavaScript',
  })
  if (created) {
    lastId.value = created.id
    logEvent(`createAnnotation → ${created.id.slice(0, 8)}`)
  }
}

async function recolorLast() {
  if (!lastId.value) return
  await viewer.value?.updateAnnotation(lastId.value, { color: '#8FCFEF' })
  logEvent(`updateAnnotation(${lastId.value.slice(0, 8)}, color)`)
}

async function deleteLast() {
  if (!lastId.value) return
  await viewer.value?.deleteAnnotation(lastId.value)
  logEvent(`deleteAnnotation(${lastId.value.slice(0, 8)})`)
  lastId.value = null
}

async function exportAll() {
  const items = await viewer.value?.exportAnnotations()
  logEvent(`exportAnnotations → ${items?.length ?? 0} items`)
}

function onCreate({ annotation }: { annotation: Annotation }) {
  logEvent(`@annotation-created ${annotation.type} (${annotation.id.slice(0, 8)})`)
}

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { DocumentViewer, type DocumentViewerInstance } from '@meldui/vue'

const viewer = ref<DocumentViewerInstance | null>(null)

async function addHighlight() {
  await viewer.value?.createAnnotation({
    type: 'highlight',
    pageIndex: 0,
    rect: { origin: { x: 100, y: 600 }, size: { width: 300, height: 20 } },
    segmentRects: [{ origin: { x: 100, y: 600 }, size: { width: 300, height: 20 } }],
    color: '#FFCD45',
    opacity: 0.4,
  })
}
<\/script>

<template>
  <DocumentViewer ref="viewer" source="/doc.pdf" wasm-url="/pdfium.wasm" :features="{ annotations: true }" />
  <button @click="addHighlight">Add Highlight</button>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        <Button size="sm" @click="addHighlight">Add highlight on page 1</Button>
        <Button size="sm" variant="outline" :disabled="!lastId" @click="recolorLast">Recolor last</Button>
        <Button size="sm" variant="outline" :disabled="!lastId" @click="deleteLast">Delete last</Button>
        <Button size="sm" variant="outline" @click="exportAll">Export all</Button>
      </div>
      <div class="h-[500px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          ref="viewer"
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, annotations: true, undoRedo: true }"
          @annotation-created="onCreate"
        />
      </div>
      <pre class="max-h-32 overflow-auto rounded-md bg-muted/40 p-2 text-xs">{{ log.join('\n') || 'Event log…' }}</pre>
    </div>
  </DemoBlock>
</template>
