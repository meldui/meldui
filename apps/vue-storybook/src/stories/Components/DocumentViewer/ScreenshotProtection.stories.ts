/**
 * DocumentViewer — screenshot-protection stories.
 *
 * `features.screenshotProtection` applies a bundle of client-side screen-capture
 * **deterrents** (obscure-on-blur/tab-hide overlay, screenshot/devtools hotkey
 * block overlay, print-blank, block right-click + drag-out). These are
 * DETERRENTS, not guarantees — every one is removable via DevTools, and none
 * stop OS screenshots / recorders / phone photos. It is additive: it does NOT
 * change selection / print / download.
 */
import { DocumentViewer, type ViewerFeatures } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { SAMPLE_PDF_URL, WASM_URL } from './_shared'

const meta: Meta<typeof DocumentViewer> = {
  title: 'Components/DocumentViewer/ScreenshotProtection',
  component: DocumentViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
\`features.screenshotProtection\` is an opt-in bundle of client-side
screen-capture **deterrents**. It is NOT a guarantee: it can't stop OS
screenshots (macOS Cmd+Shift+4, Linux PrintScreen), screen recorders, or a
phone photo, and a user can remove it via DevTools. It is **additive** — it
does NOT change \`selection\` / \`print\` / \`download\` (set those yourself).

**Try it** in the stories below:
- **Right-click** the document → context menu is suppressed
- **Drag** an image/text out → cancelled
- **Switch tabs / click another window** → content **blurs** (Layer 1),
  un-blurs on focus
- A delivered screenshot/devtools **hotkey** (e.g. **F12**) → persistent
  "Protected content" panel + **Back to document** button (Layer 2)
- **Ctrl+P** / print-to-PDF → blank viewer
        `,
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

const HINT_BAR =
  'flex:none;padding:8px 14px;border-bottom:1px solid #e5e7eb;' +
  'font:500 12px/1.4 system-ui;color:#444;background:#fafafa'

/**
 * `screenshotProtection` on, with copy/print/download also locked down via their
 * own (independent) flags — the typical "confidential share-link" lockdown.
 */
export const Enabled: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const features: ViewerFeatures = {
        screenshotProtection: true,
        // Independent flags — screenshotProtection does NOT set these for you.
        selection: false,
        print: false,
        download: false,
        zoom: true,
        search: true,
        outline: true,
        thumbnails: true,
        fullscreen: true,
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, features, HINT_BAR }
    },
    // Hint sits in a top bar ABOVE the viewer (not floating over the toolbar).
    template: `
      <div style="display:flex;flex-direction:column;height:100vh;">
        <div :style="HINT_BAR">
          Try: right-click · drag · switch tab/window (blurs) · F12 (panel) · Ctrl+P (blank)
        </div>
        <div style="flex:1;min-height:0;">
          <DocumentViewer :source="source" :wasm-url="wasmUrl" :features="features" />
        </div>
      </div>
    `,
  }),
}

/**
 * `screenshotProtection` is additive and read live, so toggling it on a mounted
 * viewer takes effect with **no `:key` remount**. Flip the checkbox and re-test
 * the deterrents.
 */
export const LiveToggle: Story = {
  render: () => ({
    components: { DocumentViewer },
    setup() {
      const enabled = ref(true)
      const features = ref<ViewerFeatures>({ screenshotProtection: true })
      function toggle(v: boolean) {
        enabled.value = v
        features.value = { ...features.value, screenshotProtection: v }
      }
      return { source: SAMPLE_PDF_URL, wasmUrl: WASM_URL, enabled, features, toggle }
    },
    template: `
      <div style="display:flex;flex-direction:column;height:100vh;">
        <label style="display:flex;align-items:center;gap:8px;padding:10px 14px;
                      border-bottom:1px solid #e5e7eb;font:500 14px system-ui;">
          <input type="checkbox" :checked="enabled"
                 @change="toggle(($event.target).checked)" />
          screenshotProtection (toggles live, no remount)
        </label>
        <div style="flex:1;min-height:0;">
          <DocumentViewer :source="source" :wasm-url="wasmUrl" :features="features" />
        </div>
      </div>
    `,
  }),
}
