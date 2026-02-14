<script setup lang="ts">
import { Skeleton } from '@meldui/vue'
</script>

<template>
  <div class="flex items-center gap-4">
    <Skeleton class="h-12 w-12 rounded-full" />
    <div class="flex flex-col gap-2">
      <Skeleton class="h-4 w-[250px]" />
      <Skeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>
