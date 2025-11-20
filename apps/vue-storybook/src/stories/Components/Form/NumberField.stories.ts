import { IconMinus, IconPlus } from '@meldui/tabler-vue'
import {
  Button,
  Label,
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof NumberField> = {
  title: 'Components/Form/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Step increment/decrement amount',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A number input field with increment and decrement buttons. Supports min/max constraints, step increments, and keyboard navigation.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <NumberField :default-value="0" class="max-w-xs">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: {
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <NumberField :default-value="10" class="max-w-xs">
        <Label>Quantity</Label>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    `,
  }),
}

export const WithMinMax: Story = {
  render: () => ({
    components: {
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <NumberField :default-value="5" :min="0" :max="10" class="max-w-xs">
        <Label>Rating (0-10)</Label>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
        <p class="text-xs text-muted-foreground mt-1">
          Min: 0, Max: 10
        </p>
      </NumberField>
    `,
  }),
}

export const WithStep: Story = {
  render: () => ({
    components: {
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <div class="flex flex-col gap-6 max-w-xs">
        <NumberField :default-value="0" :step="1">
          <Label>Step by 1</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>

        <NumberField :default-value="0" :step="5">
          <Label>Step by 5</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>

        <NumberField :default-value="0" :step="10" :min="0" :max="100">
          <Label>Step by 10 (0-100)</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    `,
  }),
}

export const DecimalValues: Story = {
  render: () => ({
    components: {
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <NumberField :default-value="0" :step="0.1" :min="0" :max="10" class="max-w-xs">
        <Label>Decimal Value (0.1 steps)</Label>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
        <p class="text-xs text-muted-foreground mt-1">
          Use 0.1 increments between 0 and 10
        </p>
      </NumberField>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: {
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <NumberField :default-value="5" disabled class="max-w-xs">
        <Label>Disabled Number Field</Label>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    setup() {
      const value = ref(0)
      const reset = () => {
        value.value = 0
      }
      return { value, reset }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-xs">
        <NumberField v-model="value" :min="0" :max="100">
          <Label>Counter</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>

        <div class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            Current value: <span class="font-mono font-semibold">{{ value }}</span>
          </div>
          <Button size="sm" variant="outline" @click="reset">
            Reset
          </Button>
        </div>
      </div>
    `,
  }),
}

export const QuantitySelector: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    setup() {
      const quantity = ref(1)
      const price = 29.99

      return { quantity, price }
    },
    template: `
      <div class="flex flex-col gap-6 max-w-md p-6 border rounded-lg">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <h3 class="font-semibold">Product Name</h3>
            <p class="text-sm text-muted-foreground">$29.99 each</p>
          </div>
          <NumberField v-model="quantity" :min="1" :max="99" class="w-32">
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <div class="flex items-center justify-between pt-4 border-t">
          <span class="text-sm font-medium">Total:</span>
          <span class="text-lg font-bold">
            {{ '$' + (quantity * price).toFixed(2) }}
          </span>
        </div>

        <Button class="w-full">
          Add to Cart
        </Button>
      </div>
    `,
  }),
}

export const CustomIcons: Story = {
  render: () => ({
    components: {
      IconMinus,
      IconPlus,
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <NumberField :default-value="0" class="max-w-xs">
        <Label>Custom Icons</Label>
        <NumberFieldContent>
          <NumberFieldDecrement>
            <IconMinus class="w-4 h-4" />
          </NumberFieldDecrement>
          <NumberFieldInput />
          <NumberFieldIncrement>
            <IconPlus class="w-4 h-4" />
          </NumberFieldIncrement>
        </NumberFieldContent>
      </NumberField>
    `,
  }),
}

export const FormIntegration: Story = {
  render: () => ({
    components: {
      Button,
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    setup() {
      const formData = ref({
        adults: 1,
        children: 0,
        rooms: 1,
      })

      const errors = ref({
        adults: '',
      })

      const handleSubmit = () => {
        errors.value.adults = ''

        if (formData.value.adults < 1) {
          errors.value.adults = 'At least 1 adult is required'
          return
        }

        alert(JSON.stringify(formData.value, null, 2))
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-4">
          <NumberField v-model="formData.adults" :min="1" :max="10">
            <Label>
              Adults
              <span class="text-destructive ml-1">*</span>
            </Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
            <p v-if="errors.adults" class="text-xs text-destructive mt-1">
              {{ errors.adults }}
            </p>
          </NumberField>

          <NumberField v-model="formData.children" :min="0" :max="10">
            <Label>Children</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
            <p class="text-xs text-muted-foreground mt-1">
              Ages 0-17
            </p>
          </NumberField>

          <NumberField v-model="formData.rooms" :min="1" :max="5">
            <Label>
              Rooms
              <span class="text-destructive ml-1">*</span>
            </Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <div class="p-4 bg-muted rounded-md">
          <p class="text-sm">
            <strong>{{ formData.adults + formData.children }}</strong> guests in
            <strong>{{ formData.rooms }}</strong> room(s)
          </p>
        </div>

        <Button type="submit">
          Continue
        </Button>
      </form>
    `,
  }),
}

export const InlineLayout: Story = {
  render: () => ({
    components: {
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <div class="flex items-center gap-4 max-w-md">
        <Label class="w-24">Quantity:</Label>
        <NumberField :default-value="1" :min="1" :max="99" class="flex-1">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    `,
  }),
}

export const CompactSize: Story = {
  render: () => ({
    components: {
      Label,
      NumberField,
      NumberFieldContent,
      NumberFieldDecrement,
      NumberFieldIncrement,
      NumberFieldInput,
    },
    template: `
      <div class="flex flex-col gap-6">
        <NumberField :default-value="0" class="w-32">
          <Label>Compact</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>

        <NumberField :default-value="0" class="w-48">
          <Label>Medium</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>

        <NumberField :default-value="0" class="w-64">
          <Label>Large</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
    `,
  }),
}
