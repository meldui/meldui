<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { inject } from 'vue'
import { cn } from '@/lib/utils'
import type { MentionLoadingProps } from './types'
import { MENTION_INJECTION_KEY } from './types'

const props = defineProps<MentionLoadingProps & { class?: HTMLAttributes['class'] }>()

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionLoading must be used within a Mention component')
}

const { loading } = context
</script>

<template>
  <div
    v-if="loading"
    :class="cn('py-6 text-center text-sm text-muted-foreground', props.class)"
    data-slot="mention-loading"
    role="presentation"
    aria-busy="true"
  >
    <slot>Loading...</slot>
  </div>
</template>
