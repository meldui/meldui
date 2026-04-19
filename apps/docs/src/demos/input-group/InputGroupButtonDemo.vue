<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { InputGroup, InputGroupInput, InputGroupButton } from '@meldui/vue'

const code = `\u003cscript setup>
import { InputGroup, InputGroupInput, InputGroupButton } from '@meldui/vue'
<\/script>

<template>
  <InputGroup>
    <InputGroupInput placeholder="Enter URL" />
    <InputGroupButton>Go</InputGroupButton>
  </InputGroup>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <InputGroup class="max-w-sm">
      <InputGroupInput placeholder="Enter URL" />
      <InputGroupButton>Go</InputGroupButton>
    </InputGroup>
  </DemoBlock>
</template>
