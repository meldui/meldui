<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@meldui/vue'

const code = `\u003cscript setup>
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationPrevious, PaginationNext, PaginationEllipsis
} from '@meldui/vue'
\u003c/script>

\u003ctemplate>
  <Pagination :total="50" :sibling-count="0" :default-page="3">
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious />
      <template v-for="(item, index) in items" :key="index">
        <PaginationItem v-if="item.type === 'page'" :value="item.value">
          {{ item.value }}
        </PaginationItem>
        <PaginationEllipsis v-else :index="index" />
      </template>
      <PaginationNext />
    </PaginationContent>
  </Pagination>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Pagination :total="50" :sibling-count="0" :default-page="3">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious />
        <template v-for="(item, index) in items" :key="index">
          <PaginationItem v-if="item.type === 'page'" :value="item.value">
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else :index="index" />
        </template>
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </DemoBlock>
</template>
