<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { Badge } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="flex flex-wrap gap-2">
    <Badge variant="default" outline>Default</Badge>
    <Badge variant="secondary" outline>Secondary</Badge>
    <Badge variant="destructive" outline>Destructive</Badge>
    <Badge variant="success" outline>Success</Badge>
    <Badge variant="warning" outline>Warning</Badge>
    <Badge variant="info" outline>Info</Badge>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex flex-wrap gap-2">
      <Badge variant="default" outline>Default</Badge>
      <Badge variant="secondary" outline>Secondary</Badge>
      <Badge variant="destructive" outline>Destructive</Badge>
      <Badge variant="success" outline>Success</Badge>
      <Badge variant="warning" outline>Warning</Badge>
      <Badge variant="info" outline>Info</Badge>
    </div>
  </DemoBlock>
</template>
