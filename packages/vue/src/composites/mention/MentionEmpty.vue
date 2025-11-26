<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import type { MentionEmptyProps } from './types'
import { MENTION_INJECTION_KEY } from './types'

const props = defineProps<MentionEmptyProps & { class?: HTMLAttributes['class'] }>()

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionEmpty must be used within a Mention component')
}

const { items, loading } = context

// Only show when not loading and no items
const shouldShow = computed(() => !loading.value && items.value.length === 0)
</script>

<template>
  <div
    v-if="shouldShow"
    :class="cn('py-6 text-center text-sm text-muted-foreground', props.class)"
    data-slot="mention-empty"
    role="presentation"
  >
    <slot>No results found</slot>
  </div>
</template>
