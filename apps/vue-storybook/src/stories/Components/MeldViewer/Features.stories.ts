/**
 * MeldViewer — feature opt-in stories.
 *
 * Each story toggles a different subset of `features` flags to show how
 * the toolbar and side panels adapt. Useful as a visual-parity reference
 * against doqo's existing `DocumentViewer`.
 */
import { MeldViewer, type MeldViewerFeatures } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SAMPLE_PDF_URL, WASM_URL } from './_shared'

const meta: Meta<typeof MeldViewer> = {
  title: 'Components/MeldViewer/Features',
  component: MeldViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The \`features\` prop is a single object controlling which EmbedPDF plugins
get registered and which toolbar groups render. Disabled features are
tree-shaken from the consumer's production bundle.

Each story below shows a different feature profile.
        `,
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const all: Required<MeldViewerFeatures> = {
  zoom: true,
  rotate: true,
  spread: true,
  pan: true,
  fullscreen: true,
  search: true,
  selection: true,
  outline: true,
  thumbnails: true,
  print: true,
  download: true,
  annotations: true,
  commentThreads: true,
  undoRedo: true,
  stamps: false,
  signature: false,
  redaction: false,
  forms: false,
  attachments: false,
  keyboardShortcuts: true,
  touchGestures: true,
}

/** Every Phase 1 feature on. */
export const AllOn: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, features: all }
    },
    template: `
      <div style="height: 100vh;">
        <MeldViewer :source="source" :wasm-url="wasmUrl" :features="features" />
      </div>
    `,
  }),
}

/** Read-only viewer (typical share-link profile). */
export const ReadOnlyShareLink: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const features: MeldViewerFeatures = {
        zoom: true,
        search: true,
        outline: true,
        thumbnails: true,
        download: false,
        print: false,
        fullscreen: true,
        annotations: false,
        commentThreads: false,
        keyboardShortcuts: true,
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, features }
    },
    template: `
      <div style="height: 100vh;">
        <MeldViewer :source="source" :wasm-url="wasmUrl" :features="features" />
      </div>
    `,
  }),
}

/** Minimal — just rendering, no toolbar features. */
export const Minimal: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const features: MeldViewerFeatures = {
        zoom: false,
        rotate: false,
        search: false,
        outline: false,
        thumbnails: false,
        print: false,
        download: false,
        fullscreen: false,
        annotations: false,
        commentThreads: false,
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, features }
    },
    template: `
      <div style="height: 100vh;">
        <MeldViewer :source="source" :wasm-url="wasmUrl" :features="features" />
      </div>
    `,
  }),
}

/**
 * **Visual-parity reference**: profile that matches doqo's existing
 * `DocumentViewer` default props. Use this story side-by-side with doqo
 * to verify toolbar layout, button order, dark-mode behaviour.
 */
export const DoqoLookAndFeelReference: Story = {
  render: () => ({
    components: { MeldViewer },
    setup() {
      const features: MeldViewerFeatures = {
        // Same set as doqo's pages currently enable
        zoom: true,
        rotate: true,
        search: true,
        outline: true,
        thumbnails: true,
        print: true,
        download: true,
        fullscreen: true,
        // Doqo's share-link page disables these; turn on here to show full surface
        annotations: true,
        commentThreads: true,
        // Doqo-specific
        keyboardShortcuts: true,
        touchGestures: true,
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, features }
    },
    template: `
      <div style="height: 100vh;">
        <MeldViewer :source="source" :wasm-url="wasmUrl" :features="features" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: `
This profile mirrors doqo's existing \`DocumentViewer\` so you can run a
side-by-side comparison.

**Visual-parity checklist**:

- Toolbar is sticky to top with \`z-30\`
- Button order: page-nav → zoom → rotate → view-mode → interaction → search → panels → annotate → actions
- Responsive \`lg\` breakpoint at 1024px
- On mobile, rotation/view-mode/interaction/panels/actions collapse into a 3-dot dropdown
- Highlight presets: yellow / green / blue / pink / purple at 0.4 alpha
- Side panels: thumbnails on left, outline on right, comments on right (when on)
- Dark mode: adapts via \`dark:\` Tailwind utilities
        `,
      },
    },
  },
}
