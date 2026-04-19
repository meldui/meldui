<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Progress } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="space-y-4">
    <Progress :model-value="60" variant="default" />
    <Progress :model-value="60" variant="success" />
    <Progress :model-value="60" variant="warning" />
    <Progress :model-value="60" variant="destructive" />
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full max-w-sm space-y-4">
      <Progress :model-value="60" variant="default" />
      <Progress :model-value="60" variant="success" />
      <Progress :model-value="60" variant="warning" />
      <Progress :model-value="60" variant="destructive" />
    </div>
  </DemoBlock>
</template>
