import { IconCheck, IconSelector } from '@meldui/tabler-vue'
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'

const meta: Meta = {
  title: 'Components/Utility/Combobox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An autocomplete input component that combines a Popover, Command, and Button to create a searchable dropdown. Users can search and select from a list of options.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('')
      const frameworks = [
        { value: 'next', label: 'Next.js' },
        { value: 'sveltekit', label: 'SvelteKit' },
        { value: 'nuxt', label: 'Nuxt.js' },
        { value: 'remix', label: 'Remix' },
        { value: 'astro', label: 'Astro' },
      ]
      const selectedFramework = computed(() =>
        frameworks.find((f) => f.value === value.value),
      )
      return { open, value, frameworks, selectedFramework }
    },
    template: `
      <div class="w-full max-w-sm">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[200px] justify-between"
            >
              {{ selectedFramework?.label || "Select framework..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search framework..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="framework in frameworks"
                    :key="framework.value"
                    :value="framework.value"
                    @select="open = false"
                  >
                    {{ framework.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === framework.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
}

export const WithSelection: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('vue')
      const frameworks = [
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
        { value: 'angular', label: 'Angular' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'solid', label: 'Solid' },
      ]
      const selectedFramework = computed(() =>
        frameworks.find((f) => f.value === value.value),
      )
      return { open, value, frameworks, selectedFramework }
    },
    template: `
      <div class="w-full max-w-sm space-y-4">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[200px] justify-between"
            >
              {{ selectedFramework?.label || "Select framework..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search framework..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="framework in frameworks"
                    :key="framework.value"
                    :value="framework.value"
                    @select="open = false"
                  >
                    {{ framework.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === framework.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div class="text-sm text-muted-foreground">
          Selected: {{ selectedFramework?.label || 'None' }}
        </div>
      </div>
    `,
  }),
}

export const WithGroups: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      CommandSeparator,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('')
      const fruits = [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
      ]
      const vegetables = [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
        { value: 'spinach', label: 'Spinach' },
      ]
      const allItems = [...fruits, ...vegetables]
      const selectedItem = computed(() =>
        allItems.find((item) => item.value === value.value),
      )
      return { open, value, fruits, vegetables, selectedItem }
    },
    template: `
      <div class="w-full max-w-sm">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[200px] justify-between"
            >
              {{ selectedItem?.label || "Select food..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search food..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Fruits">
                  <CommandItem
                    v-for="fruit in fruits"
                    :key="fruit.value"
                    :value="fruit.value"
                    @select="open = false"
                  >
                    {{ fruit.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === fruit.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Vegetables">
                  <CommandItem
                    v-for="veg in vegetables"
                    :key="veg.value"
                    :value="veg.value"
                    @select="open = false"
                  >
                    {{ veg.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === veg.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
}

export const CountrySelector: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('')
      const countries = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' },
        { value: 'de', label: 'Germany' },
        { value: 'fr', label: 'France' },
        { value: 'es', label: 'Spain' },
        { value: 'it', label: 'Italy' },
        { value: 'jp', label: 'Japan' },
        { value: 'cn', label: 'China' },
      ]
      const selectedCountry = computed(() =>
        countries.find((c) => c.value === value.value),
      )
      return { open, value, countries, selectedCountry }
    },
    template: `
      <div class="w-full max-w-sm">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[200px] justify-between"
            >
              {{ selectedCountry?.label || "Select country..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="country in countries"
                    :key="country.value"
                    :value="country.value"
                    @select="open = false"
                  >
                    {{ country.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === country.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
}

export const ProgrammingLanguages: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('javascript')
      const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'typescript', label: 'TypeScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'csharp', label: 'C#' },
        { value: 'go', label: 'Go' },
        { value: 'rust', label: 'Rust' },
        { value: 'swift', label: 'Swift' },
        { value: 'kotlin', label: 'Kotlin' },
      ]
      const selectedLang = computed(() =>
        languages.find((l) => l.value === value.value),
      )
      return { open, value, languages, selectedLang }
    },
    template: `
      <div class="w-full max-w-sm space-y-4">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[200px] justify-between"
            >
              {{ selectedLang?.label || "Select language..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search language..." />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="lang in languages"
                    :key="lang.value"
                    :value="lang.value"
                    @select="open = false"
                  >
                    {{ lang.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === lang.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div class="text-sm text-muted-foreground">
          Selected language: {{ selectedLang?.label }}
        </div>
      </div>
    `,
  }),
}

export const WithDescriptions: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('')
      const plans = [
        { value: 'free', label: 'Free', description: 'For personal use' },
        { value: 'pro', label: 'Pro', description: 'For professionals' },
        { value: 'enterprise', label: 'Enterprise', description: 'For organizations' },
      ]
      const selectedPlan = computed(() =>
        plans.find((p) => p.value === value.value),
      )
      return { open, value, plans, selectedPlan }
    },
    template: `
      <div class="w-full max-w-md">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[250px] justify-between"
            >
              {{ selectedPlan?.label || "Select plan..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[250px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search plan..." />
              <CommandList>
                <CommandEmpty>No plan found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="plan in plans"
                    :key="plan.value"
                    :value="plan.value"
                    @select="open = false"
                  >
                    <div class="flex flex-col">
                      <span class="font-medium">{{ plan.label }}</span>
                      <span class="text-xs text-muted-foreground">{{ plan.description }}</span>
                    </div>
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === plan.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
}

export const EmailSuggestions: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('')
      const emails = [
        { value: 'john', label: 'john.doe@example.com' },
        { value: 'jane', label: 'jane.smith@example.com' },
        { value: 'bob', label: 'bob.wilson@example.com' },
        { value: 'alice', label: 'alice.jones@example.com' },
        { value: 'charlie', label: 'charlie.brown@example.com' },
      ]
      const selectedEmail = computed(() =>
        emails.find((e) => e.value === value.value),
      )
      return { open, value, emails, selectedEmail }
    },
    template: `
      <div class="w-full max-w-md space-y-4">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[280px] justify-between"
            >
              {{ selectedEmail?.label || "Select email..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[280px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search email..." />
              <CommandList>
                <CommandEmpty>No email found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="email in emails"
                    :key="email.value"
                    :value="email.value"
                    @select="open = false"
                  >
                    {{ email.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === email.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div v-if="selectedEmail" class="text-sm text-muted-foreground">
          Selected: {{ selectedEmail.label }}
        </div>
      </div>
    `,
  }),
}

export const LongList: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('')
      const items = Array.from({ length: 100 }, (_, i) => ({
        value: `item-${i + 1}`,
        label: `Item ${i + 1}`,
      }))
      const selectedItem = computed(() =>
        items.find((item) => item.value === value.value),
      )
      return { open, value, items, selectedItem }
    },
    template: `
      <div class="w-full max-w-sm">
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-[200px] justify-between"
            >
              {{ selectedItem?.label || "Select item..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search items..." />
              <CommandList class="max-h-[300px]">
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="item in items"
                    :key="item.value"
                    :value="item.value"
                    @select="open = false"
                  >
                    {{ item.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === item.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: {
      Popover,
      PopoverTrigger,
      PopoverContent,
      Button,
      Command,
      CommandInput,
      CommandList,
      CommandEmpty,
      CommandGroup,
      CommandItem,
      IconCheck,
      IconSelector,
    },
    setup() {
      const open = ref(false)
      const value = ref('')
      const colors = [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'purple', label: 'Purple' },
        { value: 'orange', label: 'Orange' },
        { value: 'pink', label: 'Pink' },
        { value: 'brown', label: 'Brown' },
      ]
      const selectedColor = computed(() =>
        colors.find((c) => c.value === value.value),
      )
      return { open, value, colors, selectedColor }
    },
    template: `
      <div class="mx-auto w-full max-w-md rounded-lg border p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Color Preference</h3>
          <p class="text-sm text-muted-foreground">Choose your favorite color</p>
        </div>
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="open"
              class="w-full justify-between"
            >
              {{ selectedColor?.label || "Select color..." }}
              <IconSelector class="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[--reka-popover-trigger-width] p-0">
            <Command v-model="value">
              <CommandInput placeholder="Search color..." />
              <CommandList>
                <CommandEmpty>No color found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="color in colors"
                    :key="color.value"
                    :value="color.value"
                    @select="open = false"
                  >
                    {{ color.label }}
                    <IconCheck
                      :class="[
                        'ml-auto size-4',
                        value === color.value ? 'opacity-100' : 'opacity-0'
                      ]"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div v-if="selectedColor" class="mt-4 text-sm">
          <span class="text-muted-foreground">Selected:</span>
          <span class="ml-2 font-medium">{{ selectedColor.label }}</span>
        </div>
      </div>
    `,
  }),
}
