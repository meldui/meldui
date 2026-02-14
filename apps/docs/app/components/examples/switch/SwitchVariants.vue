<script setup lang="ts">
import { Label, Switch } from '@meldui/vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <Switch variant="default" default-checked />
      <Label>Default</Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch variant="destructive" default-checked />
      <Label>Destructive</Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch variant="success" default-checked />
      <Label>Success</Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch variant="warning" default-checked />
      <Label>Warning</Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch variant="info" default-checked />
      <Label>Info</Label>
    </div>
    <div class="flex items-center gap-2">
      <Switch variant="neutral" default-checked />
      <Label>Neutral</Label>
    </div>
  </div>
</template>
