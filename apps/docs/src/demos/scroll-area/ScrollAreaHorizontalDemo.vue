<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ScrollArea, ScrollBar } from '@meldui/vue'

const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)

const code = `\u003cscript setup>
import { ScrollArea, ScrollBar } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <ScrollArea class="w-96 whitespace-nowrap rounded-md border">
    <div class="flex w-max space-x-4 p-4">
      <div v-for="i in 20" :key="i" class="shrink-0 rounded-md border p-4 w-[150px]">
        Item {{ i }}
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <ScrollArea class="w-full max-w-sm whitespace-nowrap rounded-md border">
      <div class="flex w-max space-x-4 p-4">
        <div
          v-for="item in items"
          :key="item"
          class="flex h-20 w-[150px] shrink-0 items-center justify-center rounded-md border bg-muted/50 text-sm"
        >
          {{ item }}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </DemoBlock>
</template>
