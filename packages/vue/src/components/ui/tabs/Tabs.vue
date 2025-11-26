<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { provide, toRef } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_VARIANT_KEY, type TabsVariant } from '.'

const props = withDefaults(
  defineProps<TabsRootProps & { class?: HTMLAttributes['class']; variant?: TabsVariant }>(),
  {
    variant: 'line',
  },
)
const emits = defineEmits<TabsRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'variant')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

provide(
  TABS_VARIANT_KEY,
  toRef(() => props.variant),
)
</script>

<template>
  <TabsRoot
    v-slot="slotProps"
    data-slot="tabs"
    v-bind="forwarded"
    :class="cn('flex flex-col gap-2', props.class)"
  >
    <slot v-bind="slotProps" />
  </TabsRoot>
</template>
