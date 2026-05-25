<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { DocumentViewer } from '@meldui/vue'
import type { ToolbarConfig } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const status = ref('')

const toolbar: ToolbarConfig = {
  // Only show 3 groups, reordered
  groups: ['nav', 'zoom', 'panels'],
  // Hide a couple of buttons inside the groups we kept
  hide: ['rotate-cw', 'rotate-ccw', 'spread'],
  customButtons: [
    {
      id: 'share',
      label: 'Share',
      icon: 'IconShare',
      position: 'panels',
      onClick: () => {
        status.value = 'Share clicked at ' + new Date().toLocaleTimeString()
      },
    },
  ],
}

const code = `<script setup lang="ts">
import { DocumentViewer, type ToolbarConfig } from '@meldui/vue'

const toolbar: ToolbarConfig = {
  groups: ['nav', 'zoom', 'panels'],   // only show these
  hide: ['rotate-cw', 'rotate-ccw'],
  customButtons: [
    { id: 'share', label: 'Share', icon: 'IconShare', position: 'panels', onClick: openShareDialog },
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
