<script setup lang="ts">
import type { HTMLAttributes, Slots, VNode } from 'vue'
import { computed, useSlots } from 'vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { AvatarGroupVariants } from '.'
import { avatarGroupVariants } from '.'

export interface AvatarGroupProps {
  /**
   * Maximum number of avatars to display before showing overflow indicator
   */
  max?: number
  /**
   * Layout orientation
   * @default 'horizontal'
   */
  orientation?: AvatarGroupVariants['orientation']
  /**
   * Spacing between avatars
   * @default 'md'
   */
  spacing?: AvatarGroupVariants['spacing']
  /**
   * Reverse the stacking order (last avatar on top)
   * @default false
   */
  reverse?: AvatarGroupVariants['reverse']
  /**
   * Custom CSS classes
   */
  class?: HTMLAttributes['class']
}

defineSlots<{
  default(): unknown
  overflow(props: { count: number }): unknown
}>()

const props = defineProps<AvatarGroupProps>()

const slots = useSlots() as Slots & { default?: () => VNode[] }

const childNodes = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []

  // Flatten the slot content to get all Avatar children
  const flattenNodes = (nodes: VNode[]): VNode[] => {
    return nodes.reduce<VNode[]>((acc, node) => {
      // If it's a fragment, flatten its children
      if (node.type === Symbol.for('v-fgt')) {
        const children = node.children as VNode[] | undefined
        if (Array.isArray(children)) {
          return acc.concat(flattenNodes(children))
        }
      }
      acc.push(node)
      return acc
    }, [])
  }

  return flattenNodes(defaultSlot)
})

const visibleChildren = computed(() => {
  if (!props.max || props.max >= childNodes.value.length) {
    return childNodes.value
  }
  return childNodes.value.slice(0, props.max)
})

const overflowCount = computed(() => {
  if (!props.max || props.max >= childNodes.value.length) {
    return 0
  }
  return childNodes.value.length - props.max
})
</script>

<template>
  <div
    :class="cn(
      avatarGroupVariants({ orientation, spacing, reverse }),
      props.class
    )"
    :data-orientation="orientation"
  >
    <component
      :is="child"
      v-for="(child, index) in visibleChildren"
      :key="index"
    />
    <slot name="overflow" :count="overflowCount">
      <Avatar v-if="overflowCount > 0">
        <AvatarFallback class="bg-muted text-muted-foreground text-xs font-medium">
          +{{ overflowCount }}
        </AvatarFallback>
      </Avatar>
    </slot>
  </div>
</template>
