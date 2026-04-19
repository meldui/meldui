<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@meldui/vue'

const code = `\u003cscript setup>
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@meldui/vue'
<\/script>

<template>
  <InputOTP :num-inputs="6">
    <InputOTPGroup>
      <InputOTPSlot :index="0" />
      <InputOTPSlot :index="1" />
      <InputOTPSlot :index="2" />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot :index="3" />
      <InputOTPSlot :index="4" />
      <InputOTPSlot :index="5" />
    </InputOTPGroup>
  </InputOTP>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <InputOTP :num-inputs="6">
      <InputOTPGroup>
        <InputOTPSlot :index="0" />
        <InputOTPSlot :index="1" />
        <InputOTPSlot :index="2" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot :index="3" />
        <InputOTPSlot :index="4" />
        <InputOTPSlot :index="5" />
      </InputOTPGroup>
    </InputOTP>
  </DemoBlock>
</template>
