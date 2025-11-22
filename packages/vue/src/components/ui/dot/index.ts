import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Dot } from './Dot.vue'

export const dotVariants = cva('rounded-full', {
  variants: {
    variant: {
      primary: 'bg-foreground',
      success: 'bg-success',
      warning: 'bg-warning',
      destructive: 'bg-destructive',
      info: 'bg-info',
      neutral: 'bg-neutral',
    },
    size: {
      xs: 'size-1.5',
      sm: 'size-2',
      md: 'size-2.5',
      lg: 'size-3',
      xl: 'size-4',
    },
    effect: {
      pulse: 'animate-pulse',
      ping: 'relative',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export type DotVariants = VariantProps<typeof dotVariants>
