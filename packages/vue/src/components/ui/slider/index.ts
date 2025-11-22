import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Slider } from './Slider.vue'

export const sliderVariants = {
  range: cva('absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full', {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        success: 'bg-success',
        warning: 'bg-warning',
        info: 'bg-info',
        neutral: 'bg-neutral',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }),
  thumb: cva(
    'bg-white block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
    {
      variants: {
        variant: {
          default: 'border-primary ring-ring/50',
          destructive: 'border-destructive ring-destructive/50',
          success: 'border-success ring-success/50',
          warning: 'border-warning ring-warning/50',
          info: 'border-info ring-info/50',
          neutral: 'border-neutral ring-neutral/50',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  ),
}

export type SliderVariants = VariantProps<typeof sliderVariants.range>
