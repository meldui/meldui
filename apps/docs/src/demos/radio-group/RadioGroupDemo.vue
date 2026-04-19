<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { RadioGroup, RadioGroupItem, Label } from '@meldui/vue'

const code = `\u003cscript setup>
import { RadioGroup, RadioGroupItem, Label } from '@meldui/vue'
<\/script>

<template>
  <RadioGroup default-value="comfortable">
    <div class="flex items-center space-x-2">
      <RadioGroupItem id="default" value="default" />
      <Label for="default">Default</Label>
    </div>
    <div class="flex items-center space-x-2">
      <RadioGroupItem id="comfortable" value="comfortable" />
      <Label for="comfortable">Comfortable</Label>
    </div>
    <div class="flex items-center space-x-2">
      <RadioGroupItem id="compact" value="compact" />
      <Label for="compact">Compact</Label>
    </div>
  </RadioGroup>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <RadioGroup default-value="comfortable">
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="r-default" value="default" />
        <Label for="r-default">Default</Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="r-comfortable" value="comfortable" />
        <Label for="r-comfortable">Comfortable</Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="r-compact" value="compact" />
        <Label for="r-compact">Compact</Label>
      </div>
    </RadioGroup>
  </DemoBlock>
</template>
