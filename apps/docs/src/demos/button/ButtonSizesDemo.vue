<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Button } from '@meldui/vue'

const code = `\u003cscript setup>
import { Button } from '@meldui/vue'
\u003c/script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
    <Button size="icon">+</Button>
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex flex-wrap items-center gap-2">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">+</Button>
    </div>
  </DemoBlock>
</template>
