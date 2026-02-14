<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@meldui/vue'
</script>

<template>
  <AvatarGroup :max="3">
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
      <AvatarFallback>U1</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>U2</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>U3</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>U4</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>U5</AvatarFallback>
    </Avatar>
  </AvatarGroup>
</template>
