<script setup lang="ts">
import { Button, Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@meldui/vue'
import { IconInbox } from '@meldui/tabler-vue'
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <IconInbox />
      </EmptyMedia>
      <EmptyTitle>No results found</EmptyTitle>
      <EmptyDescription>
        Try adjusting your search or filters to find what you are looking for.
      </EmptyDescription>
    </EmptyHeader>
    <Button variant="outline">Clear filters</Button>
  </Empty>
</template>
