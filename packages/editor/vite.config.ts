import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MeldUIEditor',
      formats: ['es', 'cjs'],
    },
    rolldownOptions: {
      // External dependencies that shouldn't be bundled — the editor engine and
      // MeldUI peers are installed by the consumer, not shipped inside dist.
      external: [
        'vue',
        '@meldui/vue',
        '@meldui/tabler-vue',
        '@meldui/charts-vue',
        /^@tiptap\//, // TipTap / ProseMirror engine
        'tippy.js',
      ],
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].mjs',
          dir: 'dist/esm',
          globals: {
            vue: 'Vue',
          },
          // CSS output path (only needed in ESM)
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') {
              return 'editor.css'
            }
            return assetInfo.name || ''
          },
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          dir: 'dist/cjs',
          globals: {
            vue: 'Vue',
          },
        },
      ],
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
