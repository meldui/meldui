<script setup lang="ts">
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Button, DocumentViewer } from '@meldui/vue'
import type { ToolbarConfig } from '@meldui/vue'

const SAMPLE_PDF = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

const dark = ref(false)

// Trim the chrome so the toolbar doesn't overflow the demo width — dark mode
// only needs a representative set of themed buttons.
const toolbar: ToolbarConfig = {
  groups: ['pageNav', 'zoom', 'search', 'panels', 'annotate'],
}

const code = `<script setup lang="ts">
import { ref } from 'vue'
import { DocumentViewer } from '@meldui/vue'

const dark = ref(false)
<\/script>

<template>
  <div :class="dark ? 'dark' : ''">
    <DocumentViewer source="/doc.pdf" wasm-url="/pdfium.wasm" />
  </div>
</template>

<!--
  The viewer chrome (toolbar, panels, popovers) inherits the .dark theme.
  The PDF page itself stays the original page colour (typically white) —
  see "Theming → PDF page background" for the optional CSS filter trick.
-->`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex w-full flex-col gap-3">
      <Button size="sm" variant="outline" @click="dark = !dark">
        {{ dark ? 'Switch to light' : 'Switch to dark' }}
      </Button>
      <div :class="dark ? 'dark' : ''">
        <div class="h-[500px] w-full overflow-hidden rounded-md border bg-background">
          <DocumentViewer
            :source="SAMPLE_PDF"
            wasm-url="/pdfium.wasm"
            :features="{ zoom: true, search: true, outline: true, thumbnails: true, annotations: true }"
            :toolbar="toolbar"
          />
        </div>
      </div>
    </div>
  </DemoBlock>
</template>
