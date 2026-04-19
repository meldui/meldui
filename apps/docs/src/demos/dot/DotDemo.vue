<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Dot } from '@meldui/vue'

const code = `\u003cscript setup>
import { Dot } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex items-center gap-4">
    <Dot variant="primary" />
    <Dot variant="success" />
    <Dot variant="warning" />
    <Dot variant="destructive" />
    <Dot variant="info" />
    <Dot variant="success" effect="pulse" />
    <Dot variant="destructive" effect="ping" />
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-4">
      <Dot variant="primary" />
      <Dot variant="success" />
      <Dot variant="warning" />
      <Dot variant="destructive" />
      <Dot variant="info" />
      <Dot variant="success" effect="pulse" />
      <Dot variant="destructive" effect="ping" />
    </div>
  </DemoBlock>
</template>
