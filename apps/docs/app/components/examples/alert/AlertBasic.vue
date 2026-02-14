<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@meldui/vue'
import { IconInfoCircle } from '@meldui/tabler-vue'
</script>

<template>
  <Alert>
    <IconInfoCircle />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription> You can add components to your app using the CLI. </AlertDescription>
  </Alert>
</template>
