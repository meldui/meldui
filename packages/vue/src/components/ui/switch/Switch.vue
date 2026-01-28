<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { SwitchVariants } from '.'
import { switchVariants } from '.'

const props = defineProps<
  SwitchRootProps & { class?: HTMLAttributes['class']; variant?: SwitchVariants['variant'] }
>()

const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'variant')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SwitchRoot
    v-slot="slotProps"
    data-slot="switch"
    v-bind="forwarded"
    :class="cn(switchVariants.root({ variant }), props.class)"
  >
    <SwitchThumb data-slot="switch-thumb" :class="cn(switchVariants.thumb({ variant }))">
      <slot name="thumb" v-bind="slotProps" />
    </SwitchThumb>
  </SwitchRoot>
</template>
