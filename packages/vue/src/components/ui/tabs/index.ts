import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { InjectionKey, Ref } from 'vue'

export { default as Tabs } from './Tabs.vue'
export { default as TabsContent } from './TabsContent.vue'
export { default as TabsList } from './TabsList.vue'
export { default as TabsTrigger } from './TabsTrigger.vue'

export const tabsListVariants = cva('inline-flex h-9 w-fit items-center justify-center', {
  variants: {
    variant: {
      line: 'text-muted-foreground gap-1 border-b border-border',
      pill: 'bg-muted text-muted-foreground rounded-lg p-[3px]',
    },
  },
  defaultVariants: {
    variant: 'line',
  },
})

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        line: 'border-b-2 border-transparent -mb-px data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground hover:text-foreground',
        pill: 'h-[calc(100%-1px)] flex-1 rounded-md border border-transparent data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'line',
    },
  },
)

export type TabsVariant = VariantProps<typeof tabsListVariants>['variant']

export const TABS_VARIANT_KEY = Symbol('tabs-variant') as InjectionKey<Ref<TabsVariant>>
