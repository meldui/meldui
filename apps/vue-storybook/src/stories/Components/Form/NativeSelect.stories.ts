import { Button, Label, NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof NativeSelect> = {
  title: 'Components/Form/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple options can be selected',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native HTML select element with custom styling. Provides better performance and native mobile behavior compared to custom select components.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NativeSelect, NativeSelectOption },
    template: `
      <NativeSelect class="w-64">
        <NativeSelectOption value="">Select an option</NativeSelectOption>
        <NativeSelectOption value="option1">Option 1</NativeSelectOption>
        <NativeSelectOption value="option2">Option 2</NativeSelectOption>
        <NativeSelectOption value="option3">Option 3</NativeSelectOption>
      </NativeSelect>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOption },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="status">Status</Label>
        <NativeSelect id="status">
          <NativeSelectOption value="">Select status</NativeSelectOption>
          <NativeSelectOption value="todo">Todo</NativeSelectOption>
          <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
          <NativeSelectOption value="done">Done</NativeSelectOption>
          <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
        </NativeSelect>
      </div>
    `,
  }),
}

export const WithOptGroups: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOptGroup, NativeSelectOption },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="department">Department</Label>
        <NativeSelect id="department">
          <NativeSelectOption value="">Select department</NativeSelectOption>
          <NativeSelectOptGroup label="Engineering">
            <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
            <NativeSelectOption value="backend">Backend</NativeSelectOption>
            <NativeSelectOption value="devops">DevOps</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Sales">
            <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
            <NativeSelectOption value="account-manager">Account Manager</NativeSelectOption>
            <NativeSelectOption value="sales-director">Sales Director</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Marketing">
            <NativeSelectOption value="content">Content Marketing</NativeSelectOption>
            <NativeSelectOption value="digital">Digital Marketing</NativeSelectOption>
            <NativeSelectOption value="brand">Brand Marketing</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOption },
    setup() {
      const priority = ref('medium')
      return { priority }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <div class="flex flex-col gap-2">
          <Label for="priority">Priority</Label>
          <NativeSelect id="priority" v-model="priority">
            <NativeSelectOption value="low">Low</NativeSelectOption>
            <NativeSelectOption value="medium">Medium</NativeSelectOption>
            <NativeSelectOption value="high">High</NativeSelectOption>
            <NativeSelectOption value="critical">Critical</NativeSelectOption>
          </NativeSelect>
        </div>
        <div class="text-sm text-muted-foreground">
          Selected: <span class="font-mono font-semibold">{{ priority }}</span>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOption },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="disabled">Disabled Select</Label>
        <NativeSelect id="disabled" disabled>
          <NativeSelectOption value="">Select priority</NativeSelectOption>
          <NativeSelectOption value="low">Low</NativeSelectOption>
          <NativeSelectOption value="medium">Medium</NativeSelectOption>
          <NativeSelectOption value="high">High</NativeSelectOption>
        </NativeSelect>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOption },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="role">Role</Label>
        <NativeSelect
          id="role"
          aria-invalid="true"
          aria-describedby="role-error"
        >
          <NativeSelectOption value="">Select role</NativeSelectOption>
          <NativeSelectOption value="admin">Admin</NativeSelectOption>
          <NativeSelectOption value="editor">Editor</NativeSelectOption>
          <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
        </NativeSelect>
        <p id="role-error" class="text-xs text-destructive">
          Please select a role
        </p>
      </div>
    `,
  }),
}

export const MultipleSelect: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOption },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="skills">Skills (hold Ctrl/Cmd to select multiple)</Label>
        <NativeSelect id="skills" multiple size="5">
          <NativeSelectOption value="javascript">JavaScript</NativeSelectOption>
          <NativeSelectOption value="typescript">TypeScript</NativeSelectOption>
          <NativeSelectOption value="vue">Vue.js</NativeSelectOption>
          <NativeSelectOption value="react">React</NativeSelectOption>
          <NativeSelectOption value="angular">Angular</NativeSelectOption>
          <NativeSelectOption value="node">Node.js</NativeSelectOption>
          <NativeSelectOption value="python">Python</NativeSelectOption>
        </NativeSelect>
        <p class="text-xs text-muted-foreground">
          Select multiple options by holding Ctrl (Windows) or Cmd (Mac)
        </p>
      </div>
    `,
  }),
}

export const Countries: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOption },
    setup() {
      const country = ref('')
      return { country }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="country">Country</Label>
        <NativeSelect id="country" v-model="country">
          <NativeSelectOption value="">Select a country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="au">Australia</NativeSelectOption>
          <NativeSelectOption value="de">Germany</NativeSelectOption>
          <NativeSelectOption value="fr">France</NativeSelectOption>
          <NativeSelectOption value="jp">Japan</NativeSelectOption>
          <NativeSelectOption value="in">India</NativeSelectOption>
        </NativeSelect>
      </div>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Label, NativeSelect, NativeSelectOption },
    template: `
      <div class="flex flex-col gap-6 max-w-sm">
        <div class="flex flex-col gap-2">
          <Label for="size-default">Default Size</Label>
          <NativeSelect id="size-default">
            <NativeSelectOption value="">Select</NativeSelectOption>
            <NativeSelectOption value="1">Option 1</NativeSelectOption>
            <NativeSelectOption value="2">Option 2</NativeSelectOption>
          </NativeSelect>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="size-custom">Custom Width</Label>
          <NativeSelect id="size-custom" class="w-full">
            <NativeSelectOption value="">Select</NativeSelectOption>
            <NativeSelectOption value="1">Full Width Option 1</NativeSelectOption>
            <NativeSelectOption value="2">Full Width Option 2</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
    `,
  }),
}

