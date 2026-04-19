<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Label, Input } from '@meldui/vue'

const code = `\u003cscript setup>
import { Label, Input } from '@meldui/vue'
<\/script>

<template>
  <div class="grid w-full max-w-sm gap-1.5">
    <Label for="email">Email</Label>
    <Input id="email" type="email" placeholder="Email" />
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="grid w-full max-w-sm gap-1.5">
      <Label for="email-label">Email</Label>
      <Input id="email-label" type="email" placeholder="Email" />
    </div>
  </DemoBlock>
</template>
