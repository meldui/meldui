<script setup lang="ts">
import { Field, FieldContent, FieldDescription, FieldLabel, Input } from '@meldui/vue'
</script>

<template>
  <Field>
    <FieldLabel>Email</FieldLabel>
    <FieldContent>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>We will never share your email.</FieldDescription>
    </FieldContent>
  </Field>
</template>
