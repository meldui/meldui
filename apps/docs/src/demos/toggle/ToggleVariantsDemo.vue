<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Toggle } from '@meldui/vue'

const code = `<script setup>
import { Toggle } from '@meldui/vue'
</script>

<template>
  <div class="flex items-center gap-2">
    <Toggle variant="default">Default</Toggle>
    <Toggle variant="outline">Outline</Toggle>
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-2">
      <Toggle variant="default">Default</Toggle>
      <Toggle variant="outline">Outline</Toggle>
    </div>
  </DemoBlock>
</template>
