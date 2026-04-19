<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Separator } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="flex h-5 items-center space-x-4">
    <span>Blog</span>
    <Separator orientation="vertical" />
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>Source</span>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex h-5 items-center space-x-4 text-sm">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  </DemoBlock>
</template>
