/**
 * DocumentViewer — content-protection stories.
 *
 * `features.contentProtection` applies a bundle of client-side capture
 * deterrents (obscure-on-blur/tab-hide, PrintScreen clipboard clobber, block
 * right-click + drag-out). These are DETERRENTS, not guarantees — every one is
 * removable via DevTools, and none stop OS screenshots / recorders / phone
 * photos. The stories below let you exercise each behaviour by hand.
 */
import { DocumentViewer, type ViewerFeatures } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { SAMPLE_PDF_URL, WASM_URL } from './_shared'

const meta: Meta<typeof DocumentViewer> = {
  title: 'Components/DocumentViewer/ContentProtection',
  component: DocumentViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`features.contentProtection\` is an opt-in bundle of client-side capture
**deterrents**. It is NOT a guarantee: it can't stop OS screenshots
(macOS Cmd+Shift+4), screen recorders, or a phone photo, and a user can
remove it via DevTools. It also does **not** block copy / print / download —
use the \`selection\`, \`print\`, and \`download\` flags for those.

**Try it** in the stories below:
- **Right-click** the document → context menu is suppressed
- **Drag** an image/text out → cancelled
- **Switch tabs / click another window** → the document is covered by a
  "Protected content" overlay, restored on focus
- **Press PrintScreen** (Windows/Chromium) → brief overlay + clipboard cleared
        `,
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const HINT_STYLE =
  'position:absolute;top:8px;left:50%;transform:translateX(-50%);z-index:60;' +
  'background:rgba(0,0,0,.8);color:#fff;padding:6px 12px;border-radius:6px;' +
  'font:500 12px/1.4 system-ui;pointer-events:none;max-width:90%;text-align:center'

/**
 * `contentProtection` on, with copy/print/download also locked down via their
 * own flags — the typical "confidential share-link" lockdown.
 */
export const Enabled: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const features: ViewerFeatures = {
        contentProtection: true,
        // Lock these down explicitly — contentProtection does NOT do it for you.
        selection: false,
        print: false,
        download: false,
        zoom: true,
        search: true,
        outline: true,
        thumbnails: true,
        fullscreen: true,
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, features, HINT_STYLE }
    },
    template: `
      <div style="position:relative;height:100vh;">
        <div :style="HINT_STYLE">
          Try: right-click · drag the page · switch tab/window · PrintScreen (Win)
        </div>
        <DocumentViewer :source="source" :wasm-url="wasmUrl" :features="features" />
      </div>
    `,
  }),
}

/**
 * `contentProtection` is read live (unlike plugin-gating flags), so toggling it
 * on a mounted viewer takes effect with **no `:key` remount**. Flip the checkbox
 * and re-test the deterrents.
 */
export const LiveToggle: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const enabled = ref(true)
      const features = ref<ViewerFeatures>({ contentProtection: true })
      function toggle(v: boolean) {
        enabled.value = v
        features.value = { ...features.value, contentProtection: v }
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, enabled, features, toggle }
    },
    template: `
      <div style="display:flex;flex-direction:column;height:100vh;">
        <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;
                      border-bottom:1px solid #e5e7eb;font:500 14px system-ui;">
          <input type="checkbox" :checked="enabled"
                 @change="toggle(($event.target).checked)" />
          contentProtection (toggles live, no remount)
        </label>
        <div style="flex:1;min-height:0;">
          <DocumentViewer :source="source" :wasm-url="wasmUrl" :features="features" />
        </div>
      </div>
    `,
  }),
}
