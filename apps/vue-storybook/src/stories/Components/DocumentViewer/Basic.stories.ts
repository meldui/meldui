/**
 * DocumentViewer — basic rendering stories.
 *
 * Demonstrates the four built-in renderers (PDF, image, text, markdown)
 * and the responsive toolbar.
 */
import { DocumentViewer } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  SAMPLE_MARKDOWN,
  SAMPLE_MARKDOWN_FULL,
  SAMPLE_PDF_URL,
  SAMPLE_TEXT,
  WASM_URL,
} from './_shared'

const meta: Meta<typeof DocumentViewer> = {
  title: 'Components/DocumentViewer/Basic',
  component: DocumentViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`DocumentViewer\` is a reusable document viewer composite that renders PDFs,
images, plain-text, and markdown with a unified toolbar. The PDF renderer is
built on EmbedPDF (PDFium WASM) and is lazy-loaded so non-PDF consumers do
not pay the engine cost.

Pass the bundled \`pdfium.wasm\` URL via the \`wasm-url\` prop. In this
storybook the asset is copied into \`public/pdfium.wasm\` by the
\`prepare-assets\` script.

The toolbar adapts to enabled features and document type. Non-PDF documents
hide PDF-only buttons (outline, thumbnails, annotations, search).
        `,
      },
    },
  },
}
export default meta

type Story = StoryObj<typeof meta>

/** Minimal PDF viewer — all default features enabled. */
export const Pdf: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL }
    },
    template: `
      <div style="height: 100vh;">
        <DocumentViewer :source="source" :wasm-url="wasmUrl" />
      </div>
    `,
  }),
}

/** Image rendering — toolbar adapts to hide PDF-only features. */
export const Image: Story = {
  render: () => ({
    components: { DocumentViewer },
    template: `
      <div style="height: 100vh;">
        <DocumentViewer source="https://picsum.photos/seed/documentviewer/1200/1600" mime-type="image/jpeg" />
      </div>
    `,
  }),
}

/** Plain-text rendering using a data URL. */
export const Text: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(SAMPLE_TEXT)}`
      return { dataUrl }
    },
    template: `
      <div style="height: 100vh;">
        <DocumentViewer :source="dataUrl" mime-type="text/plain" />
      </div>
    `,
  }),
}

/** Markdown rendering using a data URL. */
export const Markdown: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const dataUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(SAMPLE_MARKDOWN)}`
      return { dataUrl }
    },
    template: `
      <div style="height: 100vh;">
        <DocumentViewer :source="dataUrl" mime-type="text/markdown" />
      </div>
    `,
  }),
}

/**
 * Comprehensive markdown showcase — exercises every GFM node type:
 * headings (H1–H6), paragraphs, emphasis, blockquotes (nested), lists
 * (ordered, unordered, task, mixed), code (inline, fenced, indented),
 * links (inline, reference, autolink, email), images (inline, reference,
 * linked), tables (with alignment), horizontal rules, inline HTML, and
 * footnotes. Useful for visually verifying renderer regressions.
 */
export const MarkdownGallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive markdown showcase covering every GFM node type. ' +
          'Useful for visually verifying that the IncremarkContent + ' +
          'ThemeProvider renderer handles headings, lists, tables, code ' +
          'fences, blockquotes, task lists, images, links, and inline HTML.',
      },
    },
  },
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const dataUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(SAMPLE_MARKDOWN_FULL)}`
      return { dataUrl }
    },
    template: `
      <div style="height: 100vh;">
        <DocumentViewer :source="dataUrl" mime-type="text/markdown" />
      </div>
    `,
  }),
}

/**
 * Features prop demo — disable annotation tools and side panels to show a
 * minimal "read-only" viewer (suitable for share-link contexts).
 */
export const ReadOnly: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const features = {
        zoom: true,
        rotate: true,
        search: true,
        outline: true,
        thumbnails: true,
        print: true,
        download: true,
        fullscreen: true,
        annotations: false,
        commentThreads: false,
        keyboardShortcuts: true,
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, features }
    },
    template: `
      <div style="height: 100vh;">
        <DocumentViewer :source="source" :wasm-url="wasmUrl" :features="features" />
      </div>
    `,
  }),
}
