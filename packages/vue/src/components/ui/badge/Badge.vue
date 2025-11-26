<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { PrimitiveProps } from 'reka-ui'
import { Primitive } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { BadgeVariants } from '.'
import { badgeVariants } from '.'

const props = defineProps<
  PrimitiveProps & {
    shape?: BadgeVariants['shape']
    variant?: BadgeVariants['variant']
    outline?: BadgeVariants['outline']
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class', 'shape', 'variant', 'outline')
</script>

<template>
  <Primitive
    data-slot="badge"
    :class="cn(badgeVariants({ shape, variant, outline }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
