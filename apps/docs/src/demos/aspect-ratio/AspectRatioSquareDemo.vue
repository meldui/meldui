<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { AspectRatio } from '@meldui/vue'

const code = `\u003ctemplate>
  <div class="flex gap-4">
    <div class="w-[150px]">
      <AspectRatio :ratio="1">
        <div class="flex h-full w-full items-center justify-center rounded-md bg-muted">1:1</div>
      </AspectRatio>
    </div>
    <div class="w-[150px]">
      <AspectRatio :ratio="4 / 3">
        <div class="flex h-full w-full items-center justify-center rounded-md bg-muted">4:3</div>
      </AspectRatio>
    </div>
    <div class="w-[150px]">
      <AspectRatio :ratio="21 / 9">
        <div class="flex h-full w-full items-center justify-center rounded-md bg-muted">21:9</div>
      </AspectRatio>
    </div>
  </div>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex gap-4">
      <div class="w-[120px]">
        <AspectRatio :ratio="1">
          <div class="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">1:1</div>
        </AspectRatio>
      </div>
      <div class="w-[120px]">
        <AspectRatio :ratio="4 / 3">
          <div class="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">4:3</div>
        </AspectRatio>
      </div>
      <div class="w-[150px]">
        <AspectRatio :ratio="21 / 9">
          <div class="flex h-full w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">21:9</div>
        </AspectRatio>
      </div>
    </div>
  </DemoBlock>
</template>
