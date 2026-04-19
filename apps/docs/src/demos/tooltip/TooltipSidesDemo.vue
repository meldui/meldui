<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, Button } from '@meldui/vue'

const code = `\u003ctemplate>
  <TooltipProvider>
    <div class="flex gap-2">
      <Tooltip>
        <TooltipTrigger as-child><Button variant="outline">Top</Button></TooltipTrigger>
        <TooltipContent side="top"><p>Top tooltip</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child><Button variant="outline">Right</Button></TooltipTrigger>
        <TooltipContent side="right"><p>Right tooltip</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child><Button variant="outline">Bottom</Button></TooltipTrigger>
        <TooltipContent side="bottom"><p>Bottom tooltip</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger as-child><Button variant="outline">Left</Button></TooltipTrigger>
        <TooltipContent side="left"><p>Left tooltip</p></TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <TooltipProvider>
      <div class="flex gap-2">
        <Tooltip>
          <TooltipTrigger as-child><Button variant="outline">Top</Button></TooltipTrigger>
          <TooltipContent side="top"><div>Top tooltip</div></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child><Button variant="outline">Right</Button></TooltipTrigger>
          <TooltipContent side="right"><div>Right tooltip</div></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child><Button variant="outline">Bottom</Button></TooltipTrigger>
          <TooltipContent side="bottom"><div>Bottom tooltip</div></TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child><Button variant="outline">Left</Button></TooltipTrigger>
          <TooltipContent side="left"><div>Left tooltip</div></TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  </DemoBlock>
</template>
