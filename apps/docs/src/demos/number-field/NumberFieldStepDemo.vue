<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { NumberField, NumberFieldContent, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement } from '@meldui/vue'

const code = `\u003ctemplate>
  <NumberField :default-value="0.5" :min="0" :max="10" :step="0.1" :format-options="{ minimumFractionDigits: 1 }">
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <NumberField :default-value="0.5" :min="0" :max="10" :step="0.1" :format-options="{ minimumFractionDigits: 1 }">
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </DemoBlock>
</template>
