<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Textarea } from '@meldui/vue'

const code = `<template>
  <Textarea autosize max-height="200px" placeholder="Grows up to 200px..." />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Textarea autosize max-height="200px" placeholder="Grows up to 200px..." class="max-w-sm" />
  </DemoBlock>
</template>
