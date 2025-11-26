<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { TabsTriggerProps } from 'reka-ui'
import { TabsTrigger, useForwardProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { inject, ref } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_VARIANT_KEY, tabsTriggerVariants } from '.'

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)

const variant = inject(TABS_VARIANT_KEY, ref('line'))
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    :class="cn(tabsTriggerVariants({ variant }), props.class)"
    v-bind="forwardedProps"
  >
    <slot />
  </TabsTrigger>
</template>
