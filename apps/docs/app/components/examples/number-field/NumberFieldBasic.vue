<script setup lang="ts">
import {
  Label,
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@meldui/vue'
</script>

<template>
  <NumberField :default-value="5" :min="0" :max="100">
    <Label>Quantity</Label>
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
