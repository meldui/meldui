<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Popover, PopoverTrigger, PopoverContent, Button, Input, Label } from '@meldui/vue'

const code = `\u003cscript setup>
import { Popover, PopoverTrigger, PopoverContent } from '@meldui/vue'
import { Button, Input, Label } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline">Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Dimensions</h4>
          <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="width">Width</Label>
            <Input id="width" default-value="100%" class="col-span-2 h-8" />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="height">Height</Label>
            <Input id="height" default-value="25px" class="col-span-2 h-8" />
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent class="w-80">
        <div class="grid gap-4">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">Dimensions</h4>
            <div class="text-sm text-muted-foreground">Set the dimensions for the layer.</div>
          </div>
          <div class="grid gap-2">
            <div class="grid grid-cols-3 items-center gap-4">
              <Label for="p-width">Width</Label>
              <Input id="p-width" default-value="100%" class="col-span-2 h-8" />
            </div>
            <div class="grid grid-cols-3 items-center gap-4">
              <Label for="p-height">Height</Label>
              <Input id="p-height" default-value="25px" class="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </DemoBlock>
</template>
