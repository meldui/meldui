import {
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Label> = {
  title: 'Components/Form/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    for: {
      control: 'text',
      description: 'The id of the form element this label is associated with',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A label component that renders an accessible label element. Associates with form controls via the "for" attribute for improved accessibility.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Label },
    template: '<Label for="email">Email address</Label>',
  }),
}

export const WithInput: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" />
      </div>
    `,
  }),
}

export const WithCheckbox: Story = {
  render: () => ({
    components: { Checkbox, Label },
    template: `
      <div class="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label for="terms" class="cursor-pointer">Accept terms and conditions</Label>
      </div>
    `,
  }),
}

export const WithSwitch: Story = {
  render: () => ({
    components: { Label, Switch },
    template: `
      <div class="flex items-center gap-2">
        <Switch id="notifications" />
        <Label for="notifications" class="cursor-pointer">Enable notifications</Label>
      </div>
    `,
  }),
}

export const WithRadioGroup: Story = {
  render: () => ({
    components: { Label, RadioGroup, RadioGroupItem },
    setup() {
      const plan = ref('free')
      return { plan }
    },
    template: `
      <div class="flex flex-col gap-3">
        <Label>Choose your plan</Label>
        <RadioGroup v-model="plan">
          <div class="flex items-center gap-2">
            <RadioGroupItem id="free" value="free" />
            <Label for="free" class="cursor-pointer font-normal">Free</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="pro" value="pro" />
            <Label for="pro" class="cursor-pointer font-normal">Pro</Label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroupItem id="enterprise" value="enterprise" />
            <Label for="enterprise" class="cursor-pointer font-normal">Enterprise</Label>
          </div>
        </RadioGroup>
      </div>
    `,
  }),
}

export const WithTextarea: Story = {
  render: () => ({
    components: { Label, Textarea },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="message">Your message</Label>
        <Textarea id="message" placeholder="Type your message here..." rows="4" />
      </div>
    `,
  }),
}

export const WithSelect: Story = {
  render: () => ({
    components: { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue },
    template: `
      <div class="flex flex-col gap-2 max-w-xs">
        <Label for="country">Country</Label>
        <Select>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    `,
  }),
}

export const Required: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="username">
          Username
          <span class="text-destructive ml-1">*</span>
        </Label>
        <Input id="username" placeholder="Enter username" required />
      </div>
    `,
  }),
}

export const WithHelperText: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password" />
        <p class="text-xs text-muted-foreground">
          Must be at least 8 characters long
        </p>
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="email-error">Email</Label>
        <Input
          id="email-error"
          type="email"
          placeholder="email@example.com"
          aria-invalid="true"
          aria-describedby="email-error-message"
        />
        <p id="email-error-message" class="text-xs text-destructive">
          Please enter a valid email address
        </p>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Checkbox, Input, Label },
    template: `
      <div class="flex flex-col gap-6 max-w-sm">
        <div class="flex flex-col gap-2">
          <Label for="disabled-input">Disabled Input</Label>
          <Input id="disabled-input" disabled placeholder="Can't type here" />
        </div>

        <div class="flex items-center gap-2">
          <Checkbox id="disabled-checkbox" disabled />
          <Label for="disabled-checkbox" class="cursor-pointer">
            Disabled checkbox
          </Label>
        </div>
      </div>
    `,
  }),
}

export const OptionalField: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex flex-col gap-2 max-w-sm">
        <Label for="phone">
          Phone number
          <span class="text-muted-foreground text-xs font-normal ml-1">(optional)</span>
        </Label>
        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
      </div>
    `,
  }),
}

export const FormLayout: Story = {
  render: () => ({
    components: {
      Checkbox,
      Input,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Textarea,
    },
    setup() {
      const newsletter = ref(false)
      return { newsletter }
    },
    template: `
      <form class="max-w-md flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="form-name">
            Full Name
            <span class="text-destructive ml-1">*</span>
          </Label>
          <Input id="form-name" placeholder="John Doe" required />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="form-email">
            Email
            <span class="text-destructive ml-1">*</span>
          </Label>
          <Input id="form-email" type="email" placeholder="john@example.com" required />
          <p class="text-xs text-muted-foreground">
            We'll never share your email with anyone else.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="form-country">Country</Label>
          <Select>
            <SelectTrigger id="form-country">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="form-bio">
            Bio
            <span class="text-muted-foreground text-xs font-normal ml-1">(optional)</span>
          </Label>
          <Textarea id="form-bio" placeholder="Tell us about yourself..." rows="4" />
          <p class="text-xs text-muted-foreground">
            Brief description for your profile. Max 250 characters.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox id="form-newsletter" v-model:checked="newsletter" />
          <Label for="form-newsletter" class="cursor-pointer font-normal">
            Subscribe to our newsletter
          </Label>
        </div>
      </form>
    `,
  }),
}

export const InlineLayout: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="flex items-center gap-4 max-w-md">
        <Label for="inline-input" class="w-24 text-right">Username</Label>
        <Input id="inline-input" placeholder="johndoe" class="flex-1" />
      </div>
    `,
  }),
}

export const GridLayout: Story = {
  render: () => ({
    components: { Input, Label },
    template: `
      <div class="grid grid-cols-2 gap-4 max-w-2xl">
        <div class="flex flex-col gap-2">
          <Label for="first-name">First Name</Label>
          <Input id="first-name" placeholder="John" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="last-name">Last Name</Label>
          <Input id="last-name" placeholder="Doe" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="email-grid">Email</Label>
          <Input id="email-grid" type="email" placeholder="john@example.com" />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="phone-grid">Phone</Label>
          <Input id="phone-grid" type="tel" placeholder="+1 (555) 000-0000" />
        </div>
      </div>
    `,
  }),
}
