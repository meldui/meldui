<script setup lang="ts">
import { Kbd, KbdGroup } from '@meldui/vue'
</script>

<template>
  <div class="flex items-center gap-6">
    <Kbd>K</Kbd>
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  </div>
</template>
