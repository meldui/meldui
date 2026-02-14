<script setup lang="ts">
import { Progress } from '@meldui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Progress :model-value="60" variant="default" class="w-full" />
    <Progress :model-value="80" variant="success" class="w-full" />
    <Progress :model-value="45" variant="warning" class="w-full" />
    <Progress :model-value="30" variant="destructive" class="w-full" />
    <Progress :model-value="70" variant="info" class="w-full" />
    <Progress :model-value="55" variant="neutral" class="w-full" />
  </div>
</template>
