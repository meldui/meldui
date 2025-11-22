<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { DotVariants } from '.'
import { dotVariants } from '.'

const props = defineProps<{
  variant?: DotVariants['variant']
  size?: DotVariants['size']
  effect?: DotVariants['effect']
  class?: HTMLAttributes['class']
}>()

const hasPingEffect = computed(() => props.effect === 'ping')
</script>

<template>
  <span class="inline-flex items-center justify-center shrink-0" :class="props.class">
    <span v-if="hasPingEffect" class="relative inline-flex">
      <span
        :class="
          cn(
            dotVariants({ variant, size }),
            'absolute inline-flex h-full w-full animate-ping opacity-75',
          )
        "
      />
      <span :class="cn(dotVariants({ variant, size }), 'relative inline-flex')" />
    </span>
    <span v-else :class="cn(dotVariants({ variant, size, effect }))" />
  </span>
</template>
