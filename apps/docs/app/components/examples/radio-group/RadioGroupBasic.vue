<script setup lang="ts">
import { Label, RadioGroup, RadioGroupItem } from '@meldui/vue'
import { ref } from 'vue'

const selected = ref('comfortable')
</script>

<template>
  <RadioGroup v-model="selected">
    <div class="flex items-center gap-2">
      <RadioGroupItem id="default" value="default" />
      <Label for="default">Default</Label>
    </div>
    <div class="flex items-center gap-2">
      <RadioGroupItem id="comfortable" value="comfortable" />
      <Label for="comfortable">Comfortable</Label>
    </div>
    <div class="flex items-center gap-2">
      <RadioGroupItem id="compact" value="compact" />
      <Label for="compact">Compact</Label>
    </div>
  </RadioGroup>
</template>
