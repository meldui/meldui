<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ButtonGroup, Button } from '@meldui/vue'

const code = `\u003cscript setup>
import { ButtonGroup, Button } from '@meldui/vue'
\u003c/script>

<template>
  <ButtonGroup>
    <Button variant="outline">Left</Button>
    <Button variant="outline">Center</Button>
    <Button variant="outline">Right</Button>
  </ButtonGroup>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  </DemoBlock>
</template>
