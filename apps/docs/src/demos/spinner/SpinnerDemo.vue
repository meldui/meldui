<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Spinner } from '@meldui/vue'

const code = `\u003cscript setup>
import { Spinner } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex items-center gap-4">
    <Spinner class="size-4" />
    <Spinner />
    <Spinner class="size-8" />
    <Spinner class="size-12 text-primary" />
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex items-center gap-4">
      <Spinner class="size-4" />
      <Spinner />
      <Spinner class="size-8" />
      <Spinner class="size-12 text-primary" />
    </div>
  </DemoBlock>
</template>
