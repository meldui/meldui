<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { NumberField, NumberFieldContent, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from '@meldui/vue'

const code = `\u003cscript setup>
import { NumberField, NumberFieldContent, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from '@meldui/vue'
<\/script>

<template>
  <NumberField :default-value="5" :min="0" :max="100">
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <NumberField :default-value="5" :min="0" :max="100">
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </DemoBlock>
</template>
