<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { ClipboardCopy, ClipboardCopyButton, CopyIdle, CopySuccess, Button } from '@meldui/vue'
import { IconCopy, IconCheck } from '@meldui/tabler-vue'

const code = `\u003cscript setup>
import { ClipboardCopy, ClipboardCopyButton, CopyIdle, CopySuccess } from '@meldui/vue'
import { Button } from '@meldui/vue'
import { IconCopy, IconCheck } from '@meldui/tabler-vue'
\u003c/script>

\u003ctemplate>
  <!-- Simple button variant -->
  <ClipboardCopyButton text="npm install @meldui/vue" />

  <!-- Custom with scoped slot -->
  <ClipboardCopy text="pnpm add @meldui/vue" v-slot="{ isCopied }">
    <Button :variant="isCopied ? 'success' : 'outline'" size="sm">
      <CopyIdle><IconCopy class="mr-2 size-4" /> Copy command</CopyIdle>
      <CopySuccess><IconCheck class="mr-2 size-4" /> Copied!</CopySuccess>
    </Button>
  </ClipboardCopy>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-4">
      <ClipboardCopyButton text="npm install @meldui/vue" />
      <ClipboardCopy text="pnpm add @meldui/vue" v-slot="{ isCopied }">
        <Button :variant="isCopied ? 'success' : 'outline'" size="sm">
          <CopyIdle><IconCopy class="mr-2 size-4" /> Copy command</CopyIdle>
          <CopySuccess><IconCheck class="mr-2 size-4" /> Copied!</CopySuccess>
        </Button>
      </ClipboardCopy>
    </div>
  </DemoBlock>
</template>
