<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Badge } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="flex gap-2">
    <Badge shape="pill">Pill</Badge>
    <Badge shape="tag">Tag</Badge>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex gap-2">
      <Badge shape="pill">Pill</Badge>
      <Badge shape="tag">Tag</Badge>
    </div>
  </DemoBlock>
</template>
