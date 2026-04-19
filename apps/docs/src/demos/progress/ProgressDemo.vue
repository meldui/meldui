<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Progress } from '@meldui/vue'

const code = `\u003cscript setup>
import { Progress } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Progress :model-value="60" />
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Progress :model-value="60" class="w-full max-w-sm" />
  </DemoBlock>
</template>
