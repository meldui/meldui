<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Pagination, PaginationContent, PaginationItem, PaginationFirst, PaginationPrevious, PaginationNext, PaginationLast, PaginationEllipsis } from '@meldui/vue'

const code = `\u003cscript setup>
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationFirst, PaginationPrevious, PaginationNext, PaginationLast,
  PaginationEllipsis
} from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Pagination :total="100" :sibling-count="1" show-edges :default-page="1">
    <PaginationContent v-slot="{ items }">
      <PaginationFirst />
      <PaginationPrevious />
      <template v-for="(item, index) in items" :key="index">
        <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === 1">
          {{ item.value }}
        </PaginationItem>
        <PaginationEllipsis v-else :index="index" />
      </template>
      <PaginationNext />
      <PaginationLast />
    </PaginationContent>
  </Pagination>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Pagination :total="100" :sibling-count="1" show-edges :default-page="1">
      <PaginationContent v-slot="{ items }">
        <PaginationFirst />
        <PaginationPrevious />
        <template v-for="(item, index) in items" :key="index">
          <PaginationItem v-if="item.type === 'page'" :value="item.value" :is-active="item.value === 1">
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else :index="index" />
        </template>
        <PaginationNext />
        <PaginationLast />
      </PaginationContent>
    </Pagination>
  </DemoBlock>
</template>
