<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ScrollArea, Separator } from '@meldui/vue'

const tags = Array.from({ length: 50 }, (_, i) => `v1.${i}.0`)

const code = `\u003cscript setup>
import { ScrollArea } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
    <div>Long scrollable content here...</div>
  </ScrollArea>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <ScrollArea class="h-[200px] w-[200px] rounded-md border">
      <div class="p-4">
        <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
        <div v-for="tag in tags" :key="tag">
          <div class="text-sm">{{ tag }}</div>
          <Separator class="my-2" />
        </div>
      </div>
    </ScrollArea>
  </DemoBlock>
</template>
