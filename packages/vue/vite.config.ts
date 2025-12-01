import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Plugin to copy theme files to dist
function copyThemes() {
  return {
    name: 'copy-themes',
    closeBundle() {
      mkdirSync(resolve(__dirname, 'dist/themes'), { recursive: true })
      copyFileSync(
        resolve(__dirname, 'src/themes/default.css'),
        resolve(__dirname, 'dist/themes/default.css'),
      )
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
    }),
    copyThemes(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MeldUIVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: [
        'vue',
        '@meldui/tabler-vue',
        /^@tabler\/icons-vue/, // Exclude all @tabler/icons-vue imports
        /^radix-vue/, // Exclude radix-vue
        /^@vueuse\//, // Exclude vueuse
        /^@tanstack\//, // Exclude tanstack
        /^@unovis\//, // Exclude unovis (chart library)
        /^@internationalized\//, // Exclude internationalized
        /^embla-carousel/, // Exclude embla carousel
        /^vaul-vue/, // Exclude vaul-vue
        /^vue-sonner/, // Exclude vue-sonner
        /^vue-input-otp/, // Exclude vue-input-otp
        /^vee-validate/, // Exclude vee-validate
        /^@vee-validate\//, // Exclude vee-validate
        /^zod/, // Exclude zod
        /^reka-ui/, // Exclude reka-ui
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
        // Also export CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'styles/index.css'
          }
          return assetInfo.name || ''
        },
      },
    },
    cssCodeSplit: false, // Bundle all CSS into one file
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
