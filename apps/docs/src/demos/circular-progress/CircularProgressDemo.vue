<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { CircularProgress } from '@meldui/vue'

const code = `\u003cscript setup>
import { CircularProgress } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex gap-6">
    <CircularProgress :value="75" />
    <CircularProgress :value="50" variant="success" />
    <CircularProgress :value="30" variant="warning" :size="64" :thickness="6" />
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex gap-6">
      <CircularProgress :value="75" />
      <CircularProgress :value="50" variant="success" />
      <CircularProgress :value="30" variant="warning" :size="64" :thickness="6" />
    </div>
  </DemoBlock>
</template>
