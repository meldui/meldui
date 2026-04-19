import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
export default defineConfig({
  site: 'https://docs.meldui.dev',
  integrations: [
    vue({
      appEntrypoint: '/src/vue-app',
    }),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['vue'],
    },
    optimizeDeps: {
      include: ['@meldui/vue', '@meldui/tabler-vue', 'vue-sonner'],
    },
    ssr: {
      optimizeDeps: {
        include: ['@meldui/vue', '@meldui/tabler-vue', 'vue-sonner'],
      },
    },
    define: {
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
