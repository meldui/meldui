import { IconX } from '@meldui/tabler-vue'
import {
  Button,
  Label,
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof TagsInput> = {
  title: 'Components/Form/TagsInput',
  component: TagsInput,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the tags input is disabled',
    },
    delimiter: {
      control: 'text',
      description: 'Delimiter character for splitting tags',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'An input field for adding and managing multiple tags. Supports keyboard navigation, deletion, and custom delimiters. Built on reka-ui.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref(['Vue', 'React', 'Angular'])
      return { tags }
    },
    template: `
      <TagsInput v-model="tags" class="max-w-md">
        <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
        <TagsInputInput placeholder="Add tag..." />
      </TagsInput>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const skills = ref(['JavaScript', 'TypeScript'])
      return { skills }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>Skills</Label>
        <TagsInput v-model="skills">
          <TagsInputItem v-for="skill in skills" :key="skill" :value="skill">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Add skill..." />
        </TagsInput>
      </div>
    `,
  }),
}

export const Empty: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref<string[]>([])
      return { tags }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>Tags</Label>
        <TagsInput v-model="tags">
          <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Type and press Enter..." />
        </TagsInput>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref(['Design', 'Development'])

      const addTag = () => {
        tags.value.push(`Tag ${tags.value.length + 1}`)
      }

      const clearAll = () => {
        tags.value = []
      }

      return { tags, addTag, clearAll }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <div class="flex flex-col gap-2">
          <Label>Categories</Label>
          <TagsInput v-model="tags">
            <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="Add category..." />
          </TagsInput>
        </div>

        <div class="flex items-center gap-2">
          <div class="text-sm text-muted-foreground">
            {{ tags.length }} tag(s)
          </div>
          <Button size="sm" variant="outline" @click="addTag">
            Add Tag
          </Button>
          <Button size="sm" variant="outline" @click="clearAll">
            Clear All
          </Button>
        </div>
      </div>
    `,
  }),
}

export const WithDelimiter: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const emails = ref(['user1@example.com', 'user2@example.com'])
      return { emails }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>Email Addresses</Label>
        <TagsInput v-model="emails" delimiter=",">
          <TagsInputItem v-for="email in emails" :key="email" :value="email">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Enter emails separated by comma..." />
        </TagsInput>
        <p class="text-xs text-muted-foreground">
          Separate emails with commas
        </p>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
      return { tags }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>Disabled Tags Input</Label>
        <TagsInput v-model="tags" disabled>
          <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Disabled..." />
        </TagsInput>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref<string[]>([])
      return { tags }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="tags-error">
          Required Tags
          <span class="text-destructive ml-1">*</span>
        </Label>
        <TagsInput
          id="tags-error"
          v-model="tags"
          aria-invalid="true"
          aria-describedby="tags-error-message"
        >
          <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Add at least one tag..." />
        </TagsInput>
        <p id="tags-error-message" class="text-xs text-destructive">
          Please add at least one tag
        </p>
      </div>
    `,
  }),
}

export const CustomIcon: Story = {
  render: () => ({
    components: {
      IconX,
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref(['Custom', 'Icons', 'Example'])
      return { tags }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>Tags with Custom Icon</Label>
        <TagsInput v-model="tags">
          <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
            <TagsInputItemText />
            <TagsInputItemDelete>
              <IconX class="size-3" />
            </TagsInputItemDelete>
          </TagsInputItem>
          <TagsInputInput placeholder="Add tag..." />
        </TagsInput>
      </div>
    `,
  }),
}

export const Keywords: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const keywords = ref(['vue', 'component', 'ui', 'library'])
      return { keywords }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>SEO Keywords</Label>
        <TagsInput v-model="keywords">
          <TagsInputItem v-for="keyword in keywords" :key="keyword" :value="keyword">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Add keyword..." />
        </TagsInput>
        <p class="text-xs text-muted-foreground">
          {{ keywords.length }} keyword(s) added
        </p>
      </div>
    `,
  }),
}

export const ColorTags: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const colors = ref(['Red', 'Blue', 'Green', 'Yellow'])
      return { colors }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>Color Palette</Label>
        <TagsInput v-model="colors">
          <TagsInputItem v-for="color in colors" :key="color" :value="color">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Add color..." />
        </TagsInput>
      </div>
    `,
  }),
}

export const FormIntegration: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const formData = ref({
        skills: ['JavaScript', 'Vue.js'],
        interests: [] as string[],
      })

      const errors = ref({
        skills: '',
        interests: '',
      })

      const handleSubmit = () => {
        errors.value = { skills: '', interests: '' }

        if (formData.value.skills.length === 0) {
          errors.value.skills = 'Please add at least one skill'
        }

        if (formData.value.interests.length === 0) {
          errors.value.interests = 'Please add at least one interest'
        }

        if (!errors.value.skills && !errors.value.interests) {
          alert(JSON.stringify(formData.value, null, 2))
        }
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="skills">
            Skills
            <span class="text-destructive ml-1">*</span>
          </Label>
          <TagsInput
            id="skills"
            v-model="formData.skills"
            :aria-invalid="!!errors.skills"
            :aria-describedby="errors.skills ? 'skills-error' : undefined"
          >
            <TagsInputItem v-for="skill in formData.skills" :key="skill" :value="skill">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="Add skill..." />
          </TagsInput>
          <p v-if="errors.skills" id="skills-error" class="text-xs text-destructive">
            {{ errors.skills }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="interests">
            Interests
            <span class="text-destructive ml-1">*</span>
          </Label>
          <TagsInput
            id="interests"
            v-model="formData.interests"
            :aria-invalid="!!errors.interests"
            :aria-describedby="errors.interests ? 'interests-error' : undefined"
          >
            <TagsInputItem v-for="interest in formData.interests" :key="interest" :value="interest">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="Add interest..." />
          </TagsInput>
          <p v-if="errors.interests" id="interests-error" class="text-xs text-destructive">
            {{ errors.interests }}
          </p>
        </div>

        <Button type="submit">
          Submit
        </Button>
      </form>
    `,
  }),
}

export const LongTagsList: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref([
        'JavaScript',
        'TypeScript',
        'Vue.js',
        'React',
        'Angular',
        'Svelte',
        'Node.js',
        'Express',
        'MongoDB',
        'PostgreSQL',
      ])
      return { tags }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-2xl">
        <Label>Technologies</Label>
        <TagsInput v-model="tags">
          <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Add technology..." />
        </TagsInput>
        <p class="text-xs text-muted-foreground">
          {{ tags.length }} technologies listed
        </p>
      </div>
    `,
  }),
}

export const CompactSize: Story = {
  render: () => ({
    components: {
      Label,
      TagsInput,
      TagsInputInput,
      TagsInputItem,
      TagsInputItemDelete,
      TagsInputItemText,
    },
    setup() {
      const tags = ref(['Small', 'Compact', 'Tags'])
      return { tags }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label>Compact Tags</Label>
        <TagsInput v-model="tags" class="py-1">
          <TagsInputItem v-for="tag in tags" :key="tag" :value="tag" class="h-4 text-xs">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>
          <TagsInputInput placeholder="Add tag..." class="text-xs" />
        </TagsInput>
      </div>
    `,
  }),
}
