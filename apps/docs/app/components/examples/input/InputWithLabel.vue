<script setup lang="ts">
import { Input, Label } from '@meldui/vue'
</script>

<template>
  <div class="grid w-full max-w-sm gap-1.5">
    <Label for="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>
</template>
