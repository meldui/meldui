import {
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGoogle,
  IconCheck,
  IconCloud,
  IconMail,
  IconPhone,
  IconX,
} from '@meldui/tabler-vue'
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Select> = {
  title: 'Components/Form/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A custom select component with rich features like grouping, search, and keyboard navigation. Built on reka-ui for accessibility.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <Select>
        <SelectTrigger class="w-64">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="framework">Framework</Label>
        <Select>
          <SelectTrigger id="framework" class="w-full">
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vue">Vue.js</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const WithGroups: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectLabel,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="fruit">Fruit</Label>
        <Select>
          <SelectTrigger id="fruit" class="w-full">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Citrus</SelectLabel>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="lemon">Lemon</SelectItem>
              <SelectItem value="lime">Lime</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Berries</SelectLabel>
              <SelectItem value="strawberry">Strawberry</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="raspberry">Raspberry</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Tropical</SelectLabel>
              <SelectItem value="mango">Mango</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
              <SelectItem value="papaya">Papaya</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const language = ref('typescript')
      const reset = () => {
        language.value = 'typescript'
      }
      return { language, reset }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <div class="flex flex-col gap-2">
          <Label for="language">Language</Label>
          <Select v-model="language">
            <SelectTrigger id="language" class="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            Selected: <span class="font-mono font-semibold">{{ language }}</span>
          </div>
          <Button size="sm" variant="outline" @click="reset">
            Reset
          </Button>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="disabled-select">Disabled Select</Label>
        <Select disabled>
          <SelectTrigger id="disabled-select" class="w-full">
            <SelectValue placeholder="Can't select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const DisabledItem: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="plan">Plan</Label>
        <Select>
          <SelectTrigger id="plan" class="w-full">
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise" disabled>
              Enterprise (Coming Soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="country">
          Country
          <span class="text-destructive ml-1">*</span>
        </Label>
        <Select>
          <SelectTrigger
            id="country"
            class="w-full"
            aria-invalid="true"
            aria-describedby="country-error"
          >
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
          </SelectContent>
        </Select>
        <p id="country-error" class="text-xs text-destructive">
          Please select your country
        </p>
      </div>
    `,
  }),
}

export const SmallSize: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex flex-col gap-6 max-w-sm">
        <div class="flex flex-col gap-2">
          <Label for="size-sm">Small Size</Label>
          <Select>
            <SelectTrigger id="size-sm" class="w-full" size="sm">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Option 1</SelectItem>
              <SelectItem value="2">Option 2</SelectItem>
              <SelectItem value="3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="size-default">Default Size</Label>
          <Select>
            <SelectTrigger id="size-default" class="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Option 1</SelectItem>
              <SelectItem value="2">Option 2</SelectItem>
              <SelectItem value="3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    `,
  }),
}

