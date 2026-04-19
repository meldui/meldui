<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Alert, AlertTitle, AlertDescription } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="space-y-4">
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong.</AlertDescription>
    </Alert>
    <Alert variant="success">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Operation completed successfully.</AlertDescription>
    </Alert>
    <Alert variant="warning">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Please check your input.</AlertDescription>
    </Alert>
    <Alert variant="info">
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>A new update is available.</AlertDescription>
    </Alert>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-full max-w-lg space-y-4">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Operation completed successfully.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Please check your input.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>A new update is available.</AlertDescription>
      </Alert>
    </div>
  </DemoBlock>
</template>
