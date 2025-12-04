<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import type { RangeCalendarHeadCellProps } from 'reka-ui'
import { RangeCalendarHeadCell, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<RangeCalendarHeadCellProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarHeadCell
    data-slot="range-calendar-head-cell"
    :class="cn('flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground text-center', props.class)"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarHeadCell>
</template>
