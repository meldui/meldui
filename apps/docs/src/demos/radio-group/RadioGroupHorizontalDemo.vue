<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { RadioGroup, RadioGroupItem, Label } from '@meldui/vue'

const code = `\u003ctemplate>
  <RadioGroup default-value="md" orientation="horizontal" class="flex gap-4">
    <div class="flex items-center space-x-2">
      <RadioGroupItem id="sm" value="sm" />
      <Label for="sm">Small</Label>
    </div>
    <div class="flex items-center space-x-2">
      <RadioGroupItem id="md" value="md" />
      <Label for="md">Medium</Label>
    </div>
    <div class="flex items-center space-x-2">
      <RadioGroupItem id="lg" value="lg" />
      <Label for="lg">Large</Label>
    </div>
  </RadioGroup>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <RadioGroup default-value="md" orientation="horizontal" class="flex gap-4">
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="rh-sm" value="sm" />
        <Label for="rh-sm">Small</Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="rh-md" value="md" />
        <Label for="rh-md">Medium</Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="rh-lg" value="lg" />
        <Label for="rh-lg">Large</Label>
      </div>
    </RadioGroup>
  </DemoBlock>
</template>
