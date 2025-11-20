import { IconCheck, IconLoader, IconX } from '@meldui/tabler-vue'
import { Button } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: () => ({
    components: { Button },
    template: '<Button>Click me</Button>',
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { Button, IconCheck, IconX },
    template: `
      <div style="display: flex; gap: 1rem;">
        <Button>
          <IconCheck :size="20" />
          Confirm
        </Button>
        <Button variant="destructive">
          <IconX :size="20" />
          Cancel
        </Button>
      </div>
    `,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { Button, IconX, IconCheck, IconLoader },
    template: `
      <div style="display: flex; gap: 1rem;">
        <Button size="icon">
          <IconCheck :size="20" />
        </Button>
        <Button size="icon" variant="outline">
          <IconX :size="20" />
        </Button>
        <Button size="icon" variant="ghost">
          <IconLoader :size="20" />
        </Button>
      </div>
    `,
  }),
}
