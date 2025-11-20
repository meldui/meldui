import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'

const meta: Meta<typeof Form> = {
  title: 'Components/Form/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive form component built on vee-validate with built-in validation, error handling, and accessibility. Supports schema validation with Zod and provides a consistent API for form fields.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const SimpleForm: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          username: z.string().min(2, 'Username must be at least 2 characters'),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-md">
        <Form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="johndoe" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="mt-4">
            Submit
          </Button>
        </Form>
      </div>
    `,
  }),
}

export const LoginForm: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          email: z.string().email('Please enter a valid email address'),
          password: z.string().min(8, 'Password must be at least 8 characters'),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-2xl font-semibold">Sign In</h2>
          <p class="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full mt-2">
            Sign In
          </Button>
        </Form>
      </div>
    `,
  }),
}

export const RegistrationForm: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
    },
    setup() {
      const formSchema = toTypedSchema(
        z
          .object({
            username: z.string().min(3, 'Username must be at least 3 characters'),
            email: z.string().email('Please enter a valid email address'),
            password: z.string().min(8, 'Password must be at least 8 characters'),
            confirmPassword: z.string(),
          })
          .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords don't match",
            path: ['confirmPassword'],
          }),
      )

      const form = useForm({
        validationSchema: formSchema,
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-2xl font-semibold">Create Account</h2>
          <p class="text-sm text-muted-foreground">
            Fill in the details to create your account
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="johndoe" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Choose a unique username
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full mt-2">
            Create Account
          </Button>
        </Form>
      </div>
    `,
  }),
}

export const ProfileForm: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
      Textarea,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          firstName: z.string().min(1, 'First name is required'),
          lastName: z.string().min(1, 'Last name is required'),
          email: z.string().email('Please enter a valid email address'),
          bio: z.string().max(200, 'Bio must be less than 200 characters').optional(),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
        initialValues: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          bio: 'Software developer with a passion for building great products.',
        },
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-2xl p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-2xl font-semibold">Edit Profile</h2>
          <p class="text-sm text-muted-foreground">
            Update your profile information
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-4">
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Your email address for notifications
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="bio">
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself..." v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Brief description for your profile (max 200 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex items-center gap-2">
            <Button type="submit">
              Save Changes
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    `,
  }),
}

export const WithSelect: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
          country: z.string({ required_error: 'Please select a country' }),
          language: z.string({ required_error: 'Please select a language' }),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-xl font-semibold">Preferences</h2>
          <p class="text-sm text-muted-foreground">
            Set your preferences
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your name" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="country">
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="in">India</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="language">
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Your preferred language for the interface
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full mt-2">
            Save Preferences
          </Button>
        </Form>
      </div>
    `,
  }),
}

export const WithCheckbox: Story = {
  render: () => ({
    components: {
      Button,
      Checkbox,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          email: z.string().email('Please enter a valid email address'),
          marketing: z.boolean(),
          terms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms and conditions',
          }),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
        initialValues: {
          marketing: false,
          terms: false,
        },
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-xl font-semibold">Newsletter Signup</h2>
          <p class="text-sm text-muted-foreground">
            Subscribe to our newsletter
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="marketing">
            <FormItem class="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox :checked="value" @update:checked="handleChange" />
              </FormControl>
              <div class="flex flex-col gap-1">
                <FormLabel class="font-normal">
                  Send me marketing emails
                </FormLabel>
                <FormDescription>
                  Receive updates about new products and features
                </FormDescription>
              </div>
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="terms">
            <FormItem class="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox :checked="value" @update:checked="handleChange" />
              </FormControl>
              <div class="flex flex-col gap-1">
                <FormLabel>
                  I accept the terms and conditions
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full mt-2">
            Subscribe
          </Button>
        </Form>
      </div>
    `,
  }),
}

export const WithRadioGroup: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      RadioGroup,
      RadioGroupItem,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          plan: z.enum(['free', 'pro', 'enterprise'], {
            required_error: 'Please select a plan',
          }),
          billing: z.enum(['monthly', 'yearly']),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
        initialValues: {
          billing: 'monthly',
        },
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-xl font-semibold">Choose Your Plan</h2>
          <p class="text-sm text-muted-foreground">
            Select a plan that fits your needs
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-6">
          <FormField v-slot="{ componentField }" name="plan">
            <FormItem>
              <FormLabel>Subscription Plan</FormLabel>
              <FormControl>
                <RadioGroup v-bind="componentField">
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="free" id="free" />
                    <FormLabel for="free" class="font-normal cursor-pointer">
                      Free - $0/month
                    </FormLabel>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="pro" id="pro" />
                    <FormLabel for="pro" class="font-normal cursor-pointer">
                      Pro - $19/month
                    </FormLabel>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="enterprise" id="enterprise" />
                    <FormLabel for="enterprise" class="font-normal cursor-pointer">
                      Enterprise - Contact us
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="billing">
            <FormItem>
              <FormLabel>Billing Cycle</FormLabel>
              <FormControl>
                <RadioGroup v-bind="componentField">
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <FormLabel for="monthly" class="font-normal cursor-pointer">
                      Monthly
                    </FormLabel>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <FormLabel for="yearly" class="font-normal cursor-pointer">
                      Yearly (Save 20%)
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Choose how often you want to be billed
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full">
            Continue
          </Button>
        </Form>
      </div>
    `,
  }),
}

export const WithSwitch: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Switch,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          notifications: z.boolean(),
          marketing: z.boolean(),
          security: z.boolean(),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
        initialValues: {
          notifications: true,
          marketing: false,
          security: true,
        },
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-xl font-semibold">Notification Settings</h2>
          <p class="text-sm text-muted-foreground">
            Manage your notification preferences
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-6">
          <FormField v-slot="{ value, handleChange }" name="notifications">
            <FormItem class="flex flex-row items-start gap-3 justify-between space-y-0">
              <div class="flex flex-col gap-1">
                <FormLabel>Push Notifications</FormLabel>
                <FormDescription>
                  Receive notifications on this device
                </FormDescription>
              </div>
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="marketing">
            <FormItem class="flex flex-row items-start gap-3 justify-between space-y-0">
              <div class="flex flex-col gap-1">
                <FormLabel>Marketing Emails</FormLabel>
                <FormDescription>
                  Receive updates about new products and features
                </FormDescription>
              </div>
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="security">
            <FormItem class="flex flex-row items-start gap-3 justify-between space-y-0">
              <div class="flex flex-col gap-1">
                <FormLabel>Security Alerts</FormLabel>
                <FormDescription>
                  Get notified about important security updates
                </FormDescription>
              </div>
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full mt-2">
            Save Settings
          </Button>
        </Form>
      </div>
    `,
  }),
}

