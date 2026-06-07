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

export const Text: Story = exampleStory('Text')
export const Markdown: Story = exampleStory('Markdown')
export const Column: Story = exampleStory('Column')
export const Card: Story = exampleStory('Card')
export const Button: Story = exampleStory('Button')
export const TextField: Story = exampleStory('TextField')
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
export const CheckBox: Story = exampleStory('CheckBox')
export const Slider: Story = exampleStory('Slider')
export const ChoicePicker: Story = exampleStory('ChoicePicker')
export const ToggleGroup: Story = exampleStory('ToggleGroup')
export const MultiSelect: Story = exampleStory('MultiSelect')
export const DateTimeInput: Story = exampleStory('DateTimeInput')
export const Tabs: Story = exampleStory('Tabs')
export const Accordion: Story = exampleStory('Accordion')
export const Modal: Story = exampleStory('Modal')
export const Carousel: Story = exampleStory('Carousel')
export const Stepper: Story = exampleStory('Stepper')
export const Timeline: Story = exampleStory('Timeline')
export const Sidebar: Story = exampleStory('Sidebar')
export const Combobox: Story = exampleStory('Combobox')
export const Chart: Story = exampleStory('Chart')
export const Icon: Story = exampleStory('Icon')
