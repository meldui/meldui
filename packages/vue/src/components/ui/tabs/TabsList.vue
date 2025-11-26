<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { TabsListProps } from 'reka-ui'
import { TabsList } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { inject, ref } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_VARIANT_KEY, tabsListVariants } from '.'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const variant = inject(TABS_VARIANT_KEY, ref('line'))
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    v-bind="delegatedProps"
    :class="cn(tabsListVariants({ variant }), props.class)"
  >
    <slot />
  </TabsList>
</template>
