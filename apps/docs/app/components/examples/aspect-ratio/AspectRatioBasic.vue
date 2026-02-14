<script setup lang="ts">
import { AspectRatio } from '@meldui/vue'
</script>

<template>
  <div class="w-[450px] overflow-hidden rounded-lg">
    <AspectRatio :ratio="16 / 9">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Landscape photograph"
        class="h-full w-full object-cover"
      />
    </AspectRatio>
  </div>
</template>
