import { Button, Card, CardContent, CardHeader, Label, Separator, Switch } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Switch> = {
  title: 'Components/Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A toggle switch component for binary on/off states. Provides accessible keyboard navigation and visual feedback. Built on reka-ui.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Switch },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `
      <Switch v-model="checked" />
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Label, Switch },
    setup() {
      const notifications = ref(true)
      return { notifications }
    },
    template: `
      <div class="flex items-center gap-2">
        <Switch id="notifications" v-model="notifications" />
        <Label for="notifications" class="cursor-pointer">Enable notifications</Label>
      </div>
    `,
  }),
}

export const Checked: Story = {
  render: () => ({
    components: { Label, Switch },
    setup() {
      const checked = ref(true)
      return { checked }
    },
    template: `
      <div class="flex items-center gap-2">
        <Switch id="checked-switch" v-model="checked" />
        <Label for="checked-switch" class="cursor-pointer">Checked by default</Label>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Button, Label, Switch },
    setup() {
      const enabled = ref(false)
      const toggle = () => {
        enabled.value = !enabled.value
      }
      return { enabled, toggle }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <div class="flex items-center gap-2">
          <Switch id="controlled" v-model="enabled" />
          <Label for="controlled" class="cursor-pointer">Feature enabled</Label>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            Status: <span class="font-semibold">{{ enabled ? 'On' : 'Off' }}</span>
          </div>
          <Button size="sm" variant="outline" @click="toggle">
            Toggle
          </Button>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Label, Switch },
    template: `
      <div class="flex flex-col gap-4 max-w-sm">
        <div class="flex items-center gap-2">
          <Switch id="disabled-off" disabled />
          <Label for="disabled-off" class="cursor-not-allowed">Disabled (Off)</Label>
        </div>

        <div class="flex items-center gap-2">
          <Switch id="disabled-on" :checked="true" disabled />
          <Label for="disabled-on" class="cursor-not-allowed">Disabled (On)</Label>
        </div>
      </div>
    `,
  }),
}

export const WithDescription: Story = {
  render: () => ({
    components: { Label, Switch },
    setup() {
      const marketing = ref(false)
      return { marketing }
    },
    template: `
      <div class="flex items-start gap-3 max-w-md">
        <Switch id="marketing" v-model="marketing" class="mt-1" />
        <div class="flex flex-col gap-1">
          <Label for="marketing" class="cursor-pointer">Marketing emails</Label>
          <p class="text-sm text-muted-foreground">
            Receive emails about new products, features, and more.
          </p>
        </div>
      </div>
    `,
  }),
}

export const MultipleSettings: Story = {
  render: () => ({
    components: { Label, Switch },
    setup() {
      const settings = ref({
        notifications: true,
        marketing: false,
        updates: true,
        newsletter: false,
      })
      return { settings }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <div class="flex items-center justify-between">
          <Label for="notifications-setting" class="cursor-pointer">Push notifications</Label>
          <Switch id="notifications-setting" v-model="settings.notifications" />
        </div>

        <div class="flex items-center justify-between">
          <Label for="marketing-setting" class="cursor-pointer">Marketing emails</Label>
          <Switch id="marketing-setting" v-model="settings.marketing" />
        </div>

        <div class="flex items-center justify-between">
          <Label for="updates-setting" class="cursor-pointer">Product updates</Label>
          <Switch id="updates-setting" v-model="settings.updates" />
        </div>

        <div class="flex items-center justify-between">
          <Label for="newsletter-setting" class="cursor-pointer">Weekly newsletter</Label>
          <Switch id="newsletter-setting" v-model="settings.newsletter" />
        </div>
      </div>
    `,
  }),
}

