<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Button,
} from '@meldui/vue'
</script>

<template>
  <Pagination :total="100" :sibling-count="1" show-edges :default-page="1">
    <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst />
      <PaginationPrevious />
      <template v-for="(item, index) in items" :key="index">
        <PaginationItem v-if="item.type === 'page'" :value="item.value" as-child>
          <Button variant="outline" class="h-10 w-10 p-0">
            {{ item.value }}
          </Button>
        </PaginationItem>
        <PaginationEllipsis v-else :index="index" />
      </template>
      <PaginationNext />
      <PaginationLast />
    </PaginationContent>
  </Pagination>
</template>
