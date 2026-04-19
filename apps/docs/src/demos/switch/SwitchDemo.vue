<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Switch, Label } from '@meldui/vue'

const code = `\u003cscript setup>
import { Switch, Label } from '@meldui/vue'
<\/script>

<template>
  <div class="flex items-center space-x-2">
    <Switch id="airplane-mode" />
    <Label for="airplane-mode">Airplane Mode</Label>
  </div>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label for="airplane-mode">Airplane Mode</Label>
    </div>
  </DemoBlock>
</template>
