<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Field, FieldLabel, FieldContent, Input } from '@meldui/vue'

const code = `<template>
  <Field orientation="horizontal">
    <FieldLabel>Name</FieldLabel>
    <FieldContent>
      <Input placeholder="Name" />
    </FieldContent>
  </Field>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Field orientation="horizontal" class="w-full max-w-md">
      <FieldLabel>Name</FieldLabel>
      <FieldContent>
        <Input placeholder="Name" />
      </FieldContent>
    </Field>
  </DemoBlock>
</template>
