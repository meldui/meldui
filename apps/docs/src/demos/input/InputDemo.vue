<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Input } from '@meldui/vue'

const code = `\u003cscript setup>
import { Input } from '@meldui/vue'
<\/script>

<template>
  <Input placeholder="Enter your email" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Input placeholder="Enter your email" class="max-w-sm" />
  </DemoBlock>
</template>