export const FormIntegration: Story = {
  render: () => ({
    components: { Button, Label, NativeSelect, NativeSelectOptGroup, NativeSelectOption },
    setup() {
      const formData = ref({
        status: '',
        priority: 'medium',
        assignee: '',
      })

      const errors = ref({
        status: '',
        assignee: '',
      })

      const handleSubmit = () => {
        errors.value = { status: '', assignee: '' }

        if (!formData.value.status) {
          errors.value.status = 'Please select a status'
        }

        if (!formData.value.assignee) {
          errors.value.assignee = 'Please select an assignee'
        }

        if (!errors.value.status && !errors.value.assignee) {
          alert(JSON.stringify(formData.value, null, 2))
        }
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="task-status">
            Status
            <span class="text-destructive ml-1">*</span>
          </Label>
          <NativeSelect
            id="task-status"
            v-model="formData.status"
            :aria-invalid="!!errors.status"
            :aria-describedby="errors.status ? 'status-error' : undefined"
          >
            <NativeSelectOption value="">Select status</NativeSelectOption>
            <NativeSelectOption value="todo">Todo</NativeSelectOption>
            <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
            <NativeSelectOption value="review">In Review</NativeSelectOption>
            <NativeSelectOption value="done">Done</NativeSelectOption>
          </NativeSelect>
          <p v-if="errors.status" id="status-error" class="text-xs text-destructive">
            {{ errors.status }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="task-priority">Priority</Label>
          <NativeSelect id="task-priority" v-model="formData.priority">
            <NativeSelectOption value="low">Low</NativeSelectOption>
            <NativeSelectOption value="medium">Medium</NativeSelectOption>
            <NativeSelectOption value="high">High</NativeSelectOption>
            <NativeSelectOption value="critical">Critical</NativeSelectOption>
          </NativeSelect>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="task-assignee">
            Assignee
            <span class="text-destructive ml-1">*</span>
          </Label>
          <NativeSelect
            id="task-assignee"
            v-model="formData.assignee"
            :aria-invalid="!!errors.assignee"
            :aria-describedby="errors.assignee ? 'assignee-error' : undefined"
          >
            <NativeSelectOption value="">Select assignee</NativeSelectOption>
            <NativeSelectOptGroup label="Engineering">
              <NativeSelectOption value="alice">Alice (Frontend)</NativeSelectOption>
              <NativeSelectOption value="bob">Bob (Backend)</NativeSelectOption>
              <NativeSelectOption value="charlie">Charlie (DevOps)</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Design">
              <NativeSelectOption value="diana">Diana (UI/UX)</NativeSelectOption>
              <NativeSelectOption value="eve">Eve (Product)</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
          <p v-if="errors.assignee" id="assignee-error" class="text-xs text-destructive">
            {{ errors.assignee }}
          </p>
        </div>

        <Button type="submit">
          Create Task
        </Button>
      </form>
    `,
  }),
}

export const DynamicOptions: Story = {
  render: () => ({
    components: { Button, Label, NativeSelect, NativeSelectOption },
    setup() {
      const category = ref('')
      const item = ref('')

      const items = ref<Record<string, string[]>>({
        fruits: ['Apple', 'Banana', 'Orange', 'Grape'],
        vegetables: ['Carrot', 'Broccoli', 'Spinach', 'Tomato'],
        dairy: ['Milk', 'Cheese', 'Yogurt', 'Butter'],
      })

      const availableItems = ref<string[]>([])

      const handleCategoryChange = () => {
        item.value = ''
        availableItems.value = category.value ? items.value[category.value] : []
      }

      return { category, item, availableItems, handleCategoryChange }
    },
    template: `
      <div class="flex flex-col gap-6 max-w-md">
        <div class="flex flex-col gap-2">
          <Label for="category">Category</Label>
          <NativeSelect
            id="category"
            v-model="category"
            @change="handleCategoryChange"
          >
            <NativeSelectOption value="">Select category</NativeSelectOption>
            <NativeSelectOption value="fruits">Fruits</NativeSelectOption>
            <NativeSelectOption value="vegetables">Vegetables</NativeSelectOption>
            <NativeSelectOption value="dairy">Dairy</NativeSelectOption>
          </NativeSelect>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="item">Item</Label>
          <NativeSelect
            id="item"
            v-model="item"
            :disabled="!category"
          >
            <NativeSelectOption value="">
              {{ category ? 'Select item' : 'Select category first' }}
            </NativeSelectOption>
            <NativeSelectOption
              v-for="itemName in availableItems"
              :key="itemName"
              :value="itemName.toLowerCase()"
            >
              {{ itemName }}
            </NativeSelectOption>
          </NativeSelect>
        </div>

        <div v-if="category && item" class="p-4 bg-muted rounded-md">
          <p class="text-sm">
            Selected: <span class="font-semibold">{{ item }}</span> from
            <span class="font-semibold">{{ category }}</span>
          </p>
        </div>
      </div>
    `,
  }),
}
