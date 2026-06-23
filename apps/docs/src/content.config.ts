import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const propSchema = z.object({
  name: z.string(),
  type: z.string(),
  default: z.string().optional(),
  description: z.string(),
  required: z.boolean().default(false),
})

const eventSchema = z.object({
  name: z.string(),
  payload: z.string(),
  description: z.string(),
})

const slotSchema = z.object({
  name: z.string(),
  props: z.string().optional(),
  description: z.string(),
})

const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['getting-started', 'components', 'composites', 'charts', 'examples', 'a2ui']),
    subcategory: z.string().optional(),
    package: z
      .enum([
        '@meldui/vue',
        '@meldui/charts-vue',
        '@meldui/editor',
        '@meldui/tabler-vue',
        '@meldui/a2ui',
      ])
      .optional(),
    componentName: z.string().optional(),
    // Hide the docs sidebar and render full-width (used by the catalog overview pages).
    hideSidebar: z.boolean().default(false),
    props: z.array(propSchema).optional(),
    events: z.array(eventSchema).optional(),
    slots: z.array(slotSchema).optional(),
    subComponents: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          props: z.array(propSchema).optional(),
          slots: z.array(slotSchema).optional(),
        }),
      )
      .optional(),
    order: z.number().default(999),
    sourceUrl: z.string().optional(),
    storybookUrl: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }),
})

export const collections = { docs }
