import { Button, Field, FieldContent, FieldDescription, FieldError, FieldLabel, Label, MultiSelect } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof MultiSelect> = {
  title: 'Components/Form/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the multi-select is disabled',
    },
    max: {
      control: 'number',
      description: 'Maximum number of selections allowed',
    },
    maxDisplay: {
      control: 'number',
      description: 'Maximum number of badges to display before showing "+N more"',
    },
    creatable: {
      control: 'boolean',
      description: 'Allow creating new options on-the-fly',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A multi-select component for choosing multiple items from a predefined list with search/filter capabilities. Built on Command and Popover for rich interactions.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<string[]>([])
      const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']
      return { selected, options }
    },
    template: `
      <div class="max-w-md">
        <MultiSelect
          v-model="selected"
          :options="options"
          placeholder="Select options..."
        />
        <p class="mt-4 text-sm text-muted-foreground">
          Selected: {{ selected.length ? selected.join(', ') : 'None' }}
        </p>
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Label, MultiSelect },
    setup() {
      const frameworks = ref<string[]>([])
      const options = ['Vue.js', 'React', 'Angular', 'Svelte', 'Solid.js']
      return { frameworks, options }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="frameworks">Frameworks</Label>
        <MultiSelect
          id="frameworks"
          v-model="frameworks"
          :options="options"
          placeholder="Select frameworks..."
        />
      </div>
    `,
  }),
}

export const WithObjectOptions: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<string[]>(['vue', 'react'])
      const options = [
        { value: 'vue', label: 'Vue.js' },
        { value: 'react', label: 'React' },
        { value: 'angular', label: 'Angular' },
        { value: 'svelte', label: 'Svelte' },
        { value: 'solid', label: 'Solid.js' },
      ]
      return { selected, options }
    },
    template: `
      <div class="max-w-md">
        <MultiSelect
          v-model="selected"
          :options="options"
          placeholder="Select frameworks..."
        />
        <p class="mt-4 text-sm text-muted-foreground">
          Selected values: {{ selected.join(', ') }}
        </p>
      </div>
    `,
  }),
}

export const WithGroups: Story = {
  render: () => ({
    components: { Label, MultiSelect },
    setup() {
      const selected = ref<string[]>([])
      const groups = [
        {
          label: 'Fruits',
          options: ['Apple', 'Banana', 'Orange', 'Mango'],
        },
        {
          label: 'Vegetables',
          options: ['Carrot', 'Broccoli', 'Spinach', 'Tomato'],
        },
        {
          label: 'Grains',
          options: ['Rice', 'Wheat', 'Oats', 'Quinoa'],
        },
      ]
      return { selected, groups }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="food">Food Items</Label>
        <MultiSelect
          id="food"
          v-model="selected"
          :groups="groups"
          placeholder="Select food items..."
        />
      </div>
    `,
  }),
}

export const WithMaxSelections: Story = {
  render: () => ({
    components: { Label, MultiSelect },
    setup() {
      const selected = ref<string[]>([])
      const options = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink']
      return { selected, options }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="colors">Choose up to 3 colors</Label>
        <MultiSelect
          id="colors"
          v-model="selected"
          :options="options"
          :max="3"
          placeholder="Select colors..."
        />
        <p class="text-xs text-muted-foreground">
          You can select up to 3 colors
        </p>
      </div>
    `,
  }),
}

export const WithMaxDisplay: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<string[]>(['JavaScript', 'TypeScript', 'Python', 'Java', 'Rust'])
      const options = [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'Rust',
        'Go',
        'C++',
        'C#',
        'Ruby',
        'PHP',
      ]
      return { selected, options }
    },
    template: `
      <div class="max-w-md">
        <MultiSelect
          v-model="selected"
          :options="options"
          :max-display="3"
          placeholder="Select languages..."
        />
        <p class="mt-4 text-sm text-muted-foreground">
          Only first 3 badges shown, rest collapsed to "+N more"
        </p>
      </div>
    `,
  }),
}

