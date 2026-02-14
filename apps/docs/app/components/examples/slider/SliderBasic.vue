<script setup lang="ts">
import { Slider } from '@meldui/vue'
import { ref } from 'vue'

const value = ref([50])
</script>

<template>
  <Slider v-model="value" :max="100" :step="1" class="w-full max-w-sm" />
</template>
