<script setup lang="ts">
import { Dot } from '@meldui/vue'
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <div class="flex items-center gap-2">
      <Dot variant="success" effect="pulse" />
      <span class="text-sm">Pulse</span>
    </div>
    <div class="flex items-center gap-2">
      <Dot variant="destructive" effect="ping" />
      <span class="text-sm">Ping</span>
    </div>
    <div class="flex items-center gap-2">
      <Dot variant="info" />
      <span class="text-sm">Static</span>
    </div>
  </div>
</template>
