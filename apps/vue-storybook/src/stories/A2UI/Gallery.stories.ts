/**
 * A2UI per-tier galleries. Renders every catalog component's canonical example
 * live, grouped by reliability tier (Basic primitives → Structural & display →
 * Rich). The tier grouping comes from `COMPONENT_TIERS` in `@meldui/a2ui`, so it
 * stays in sync with the catalog; each cell is an isolated surface fed the
 * component's `examples` entry (the same single source the per-component stories
 * and docs use).
 */
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { COMPONENT_TIERS } from '@meldui/a2ui'
import { galleryStory } from './_a2ui'
import '@incremark/theme/styles.css'

const meta: Meta = {
  title: 'A2UI/Gallery',
}
export default meta
type Story = StoryObj

const tier = (i: number) => COMPONENT_TIERS[i]?.components ?? []

export const BasicPrimitives: Story = galleryStory(tier(0))
export const StructuralAndDisplay: Story = galleryStory(tier(1))
export const Rich: Story = galleryStory(tier(2))
