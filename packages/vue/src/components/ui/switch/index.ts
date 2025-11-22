import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Switch } from './Switch.vue'

export const switchVariants = {
  root: cva(
    'peer data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    {
      variants: {
        variant: {
          default: 'data-[state=checked]:bg-primary',
          destructive: 'data-[state=checked]:bg-destructive',
          success: 'data-[state=checked]:bg-success',
          warning: 'data-[state=checked]:bg-warning',
          info: 'data-[state=checked]:bg-info',
          neutral: 'data-[state=checked]:bg-neutral',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  ),
  thumb: cva(
    'bg-background pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
    {
      variants: {
        variant: {
          default:
            'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground',
          destructive:
            'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-white',
          success: 'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-white',
          warning: 'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-white',
          info: 'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-white',
          neutral: 'dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-white',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  ),
}

export type SwitchVariants = VariantProps<typeof switchVariants.root>
