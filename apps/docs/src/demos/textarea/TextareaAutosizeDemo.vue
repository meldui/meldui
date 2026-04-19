<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Textarea } from '@meldui/vue'

const code = `<template>
  <Textarea autosize placeholder="This textarea grows as you type..." />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Textarea autosize placeholder="This textarea grows as you type..." class="max-w-sm" />
  </DemoBlock>
</template>
