<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@meldui/vue'
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from '@meldui/tabler-vue'
</script>

<template>
  <ToggleGroup type="single">
    <ToggleGroupItem value="left" aria-label="Align left">
      <IconAlignLeft />
    </ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center">
      <IconAlignCenter />
    </ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right">
      <IconAlignRight />
    </ToggleGroupItem>
  </ToggleGroup>
</template>
