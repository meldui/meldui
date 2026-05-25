<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { DocumentViewer } from '@meldui/vue'

// TraceMonkey is 14 pages — enough to demonstrate continuous scroll + tiling.
// For a true large-document showcase, swap in a 500+ page PDF.
const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const code = `<script setup lang="ts">
import { DocumentViewer } from '@meldui/vue'
<\/script>

<template>
  <DocumentViewer
    source="/very-large.pdf"
    wasm-url="/pdfium.wasm"
    :features="{ zoom: true, search: true, outline: true, thumbnails: true, download: true }"
    :initial-page="1"
    initial-scale="fit-width"
  />
</template>

<!--
  Tiling + virtualization (always-on) handle 1000+ pages with bounded memory.
  Pair with thumbnails so the user can navigate without scrolling end-to-end.
-->`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-2">
      <div class="text-xs text-muted-foreground">
        Tiling + virtualization handle large documents with bounded memory. The thumbnails panel makes
        navigation through long PDFs practical without scrolling end-to-end.
      </div>
      <div class="h-[600px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :features="{ zoom: true, search: true, outline: true, thumbnails: true, download: true }"
        />
      </div>
    </div>
  </DemoBlock>
</template>
