<script setup lang="ts">
import { Label, Switch } from '@meldui/vue'
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <div class="flex items-center gap-2">
    <Switch id="airplane" v-model:checked="enabled" />
    <Label for="airplane">Airplane Mode</Label>
  </div>
</template>
