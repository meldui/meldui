<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@meldui/vue'

const code = `\u003ctemplate>
  <ResizablePanelGroup direction="vertical" class="min-h-[200px] max-w-md rounded-lg border">
    <ResizablePanel :default-size="25">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Header</span>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="75">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Content</span>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <ResizablePanelGroup direction="vertical" class="min-h-[200px] max-w-md rounded-lg border">
      <ResizablePanel :default-size="25">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="75">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </DemoBlock>
</template>
