<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@meldui/vue'

const code = `\u003ctemplate>
  <!-- Digits only pattern -->
  <InputOTP :num-inputs="4" :pattern="/^\\d+$/">
    <InputOTPGroup>
      <InputOTPSlot v-for="i in 4" :key="i" :index="i - 1" />
    </InputOTPGroup>
  </InputOTP>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <InputOTP :num-inputs="4" :pattern="/^\d+$/">
      <InputOTPGroup>
        <InputOTPSlot v-for="i in 4" :key="i" :index="i - 1" />
      </InputOTPGroup>
    </InputOTP>
  </DemoBlock>
</template>
