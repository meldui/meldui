import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
    template: `
      <Card style="max-width: 400px;">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>
    `,
  }),
}

export const WithFooter: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardContent, CardFooter, Button },
    template: `
      <Card style="max-width: 400px;">
        <CardHeader>
          <CardTitle>Confirm Action</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Are you sure you want to proceed?</p>
        </CardContent>
        <CardFooter style="display: flex; gap: 0.5rem;">
          <Button variant="default">Confirm</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    `,
  }),
}
