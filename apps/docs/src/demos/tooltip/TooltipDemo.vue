<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, Button } from '@meldui/vue'

const code = `\u003cscript setup>
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@meldui/vue'
import { Button } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <div>Add to library</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </DemoBlock>
</template>
