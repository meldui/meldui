<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Switch } from '@meldui/vue'

const code = `\u003ctemplate>
  <Switch variant="default" :default-value="true" />
  <Switch variant="success" :default-value="true" />
  <Switch variant="warning" :default-value="true" />
  <Switch variant="destructive" :default-value="true" />
  <Switch variant="info" :default-value="true" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-4">
      <Switch variant="default" :default-value="true" />
      <Switch variant="success" :default-value="true" />
      <Switch variant="warning" :default-value="true" />
      <Switch variant="destructive" :default-value="true" />
      <Switch variant="info" :default-value="true" />
    </div>
  </DemoBlock>
</template>
