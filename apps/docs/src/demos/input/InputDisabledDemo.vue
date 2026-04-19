<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Input } from '@meldui/vue'

const code = `<template>
  <Input disabled placeholder="Disabled input" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Input disabled placeholder="Disabled input" class="max-w-sm" />
  </DemoBlock>
</template>
