<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { NativeSelect, NativeSelectOption } from '@meldui/vue'

const code = `\u003cscript setup>
import { NativeSelect, NativeSelectOption } from '@meldui/vue'
<\/script>

<template>
  <NativeSelect>
    <NativeSelectOption value="" disabled>Select a fruit</NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
  </NativeSelect>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <NativeSelect class="w-[180px]">
      <NativeSelectOption value="" disabled>Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
    </NativeSelect>
  </DemoBlock>
</template>
