<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Empty, EmptyHeader, EmptyMedia, EmptyContent, EmptyTitle, EmptyDescription } from '@meldui/vue'
import { IconInbox } from '@meldui/tabler-vue'

const code = `\u003cscript setup>
import { Empty, EmptyHeader, EmptyMedia, EmptyContent, EmptyTitle, EmptyDescription } from '@meldui/vue'
import { IconInbox } from '@meldui/tabler-vue'
\u003c/script>

\u003ctemplate>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <IconInbox class="size-10" />
      </EmptyMedia>
    </EmptyHeader>
    <EmptyContent>
      <EmptyTitle>No items found</EmptyTitle>
      <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
    </EmptyContent>
  </Empty>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox class="size-10" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyContent>
        <EmptyTitle>No items found</EmptyTitle>
        <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
      </EmptyContent>
    </Empty>
  </DemoBlock>
</template>
