<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { AspectRatio } from '@meldui/vue'

const code = `\u003cscript setup>
import { AspectRatio } from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <div class="w-[450px]">
    <AspectRatio :ratio="16 / 9">
      <div class="flex h-full w-full items-center justify-center rounded-md bg-muted">
        16:9
      </div>
    </AspectRatio>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="w-[300px]">
      <AspectRatio :ratio="16 / 9">
        <div class="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
          16:9
        </div>
      </AspectRatio>
    </div>
  </DemoBlock>
</template>
