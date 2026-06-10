<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Input, Button } from '@meldui/vue'

const onSubmit = (values) => console.log(values)

function validateUsername(value) {
  if (!value) return 'Username is required'
  if (value.length < 2) return 'Username must be at least 2 characters'
  if (value.length > 50) return 'Username must be at most 50 characters'
  return true
}

const code = `\u003cscript setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@meldui/vue'
import { Input } from '@meldui/vue'

const formSchema = toTypedSchema(z.object({
  username: z.string().min(2).max(50),
}))

const { handleSubmit } = useForm({ validationSchema: formSchema })
const onSubmit = handleSubmit((values) => console.log(values))
<\/script>

<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input placeholder="username" v-bind="componentField" />
        </FormControl>
        <FormDescription>Your public display name.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Form class="w-full max-w-sm space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="username" :rules="validateUsername">
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="username" v-bind="componentField" />
          </FormControl>
          <FormDescription>Your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit">Submit</Button>
    </Form>
  </DemoBlock>
</template>
