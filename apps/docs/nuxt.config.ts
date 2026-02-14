import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxtjs/sitemap'],

  site: {
    url: 'https://meldui.dev',
    name: 'MeldUI',
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['vue', 'typescript', 'javascript', 'html', 'css', 'bash', 'json', 'yaml'],
        },
      },
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'MeldUI',
      meta: [{ name: 'description', content: 'A Vue 3 design system built on shadcn components.' }],
      script: [
        {
          // FOUC prevention: apply saved theme before render
          innerHTML: `
            (function() {
              try {
                var mode = localStorage.getItem('meldui-color-mode');
                if (mode === 'dark' || (!mode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();
          `,
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
