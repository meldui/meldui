<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Button } from '@meldui/vue'
import { IconSend } from '@meldui/tabler-vue'

const code = `\u003cscript setup>
import { Button } from '@meldui/vue'
import { IconSend } from '@meldui/tabler-vue'
\u003c/script>

<template>
  <Button>
    <IconSend class="mr-2 size-4" />
    Send Message
  </Button>
</template>`
</script>

<template>
  <DemoBlock :code="code">
    <Button>
      <IconSend class="mr-2 size-4" />
      Send Message
    </Button>
  </DemoBlock>
</template>
