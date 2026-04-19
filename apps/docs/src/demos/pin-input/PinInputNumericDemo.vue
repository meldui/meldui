<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { PinInput, PinInputGroup, PinInputSlot } from '@meldui/vue'

const code = `\u003ctemplate>
  <!-- Numeric-only pin input with 4 digits -->
  <PinInput type="number" placeholder="○">
    <PinInputGroup>
      <PinInputSlot v-for="i in 4" :key="i" :index="i - 1" />
    </PinInputGroup>
  </PinInput>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <PinInput type="number" placeholder="○">
      <PinInputGroup>
        <PinInputSlot v-for="i in 4" :key="i" :index="i - 1" />
      </PinInputGroup>
    </PinInput>
  </DemoBlock>
</template>
