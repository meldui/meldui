<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Separator } from '@meldui/vue'

const code = `\u003cscript setup>
import { Separator } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div>
    <p>Content above</p>
    <Separator class="my-4" />
    <p>Content below</p>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full max-w-sm">
      <p class="text-sm">Content above</p>
      <Separator class="my-4" />
      <p class="text-sm">Content below</p>
    </div>
  </DemoBlock>
</template>
