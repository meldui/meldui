import { Toaster } from '@meldui/vue'
import type { Preview } from '@storybook/vue3-vite'
// Order matters: load the prebuilt library bundles FIRST, then Storybook's own
// Tailwind LAST so consumer utility overrides (e.g. the editor's `sm:max-w-md`
// on a dialog) win the cascade over the library's base utilities. This mirrors
// the single-pipeline order the docs site uses.
import '@meldui/vue/styles' // Component styles bundled by @meldui/vue
import '@meldui/editor/styles' // Component styles bundled by @meldui/editor
import '../src/styles/tailwind.css' // Tailwind (theme + utilities) — last to win
import 'vue-sonner/style.css' // Import Sonner styles

const preview: Preview = {
  decorators: [
    (story) => ({
      components: { story, Toaster },
      template: '<div><story /><Toaster /></div>',
    }),
  ],
  parameters: {
    docs: {
      source: {
        language: 'vue',
        type: 'code',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        light: {
          name: 'light',
          value: '#ffffff',
        },

        dark: {
          name: 'dark',
          value: '#0f172a',
        },
      },
    },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'light',
    },
  },
}

export default preview
