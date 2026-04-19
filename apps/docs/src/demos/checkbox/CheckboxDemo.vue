<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Checkbox, Label } from '@meldui/vue'

const code = `\u003cscript setup>
import { Checkbox, Label } from '@meldui/vue'
<\/script>

<template>
  <div class="flex items-center space-x-2">
    <Checkbox id="terms" />
    <Label for="terms">Accept terms and conditions</Label>
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label for="terms">Accept terms and conditions</Label>
    </div>
  </DemoBlock>
</template>
