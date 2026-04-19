<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Checkbox, Label } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="space-y-4">
    <div class="flex items-start space-x-2">
      <Checkbox id="notifications" />
      <div class="grid gap-1 leading-none">
        <Label for="notifications" class="font-medium">Email notifications</Label>
        <p class="text-sm text-muted-foreground">Receive emails about account activity.</p>
      </div>
    </div>
    <div class="flex items-start space-x-2">
      <Checkbox id="marketing" />
      <div class="grid gap-1 leading-none">
        <Label for="marketing" class="font-medium">Marketing emails</Label>
        <p class="text-sm text-muted-foreground">Receive emails about new features.</p>
      </div>
    </div>
    <div class="flex items-start space-x-2">
      <Checkbox id="disabled" disabled />
      <div class="grid gap-1 leading-none">
        <Label for="disabled" class="font-medium text-muted-foreground">Disabled option</Label>
        <p class="text-sm text-muted-foreground">This option is not available.</p>
      </div>
    </div>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="space-y-4">
      <div class="flex items-start space-x-2">
        <Checkbox id="cb-notifications" />
        <div class="grid gap-1 leading-none">
          <Label for="cb-notifications" class="font-medium">Email notifications</Label>
          <div class="text-sm text-muted-foreground">Receive emails about account activity.</div>
        </div>
      </div>
      <div class="flex items-start space-x-2">
        <Checkbox id="cb-marketing" />
        <div class="grid gap-1 leading-none">
          <Label for="cb-marketing" class="font-medium">Marketing emails</Label>
          <div class="text-sm text-muted-foreground">Receive emails about new features.</div>
        </div>
      </div>
      <div class="flex items-start space-x-2">
        <Checkbox id="cb-disabled" disabled />
        <div class="grid gap-1 leading-none">
          <Label for="cb-disabled" class="font-medium text-muted-foreground">Disabled option</Label>
          <div class="text-sm text-muted-foreground">This option is not available.</div>
        </div>
      </div>
    </div>
  </DemoBlock>
</template>
