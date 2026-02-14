<script setup lang="ts">
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@meldui/vue'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <InputOTP v-model="value" :max-length="6">
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
</template>
