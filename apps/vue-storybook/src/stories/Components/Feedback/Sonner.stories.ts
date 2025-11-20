import { Button } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { toast } from 'vue-sonner'

const meta: Meta = {
  title: 'Components/Feedback/Sonner',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast('Event has been created')
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Toast</Button>
      </div>
    `,
  }),
}

export const WithDescription: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast('Event has been created', {
          description: 'Monday, January 3rd at 6:00pm',
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Toast</Button>
      </div>
    `,
  }),
}

export const Success: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast.success('Successfully saved', {
          description: 'Your changes have been saved',
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Success</Button>
      </div>
    `,
  }),
}

export const ErrorToast: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast.error('Something went wrong', {
          description: 'Please try again later',
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Error</Button>
      </div>
    `,
  }),
}

export const Warning: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast.warning('Warning', {
          description: 'This action cannot be undone',
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Warning</Button>
      </div>
    `,
  }),
}

export const Info: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast.info('Information', {
          description: 'Here is some useful information',
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Info</Button>
      </div>
    `,
  }),
}

export const Loading: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast.loading('Loading...', {
          description: 'Please wait while we process your request',
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Loading</Button>
      </div>
    `,
  }),
}

export const WithAction: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast('Event has been created', {
          description: 'Monday, January 3rd at 6:00pm',
          action: {
            label: 'Undo',
            onClick: () => {
              toast.success('Undo successful')
            },
          },
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Toast with Action</Button>
      </div>
    `,
  }),
}

export const PromiseToast: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        const promise = new Promise((resolve) => setTimeout(resolve, 2000))

        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Success!',
          error: 'Error',
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Show Promise Toast</Button>
      </div>
    `,
  }),
}

export const AllTypes: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showDefault = () => toast('Default notification')
      const showSuccess = () => toast.success('Success notification')
      const showError = () => toast.error('Error notification')
      const showWarning = () => toast.warning('Warning notification')
      const showInfo = () => toast.info('Info notification')
      const showLoading = () => toast.loading('Loading notification')

      return { showDefault, showSuccess, showError, showWarning, showInfo, showLoading }
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button @click="showDefault" variant="outline">Default</Button>
        <Button @click="showSuccess" variant="outline">Success</Button>
        <Button @click="showError" variant="outline">Error</Button>
        <Button @click="showWarning" variant="outline">Warning</Button>
        <Button @click="showInfo" variant="outline">Info</Button>
        <Button @click="showLoading" variant="outline">Loading</Button>
      </div>
    `,
  }),
}

export const Position: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showTopLeft = () => toast('Top left', { position: 'top-left' })
      const showTopCenter = () => toast('Top center', { position: 'top-center' })
      const showTopRight = () => toast('Top right', { position: 'top-right' })
      const showBottomLeft = () => toast('Bottom left', { position: 'bottom-left' })
      const showBottomCenter = () => toast('Bottom center', { position: 'bottom-center' })
      const showBottomRight = () => toast('Bottom right', { position: 'bottom-right' })

      return {
        showTopLeft,
        showTopCenter,
        showTopRight,
        showBottomLeft,
        showBottomCenter,
        showBottomRight,
      }
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex gap-2">
          <Button @click="showTopLeft" variant="outline" size="sm">Top Left</Button>
          <Button @click="showTopCenter" variant="outline" size="sm">Top Center</Button>
          <Button @click="showTopRight" variant="outline" size="sm">Top Right</Button>
        </div>
        <div class="flex gap-2">
          <Button @click="showBottomLeft" variant="outline" size="sm">Bottom Left</Button>
          <Button @click="showBottomCenter" variant="outline" size="sm">Bottom Center</Button>
          <Button @click="showBottomRight" variant="outline" size="sm">Bottom Right</Button>
        </div>
      </div>
    `,
  }),
}

export const Duration: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const show1Second = () => toast('1 second', { duration: 1000 })
      const show3Seconds = () => toast('3 seconds', { duration: 3000 })
      const show5Seconds = () => toast('5 seconds', { duration: 5000 })
      const showIndefinite = () =>
        toast('Indefinite (click to close)', { duration: Number.POSITIVE_INFINITY })

      return { show1Second, show3Seconds, show5Seconds, showIndefinite }
    },
    template: `
      <div class="flex flex-wrap gap-2">
        <Button @click="show1Second" variant="outline">1s</Button>
        <Button @click="show3Seconds" variant="outline">3s</Button>
        <Button @click="show5Seconds" variant="outline">5s</Button>
        <Button @click="showIndefinite" variant="outline">Indefinite</Button>
      </div>
    `,
  }),
}

export const RichContent: Story = {
  render: () => ({
    components: { Button },
    setup() {
      const showToast = () => {
        toast('File uploaded successfully', {
          description: 'document.pdf (2.4 MB)',
          action: {
            label: 'View',
            onClick: () => {
              toast.info('Opening file...')
            },
          },
        })
      }
      return { showToast }
    },
    template: `
      <div>
        <Button @click="showToast">Upload Complete</Button>
      </div>
    `,
  }),
}
