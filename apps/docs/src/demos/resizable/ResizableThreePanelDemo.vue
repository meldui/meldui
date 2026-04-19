<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@meldui/vue'

const code = `\u003ctemplate>
  <ResizablePanelGroup direction="horizontal" class="max-w-md rounded-lg border">
    <ResizablePanel :default-size="30" :min-size="20">
      <div class="flex h-[200px] items-center justify-center p-6">Sidebar</div>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel :default-size="40">
      <div class="flex h-[200px] items-center justify-center p-6">Main</div>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel :default-size="30" :min-size="20">
      <div class="flex h-[200px] items-center justify-center p-6">Panel</div>
    </ResizablePanel>
  </ResizablePanelGroup>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <ResizablePanelGroup direction="horizontal" class="max-w-md rounded-lg border">
      <ResizablePanel :default-size="30" :min-size="20">
        <div class="flex h-[200px] items-center justify-center p-6 text-sm font-semibold">Sidebar</div>
      </ResizablePanel>
      <ResizableHandle with-handle />
      <ResizablePanel :default-size="40">
        <div class="flex h-[200px] items-center justify-center p-6 text-sm font-semibold">Main</div>
      </ResizablePanel>
      <ResizableHandle with-handle />
      <ResizablePanel :default-size="30" :min-size="20">
        <div class="flex h-[200px] items-center justify-center p-6 text-sm font-semibold">Panel</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </DemoBlock>
</template>
