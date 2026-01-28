<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import type { MentionLabelProps } from './types'
import { MENTION_INJECTION_KEY } from './types'

const props = defineProps<MentionLabelProps & { class?: HTMLAttributes['class'] }>()

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionLabel must be used within a Mention component')
}

const { inputId, labelId } = context
</script>

<template>
  <label
    :id="labelId"
    :for="inputId"
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        props.class,
      )
    "
    data-slot="mention-label"
  >
    <slot />
  </label>
</template>
