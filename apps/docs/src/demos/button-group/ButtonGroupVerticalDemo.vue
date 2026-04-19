<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ButtonGroup, Button } from '@meldui/vue'

const code = `\u003cscript setup>
import { ButtonGroup, Button } from '@meldui/vue'
\u003c/script>

<template>
  <ButtonGroup orientation="vertical">
    <Button variant="outline">Top</Button>
    <Button variant="outline">Middle</Button>
    <Button variant="outline">Bottom</Button>
  </ButtonGroup>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  </DemoBlock>
</template>
