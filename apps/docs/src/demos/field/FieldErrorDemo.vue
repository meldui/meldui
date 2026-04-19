<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Field, FieldLabel, FieldContent, FieldError, Input } from '@meldui/vue'

const code = `<template>
  <Field>
    <FieldLabel>Email</FieldLabel>
    <FieldContent>
      <Input placeholder="Email" />
    </FieldContent>
    <FieldError :errors="['Please enter a valid email address.']" />
  </Field>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Field class="w-full max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <FieldContent>
        <Input placeholder="Email" />
      </FieldContent>
      <FieldError :errors="['Please enter a valid email address.']" />
    </Field>
  </DemoBlock>
</template>
