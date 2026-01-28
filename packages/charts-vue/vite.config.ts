import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MeldUIChartsVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rolldownOptions: {
      // External dependencies that shouldn't be bundled
      external: [
        'vue',
        '@meldui/vue', // Externalize @meldui/vue (peer dependency)
        /^echarts/, // Externalize echarts for better tree-shaking
        /^vue-echarts/, // Externalize vue-echarts
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@meldui/vue': 'MeldUIVue',
          echarts: 'echarts',
        },
      },
    },
    sourcemap: true,
    // Oxc minification is automatic via Rolldown
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
