<script setup lang="ts">
import { DateRangePicker } from '@meldui/vue'
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <DateRangePicker v-model="value" placeholder="Pick a date range" />
</template>
