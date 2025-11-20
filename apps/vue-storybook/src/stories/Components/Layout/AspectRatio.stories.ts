import { AspectRatio } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
      description: 'The desired aspect ratio (width/height)',
    },
  },
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
  render: (args) => ({
    components: { AspectRatio },
    setup() {
      return { args }
    },
    template: `
      <div style="max-width: 400px;">
        <AspectRatio v-bind="args">
          <img
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Photo by Drew Beamer"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;"
          />
        </AspectRatio>
      </div>
    `,
  }),
  args: {
    ratio: 16 / 9,
  },
}

export const Square: Story = {
  render: () => ({
    components: { AspectRatio },
    template: `
      <div style="max-width: 400px;">
        <AspectRatio :ratio="1">
          <img
            src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80"
            alt="Square image"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;"
          />
        </AspectRatio>
      </div>
    `,
  }),
}

export const Portrait: Story = {
  render: () => ({
    components: { AspectRatio },
    template: `
      <div style="max-width: 400px;">
        <AspectRatio :ratio="3 / 4">
          <img
            src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&dpr=2&q=80"
            alt="Portrait image"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;"
          />
        </AspectRatio>
      </div>
    `,
  }),
}

export const Ultrawide: Story = {
  render: () => ({
    components: { AspectRatio },
    template: `
      <div style="max-width: 600px;">
        <AspectRatio :ratio="21 / 9">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&dpr=2&q=80"
            alt="Ultrawide image"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;"
          />
        </AspectRatio>
      </div>
    `,
  }),
}

export const WithContent: Story = {
  render: () => ({
    components: { AspectRatio },
    template: `
      <div style="max-width: 400px;">
        <AspectRatio :ratio="16 / 9">
          <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
            16:9 Aspect Ratio
          </div>
        </AspectRatio>
      </div>
    `,
  }),
}

export const MultipleRatios: Story = {
  render: () => ({
    components: { AspectRatio },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; max-width: 800px;">
        <div>
          <AspectRatio :ratio="1">
            <div style="width: 100%; height: 100%; background: #3b82f6; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
              1:1
            </div>
          </AspectRatio>
        </div>
        <div>
          <AspectRatio :ratio="4 / 3">
            <div style="width: 100%; height: 100%; background: #8b5cf6; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
              4:3
            </div>
          </AspectRatio>
        </div>
        <div>
          <AspectRatio :ratio="16 / 9">
            <div style="width: 100%; height: 100%; background: #ec4899; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
              16:9
            </div>
          </AspectRatio>
        </div>
      </div>
    `,
  }),
}

export const VideoEmbed: Story = {
  render: () => ({
    components: { AspectRatio },
    template: `
      <div style="max-width: 600px;">
        <AspectRatio :ratio="16 / 9">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="width: 100%; height: 100%; border-radius: 0.5rem;"
          ></iframe>
        </AspectRatio>
      </div>
    `,
  }),
}
