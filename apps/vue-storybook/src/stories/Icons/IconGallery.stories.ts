import * as TablerIcons from '@meldui/tabler-vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'

const meta: Meta = {
  title: 'Icons/Gallery',
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

export const AllIcons: Story = {
  render: () => ({
    setup() {
      const search = ref('')

      // Get all icon components
      const allIcons = Object.entries(TablerIcons)
        .filter(([name]) => name.startsWith('Icon'))
        .map(([name, component]) => ({ name, component }))

      // Filter icons based on search
      const filteredIcons = computed(() => {
        if (!search.value) return allIcons
        const query = search.value.toLowerCase()
        return allIcons.filter(({ name }) => name.toLowerCase().includes(query))
      })

      return {
        search,
        filteredIcons,
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 2rem;">
          <input
            v-model="search"
            type="text"
            placeholder="Search icons..."
            style="
              width: 100%;
              max-width: 400px;
              padding: 0.5rem 1rem;
              border: 1px solid var(--color-border);
              border-radius: var(--radius-md);
              font-size: 1rem;
            "
          />
          <p style="margin-top: 0.5rem; color: var(--color-muted-foreground);">
            Showing {{ filteredIcons.length }} icons
          </p>
        </div>

        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
        ">
          <div
            v-for="{ name, component } in filteredIcons"
            :key="name"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
              padding: 1rem;
              border: 1px solid var(--color-border);
              border-radius: var(--radius-md);
              cursor: pointer;
              transition: background-color 0.2s;
            "
            @click="copyIconName(name)"
            :title="'Click to copy: ' + name"
          >
            <component :is="component" :size="32" />
            <span style="
              font-size: 0.75rem;
              text-align: center;
              word-break: break-word;
              color: var(--color-muted-foreground);
            ">
              {{ name }}
            </span>
          </div>
        </div>
      </div>
    `,
    methods: {
      copyIconName(name: string) {
        navigator.clipboard.writeText(name)
        alert(`Copied: ${name}`)
      },
    },
  }),
}
