<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface Props {
  table: Table<TData>
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <Checkbox
    :model-value="
      props.table.getIsAllPageRowsSelected()
        ? true
        : props.table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : false
    "
    @update:model-value="
      (value: boolean | 'indeterminate') => props.table.toggleAllPageRowsSelected(!!value)
    "
    aria-label="Select all"
    :class="cn(props.class)"
  />
</template>
