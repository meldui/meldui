<script setup lang="ts">
import { Checkbox, Label } from '@meldui/vue'
import { ref } from 'vue'

const checked = ref(false)
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox id="terms" v-model:checked="checked" />
    <Label for="terms">Accept terms and conditions</Label>
  </div>
</template>
