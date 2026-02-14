<script setup lang="ts">
import { Button, Spinner } from '@meldui/vue'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <Button disabled>
      <Spinner class="size-4" />
      Please wait
    </Button>
  </div>
</template>
