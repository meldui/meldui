<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@meldui/vue'
</script>

<template>
  <div class="flex items-center gap-4">
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage src="/broken-link.jpg" alt="Broken" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  </div>
</template>