export const Creatable: Story = {
  render: () => ({
    components: { Label, MultiSelect },
    setup() {
      const tags = ref<string[]>(['vue', 'typescript'])
      const predefinedTags = ['vue', 'react', 'angular', 'typescript', 'javascript']
      return { tags, predefinedTags }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="tags">Tags</Label>
        <MultiSelect
          id="tags"
          v-model="tags"
          :options="predefinedTags"
          :creatable="true"
          placeholder="Select or create tags..."
          search-placeholder="Search or create..."
        />
        <p class="text-xs text-muted-foreground">
          Type a tag name and press Enter to create a new one
        </p>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Label, MultiSelect },
    setup() {
      const selected = ref<string[]>(['Option 1', 'Option 2'])
      const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4']
      return { selected, options }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="disabled">Disabled MultiSelect</Label>
        <MultiSelect
          id="disabled"
          v-model="selected"
          :options="options"
          :disabled="true"
          placeholder="Cannot select..."
        />
      </div>
    `,
  }),
}

export const WithFieldError: Story = {
  render: () => ({
    components: { Field, FieldContent, FieldDescription, FieldError, FieldLabel, MultiSelect },
    setup() {
      const selected = ref<string[]>([])
      const options = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Rust']
      const errors = ref(['Please select at least one skill'])
      return { selected, options, errors }
    },
    template: `
      <div class="max-w-md">
        <Field orientation="vertical">
          <FieldLabel>
            Skills
            <span class="text-destructive ml-1">*</span>
          </FieldLabel>
          <FieldContent>
            <MultiSelect
              v-model="selected"
              :options="options"
              aria-invalid="true"
              placeholder="Select your skills..."
            />
            <FieldDescription>
              Select the programming languages you're proficient in
            </FieldDescription>
            <FieldError :errors="errors" />
          </FieldContent>
        </Field>
      </div>
    `,
  }),
}

export const LargeDataset: Story = {
  render: () => ({
    components: { MultiSelect },
    setup() {
      const selected = ref<string[]>([])

      // Generate 100 countries
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
        'India',
        'Brazil',
        'Mexico',
        'Argentina',
        'South Korea',
        'Indonesia',
        'Turkey',
        'Saudi Arabia',
        'Switzerland',
        'Netherlands',
        'Belgium',
        'Sweden',
        'Norway',
        'Denmark',
        'Finland',
        'Poland',
        'Austria',
        'Ireland',
        'Portugal',
        'Greece',
        'Czech Republic',
        'Romania',
        'Hungary',
        'New Zealand',
        'Singapore',
        'Malaysia',
        'Thailand',
        'Philippines',
        'Vietnam',
        'Egypt',
        'South Africa',
        'Nigeria',
        'Kenya',
        'Morocco',
        'Israel',
        'UAE',
        'Qatar',
        'Kuwait',
        'Chile',
        'Colombia',
        'Peru',
        'Venezuela',
        'Ukraine',
        'Russia',
        'Pakistan',
        'Bangladesh',
      ].sort()

      return { selected, countries }
    },
    template: `
      <div class="max-w-md">
        <MultiSelect
          v-model="selected"
          :options="countries"
          :max-display="2"
          placeholder="Select countries..."
          search-placeholder="Search countries..."
        />
        <p class="mt-4 text-sm text-muted-foreground">
          {{ selected.length }} countries selected
        </p>
      </div>
    `,
  }),
}

export const FormIntegration: Story = {
  render: () => ({
    components: {
      Button,
      Field,
      FieldContent,
      FieldDescription,
      FieldError,
      FieldLabel,
      MultiSelect,
    },
    setup() {
      const formData = ref({
        skills: [] as string[],
        interests: [] as string[],
      })

      const errors = ref<Record<string, string[]>>({})

      const skillOptions = [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'Rust',
        'Go',
        'C++',
        'Ruby',
      ]

      const interestGroups = [
        {
          label: 'Technology',
          options: ['Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain'],
        },
        {
          label: 'Design',
          options: ['UI/UX', 'Graphic Design', '3D Modeling', 'Animation'],
        },
        {
          label: 'Business',
          options: ['Marketing', 'Sales', 'Product Management', 'Entrepreneurship'],
        },
      ]

      const validateForm = () => {
        errors.value = {}

        if (formData.value.skills.length === 0) {
          errors.value.skills = ['Please select at least one skill']
        }

        if (formData.value.interests.length === 0) {
          errors.value.interests = ['Please select at least one interest']
        }

        return Object.keys(errors.value).length === 0
      }

      const handleSubmit = () => {
        if (validateForm()) {
          alert(JSON.stringify(formData.value, null, 2))
        }
      }

      return { formData, errors, skillOptions, interestGroups, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Profile Information</h3>
          <p class="text-sm text-muted-foreground">
            Select your skills and areas of interest
          </p>
        </div>

        <Field orientation="vertical">
          <FieldLabel>
            Technical Skills
            <span class="text-destructive ml-1">*</span>
          </FieldLabel>
          <FieldContent>
            <MultiSelect
              v-model="formData.skills"
              :options="skillOptions"
              :aria-invalid="!!errors.skills"
              placeholder="Select your skills..."
            />
            <FieldDescription>
              Choose the programming languages you're proficient in
            </FieldDescription>
            <FieldError v-if="errors.skills" :errors="errors.skills" />
          </FieldContent>
        </Field>

        <Field orientation="vertical">
          <FieldLabel>
            Interests
            <span class="text-destructive ml-1">*</span>
          </FieldLabel>
          <FieldContent>
            <MultiSelect
              v-model="formData.interests"
              :groups="interestGroups"
              :max="5"
              :aria-invalid="!!errors.interests"
              placeholder="Select your interests..."
            />
            <FieldDescription>
              Select up to 5 areas you're interested in
            </FieldDescription>
            <FieldError v-if="errors.interests" :errors="errors.interests" />
          </FieldContent>
        </Field>

        <Button type="submit">
          Submit
        </Button>
      </form>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Button, Label, MultiSelect },
    setup() {
      const selected = ref<string[]>(['TypeScript', 'Vue.js'])
      const options = [
        'JavaScript',
        'TypeScript',
        'Vue.js',
        'React',
        'Angular',
        'Svelte',
      ]

      const addRandom = () => {
        const available = options.filter((opt) => !selected.value.includes(opt))
        if (available.length > 0) {
          const random = available[Math.floor(Math.random() * available.length)]
          selected.value = [...selected.value, random]
        }
      }

      const reset = () => {
        selected.value = ['TypeScript', 'Vue.js']
      }

      return { selected, options, addRandom, reset }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <div class="flex flex-col gap-2">
          <Label for="controlled">Technologies</Label>
          <MultiSelect
            id="controlled"
            v-model="selected"
            :options="options"
            placeholder="Select technologies..."
          />
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            Selected: <span class="font-mono font-semibold">{{ selected.length }}</span>
          </div>
          <Button size="sm" variant="outline" @click="addRandom">
            Add Random
          </Button>
          <Button size="sm" variant="outline" @click="reset">
            Reset
          </Button>
        </div>
      </div>
    `,
  }),
}
