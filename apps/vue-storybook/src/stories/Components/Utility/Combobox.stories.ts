import { IconCheck } from '@meldui/tabler-vue'
import {
  Button,
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxSeparator,
  ComboboxViewport,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Combobox> = {
  title: 'Components/Utility/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An autocomplete input component that allows users to search and select from a list of options. Combines a text input with a filterable dropdown list.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
      Button,
    },
    setup() {
      const searchTerm = ref('')
      const options = [
        'Apple',
        'Banana',
        'Cherry',
        'Date',
        'Elderberry',
        'Fig',
        'Grape',
        'Honeydew',
      ]
      return { searchTerm, options }
    },
    template: `
      <div class="w-full max-w-sm">
        <Combobox v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Search fruit..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)]">
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="option in options" :key="option" :value="option">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ option }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
      </div>
    `,
  }),
}

export const WithSelection: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedValue = ref('')
      const options = ['React', 'Vue', 'Angular', 'Svelte', 'Solid']
      return { searchTerm, selectedValue, options }
    },
    template: `
      <div class="w-full max-w-sm space-y-4">
        <Combobox v-model="selectedValue" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Select framework..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)]">
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="option in options" :key="option" :value="option">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ option }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
        <div class="text-sm text-muted-foreground">
          Selected: {{ selectedValue || 'None' }}
        </div>
      </div>
    `,
  }),
}

export const WithGroups: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      ComboboxSeparator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedValue = ref('')
      const fruits = ['Apple', 'Banana', 'Cherry']
      const vegetables = ['Carrot', 'Broccoli', 'Spinach']
      return { searchTerm, selectedValue, fruits, vegetables }
    },
    template: `
      <div class="w-full max-w-sm">
        <Combobox v-model="selectedValue" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Search food..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)]">
              <ComboboxEmpty>No results found.</ComboboxEmpty>
              <ComboboxGroup heading="Fruits">
                <ComboboxItem v-for="fruit in fruits" :key="fruit" :value="fruit">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ fruit }}
                </ComboboxItem>
              </ComboboxGroup>
              <ComboboxSeparator />
              <ComboboxGroup heading="Vegetables">
                <ComboboxItem v-for="veg in vegetables" :key="veg" :value="veg">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ veg }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
      </div>
    `,
  }),
}

export const CountrySelector: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedCountry = ref('')
      const countries = [
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'Germany',
        'France',
        'Spain',
        'Italy',
        'Japan',
        'China',
      ]
      return { searchTerm, selectedCountry, countries }
    },
    template: `
      <div class="w-full max-w-sm">
        <Combobox v-model="selectedCountry" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Select country..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)] max-h-[300px]">
              <ComboboxEmpty>No country found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="country in countries" :key="country" :value="country">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ country }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
      </div>
    `,
  }),
}

export const ProgrammingLanguages: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedLang = ref('JavaScript')
      const languages = [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'C++',
        'C#',
        'Go',
        'Rust',
        'Swift',
        'Kotlin',
      ]
      return { searchTerm, selectedLang, languages }
    },
    template: `
      <div class="w-full max-w-sm space-y-4">
        <Combobox v-model="selectedLang" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Search languages..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)]">
              <ComboboxEmpty>No language found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="lang in languages" :key="lang" :value="lang">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ lang }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
        <div class="text-sm text-muted-foreground">
          Selected language: {{ selectedLang }}
        </div>
      </div>
    `,
  }),
}

export const WithDescriptions: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedPlan = ref('')
      const plans = [
        { value: 'free', label: 'Free', description: 'For personal use' },
        { value: 'pro', label: 'Pro', description: 'For professionals' },
        {
          value: 'enterprise',
          label: 'Enterprise',
          description: 'For organizations',
        },
      ]
      return { searchTerm, selectedPlan, plans }
    },
    template: `
      <div class="w-full max-w-md">
        <Combobox v-model="selectedPlan" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Select plan..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)]">
              <ComboboxEmpty>No plan found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="plan in plans" :key="plan.value" :value="plan.value">
                  <div class="flex flex-1 items-center gap-2">
                    <ComboboxItemIndicator>
                      <IconCheck />
                    </ComboboxItemIndicator>
                    <div class="flex flex-col">
                      <span class="font-medium">{{ plan.label }}</span>
                      <span class="text-xs text-muted-foreground">{{ plan.description }}</span>
                    </div>
                  </div>
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
      </div>
    `,
  }),
}

export const EmailSuggestions: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedEmail = ref('')
      const emails = [
        'john.doe@example.com',
        'jane.smith@example.com',
        'bob.wilson@example.com',
        'alice.jones@example.com',
        'charlie.brown@example.com',
      ]
      return { searchTerm, selectedEmail, emails }
    },
    template: `
      <div class="w-full max-w-md space-y-4">
        <Combobox v-model="selectedEmail" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Search email..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)]">
              <ComboboxEmpty>No email found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="email in emails" :key="email" :value="email">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ email }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
        <div v-if="selectedEmail" class="text-sm text-muted-foreground">
          Selected: {{ selectedEmail }}
        </div>
      </div>
    `,
  }),
}

export const LongList: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedItem = ref('')
      const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)
      return { searchTerm, selectedItem, items }
    },
    template: `
      <div class="w-full max-w-sm">
        <Combobox v-model="selectedItem" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Search items..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)] max-h-[300px]">
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="item in items" :key="item" :value="item">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ item }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: {
      Combobox,
      ComboboxAnchor,
      ComboboxInput,
      ComboboxList,
      ComboboxViewport,
      ComboboxEmpty,
      ComboboxGroup,
      ComboboxItem,
      ComboboxItemIndicator,
      IconCheck,
    },
    setup() {
      const searchTerm = ref('')
      const selectedColor = ref('')
      const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown']
      return { searchTerm, selectedColor, colors }
    },
    template: `
      <div class="mx-auto w-full max-w-md rounded-lg border p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Color Preference</h3>
          <p class="text-sm text-muted-foreground">Choose your favorite color</p>
        </div>
        <Combobox v-model="selectedColor" v-model:search-term="searchTerm">
          <ComboboxAnchor as-child>
            <ComboboxInput placeholder="Select color..." class="w-full" />
          </ComboboxAnchor>
          <ComboboxList class="w-full">
            <ComboboxViewport class="w-full min-w-[var(--reka-combobox-trigger-width)]">
              <ComboboxEmpty>No color found.</ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="color in colors" :key="color" :value="color">
                  <ComboboxItemIndicator>
                    <IconCheck />
                  </ComboboxItemIndicator>
                  {{ color }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxViewport>
          </ComboboxList>
        </Combobox>
        <div v-if="selectedColor" class="mt-4 text-sm">
          <span class="text-muted-foreground">Selected:</span>
          <span class="ml-2 font-medium">{{ selectedColor }}</span>
        </div>
      </div>
    `,
  }),
}
