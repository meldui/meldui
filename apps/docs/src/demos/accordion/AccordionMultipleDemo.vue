<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@meldui/vue'

const code = `\u003ctemplate>
  <Accordion type="multiple" :default-value="['item-1']">
    <AccordionItem value="item-1">
      <AccordionTrigger>Multiple sections can be open</AccordionTrigger>
      <AccordionContent>This accordion allows multiple items to be expanded simultaneously.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Try opening both</AccordionTrigger>
      <AccordionContent>Both this and the item above can be open at the same time.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3" disabled>
      <AccordionTrigger>Disabled item</AccordionTrigger>
      <AccordionContent>This content is not reachable.</AccordionContent>
    </AccordionItem>
  </Accordion>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Accordion type="multiple" :default-value="['item-1']" class="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Multiple sections can be open</AccordionTrigger>
        <AccordionContent>This accordion allows multiple items to be expanded simultaneously.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Try opening both</AccordionTrigger>
        <AccordionContent>Both this and the item above can be open at the same time.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>This content is not reachable.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </DemoBlock>
</template>
