<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { Avatar, AvatarFallback } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="flex items-end gap-4">
    <Avatar class="size-6"><AvatarFallback class="text-xs">XS</AvatarFallback></Avatar>
    <Avatar class="size-8"><AvatarFallback class="text-xs">SM</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
    <Avatar class="size-14"><AvatarFallback class="text-lg">LG</AvatarFallback></Avatar>
    <Avatar class="size-20"><AvatarFallback class="text-xl">XL</AvatarFallback></Avatar>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-end gap-4">
      <Avatar class="size-6"><AvatarFallback class="text-xs">XS</AvatarFallback></Avatar>
      <Avatar class="size-8"><AvatarFallback class="text-xs">SM</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>MD</AvatarFallback></Avatar>
      <Avatar class="size-14"><AvatarFallback class="text-lg">LG</AvatarFallback></Avatar>
      <Avatar class="size-20"><AvatarFallback class="text-xl">XL</AvatarFallback></Avatar>
    </div>
  </DemoBlock>
</template>
