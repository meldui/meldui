<script setup lang="ts">
import { ScrollArea } from '@meldui/vue'
import { Separator } from '@meldui/vue'

const tags = Array.from({ length: 50 }).map((_, i) => `v1.0.0-beta.${i + 1}`)
</script>

<template>
  <ScrollArea class="h-72 w-48 rounded-md border">
    <div class="p-4">
      <h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
      <div v-for="tag in tags" :key="tag">
        <div class="text-sm">{{ tag }}</div>
        <Separator class="my-2" />
      </div>
    </div>
  </ScrollArea>
</template>
