<script setup lang="ts">
import type { HTMLAttributes, Slots, VNode } from 'vue'
import { cloneVNode, computed, useSlots } from 'vue'
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
   * Uniform size applied to every avatar AND the "+N" overflow badge, so the
   * whole group scales together. Overrides individual avatar sizes. When unset,
   * avatars keep their own size and the badge uses the base Avatar size.
   */
  size?: 'sm' | 'md' | 'lg'
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

// When `size` is set, scale the whole group uniformly: clone each visible avatar
// with the size class and apply the same class to the overflow badge below.
const sizeClassMap = { sm: 'size-8', md: 'size-10', lg: 'size-12' } as const
const avatarSizeClass = computed(() => (props.size ? sizeClassMap[props.size] : undefined))

const sizedChildren = computed(() =>
  avatarSizeClass.value
    ? visibleChildren.value.map((child) => cloneVNode(child, { class: avatarSizeClass.value }))
    : visibleChildren.value,
)
</script>

<template>
  <div
    :class="cn(avatarGroupVariants({ orientation, spacing, reverse }), props.class)"
    :data-orientation="orientation"
  >
    <component :is="child" v-for="(child, index) in sizedChildren" :key="index" />
    <slot name="overflow" :count="overflowCount">
      <Avatar v-if="overflowCount > 0" :class="avatarSizeClass">
        <AvatarFallback class="bg-muted text-muted-foreground text-xs font-medium">
          +{{ overflowCount }}
        </AvatarFallback>
      </Avatar>
    </slot>
  </div>
</template>