export const WithSeparators: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectSeparator,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="timezone">Timezone</Label>
        <Select>
          <SelectTrigger id="timezone" class="w-full">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
            <SelectItem value="mst">Mountain (MST)</SelectItem>
            <SelectItem value="cst">Central (CST)</SelectItem>
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectSeparator />
            <SelectItem value="gmt">GMT</SelectItem>
            <SelectItem value="cet">Central European (CET)</SelectItem>
            <SelectItem value="jst">Japan (JST)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const Countries: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectLabel,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const country = ref('')
      return { country }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="country-select">Country</Label>
        <Select v-model="country">
          <SelectTrigger id="country-select" class="w-full">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>North America</SelectLabel>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="mx">Mexico</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="es">Spain</SelectItem>
              <SelectItem value="it">Italy</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Asia</SelectLabel>
              <SelectItem value="jp">Japan</SelectItem>
              <SelectItem value="cn">China</SelectItem>
              <SelectItem value="in">India</SelectItem>
              <SelectItem value="sg">Singapore</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Oceania</SelectLabel>
              <SelectItem value="au">Australia</SelectItem>
              <SelectItem value="nz">New Zealand</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const FormIntegration: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectLabel,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const formData = ref({
        role: '',
        department: '',
        level: 'mid',
      })

      const errors = ref({
        role: '',
        department: '',
      })

      const handleSubmit = () => {
        errors.value = { role: '', department: '' }

        if (!formData.value.role) {
          errors.value.role = 'Please select a role'
        }

        if (!formData.value.department) {
          errors.value.department = 'Please select a department'
        }

        if (!errors.value.role && !errors.value.department) {
          alert(JSON.stringify(formData.value, null, 2))
        }
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="form-role">
            Role
            <span class="text-destructive ml-1">*</span>
          </Label>
          <Select v-model="formData.role">
            <SelectTrigger
              id="form-role"
              class="w-full"
              :aria-invalid="!!errors.role"
              :aria-describedby="errors.role ? 'role-error' : undefined"
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
            </SelectContent>
          </Select>
          <p v-if="errors.role" id="role-error" class="text-xs text-destructive">
            {{ errors.role }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="form-department">
            Department
            <span class="text-destructive ml-1">*</span>
          </Label>
          <Select v-model="formData.department">
            <SelectTrigger
              id="form-department"
              class="w-full"
              :aria-invalid="!!errors.department"
              :aria-describedby="errors.department ? 'department-error' : undefined"
            >
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Engineering</SelectLabel>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Business</SelectLabel>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p v-if="errors.department" id="department-error" class="text-xs text-destructive">
            {{ errors.department }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="form-level">Experience Level</Label>
          <Select v-model="formData.level">
            <SelectTrigger id="form-level" class="w-full">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="mid">Mid-level</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit">
          Submit
        </Button>
      </form>
    `,
  }),
}

export const ProfileSettings: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const settings = ref({
        language: 'en',
        timezone: 'pst',
        theme: 'system',
      })

      return { settings }
    },
    template: `
      <div class="max-w-md flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Profile Settings</h3>
          <p class="text-sm text-muted-foreground">
            Manage your account preferences
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="settings-language">Language</Label>
          <Select v-model="settings.language">
            <SelectTrigger id="settings-language" class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="settings-timezone">Timezone</Label>
          <Select v-model="settings.timezone">
            <SelectTrigger id="settings-timezone" class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pst">Pacific Time (PST)</SelectItem>
              <SelectItem value="mst">Mountain Time (MST)</SelectItem>
              <SelectItem value="cst">Central Time (CST)</SelectItem>
              <SelectItem value="est">Eastern Time (EST)</SelectItem>
              <SelectItem value="gmt">GMT</SelectItem>
              <SelectItem value="cet">Central European Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="settings-theme">Theme</Label>
          <Select v-model="settings.theme">
            <SelectTrigger id="settings-theme" class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button class="w-full">
          Save Changes
        </Button>
      </div>
    `,
  }),
}

export const InlineLayout: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    template: `
      <div class="flex items-center gap-4 max-w-md">
        <Label for="inline-select" class="w-24 text-right">Status:</Label>
        <Select>
          <SelectTrigger id="inline-select" class="flex-1">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const FilterExample: Story = {
  render: () => ({
    components: {
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const filters = ref({
        status: 'all',
        priority: 'all',
        assignee: 'all',
      })

      return { filters }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-4xl">
        <h3 class="text-lg font-semibold">Task Filters</h3>

        <div class="flex flex-wrap gap-4">
          <div class="flex flex-col gap-2 flex-1 min-w-48">
            <Label for="filter-status">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger id="filter-status" size="sm" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex flex-col gap-2 flex-1 min-w-48">
            <Label for="filter-priority">Priority</Label>
            <Select v-model="filters.priority">
              <SelectTrigger id="filter-priority" size="sm" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex flex-col gap-2 flex-1 min-w-48">
            <Label for="filter-assignee">Assignee</Label>
            <Select v-model="filters.assignee">
              <SelectTrigger id="filter-assignee" size="sm" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="alice">Alice</SelectItem>
                <SelectItem value="bob">Bob</SelectItem>
                <SelectItem value="charlie">Charlie</SelectItem>
                <SelectItem value="diana">Diana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="p-4 bg-muted rounded-md">
          <p class="text-sm">
            Filters:
            <span class="font-mono">{{ JSON.stringify(filters) }}</span>
          </p>
        </div>
      </div>
    `,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: {
      IconBrandGithub,
      IconBrandGitlab,
      IconBrandGoogle,
      IconCloud,
      Label,
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectLabel,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const provider = ref('github')
      return { provider }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="provider">Git Provider</Label>
        <Select v-model="provider">
          <SelectTrigger id="provider" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="github">
              <div class="flex items-center gap-2">
                <IconBrandGithub class="size-4" />
                <span>GitHub</span>
              </div>
            </SelectItem>
            <SelectItem value="gitlab">
              <div class="flex items-center gap-2">
                <IconBrandGitlab class="size-4" />
                <span>GitLab</span>
              </div>
            </SelectItem>
            <SelectItem value="bitbucket">
              <div class="flex items-center gap-2">
                <IconCloud class="size-4" />
                <span>Bitbucket</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const WithIconsAndGroups: Story = {
  render: () => ({
    components: {
      IconBrandGithub,
      IconBrandGitlab,
      IconBrandGoogle,
      IconMail,
      IconPhone,
      Label,
      Select,
      SelectContent,
      SelectGroup,
      SelectItem,
      SelectLabel,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const method = ref('')
      return { method }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="auth-method">Authentication Method</Label>
        <Select v-model="method">
          <SelectTrigger id="auth-method" class="w-full">
            <SelectValue placeholder="Select authentication method" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Social</SelectLabel>
              <SelectItem value="google">
                <div class="flex items-center gap-2">
                  <IconBrandGoogle class="size-4" />
                  <span>Continue with Google</span>
                </div>
              </SelectItem>
              <SelectItem value="github">
                <div class="flex items-center gap-2">
                  <IconBrandGithub class="size-4" />
                  <span>Continue with GitHub</span>
                </div>
              </SelectItem>
              <SelectItem value="gitlab">
                <div class="flex items-center gap-2">
                  <IconBrandGitlab class="size-4" />
                  <span>Continue with GitLab</span>
                </div>
              </SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Traditional</SelectLabel>
              <SelectItem value="email">
                <div class="flex items-center gap-2">
                  <IconMail class="size-4" />
                  <span>Email</span>
                </div>
              </SelectItem>
              <SelectItem value="phone">
                <div class="flex items-center gap-2">
                  <IconPhone class="size-4" />
                  <span>Phone Number</span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const StatusWithIcons: Story = {
  render: () => ({
    components: {
      IconCheck,
      IconCloud,
      IconX,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const status = ref('active')
      return { status }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="status">Status</Label>
        <Select v-model="status">
          <SelectTrigger id="status" class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              <div class="flex items-center gap-2">
                <IconCheck class="size-4 text-green-500" />
                <span>Active</span>
              </div>
            </SelectItem>
            <SelectItem value="pending">
              <div class="flex items-center gap-2">
                <IconCloud class="size-4 text-yellow-500" />
                <span>Pending</span>
              </div>
            </SelectItem>
            <SelectItem value="inactive">
              <div class="flex items-center gap-2">
                <IconX class="size-4 text-red-500" />
                <span>Inactive</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}
