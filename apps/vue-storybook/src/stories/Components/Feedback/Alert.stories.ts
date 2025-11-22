import { IconAlertCircle, IconAlertTriangle, IconCheck, IconInfoCircle } from '@meldui/tabler-vue'
import { Alert, AlertDescription, AlertTitle } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info', 'neutral'],
      description: 'Visual style variant of the alert',
    },
  },
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription },
    template: `
      <Alert style="max-width: 600px;">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription, IconInfoCircle },
    template: `
      <Alert style="max-width: 600px;">
        <IconInfoCircle />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an informational alert with an icon.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const Destructive: Story = {
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription, IconAlertCircle },
    template: `
      <Alert variant="destructive" style="max-width: 600px;">
        <IconAlertCircle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const Success: Story = {
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription, IconCheck },
    template: `
      <Alert variant="success" style="max-width: 600px;">
        <IconCheck />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const Warning: Story = {
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription, IconAlertTriangle },
    template: `
      <Alert variant="warning" style="max-width: 600px;">
        <IconAlertTriangle />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          This action cannot be undone. Please proceed with caution.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const Info: Story = {
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription, IconInfoCircle },
    template: `
      <Alert variant="info" style="max-width: 600px;">
        <IconInfoCircle />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          New features are available. Check out what's new in the release notes.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const Neutral: Story = {
  render: () => ({
    components: { Alert, AlertTitle, AlertDescription, IconInfoCircle },
    template: `
      <Alert variant="neutral" style="max-width: 600px;">
        <IconInfoCircle />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This is a neutral alert for general information.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const TitleOnly: Story = {
  render: () => ({
    components: { Alert, AlertTitle, IconInfoCircle },
    template: `
      <Alert style="max-width: 600px;">
        <IconInfoCircle />
        <AlertTitle>This alert only has a title</AlertTitle>
      </Alert>
    `,
  }),
}

export const DescriptionOnly: Story = {
  render: () => ({
    components: { Alert, AlertDescription, IconInfoCircle },
    template: `
      <Alert style="max-width: 600px;">
        <IconInfoCircle />
        <AlertDescription>
          This alert only has a description without a title.
        </AlertDescription>
      </Alert>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: {
      Alert,
      AlertTitle,
      AlertDescription,
      IconInfoCircle,
      IconAlertCircle,
      IconCheck,
      IconAlertTriangle,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 600px;">
        <Alert>
          <IconInfoCircle />
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>
            This is the default alert variant.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <IconAlertCircle />
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>
            This is the destructive alert variant for errors.
          </AlertDescription>
        </Alert>

        <Alert variant="success">
          <IconCheck />
          <AlertTitle>Success Alert</AlertTitle>
          <AlertDescription>
            This is the success alert variant for positive feedback.
          </AlertDescription>
        </Alert>

        <Alert variant="warning">
          <IconAlertTriangle />
          <AlertTitle>Warning Alert</AlertTitle>
          <AlertDescription>
            This is the warning alert variant for cautions.
          </AlertDescription>
        </Alert>

        <Alert variant="info">
          <IconInfoCircle />
          <AlertTitle>Info Alert</AlertTitle>
          <AlertDescription>
            This is the info alert variant for informational messages.
          </AlertDescription>
        </Alert>

        <Alert variant="neutral">
          <IconInfoCircle />
          <AlertTitle>Neutral Alert</AlertTitle>
          <AlertDescription>
            This is the neutral alert variant for general messages.
          </AlertDescription>
        </Alert>
      </div>
    `,
  }),
}