export const SettingsCard: Story = {
  render: () => ({
    components: { Card, CardContent, CardHeader, Label, Separator, Switch },
    setup() {
      const settings = ref({
        notifications: true,
        sound: false,
        vibration: true,
      })
      return { settings }
    },
    template: `
      <Card class="max-w-md">
        <CardHeader>
          <h3 class="text-lg font-semibold">Notification Settings</h3>
          <p class="text-sm text-muted-foreground">
            Manage how you receive notifications
          </p>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <div class="flex items-start gap-3">
            <Switch id="card-notifications" v-model="settings.notifications" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="card-notifications" class="cursor-pointer">Push Notifications</Label>
              <p class="text-sm text-muted-foreground">
                Receive push notifications on this device
              </p>
            </div>
          </div>

          <Separator />

          <div class="flex items-start gap-3">
            <Switch id="card-sound" v-model="settings.sound" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="card-sound" class="cursor-pointer">Sound</Label>
              <p class="text-sm text-muted-foreground">
                Play a sound when receiving notifications
              </p>
            </div>
          </div>

          <Separator />

          <div class="flex items-start gap-3">
            <Switch id="card-vibration" v-model="settings.vibration" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="card-vibration" class="cursor-pointer">Vibration</Label>
              <p class="text-sm text-muted-foreground">
                Vibrate when receiving notifications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    `,
  }),
}

