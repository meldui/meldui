<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Field, FieldLabel, FieldContent, FieldDescription, Input } from '@meldui/vue'

const code = `\u003cscript setup>
import { Field, FieldLabel, FieldContent, FieldDescription, Input } from '@meldui/vue'
<\/script>

<template>
  <Field>
    <FieldLabel>Username</FieldLabel>
    <FieldContent>
      <Input placeholder="Enter username" />
    </FieldContent>
    <FieldDescription>This is your public display name.</FieldDescription>
  </Field>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Field class="w-full max-w-sm">
      <FieldLabel>Username</FieldLabel>
      <FieldContent>
        <Input placeholder="Enter username" />
      </FieldContent>
      <FieldDescription>This is your public display name.</FieldDescription>
    </Field>
  </DemoBlock>
</template>
