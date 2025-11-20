import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MeldUITablerVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['vue'],
      output: {
        // Provide globals for UMD build (if needed later)
        globals: {
          vue: 'Vue',
        },
        // Preserve the structure for better tree-shaking
        preserveModules: false,
      },
    },
    sourcemap: true,
    // Clear output directory before build
    emptyOutDir: true,
  },
})
