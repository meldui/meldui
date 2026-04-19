<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@meldui/vue'

const code = `\u003cscript setup>
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Is it styled?</AccordionTrigger>
      <AccordionContent>Yes. It comes with default styles via Tailwind CSS.</AccordionContent>
    </AccordionItem>
  </Accordion>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Accordion type="single" collapsible class="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It comes with default styles via Tailwind CSS.</AccordionContent>
      </AccordionItem>
    </Accordion>
  </DemoBlock>
</template>
