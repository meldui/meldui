import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as AvatarGroup } from './AvatarGroup.vue'

export const avatarGroupVariants = cva('flex *:ring-2 *:ring-background', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'flex-col',
    },
    spacing: {
      sm: '',
      md: '',
      lg: '',
    },
    reverse: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Horizontal spacing (normal)
    { orientation: 'horizontal', spacing: 'sm', reverse: false, class: '-space-x-2' },
    { orientation: 'horizontal', spacing: 'md', reverse: false, class: '-space-x-3' },
    { orientation: 'horizontal', spacing: 'lg', reverse: false, class: '-space-x-4' },
    // Horizontal spacing (reversed)
    {
      orientation: 'horizontal',
      spacing: 'sm',
      reverse: true,
      class: 'flex-row-reverse -space-x-2 space-x-reverse',
    },
    {
      orientation: 'horizontal',
      spacing: 'md',
      reverse: true,
      class: 'flex-row-reverse -space-x-3 space-x-reverse',
    },
    {
      orientation: 'horizontal',
      spacing: 'lg',
      reverse: true,
      class: 'flex-row-reverse -space-x-4 space-x-reverse',
    },
    // Vertical spacing (normal)
    { orientation: 'vertical', spacing: 'sm', reverse: false, class: '-space-y-2' },
    { orientation: 'vertical', spacing: 'md', reverse: false, class: '-space-y-3' },
    { orientation: 'vertical', spacing: 'lg', reverse: false, class: '-space-y-4' },
    // Vertical spacing (reversed)
    {
      orientation: 'vertical',
      spacing: 'sm',
      reverse: true,
      class: 'flex-col-reverse -space-y-2 space-y-reverse',
    },
    {
      orientation: 'vertical',
      spacing: 'md',
      reverse: true,
      class: 'flex-col-reverse -space-y-3 space-y-reverse',
    },
    {
      orientation: 'vertical',
      spacing: 'lg',
      reverse: true,
      class: 'flex-col-reverse -space-y-4 space-y-reverse',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'md',
    reverse: false,
  },
})

export type AvatarGroupVariants = VariantProps<typeof avatarGroupVariants>
