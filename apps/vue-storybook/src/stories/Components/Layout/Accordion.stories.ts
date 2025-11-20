import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Accordion> = {
  title: 'Components/Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => ({
    components: { Accordion, AccordionContent, AccordionItem, AccordionTrigger },
    template: `
      <Accordion type="single" collapsible style="max-width: 600px;">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other components aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const Multiple: Story = {
  render: () => ({
    components: { Accordion, AccordionContent, AccordionItem, AccordionTrigger },
    template: `
      <Accordion type="multiple" style="max-width: 600px;">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is MeldUI?</AccordionTrigger>
          <AccordionContent>
            MeldUI is an internal design system built on shadcn components, offering a consistent and customizable UI library.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I install it?</AccordionTrigger>
          <AccordionContent>
            You can install MeldUI using pnpm: <code>pnpm add @meldui/vue</code>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Does it support theming?</AccordionTrigger>
          <AccordionContent>
            Yes. MeldUI supports full theming through Tailwind CSS v4 configuration.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is it production ready?</AccordionTrigger>
          <AccordionContent>
            Yes. MeldUI components are built on battle-tested libraries and are ready for production use.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const WithDefaultValue: Story = {
  render: () => ({
    components: { Accordion, AccordionContent, AccordionItem, AccordionTrigger },
    template: `
      <Accordion type="single" collapsible default-value="item-2" style="max-width: 600px;">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>
            This is the content for item 1.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2 (Initially Open)</AccordionTrigger>
          <AccordionContent>
            This accordion item is open by default because its value matches the defaultValue prop.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Item 3</AccordionTrigger>
          <AccordionContent>
            This is the content for item 3.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Accordion, AccordionContent, AccordionItem, AccordionTrigger },
    template: `
      <Accordion type="single" collapsible style="max-width: 600px;">
        <AccordionItem value="item-1">
          <AccordionTrigger>Enabled Item</AccordionTrigger>
          <AccordionContent>
            This item is enabled and can be expanded.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Disabled Item</AccordionTrigger>
          <AccordionContent>
            This content won't be visible because the item is disabled.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Another Enabled Item</AccordionTrigger>
          <AccordionContent>
            This item is also enabled and can be expanded.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    `,
  }),
}
