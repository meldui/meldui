<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Button } from '@meldui/vue'

const sides = ['top', 'right', 'bottom', 'left']

const code = `\u003cscript setup>
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@meldui/vue'
import { Button } from '@meldui/vue'

const sides = ['top', 'right', 'bottom', 'left']
\u003c/script>

\u003ctemplate>
  <div class="flex gap-2">
    <Sheet v-for="side in sides" :key="side">
      <SheetTrigger as-child>
        <Button variant="outline">{{ side }}</Button>
      </SheetTrigger>
      <SheetContent :side="side">
        <SheetHeader>
          <SheetTitle>{{ side }} sheet</SheetTitle>
          <SheetDescription>This sheet opens from the {{ side }}.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex gap-2">
      <Sheet v-for="side in sides" :key="side">
        <SheetTrigger as-child>
          <Button variant="outline" class="capitalize">{{ side }}</Button>
        </SheetTrigger>
        <SheetContent :side="side">
          <SheetHeader>
            <SheetTitle class="capitalize">{{ side }} sheet</SheetTitle>
            <SheetDescription>This sheet opens from the {{ side }}.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  </DemoBlock>
</template>
