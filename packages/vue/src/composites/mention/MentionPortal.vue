<script setup lang="ts">
import { inject } from 'vue'
import type { MentionPortalProps } from './types'
import { MENTION_INJECTION_KEY } from './types'

const props = withDefaults(defineProps<MentionPortalProps>(), {
  to: 'body',
  disabled: false,
})

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionPortal must be used within a Mention component')
}

const { open } = context
</script>

<template>
  <Teleport :to="props.to" :disabled="props.disabled">
    <slot v-if="open" />
  </Teleport>
</template>
