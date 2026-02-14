<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@meldui/vue'
</script>

<template>
  <ResizablePanelGroup direction="horizontal" class="min-h-[200px] max-w-md rounded-lg border">
    <ResizablePanel :default-size="50">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Panel A</span>
      </div>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel :default-size="50">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Panel B</span>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
