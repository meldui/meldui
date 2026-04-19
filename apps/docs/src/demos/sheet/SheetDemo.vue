<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Button, Input, Label } from '@meldui/vue'

const code = `\u003cscript setup>
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@meldui/vue'
import { Button, Input, Label } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline">Open Sheet</Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit Profile</SheetTitle>
        <SheetDescription>Make changes to your profile.</SheetDescription>
      </SheetHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input id="name" class="col-span-3" />
        </div>
      </div>
    </SheetContent>
  </Sheet>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>Make changes to your profile.</SheetDescription>
        </SheetHeader>
        <div class="px-4 grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="s-name" class="text-right">Name</Label>
            <Input id="s-name" class="col-span-3" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </DemoBlock>
</template>
