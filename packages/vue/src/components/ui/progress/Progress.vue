<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { ProgressRootProps } from 'reka-ui'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { ProgressVariants } from '.'
import { progressVariants } from '.'

const props = withDefaults(
  defineProps<
    ProgressRootProps & { class?: HTMLAttributes['class']; variant?: ProgressVariants['variant'] }
  >(),
  {
    modelValue: 0,
  },
)

const delegatedProps = reactiveOmit(props, 'class', 'variant')
</script>

<template>
  <ProgressRoot
    data-slot="progress"
    v-bind="delegatedProps"
    :class="cn(progressVariants({ variant }), props.class)"
  >
    <ProgressIndicator
      data-slot="progress-indicator"
      class="h-full w-full flex-1 transition-all"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
