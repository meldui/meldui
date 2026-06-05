/**
 * Per-component A2UI renderer stories. Each story renders the component from its
 * canonical A2UI message sequence (live) and shows those messages as a code
 * block — demonstrating exactly what an agent emits and how MeldUI renders it.
 */
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { exampleStory } from './_a2ui'

const meta: Meta = {
  title: 'A2UI/Components',
}
export default meta
type Story = StoryObj

export const Alert: Story = exampleStory('Alert')
export const Badge: Story = exampleStory('Badge')
export const Avatar: Story = exampleStory('Avatar')
export const AvatarGroup: Story = exampleStory('AvatarGroup')
export const Kbd: Story = exampleStory('Kbd')
export const Separator: Story = exampleStory('Separator')
export const Divider: Story = exampleStory('Divider')
export const Image: Story = exampleStory('Image')
export const Row: Story = exampleStory('Row')
export const List: Story = exampleStory('List')
export const ScrollArea: Story = exampleStory('ScrollArea')
export const ButtonGroup: Story = exampleStory('ButtonGroup')
export const Table: Story = exampleStory('Table')
