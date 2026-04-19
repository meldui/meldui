<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@meldui/vue'

const code = `\u003cscript setup>
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <ResizablePanelGroup direction="horizontal" class="max-w-md rounded-lg border">
    <ResizablePanel :default-size="50">
      <div class="flex h-[200px] items-center justify-center p-6">
        <span class="font-semibold">One</span>
      </div>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel :default-size="50">
      <div class="flex h-[200px] items-center justify-center p-6">
        <span class="font-semibold">Two</span>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <ResizablePanelGroup direction="horizontal" class="max-w-md rounded-lg border">
      <ResizablePanel :default-size="50">
        <div class="flex h-[200px] items-center justify-center p-6">
          <span class="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle with-handle />
      <ResizablePanel :default-size="50">
        <div class="flex h-[200px] items-center justify-center p-6">
          <span class="font-semibold">Two</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </DemoBlock>
</template>
