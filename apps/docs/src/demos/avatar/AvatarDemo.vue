<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Avatar, AvatarImage, AvatarFallback } from '@meldui/vue'

const code = `\u003cscript setup>
import { Avatar, AvatarImage, AvatarFallback } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex gap-4">
    <Avatar>
      <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
      <AvatarFallback>RV</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/radix-vue.png" alt="@radix-vue" />
        <AvatarFallback>RV</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  </DemoBlock>
</template>
