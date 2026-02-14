<script setup lang="ts">
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressLabel,
  CircularProgressRange,
  CircularProgressTrack,
} from '@meldui/vue'
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <CircularProgress :value="75" :size="48" :thickness="4">
      <CircularProgressIndicator>
        <CircularProgressTrack />
        <CircularProgressRange />
      </CircularProgressIndicator>
      <CircularProgressLabel />
    </CircularProgress>

    <CircularProgress :value="45" :size="64" :thickness="6" variant="success">
      <CircularProgressIndicator>
        <CircularProgressTrack />
        <CircularProgressRange />
      </CircularProgressIndicator>
      <CircularProgressLabel />
    </CircularProgress>

    <CircularProgress :value="null" :size="48" :thickness="4" variant="info">
      <CircularProgressIndicator>
        <CircularProgressTrack />
        <CircularProgressRange />
      </CircularProgressIndicator>
    </CircularProgress>
  </div>
</template>
