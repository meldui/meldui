<script setup lang="ts">
import { Badge } from '@meldui/vue'
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Badge variant="default" outline>Default</Badge>
    <Badge variant="secondary" outline>Secondary</Badge>
    <Badge variant="destructive" outline>Destructive</Badge>
    <Badge variant="success" outline>Success</Badge>
    <Badge variant="warning" outline>Warning</Badge>
    <Badge variant="info" outline>Info</Badge>
    <Badge variant="neutral" outline>Neutral</Badge>
  </div>
</template>
