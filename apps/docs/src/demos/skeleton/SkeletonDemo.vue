<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Skeleton } from '@meldui/vue'

const code = `\u003cscript setup>
import { Skeleton } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex items-center space-x-4">
    <Skeleton class="h-12 w-12 rounded-full" />
    <div class="space-y-2">
      <Skeleton class="h-4 w-[250px]" />
      <Skeleton class="h-4 w-[200px]" />
    </div>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center space-x-4">
      <Skeleton class="h-12 w-12 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  </DemoBlock>
</template>
