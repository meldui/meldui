/**
 * MeldViewer — annotation system stories.
 *
 * Covers: load-on-open, AI/RAG citation injection via the programmatic API,
 * import/export round-trip, save-as-copy with annotations baked in.
 */
import { HIGHLIGHT_COLORS, MeldViewer, type MeldViewerInstance } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { SAMPLE_PDF_URL, SEEDED_ANNOTATIONS, SEEDED_THREADS, WASM_URL, DEMO_USER } from './_shared'

const meta: Meta<typeof MeldViewer> = {
  title: 'Components/MeldViewer/Annotations',
  component: MeldViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The annotation system uses **native EmbedPDF annotations** under the hood,
with a **threaded comments overlay** layered on top (keyed by EmbedPDF's
stable annotation UUID).

Annotations are persisted via the programmatic API (\`MeldViewerInstance\`)
exposed through Vue's \`defineExpose\` — capture a template ref and call
methods directly.
        `,
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const ENABLE_ANNOTATIONS_FEATURES = {
  annotations: true,
  commentThreads: true,
  zoom: true,
  search: true,
  outline: true,
  thumbnails: true,
  selection: true,
  print: true,
  download: true,
  fullscreen: true,
  keyboardShortcuts: true,
}

/** Load pre-seeded annotations + threads at mount time. */
export const LoadOnOpen: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      return {
        source: SAMPLE_PDF_URL,
        wasmUrl: WASM_URL,
        annotations: SEEDED_ANNOTATIONS,
        threads: SEEDED_THREADS,
        user: DEMO_USER,
        features: ENABLE_ANNOTATIONS_FEATURES,
      }
    },
    template: `
      <div style="height: 100vh;">
        <MeldViewer
          :source="source"
          :wasm-url="wasmUrl"
          :features="features"
          :current-user="user"
          :initial-annotations="annotations"
          :initial-threads="threads"
        />
      </div>
    `,
  }),
}

/**
 * Programmatic annotation — simulates an AI/RAG citation flow that creates
 * a highlight from external code (no user interaction).
 */
export const ProgrammaticAnnotation: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const viewer = ref<MeldViewerInstance | null>(null)

      async function injectCitation() {
        const v = viewer.value
        if (!v) return
        await v.createAnnotation({
          type: 'highlight',
          pageIndex: 0,
          rect: { origin: { x: 80, y: 500 }, size: { width: 320, height: 16 } },
          segmentRects: [{ origin: { x: 80, y: 500 }, size: { width: 320, height: 16 } }],
          // Use the palette's Green preset (index 1) so the AI-injected highlight
          // matches the toolbar swatches and a user manually re-colouring it
          // sees the matching swatch highlighted.
          color: HIGHLIGHT_COLORS[1].value,
          opacity: 1,
          selectedText: 'AI-generated citation',
          author: 'AI Assistant',
          metadata: { isEphemeral: true, sourceClaim: 'demo' },
        })
      }

      async function exportAll() {
        const v = viewer.value
        if (!v) return
        const exported = await v.exportAnnotations()
        console.log('[storybook] exported annotations:', exported)
        alert(`Exported ${exported.length} annotations — see console.`)
      }

      async function saveAsCopy() {
        const v = viewer.value
        if (!v) return
        const buf = await v.saveAsCopy()
        const blob = new Blob([buf], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
      }

      return {
        viewer,
        source: SAMPLE_PDF_URL,
        wasmUrl: WASM_URL,
        user: DEMO_USER,
        features: ENABLE_ANNOTATIONS_FEATURES,
        injectCitation,
        exportAll,
        saveAsCopy,
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; height: 100vh;">
        <div style="display: flex; gap: 0.5rem; padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">
          <button
            type="button"
            style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #16a34a; color: white;"
            @click="injectCitation"
          >Inject AI Citation</button>
          <button
            type="button"
            style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #2563eb; color: white;"
            @click="exportAll"
          >Export Annotations</button>
          <button
            type="button"
            style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #7c3aed; color: white;"
            @click="saveAsCopy"
          >Save As Copy</button>
        </div>
        <div style="flex: 1; min-height: 0;">
          <MeldViewer
            ref="viewer"
            :source="source"
            :wasm-url="wasmUrl"
            :features="features"
            :current-user="user"
          />
        </div>
      </div>
    `,
  }),
}

/**
 * Import / export round-trip — capture annotations from the viewer and
 * re-hydrate them on a fresh mount.
 */
export const ImportExportRoundTrip: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const viewer = ref<MeldViewerInstance | null>(null)
      const exported = ref<string>('')
      const remountKey = ref(0)
      const annotations = ref(SEEDED_ANNOTATIONS)

      async function dumpJson() {
        const v = viewer.value
        if (!v) return
        const items = await v.exportAnnotations()
        exported.value = JSON.stringify(
          items.map((i) => i.annotation),
          null,
          2,
        )
      }

      function importFromJson() {
        try {
          annotations.value = JSON.parse(exported.value)
          remountKey.value++
        } catch (e) {
          alert(`Invalid JSON: ${(e as Error).message}`)
        }
      }

      return {
        viewer,
        annotations,
        exported,
        remountKey,
        source: SAMPLE_PDF_URL,
        wasmUrl: WASM_URL,
        user: DEMO_USER,
        features: ENABLE_ANNOTATIONS_FEATURES,
        dumpJson,
        importFromJson,
      }
    },
    template: `
      <div style="display: flex; height: 100vh;">
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column;">
          <div style="display: flex; gap: 0.5rem; padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">
            <button type="button" @click="dumpJson"
              style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #2563eb; color: white;">
              Export → JSON
            </button>
            <button type="button" @click="importFromJson"
              style="padding: 0.25rem 0.75rem; border-radius: 0.375rem; background: #16a34a; color: white;">
              Re-import from JSON
            </button>
          </div>
          <div style="flex: 1; min-height: 0;">
            <MeldViewer
              :key="remountKey"
              ref="viewer"
              :source="source"
              :wasm-url="wasmUrl"
              :features="features"
              :current-user="user"
              :initial-annotations="annotations"
            />
          </div>
        </div>
        <textarea
          v-model="exported"
          style="width: 32rem; font-family: monospace; font-size: 11px; padding: 0.5rem; border: 0; border-left: 1px solid #e5e7eb;"
          placeholder="Click Export to dump annotations as JSON; edit & re-import to test round-trip."
        ></textarea>
      </div>
    `,
  }),
}
