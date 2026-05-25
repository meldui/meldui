<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { DocumentViewer } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const code = `<script setup lang="ts">
import { DocumentViewer } from '@meldui/vue'
<\/script>

<template>
  <DocumentViewer
    source="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
    wasm-url="/pdfium.wasm"
    :features="{ zoom: true, search: true, outline: true, thumbnails: true, download: true }"
  />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="h-[600px] w-full overflow-hidden rounded-md border">
      <DocumentViewer
        :source="SAMPLE_PDF"
        wasm-url="/pdfium.wasm"
        :features="{ zoom: true, search: true, outline: true, thumbnails: true, download: true }"
      />
    </div>
  </DemoBlock>
</template>
