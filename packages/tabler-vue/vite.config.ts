import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MeldUITablerVue',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: ['vue', /^@tabler\/icons-vue/],
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
    sourcemap: true,
    // Enable minification
    minify: 'esbuild',
    // Clear output directory before build
    emptyOutDir: true,
  },
})
