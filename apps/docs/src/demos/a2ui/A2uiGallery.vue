<script setup lang="ts">
import { defineComponent, h, onMounted } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { A2UISurface, provideA2UI } from '@meldui/a2ui/vue'
import '@incremark/theme/styles.css'

/**
 * The A2UI gallery: renders each full-interface example from
 * `packages/a2ui/examples/*.json` (the single source of truth) live, alongside
 * the exact A2UI v0.9 messages an agent would emit. Each example mounts its own
 * surface + processor so they stay independent on one page.
 */

// Eagerly import every example file (the raw message arrays), keyed by path.
const modules = import.meta.glob('../../../../../packages/a2ui/examples/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown[]>

/** Display metadata keyed by file stem (e.g. `01-hello-card`). */
const META: Record<string, { title: string; description: string }> = {
  '01-hello-card': {
    title: 'Hello card',
    description: 'The smallest useful surface — a titled card with a paragraph and a primary action.',
  },
  '02-newsletter-signup': {
    title: 'Newsletter signup',
    description:
      'A form bound to a data model: a regex-validated email field, choice chips, a consent checkbox, and a submit action.',
  },
  '03-order-tracking': {
    title: 'Order tracking',
    description:
      'A status view combining a Badge, Alert, Timeline, and a data-bound Table, with currency formatting.',
  },
  '04-analytics-dashboard': {
    title: 'Analytics dashboard',
    description:
      'Weighted stat tiles that share the row equally, Tabs switching between Charts, and a breakdown Table.',
  },
  '05-account-settings-app': {
    title: 'Account settings',
    description:
      'An app-like shell: a Sidebar with Tabs, and forms streamed across several messages (Combobox, MultiSelect, ToggleGroup, Accordion).',
  },
  '06-media-player': {
    title: 'Media player',
    description:
      'Icon usage in three contexts — icon-only buttons, icon + text rows, and a standalone icon beside a slider.',
  },
  '07-coffee-receipt': {
    title: 'Coffee receipt',
    description:
      'Per-row justify (spaceBetween) for label/price alignment, with line items generated from a list template.',
  },
}

function stemFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.json$/, '')
}

function humanize(stem: string): string {
  return stem
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

interface GalleryItem {
  id: string
  title: string
  description: string
  messages: unknown[]
  code: string
}

const examples: GalleryItem[] = Object.keys(modules)
  .sort()
  .map((path) => {
    const stem = stemFromPath(path)
    const meta = META[stem]
    const messages = modules[path] ?? []
    return {
      id: stem.replace(/^\d+-/, ''),
      title: meta?.title ?? humanize(stem),
      description: meta?.description ?? '',
      messages,
      code: JSON.stringify(messages, null, 2),
    }
  })

/** Renders one fresh surface for the given messages (its own processor). */
const SurfaceOnce = defineComponent({
  name: 'A2uiGallerySurface',
  props: { messages: { type: Array, required: true } },
  setup(props) {
    const { processor } = provideA2UI({
      // eslint-disable-next-line no-console
      onAction: (action) => console.log('[a2ui gallery] action', action),
    })
    onMounted(() => processor.processMessages(props.messages as never))
    return () => h(A2UISurface, { surfaceId: 's1' })
  },
})
</script>

<template>
  <div class="not-prose flex flex-col gap-10">
    <section v-for="ex in examples" :id="ex.id" :key="ex.id" class="scroll-mt-24">
      <h3 class="mb-1 text-lg font-semibold tracking-tight">{{ ex.title }}</h3>
      <p v-if="ex.description" class="mb-3 text-sm text-muted-foreground">{{ ex.description }}</p>
      <DemoBlock :code="ex.code" lang="json">
        <div class="w-full max-w-xl">
          <SurfaceOnce :messages="ex.messages" />
        </div>
      </DemoBlock>
    </section>
  </div>
</template>
