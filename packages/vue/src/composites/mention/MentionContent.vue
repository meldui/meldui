<script setup lang="ts">
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import type { HTMLAttributes } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import type { MentionContentProps } from './types'
import { MENTION_INJECTION_KEY } from './types'

const props = withDefaults(
  defineProps<MentionContentProps & { class?: HTMLAttributes['class'] }>(),
  {
    side: 'bottom',
    sideOffset: 4,
    align: 'start',
    avoidCollisions: true,
  },
)

const context = inject(MENTION_INJECTION_KEY)

if (!context) {
  throw new Error('MentionContent must be used within a Mention component')
}

const { open, virtualAnchor, contentRef, setItems, setLoading } = context

// Sync items from props
watch(
  () => props.items,
  (newItems) => {
    if (newItems) {
      setItems(newItems)
    }
  },
  { immediate: true },
)

// Sync loading from props
watch(
  () => props.loading,
  (newLoading) => {
    if (newLoading !== undefined) {
      setLoading(newLoading)
    }
  },
  { immediate: true },
)

// Floating UI setup
const floatingEl = ref<HTMLElement | null>(null)

const placement = computed(() => {
  const side = props.side
  const align = props.align
  if (align === 'center') return side
  return `${side}-${align}` as const
})

const middleware = computed(() => {
  const result = [offset(props.sideOffset)]

  if (props.avoidCollisions) {
    result.push(flip())
    result.push(shift({ padding: 8 }))
  }

  return result
})

const { floatingStyles, placement: actualPlacement } = useFloating(virtualAnchor, floatingEl, {
  placement,
  middleware,
  whileElementsMounted: autoUpdate,
  strategy: 'fixed',
})

// Update content ref
watch(floatingEl, (el) => {
  contentRef.value = el
})

// Computed data attributes
const side = computed(() => actualPlacement.value.split('-')[0])
const align = computed(() => actualPlacement.value.split('-')[1] || 'center')
</script>

<template>
  <div
    v-if="open && virtualAnchor"
    ref="floatingEl"
    :class="cn(
      'bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
      props.class
    )"
    :style="floatingStyles"
    :data-state="open ? 'open' : 'closed'"
    :data-side="side"
    :data-align="align"
    data-slot="mention-content"
    role="listbox"
  >
    <slot />
  </div>
</template>
