<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Alert, AlertTitle, AlertDescription } from '@meldui/vue'

const code = `\u003cscript setup>
import { Alert, AlertTitle, AlertDescription } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Alert>
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
  </Alert>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Alert class="max-w-lg">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  </DemoBlock>
</template>
