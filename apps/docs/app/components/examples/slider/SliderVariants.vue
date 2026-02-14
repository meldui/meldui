<script setup lang="ts">
import { Slider } from '@meldui/vue'
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <Slider :default-value="[50]" variant="default" />
    <Slider :default-value="[50]" variant="destructive" />
    <Slider :default-value="[50]" variant="success" />
    <Slider :default-value="[50]" variant="warning" />
    <Slider :default-value="[50]" variant="info" />
    <Slider :default-value="[50]" variant="neutral" />
  </div>
</template>