export const PrivacySettings: Story = {
  render: () => ({
    components: { Label, Separator, Switch },
    setup() {
      const privacy = ref({
        publicProfile: true,
        showEmail: false,
        showActivity: false,
        allowMessages: true,
      })
      return { privacy }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Privacy & Visibility</h3>
          <p class="text-sm text-muted-foreground">
            Control who can see your information
          </p>
        </div>

        <Separator />

        <div class="flex items-start gap-3">
          <Switch id="public-profile" v-model="privacy.publicProfile" class="mt-1" />
          <div class="flex flex-col gap-1">
            <Label for="public-profile" class="cursor-pointer font-medium">Public Profile</Label>
            <p class="text-sm text-muted-foreground">
              Make your profile visible to everyone
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <Switch id="show-email" v-model="privacy.showEmail" class="mt-1" />
          <div class="flex flex-col gap-1">
            <Label for="show-email" class="cursor-pointer font-medium">Show Email</Label>
            <p class="text-sm text-muted-foreground">
              Display your email address on your profile
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <Switch id="show-activity" v-model="privacy.showActivity" class="mt-1" />
          <div class="flex flex-col gap-1">
            <Label for="show-activity" class="cursor-pointer font-medium">Show Activity Status</Label>
            <p class="text-sm text-muted-foreground">
              Let others see when you're online
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <Switch id="allow-messages" v-model="privacy.allowMessages" class="mt-1" />
          <div class="flex flex-col gap-1">
            <Label for="allow-messages" class="cursor-pointer font-medium">Allow Direct Messages</Label>
            <p class="text-sm text-muted-foreground">
              Anyone can send you direct messages
            </p>
          </div>
        </div>
      </div>
    `,
  }),
}

export const FeatureToggles: Story = {
  render: () => ({
    components: { Label, Switch },
    setup() {
      const features = ref({
        darkMode: false,
        animations: true,
        autoSave: true,
        spellCheck: true,
      })
      return { features }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md p-6 border rounded-lg">
        <h3 class="text-lg font-semibold">Feature Toggles</h3>

        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <Label for="dark-mode" class="cursor-pointer font-medium">Dark Mode</Label>
            <p class="text-xs text-muted-foreground">Use dark theme</p>
          </div>
          <Switch id="dark-mode" v-model="features.darkMode" />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <Label for="animations" class="cursor-pointer font-medium">Animations</Label>
            <p class="text-xs text-muted-foreground">Enable UI animations</p>
          </div>
          <Switch id="animations" v-model="features.animations" />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <Label for="auto-save" class="cursor-pointer font-medium">Auto-save</Label>
            <p class="text-xs text-muted-foreground">Automatically save changes</p>
          </div>
          <Switch id="auto-save" v-model="features.autoSave" />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <Label for="spell-check" class="cursor-pointer font-medium">Spell Check</Label>
            <p class="text-xs text-muted-foreground">Check spelling as you type</p>
          </div>
          <Switch id="spell-check" v-model="features.spellCheck" />
        </div>
      </div>
    `,
  }),
}

export const FormIntegration: Story = {
  render: () => ({
    components: { Button, Label, Separator, Switch },
    setup() {
      const formData = ref({
        agreeToTerms: false,
        subscribeNewsletter: false,
        enableNotifications: true,
      })

      const errors = ref({
        agreeToTerms: '',
      })

      const handleSubmit = () => {
        errors.value.agreeToTerms = ''

        if (!formData.value.agreeToTerms) {
          errors.value.agreeToTerms = 'You must agree to the terms and conditions'
          return
        }

        alert(JSON.stringify(formData.value, null, 2))
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-md flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Account Setup</h3>
          <p class="text-sm text-muted-foreground">
            Configure your account preferences
          </p>
        </div>

        <Separator />

        <div class="flex flex-col gap-4">
          <div class="flex items-start gap-3">
            <Switch
              id="terms"
              v-model="formData.agreeToTerms"
              :aria-invalid="!!errors.agreeToTerms"
              class="mt-1"
            />
            <div class="flex flex-col gap-1">
              <Label for="terms" class="cursor-pointer">
                I agree to the terms and conditions
                <span class="text-destructive ml-1">*</span>
              </Label>
              <p v-if="errors.agreeToTerms" class="text-xs text-destructive">
                {{ errors.agreeToTerms }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Switch id="newsletter" v-model="formData.subscribeNewsletter" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="newsletter" class="cursor-pointer">Subscribe to newsletter</Label>
              <p class="text-sm text-muted-foreground">
                Get weekly updates and tips
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <Switch id="notifications-form" v-model="formData.enableNotifications" class="mt-1" />
            <div class="flex flex-col gap-1">
              <Label for="notifications-form" class="cursor-pointer">Enable notifications</Label>
              <p class="text-sm text-muted-foreground">
                Receive important account updates
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" class="w-full">
          Create Account
        </Button>
      </form>
    `,
  }),
}

export const AccessibilitySettings: Story = {
  render: () => ({
    components: { Label, Switch },
    setup() {
      const accessibility = ref({
        highContrast: false,
        largeText: false,
        reduceMotion: false,
        screenReader: false,
      })
      return { accessibility }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Accessibility</h3>
          <p class="text-sm text-muted-foreground">
            Customize your viewing experience
          </p>
        </div>

        <div class="flex items-center justify-between">
          <Label for="high-contrast" class="cursor-pointer">High Contrast Mode</Label>
          <Switch id="high-contrast" v-model="accessibility.highContrast" />
        </div>

        <div class="flex items-center justify-between">
          <Label for="large-text" class="cursor-pointer">Large Text</Label>
          <Switch id="large-text" v-model="accessibility.largeText" />
        </div>

        <div class="flex items-center justify-between">
          <Label for="reduce-motion" class="cursor-pointer">Reduce Motion</Label>
          <Switch id="reduce-motion" v-model="accessibility.reduceMotion" />
        </div>

        <div class="flex items-center justify-between">
          <Label for="screen-reader" class="cursor-pointer">Screen Reader Optimized</Label>
          <Switch id="screen-reader" v-model="accessibility.screenReader" />
        </div>
      </div>
    `,
  }),
}

export const InlineLayout: Story = {
  render: () => ({
    components: { Label, Switch },
    setup() {
      const enabled = ref(true)
      return { enabled }
    },
    template: `
      <div class="flex items-center gap-4 max-w-md">
        <Label for="inline" class="w-32 text-right">Feature:</Label>
        <Switch id="inline" v-model="enabled" />
        <span class="text-sm text-muted-foreground">{{ enabled ? 'Enabled' : 'Disabled' }}</span>
      </div>
    `,
  }),
}
