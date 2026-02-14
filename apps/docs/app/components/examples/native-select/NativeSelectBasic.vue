<script setup lang="ts">
import { NativeSelect, NativeSelectOption } from '@meldui/vue'
import { ref } from 'vue'

const selected = ref('')
</script>

<template>
  <NativeSelect v-model="selected">
    <NativeSelectOption value="" disabled>Select a fruit...</NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
    <NativeSelectOption value="grape">Grape</NativeSelectOption>
  </NativeSelect>
</template>
