<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Button, toast, Toaster } from '@meldui/vue'

const code = `\u003cscript setup>
import { toast } from '@meldui/vue'
import { Button } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="flex flex-wrap gap-2">
    <Button variant="outline" @click="toast('Event has been created.')">Default</Button>
    <Button variant="outline" @click="toast.success('Changes saved!')">Success</Button>
    <Button variant="outline" @click="toast.error('Something went wrong.')">Error</Button>
    <Button variant="outline" @click="toast.warning('Check your input.')">Warning</Button>
    <Button variant="outline" @click="toast.info('Update available.')">Info</Button>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex flex-wrap gap-2">
      <Button variant="outline" @click="toast('Event has been created.')">Default</Button>
      <Button variant="outline" @click="toast.success('Changes saved!')">Success</Button>
      <Button variant="outline" @click="toast.error('Something went wrong.')">Error</Button>
      <Button variant="outline" @click="toast.warning('Check your input.')">Warning</Button>
      <Button variant="outline" @click="toast.info('Update available.')">Info</Button>
    </div>
    <Toaster position="bottom-right" />
  </DemoBlock>
</template>
