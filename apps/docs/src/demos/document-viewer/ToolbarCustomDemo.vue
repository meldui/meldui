<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DocumentViewer } from '@meldui/vue'
import type { ToolbarConfig } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const status = ref('')

const toolbar: ToolbarConfig = {
  // Show only these groups, in this order
  groups: ['pageNav', 'zoom', 'panels'],
  // Hide specific buttons inside the groups we kept (keep just the zoom preset dropdown)
  hide: ['zoom-in', 'zoom-out'],
  customButtons: [
    {
      id: 'share',
      label: 'Share',
      onClick: () => {
        status.value = 'Share clicked at ' + new Date().toLocaleTimeString()
      },
    },
  ],
}

const code = `<script setup lang="ts">
import { DocumentViewer, type ToolbarConfig } from '@meldui/vue'

const toolbar: ToolbarConfig = {
  groups: ['pageNav', 'zoom', 'panels'],   // only show these, in this order
  hide: ['zoom-in', 'zoom-out'],           // keep just the zoom preset dropdown
  customButtons: [
    { id: 'share', label: 'Share', onClick: openShareDialog },
  ],
}
<\/script>

<template>
  <DocumentViewer source="/doc.pdf" wasm-url="/pdfium.wasm" :toolbar="toolbar" :features="{ zoom: true, outline: true, thumbnails: true }" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <div v-if="status" class="text-xs text-muted-foreground">{{ status }}</div>
      <div class="h-[500px] w-full overflow-hidden rounded-md border">
        <DocumentViewer
          :source="SAMPLE_PDF"
          wasm-url="/pdfium.wasm"
          :toolbar="toolbar"
          :features="{ zoom: true, outline: true, thumbnails: true }"
        />
      </div>
    </div>
  </DemoBlock>
</template>
