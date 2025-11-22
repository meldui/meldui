import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as CircularProgress } from './CircularProgress.vue'
export { default as CircularProgressIndicator } from './CircularProgressIndicator.vue'
export { default as CircularProgressLabel } from './CircularProgressLabel.vue'
export { default as CircularProgressRange } from './CircularProgressRange.vue'
export { default as CircularProgressTrack } from './CircularProgressTrack.vue'

export const circularProgressVariants = cva('relative inline-flex', {
  variants: {
    variant: {
      default: 'text-primary',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
      neutral: 'text-neutral',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type CircularProgressVariants = VariantProps<typeof circularProgressVariants>
