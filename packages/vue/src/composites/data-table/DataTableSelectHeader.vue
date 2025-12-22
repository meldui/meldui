<script setup lang="ts" generic="TData">
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { DataTableSelectHeaderProps } from './componentProps'

const props = defineProps<DataTableSelectHeaderProps<TData>>()
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
            (value: boolean | 'indeterminate') =>
                props.table.toggleAllPageRowsSelected(!!value)
        "
        aria-label="Select all"
        :class="cn(props.class)"
    />
</template>
