<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Badge } from '@meldui/vue'

const code = `\u003cscript setup>
import { Badge } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex flex-wrap gap-2">
    <Badge>Default</Badge>
    <Badge variant="secondary">Secondary</Badge>
    <Badge variant="destructive">Destructive</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="info">Info</Badge>
    <Badge variant="neutral">Neutral</Badge>
    <Badge variant="default" outline>Outline</Badge>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="default" outline>Outline</Badge>
    </div>
  </DemoBlock>
</template>
