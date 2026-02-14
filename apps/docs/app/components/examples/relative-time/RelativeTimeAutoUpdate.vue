<script setup lang="ts">
import { RelativeTime } from '@meldui/vue'

const created = new Date()
</script>

<template>
  <div class="text-sm">
    <span class="text-muted-foreground">This page was opened: </span>
    <RelativeTime :date="created" auto-update :update-interval="1000" />
  </div>
</template>
