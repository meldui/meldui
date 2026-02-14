<script setup lang="ts">
import { InputGroup, InputGroupAddon, InputGroupInput } from '@meldui/vue'
import { IconMail } from '@meldui/tabler-vue'
</script>

<template>
  <InputGroup>
    <InputGroupAddon align="inline-start">
      <IconMail />
    </InputGroupAddon>
    <InputGroupInput placeholder="Email address" />
  </InputGroup>
</template>
