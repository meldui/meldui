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
