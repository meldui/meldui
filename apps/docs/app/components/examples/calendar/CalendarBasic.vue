<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@meldui/vue'
import type { DateValue } from '@internationalized/date'

const value = ref<DateValue>()
</script>

<template>
  <Calendar v-model="value" />
</template>
