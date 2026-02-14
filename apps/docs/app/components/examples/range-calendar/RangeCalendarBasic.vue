<script setup lang="ts">
import { ref } from 'vue'
import { RangeCalendar } from '@meldui/vue'
import type { DateValue } from '@internationalized/date'

const value = ref<{ start: DateValue; end: DateValue }>()
</script>

<template>
  <RangeCalendar v-model="value" />
</template>
