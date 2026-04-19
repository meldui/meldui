<script setup lang="ts">
import DemoBlock from '../../components/DemoBlock.vue'
import { AvatarGroup, Avatar, AvatarFallback } from '@meldui/vue'

const code = `\u003cscript setup>
import { AvatarGroup, Avatar, AvatarFallback } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <AvatarGroup :max="4" spacing="md">
    <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
    <Avatar><AvatarFallback>IJ</AvatarFallback></Avatar>
  </AvatarGroup>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <AvatarGroup :max="4" spacing="md">
      <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>GH</AvatarFallback></Avatar>
      <Avatar><AvatarFallback>IJ</AvatarFallback></Avatar>
    </AvatarGroup>
  </DemoBlock>
</template>
