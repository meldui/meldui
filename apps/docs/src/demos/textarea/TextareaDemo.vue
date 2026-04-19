<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Textarea } from '@meldui/vue'

const code = `\u003cscript setup>
import { Textarea } from '@meldui/vue'
<\/script>

<template>
  <Textarea placeholder="Type your message here." />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Textarea placeholder="Type your message here." class="max-w-sm" />
  </DemoBlock>
</template>
