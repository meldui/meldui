<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@meldui/vue'
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from '@meldui/tabler-vue'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Alert variant="default">
      <AlertTitle>Default</AlertTitle>
      <AlertDescription>This is a default alert.</AlertDescription>
    </Alert>

    <Alert variant="destructive">
      <IconAlertOctagon />
      <AlertTitle>Destructive</AlertTitle>
      <AlertDescription>Something went wrong. Please try again.</AlertDescription>
    </Alert>

    <Alert variant="success">
      <IconCircleCheck />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved.</AlertDescription>
    </Alert>

    <Alert variant="warning">
      <IconAlertTriangle />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Your session is about to expire.</AlertDescription>
    </Alert>

    <Alert variant="info">
      <IconInfoCircle />
      <AlertTitle>Info</AlertTitle>
      <AlertDescription>A new version is available.</AlertDescription>
    </Alert>

    <Alert variant="neutral">
      <AlertTitle>Neutral</AlertTitle>
      <AlertDescription>This is a neutral informational alert.</AlertDescription>
    </Alert>
  </div>
</template>
