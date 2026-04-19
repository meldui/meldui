<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Switch } from '@meldui/vue'

const code = `<template>
  <Switch variant="default" />
  <Switch variant="success" />
  <Switch variant="warning" />
  <Switch variant="destructive" />
  <Switch variant="info" />
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-4">
      <Switch variant="default" default-checked />
      <Switch variant="success" default-checked />
      <Switch variant="warning" default-checked />
      <Switch variant="destructive" default-checked />
      <Switch variant="info" default-checked />
    </div>
  </DemoBlock>
</template>
