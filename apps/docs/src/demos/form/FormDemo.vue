<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, Input, Button } from '@meldui/vue'

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
    <div class="w-full max-w-sm space-y-4">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input placeholder="username" />
        </FormControl>
        <FormDescription>Your public display name.</FormDescription>
        <FormMessage />
      </FormItem>
      <Button type="submit">Submit</Button>
    </div>
  </DemoBlock>
</template>