export const ComplexForm: Story = {
  render: () => ({
    components: {
      Button,
      Checkbox,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
      RadioGroup,
      RadioGroupItem,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Textarea,
    },
    setup() {
      const formSchema = toTypedSchema(
        z.object({
          companyName: z.string().min(2, 'Company name must be at least 2 characters'),
          industry: z.string({ required_error: 'Please select an industry' }),
          size: z.enum(['1-10', '11-50', '51-200', '201-500', '500+']),
          website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
          description: z.string().min(20, 'Description must be at least 20 characters'),
          newsletter: z.boolean(),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
        initialValues: {
          size: '1-10',
          newsletter: false,
        },
      })

      const onSubmit = form.handleSubmit((values) => {
        alert(JSON.stringify(values, null, 2))
      })

      return { form, onSubmit }
    },
    template: `
      <div class="max-w-2xl p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-2xl font-semibold">Company Information</h2>
          <p class="text-sm text-muted-foreground">
            Tell us about your company
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-6">
          <div class="grid grid-cols-2 gap-4">
            <FormField v-slot="{ componentField }" name="companyName">
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Acme Inc." v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="industry">
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField v-slot="{ componentField }" name="size">
            <FormItem>
              <FormLabel>Company Size</FormLabel>
              <FormControl>
                <RadioGroup v-bind="componentField" class="flex flex-wrap gap-4">
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="1-10" id="size-1-10" />
                    <FormLabel for="size-1-10" class="font-normal cursor-pointer">
                      1-10
                    </FormLabel>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="11-50" id="size-11-50" />
                    <FormLabel for="size-11-50" class="font-normal cursor-pointer">
                      11-50
                    </FormLabel>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="51-200" id="size-51-200" />
                    <FormLabel for="size-51-200" class="font-normal cursor-pointer">
                      51-200
                    </FormLabel>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="201-500" id="size-201-500" />
                    <FormLabel for="size-201-500" class="font-normal cursor-pointer">
                      201-500
                    </FormLabel>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioGroupItem value="500+" id="size-500" />
                    <FormLabel for="size-500" class="font-normal cursor-pointer">
                      500+
                    </FormLabel>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Number of employees
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="website">
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="description">
            <FormItem>
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your company..."
                  class="min-h-32"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                Provide a brief description of your company (min 20 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ value, handleChange }" name="newsletter">
            <FormItem class="flex flex-row items-start gap-3 space-y-0">
              <FormControl>
                <Checkbox :checked="value" @update:checked="handleChange" />
              </FormControl>
              <div class="flex flex-col gap-1">
                <FormLabel class="font-normal">
                  Subscribe to our newsletter
                </FormLabel>
                <FormDescription>
                  Receive updates about industry trends and insights
                </FormDescription>
              </div>
            </FormItem>
          </FormField>

          <div class="flex items-center gap-2">
            <Button type="submit">
              Submit
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    `,
  }),
}

export const ContactForm: Story = {
  render: () => ({
    components: {
      Button,
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
      Input,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Textarea,
    },
    setup() {
      const loading = ref(false)

      const formSchema = toTypedSchema(
        z.object({
          name: z.string().min(2, 'Name must be at least 2 characters'),
          email: z.string().email('Please enter a valid email address'),
          subject: z.string({ required_error: 'Please select a subject' }),
          message: z.string().min(10, 'Message must be at least 10 characters'),
        }),
      )

      const form = useForm({
        validationSchema: formSchema,
      })

      const onSubmit = form.handleSubmit(async (values) => {
        loading.value = true
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        loading.value = false
        alert(JSON.stringify(values, null, 2))
        form.resetForm()
      })

      return { form, onSubmit, loading }
    },
    template: `
      <div class="max-w-lg p-6 border rounded-lg">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-2xl font-semibold">Contact Us</h2>
          <p class="text-sm text-muted-foreground">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <Form @submit="onSubmit" class="flex flex-col gap-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your name" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="subject">
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="sales">Sales Question</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="message">
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message..."
                  class="min-h-32"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                Please provide as much detail as possible
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" :disabled="loading" class="w-full mt-2">
            {{ loading ? 'Sending...' : 'Send Message' }}
          </Button>
        </Form>
      </div>
    `,
  }),
}
