import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Progress } from './Progress.vue'

export const progressVariants = cva('relative h-2 w-full overflow-hidden rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary/20 [&>div]:bg-primary',
      destructive: 'bg-destructive/20 [&>div]:bg-destructive',
      success: 'bg-success/20 [&>div]:bg-success',
      warning: 'bg-warning/20 [&>div]:bg-warning',
      info: 'bg-info/20 [&>div]:bg-info',
      neutral: 'bg-neutral/20 [&>div]:bg-neutral',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type ProgressVariants = VariantProps<typeof progressVariants>
