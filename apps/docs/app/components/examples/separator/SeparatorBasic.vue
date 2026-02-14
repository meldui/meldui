<script setup lang="ts">
import { Separator } from '@meldui/vue'
</script>

<template>
  <div>
    <div class="space-y-1">
      <h4 class="text-sm font-medium leading-none">MeldUI</h4>
      <p class="text-sm text-muted-foreground">An open-source design system.</p>
    </div>
    <Separator class="my-4" />
    <div class="flex h-5 items-center space-x-4 text-sm">
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
      <Separator orientation="vertical" />
      <div>Changelog</div>
    </div>
  </div>
</template>
