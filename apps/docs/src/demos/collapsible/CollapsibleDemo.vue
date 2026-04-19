<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from '@meldui/vue'

const open = ref(false)

const code = `\u003cscript setup>
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@meldui/vue'
import { Button } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Collapsible>
    <CollapsibleTrigger as-child>
      <Button variant="ghost">Toggle</Button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <p>This content can be collapsed.</p>
    </CollapsibleContent>
  </Collapsible>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Collapsible v-model:open="open" class="w-full max-w-sm space-y-2">
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="sm">
          {{ open ? 'Hide' : 'Show' }} content
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div class="rounded-md border px-4 py-3 text-sm">
          This content can be collapsed.
        </div>
      </CollapsibleContent>
    </Collapsible>
  </DemoBlock>
</template>
