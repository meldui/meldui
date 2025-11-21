import { IconChevronDown } from '@meldui/tabler-vue'
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Layout/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An interactive component which expands/collapses a panel. Useful for showing and hiding content in a space-efficient way.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Collapsible>

export const Default: Story = {
  render: () => ({
    components: { Collapsible, CollapsibleContent, CollapsibleTrigger, Button },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <Collapsible v-model:open="isOpen" class="w-full max-w-md">
        <div class="flex items-center justify-between rounded-md border px-4 py-3">
          <h4 class="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="sm" class="w-9 p-0">
              <span class="sr-only">Toggle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div class="rounded-md border border-t-0 px-4 py-3">
          <p class="text-sm">
            @reka-ui/vue
          </p>
        </div>
        <CollapsibleContent class="space-y-2">
          <div class="rounded-md border px-4 py-3">
            <p class="text-sm">
              @shadcn-vue/ui
            </p>
          </div>
          <div class="rounded-md border px-4 py-3">
            <p class="text-sm">
              @vue/core
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    `,
  }),
}

export const DefaultOpen: Story = {
  render: () => ({
    components: { Collapsible, CollapsibleContent, CollapsibleTrigger, Button },
    template: `
      <Collapsible default-open class="w-full max-w-md">
        <div class="flex items-center justify-between rounded-md border px-4 py-3">
          <h4 class="text-sm font-semibold">
            Can I use this in my project?
          </h4>
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="sm" class="w-9 p-0">
              <span class="sr-only">Toggle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent class="pt-2">
          <div class="rounded-md border px-4 py-3">
            <p class="text-sm text-muted-foreground">
              Yes! This component is open by default because of the default-open prop.
              You can use it in your projects built with Vue 3 and MeldUI.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: {
      Collapsible,
      CollapsibleContent,
      CollapsibleTrigger,
      Button,
      IconChevronDown,
    },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <Collapsible v-model:open="isOpen" class="w-full max-w-md">
        <div class="rounded-md border">
          <CollapsibleTrigger as-child>
            <Button
              variant="ghost"
              class="flex w-full items-center justify-between px-4 py-3 hover:bg-accent"
            >
              <span class="text-sm font-semibold">What is MeldUI?</span>
              <IconChevronDown
                :size="16"
                :class="['transition-transform duration-200', isOpen ? 'rotate-180' : '']"
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div class="border-t px-4 py-3">
              <p class="text-sm text-muted-foreground">
                MeldUI is an internal design system built on shadcn components. It provides
                a consistent and customizable UI library for Vue 3 applications with support
                for Tailwind CSS v4.
              </p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Collapsible, CollapsibleContent, CollapsibleTrigger, Button },
    template: `
      <Collapsible disabled class="w-full max-w-md">
        <div class="flex items-center justify-between rounded-md border px-4 py-3 opacity-50">
          <h4 class="text-sm font-semibold">
            This collapsible is disabled
          </h4>
          <CollapsibleTrigger as-child>
            <Button variant="ghost" size="sm" class="w-9 p-0" disabled>
              <span class="sr-only">Toggle</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent class="space-y-2">
          <div class="rounded-md border px-4 py-3">
            <p class="text-sm">
              This content cannot be toggled because the collapsible is disabled.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    `,
  }),
}

export const MultipleItems: Story = {
  render: () => ({
    components: {
      Collapsible,
      CollapsibleContent,
      CollapsibleTrigger,
      Button,
      IconChevronDown,
    },
    setup() {
      const openStates = ref({
        faq1: false,
        faq2: false,
        faq3: false,
      })
      return { openStates }
    },
    template: `
      <div class="w-full max-w-2xl space-y-4">
        <Collapsible v-model:open="openStates.faq1">
          <div class="rounded-md border">
            <CollapsibleTrigger as-child>
              <Button
                variant="ghost"
                class="flex w-full items-center justify-between px-4 py-3 hover:bg-accent"
              >
                <span class="text-sm font-semibold">How do I install MeldUI?</span>
                <IconChevronDown
                  :size="16"
                  :class="['transition-transform duration-200', openStates.faq1 ? 'rotate-180' : '']"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="border-t px-4 py-3">
                <p class="text-sm text-muted-foreground">
                  You can install MeldUI using pnpm: <code class="rounded bg-muted px-1 py-0.5">pnpm add @meldui/vue @meldui/tabler-vue</code>
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Collapsible v-model:open="openStates.faq2">
          <div class="rounded-md border">
            <CollapsibleTrigger as-child>
              <Button
                variant="ghost"
                class="flex w-full items-center justify-between px-4 py-3 hover:bg-accent"
              >
                <span class="text-sm font-semibold">Does it support dark mode?</span>
                <IconChevronDown
                  :size="16"
                  :class="['transition-transform duration-200', openStates.faq2 ? 'rotate-180' : '']"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="border-t px-4 py-3">
                <p class="text-sm text-muted-foreground">
                  Yes! MeldUI components support dark mode out of the box through Tailwind CSS v4 theming.
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Collapsible v-model:open="openStates.faq3">
          <div class="rounded-md border">
            <CollapsibleTrigger as-child>
              <Button
                variant="ghost"
                class="flex w-full items-center justify-between px-4 py-3 hover:bg-accent"
              >
                <span class="text-sm font-semibold">Is it accessible?</span>
                <IconChevronDown
                  :size="16"
                  :class="['transition-transform duration-200', openStates.faq3 ? 'rotate-180' : '']"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="border-t px-4 py-3">
                <p class="text-sm text-muted-foreground">
                  Yes. It adheres to the WAI-ARIA design pattern and includes proper keyboard navigation and screen reader support.
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    `,
  }),
}

export const ComplexContent: Story = {
  render: () => ({
    components: { Collapsible, CollapsibleContent, CollapsibleTrigger, Button },
    setup() {
      const isOpen = ref(false)
      return { isOpen }
    },
    template: `
      <Collapsible v-model:open="isOpen" class="w-full max-w-2xl">
        <div class="rounded-md border">
          <CollapsibleTrigger as-child>
            <Button
              variant="ghost"
              class="flex w-full items-center justify-between px-4 py-3 hover:bg-accent"
            >
              <div>
                <h4 class="text-sm font-semibold">System Requirements</h4>
                <p class="text-xs text-muted-foreground">Click to {{ isOpen ? 'hide' : 'show' }} details</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="['h-4 w-4 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div class="border-t px-4 py-4">
              <div class="space-y-4">
                <div>
                  <h5 class="mb-2 text-sm font-semibold">Minimum Requirements</h5>
                  <ul class="space-y-1 text-sm text-muted-foreground">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5">•</span>
                      <span>Vue 3.3 or higher</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5">•</span>
                      <span>Tailwind CSS v4</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5">•</span>
                      <span>Node.js 18.0 or higher</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 class="mb-2 text-sm font-semibold">Recommended</h5>
                  <ul class="space-y-1 text-sm text-muted-foreground">
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5">•</span>
                      <span>TypeScript 5.0 or higher</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="mt-0.5">•</span>
                      <span>Vite 5.0 or higher</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    `,
  }),
}
