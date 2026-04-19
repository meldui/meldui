<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { ButtonGroup, Button } from '@meldui/vue'

const code = `<script setup>
import { ButtonGroup, Button } from '@meldui/vue'
</script>

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
