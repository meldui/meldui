import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'pill'],
      description: 'Visual style variant of the tabs (line = underline, pill = background)',
    },
    defaultValue: {
      control: 'text',
      description: 'The default active tab value',
    },
    modelValue: {
      control: 'text',
      description: 'The controlled active tab value',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A set of layered sections of content (tab panels) that display one panel at a time. Allows users to switch between different views without leaving the page.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Tabs, TabsContent, TabsList, TabsTrigger },
    template: `
      <Tabs default-value="account" class="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p class="text-sm">Make changes to your account here.</p>
        </TabsContent>
        <TabsContent value="password">
          <p class="text-sm">Change your password here.</p>
        </TabsContent>
      </Tabs>
    `,
  }),
}

export const WithForm: Story = {
  render: () => ({
    components: {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
      Input,
      Label,
      Button,
    },
    template: `
      <Tabs default-value="account" class="w-[400px]">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <Label for="name">Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="username">Username</Label>
                <Input id="username" placeholder="@johndoe" />
              </div>
              <Button>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <Label for="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="new">New password</Label>
                <Input id="new" type="password" />
              </div>
              <Button>Save password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    `,
  }),
}

export const MultipleTabsContent: Story = {
  render: () => ({
    components: { Tabs, TabsContent, TabsList, TabsTrigger },
    template: `
      <Tabs default-value="overview" class="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Overview</h3>
            <p class="text-sm text-muted-foreground">
              View a summary of your account activity and key metrics.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="analytics" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Analytics</h3>
            <p class="text-sm text-muted-foreground">
              Detailed analytics and insights about your usage patterns.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reports" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Reports</h3>
            <p class="text-sm text-muted-foreground">
              Generate and download comprehensive reports.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Notifications</h3>
            <p class="text-sm text-muted-foreground">
              Manage your notification preferences and settings.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Tabs, TabsContent, TabsList, TabsTrigger, Button },
    setup() {
      const activeTab = ref('tab1')
      const goToNext = () => {
        const tabs = ['tab1', 'tab2', 'tab3']
        const currentIndex = tabs.indexOf(activeTab.value)
        if (currentIndex < tabs.length - 1) {
          activeTab.value = tabs[currentIndex + 1]
        }
      }
      return { activeTab, goToNext }
    },
    template: `
      <div class="flex flex-col gap-4 w-[400px]">
        <Tabs v-model="activeTab">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="tab1">Step 1</TabsTrigger>
            <TabsTrigger value="tab2">Step 2</TabsTrigger>
            <TabsTrigger value="tab3">Step 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div class="flex flex-col gap-4 py-4">
              <p class="text-sm">Complete the first step of the process.</p>
              <Button @click="goToNext">Next Step</Button>
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div class="flex flex-col gap-4 py-4">
              <p class="text-sm">Complete the second step of the process.</p>
              <Button @click="goToNext">Next Step</Button>
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div class="flex flex-col gap-4 py-4">
              <p class="text-sm">Final step completed!</p>
              <Button @click="activeTab = 'tab1'">Start Over</Button>
            </div>
          </TabsContent>
        </Tabs>
        <p class="text-xs text-muted-foreground">Current tab: {{ activeTab }}</p>
      </div>
    `,
  }),
}

export const VerticalOrientation: Story = {
  render: () => ({
    components: { Tabs, TabsContent, TabsList, TabsTrigger },
    template: `
      <Tabs default-value="personal" class="flex gap-6">
        <TabsList class="flex flex-col h-auto">
          <TabsTrigger value="personal" class="w-full">Personal Info</TabsTrigger>
          <TabsTrigger value="security" class="w-full">Security</TabsTrigger>
          <TabsTrigger value="preferences" class="w-full">Preferences</TabsTrigger>
          <TabsTrigger value="billing" class="w-full">Billing</TabsTrigger>
        </TabsList>
        <div class="flex-1">
          <TabsContent value="personal">
            <h3 class="text-lg font-semibold mb-2">Personal Information</h3>
            <p class="text-sm text-muted-foreground">Update your personal details and profile information.</p>
          </TabsContent>
          <TabsContent value="security">
            <h3 class="text-lg font-semibold mb-2">Security Settings</h3>
            <p class="text-sm text-muted-foreground">Manage your password, 2FA, and security preferences.</p>
          </TabsContent>
          <TabsContent value="preferences">
            <h3 class="text-lg font-semibold mb-2">Preferences</h3>
            <p class="text-sm text-muted-foreground">Customize your app experience and display settings.</p>
          </TabsContent>
          <TabsContent value="billing">
            <h3 class="text-lg font-semibold mb-2">Billing & Subscription</h3>
            <p class="text-sm text-muted-foreground">View and manage your subscription and payment methods.</p>
          </TabsContent>
        </div>
      </Tabs>
    `,
  }),
}

export const DisabledTab: Story = {
  render: () => ({
    components: { Tabs, TabsContent, TabsList, TabsTrigger },
    template: `
      <Tabs default-value="available" class="w-[400px]">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="locked" disabled>Locked</TabsTrigger>
          <TabsTrigger value="premium" disabled>Premium</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <p class="text-sm py-4">This tab is available for everyone.</p>
        </TabsContent>
        <TabsContent value="locked">
          <p class="text-sm py-4">This content is locked.</p>
        </TabsContent>
        <TabsContent value="premium">
          <p class="text-sm py-4">Upgrade to premium to access this content.</p>
        </TabsContent>
      </Tabs>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { Tabs, TabsContent, TabsList, TabsTrigger },
    template: `
      <div class="flex flex-col gap-8">
        <div>
          <p class="text-sm font-medium mb-3">Line (default)</p>
          <Tabs variant="line" default-value="account" class="w-[400px]">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <p class="text-sm text-muted-foreground py-4">Manage your account settings and preferences.</p>
            </TabsContent>
            <TabsContent value="password">
              <p class="text-sm text-muted-foreground py-4">Update your password and security settings.</p>
            </TabsContent>
            <TabsContent value="settings">
              <p class="text-sm text-muted-foreground py-4">Configure your application settings.</p>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <p class="text-sm font-medium mb-3">Pill</p>
          <Tabs variant="pill" default-value="account" class="w-[400px]">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <p class="text-sm text-muted-foreground py-4">Manage your account settings and preferences.</p>
            </TabsContent>
            <TabsContent value="password">
              <p class="text-sm text-muted-foreground py-4">Update your password and security settings.</p>
            </TabsContent>
            <TabsContent value="settings">
              <p class="text-sm text-muted-foreground py-4">Configure your application settings.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    `,
  }),
}

export const PillVariant: Story = {
  render: () => ({
    components: { Tabs, TabsContent, TabsList, TabsTrigger },
    template: `
      <Tabs variant="pill" default-value="overview" class="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Overview</h3>
            <p class="text-sm text-muted-foreground">
              View a summary of your account activity and key metrics.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="analytics" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Analytics</h3>
            <p class="text-sm text-muted-foreground">
              Detailed analytics and insights about your usage patterns.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="reports" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Reports</h3>
            <p class="text-sm text-muted-foreground">
              Generate and download comprehensive reports.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications" class="mt-6">
          <div class="flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Notifications</h3>
            <p class="text-sm text-muted-foreground">
              Manage your notification preferences and settings.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    `,
  }),
}
