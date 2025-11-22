import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {},
  },

  docs: {
    defaultName: 'Documentation',
  },

  core: {
    disableTelemetry: true,
  },

  viteFinal: async (config) => {
    // Add Tailwind CSS v4 Vite plugin
    return mergeConfig(config, {
      plugins: [
        tailwindcss(),
        {
          name: 'resolve-file-protocol',
          async resolveId(id, importer, options) {
            // Convert file:// protocol imports to module specifiers
            if (id.includes('mdx-react-shim.js')) {
              // Use Rollup's resolver to find @mdx-js/react
              const resolved = await this.resolve('@mdx-js/react', importer, {
                ...options,
                skipSelf: true,
              })
              return resolved
            }
            return null
          },
        },
      ],
      resolve: {
        alias: {
          vue: resolve(__dirname, '../../node_modules/vue/dist/vue.esm-bundler.js'),
        },
      },
    })
  },
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
