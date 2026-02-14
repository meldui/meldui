<script setup lang="ts">
import { RelativeTime } from '@meldui/vue'

const now = new Date()
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
</script>

<template>
  <div class="flex flex-col gap-2 text-sm">
    <div class="flex items-center justify-between gap-8">
      <span class="text-muted-foreground">5 minutes ago:</span>
      <RelativeTime :date="fiveMinutesAgo" />
    </div>
    <div class="flex items-center justify-between gap-8">
      <span class="text-muted-foreground">2 hours ago:</span>
      <RelativeTime :date="twoHoursAgo" />
    </div>
    <div class="flex items-center justify-between gap-8">
      <span class="text-muted-foreground">3 days ago:</span>
      <RelativeTime :date="threeDaysAgo" />
    </div>
  </div>
</template>
