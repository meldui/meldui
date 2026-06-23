/**
 * MeldEditor — rich-text editor stories.
 *
 * Demonstrates the default editing experience, the optional toolbar, read-only
 * mode, callback-driven mentions and image upload, and a custom block component.
 */
import { MeldEditor } from '@meldui/editor'
import type { Editor } from '@tiptap/core'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SAMPLE_DOC, searchPeople, uploadImage } from './_shared'

const meta: Meta<typeof MeldEditor> = {
  title: 'Components/Editor/MeldEditor',
  component: MeldEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`MeldEditor\` is a Vue 3 rich-text editor built on [TipTap](https://tiptap.dev) v3.
It ships a default extension set (headings, lists, tables, images, mentions,
columns, table-of-contents, chart blocks), a \`/\` slash-command menu, a selection
bubble menu, an optional toolbar, and a Notion-style drag handle.

Integration is callback-driven: pass \`onImageUpload\` and \`onMentionSearch\`, and
register custom blocks through \`customComponents\`. The editor emits
\`update:json\` on every change and \`created\` with the underlying TipTap
\`Editor\` instance — set initial content from the \`created\` handler.

Requires the \`@meldui/vue\`, \`@meldui/tabler-vue\`, and \`@meldui/charts-vue\`
peers, and \`@meldui/editor/styles\` imported once at app root.
        `,
      },
    },
  },
  argTypes: {
    showToolbar: {
      control: 'boolean',
      description: 'Show the formatting toolbar above the editor',
    },
    showBubbleMenu: { control: 'boolean', description: 'Show the selection bubble menu' },
    editable: { control: 'boolean', description: 'Whether the document can be edited' },
    placeholder: { control: 'text', description: 'Placeholder shown in an empty document' },
  },
}
export default meta

type Story = StoryObj<typeof meta>

/** Seeds the editor with the sample document once it is created. */
function seed(editor: Editor) {
  editor.commands.setContent(SAMPLE_DOC)
}

/** Wraps the editor in a centered, scrollable canvas so it fills the frame. */
const FRAME = `
  <div style="height: 100vh; padding: 24px; overflow: auto; background: var(--background);">
    <div style="max-width: 760px; margin: 0 auto;">
      <slot />
    </div>
  </div>
`

/** Default editing experience — bubble menu and slash commands, no toolbar. */
export const Default: Story = {
  render: () => ({
    components: { MeldEditor },
    setup() {
      return { seed, uploadImage }
    },
    template: FRAME.replace(
      '<slot />',
      `<MeldEditor :on-image-upload="uploadImage" @created="seed" />`,
    ),
  }),
}

/** With the optional formatting toolbar enabled. */
export const WithToolbar: Story = {
  render: () => ({
    components: { MeldEditor },
    setup() {
      return { seed, uploadImage }
    },
    template: FRAME.replace(
      '<slot />',
      `<MeldEditor :show-toolbar="true" :on-image-upload="uploadImage" @created="seed" />`,
    ),
  }),
}

/** Read-only rendering — content shows but cannot be modified. */
export const ReadOnly: Story = {
  render: () => ({
    components: { MeldEditor },
    setup() {
      return { seed }
    },
    template: FRAME.replace('<slot />', `<MeldEditor :editable="false" @created="seed" />`),
  }),
}

/**
 * Mentions — type `@` to search a static people directory resolved through the
 * `onMentionSearch` callback. The mention extension only loads when the callback
 * is provided.
 */
export const Mentions: Story = {
  render: () => ({
    components: { MeldEditor },
    setup() {
      return { searchPeople }
    },
    template: FRAME.replace(
      '<slot />',
      `<MeldEditor placeholder="Type @ to mention someone…" :on-mention-search="searchPeople" />`,
    ),
  }),
}

/**
 * Image upload — use the `/` slash menu (or toolbar) to insert an image. The
 * `onImageUpload` callback receives the `File`; here it returns a local object
 * URL instead of hitting a server.
 */
export const ImageUpload: Story = {
  render: () => ({
    components: { MeldEditor },
    setup() {
      return { uploadImage }
    },
    template: FRAME.replace(
      '<slot />',
      `<MeldEditor :show-toolbar="true" placeholder="Insert an image via the / menu…" :on-image-upload="uploadImage" />`,
    ),
  }),
}

/**
 * Kitchen sink — toolbar, bubble menu, mentions, and image upload all enabled.
 * Insert tables, columns, and chart blocks from the `/` slash menu.
 */
export const KitchenSink: Story = {
  render: () => ({
    components: { MeldEditor },
    setup() {
      return { seed, searchPeople, uploadImage }
    },
    template: FRAME.replace(
      '<slot />',
      `<MeldEditor
        :show-toolbar="true"
        :on-image-upload="uploadImage"
        :on-mention-search="searchPeople"
        @created="seed"
      />`,
    ),
  }),
}
