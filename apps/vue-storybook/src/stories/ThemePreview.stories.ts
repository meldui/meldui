import { IconCheck, IconMoon, IconSun, IconUser } from '@meldui/tabler-vue'
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta = {
  title: 'Theme Preview',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Interactive preview of MeldUI's theming system. Toggle between light and dark modes to see how components adapt.

## Available Themes

| Theme | Description |
|-------|-------------|
| \`default\` | Slate-based neutral theme with light and dark modes |

More themes coming soon!
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    components: {
      Avatar,
      AvatarFallback,
      Badge,
      Button,
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
      Checkbox,
      IconCheck,
      IconMoon,
      IconSun,
      IconUser,
      Input,
      Label,
      Progress,
      RadioGroup,
      RadioGroupItem,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Separator,
      Switch,
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
    },
    setup() {
      const isDark = ref(false)
      const toggleTheme = () => {
        isDark.value = !isDark.value
      }
      return { isDark, toggleTheme }
    },
    template: `
      <div :class="{ dark: isDark }" class="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div class="p-8 max-w-6xl mx-auto space-y-8">
          <!-- Header with theme toggle -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold">Theme Preview</h1>
              <p class="text-muted-foreground">Default theme with light and dark mode support</p>
            </div>
            <div class="flex items-center gap-3">
              <IconSun class="size-5 text-muted-foreground" />
              <Switch :checked="isDark" @update:checked="toggleTheme" />
              <IconMoon class="size-5 text-muted-foreground" />
            </div>
          </div>

          <Separator />

          <!-- Color Palette -->
          <section>
            <h2 class="text-xl font-semibold mb-4">Color Palette</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-primary"></div>
                <p class="text-xs font-medium">Primary</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-secondary"></div>
                <p class="text-xs font-medium">Secondary</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-muted"></div>
                <p class="text-xs font-medium">Muted</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-accent"></div>
                <p class="text-xs font-medium">Accent</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-destructive"></div>
                <p class="text-xs font-medium">Destructive</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-success"></div>
                <p class="text-xs font-medium">Success</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-warning"></div>
                <p class="text-xs font-medium">Warning</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-info"></div>
                <p class="text-xs font-medium">Info</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-neutral"></div>
                <p class="text-xs font-medium">Neutral</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg border-2 border-border"></div>
                <p class="text-xs font-medium">Border</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-card border border-border"></div>
                <p class="text-xs font-medium">Card</p>
              </div>
              <div class="space-y-2">
                <div class="h-16 rounded-lg bg-popover border border-border"></div>
                <p class="text-xs font-medium">Popover</p>
              </div>
            </div>
          </section>

          <Separator />

          <!-- Components Preview -->
          <section>
            <h2 class="text-xl font-semibold mb-4">Components</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Buttons -->
              <Card>
                <CardHeader>
                  <CardTitle>Buttons</CardTitle>
                  <CardDescription>Various button styles and variants</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="info">Info</Button>
                  </div>
                </CardContent>
              </Card>

              <!-- Badges -->
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                  <CardDescription>Status and label indicators</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex flex-wrap gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <Badge :outline="true">Outline</Badge>
                    <Badge variant="success" :outline="true">Success</Badge>
                    <Badge variant="destructive" :outline="true">Error</Badge>
                  </div>
                </CardContent>
              </Card>

              <!-- Form Elements -->
              <Card>
                <CardHeader>
                  <CardTitle>Form Elements</CardTitle>
                  <CardDescription>Inputs, selects, and controls</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                  <div class="space-y-2">
                    <Label>Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="flex items-center gap-2">
                    <Checkbox id="terms" />
                    <Label for="terms">Accept terms and conditions</Label>
                  </div>
                </CardContent>
              </Card>

              <!-- Progress & Feedback -->
              <Card>
                <CardHeader>
                  <CardTitle>Progress & Feedback</CardTitle>
                  <CardDescription>Loading and status indicators</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span>Progress</span>
                      <span class="text-muted-foreground">65%</span>
                    </div>
                    <Progress :model-value="65" />
                  </div>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span>Upload</span>
                      <span class="text-muted-foreground">30%</span>
                    </div>
                    <Progress :model-value="30" />
                  </div>
                </CardContent>
              </Card>

              <!-- Tabs -->
              <Card class="md:col-span-2">
                <CardHeader>
                  <CardTitle>Tabs</CardTitle>
                  <CardDescription>Tabbed navigation example</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs default-value="account">
                    <TabsList>
                      <TabsTrigger value="account">Account</TabsTrigger>
                      <TabsTrigger value="password">Password</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account" class="p-4 border rounded-lg mt-2">
                      <p class="text-sm text-muted-foreground">
                        Manage your account settings and preferences here.
                      </p>
                    </TabsContent>
                    <TabsContent value="password" class="p-4 border rounded-lg mt-2">
                      <p class="text-sm text-muted-foreground">
                        Change your password and security settings.
                      </p>
                    </TabsContent>
                    <TabsContent value="settings" class="p-4 border rounded-lg mt-2">
                      <p class="text-sm text-muted-foreground">
                        Configure your application settings.
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </section>

          <!-- Avatars and User Elements -->
          <section>
            <h2 class="text-xl font-semibold mb-4">User Elements</h2>
            <Card>
              <CardContent class="pt-6">
                <div class="flex items-center gap-4">
                  <Avatar class="size-12">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="font-medium">John Doe</p>
                    <p class="text-sm text-muted-foreground">john@example.com</p>
                  </div>
                  <div class="ml-auto flex gap-2">
                    <Badge variant="success">Active</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        code: `
<!-- Toggle dark mode by adding/removing the 'dark' class -->
<div :class="{ dark: isDark }">
  <Button>Adapts to theme</Button>
  <Badge variant="success">Success</Badge>
  <Card>
    <CardContent>Theme-aware content</CardContent>
  </Card>
</div>
        `,
      },
    },
  },
}

export const ColorSwatches: Story = {
  render: () => ({
    components: { Card, CardContent, CardHeader, CardTitle },
    setup() {
      const colors = [
        { name: 'Background', var: '--background', class: 'bg-background' },
        { name: 'Foreground', var: '--foreground', class: 'bg-foreground' },
        { name: 'Primary', var: '--primary', class: 'bg-primary' },
        { name: 'Primary Foreground', var: '--primary-foreground', class: 'bg-primary-foreground' },
        { name: 'Secondary', var: '--secondary', class: 'bg-secondary' },
        { name: 'Muted', var: '--muted', class: 'bg-muted' },
        { name: 'Accent', var: '--accent', class: 'bg-accent' },
        { name: 'Destructive', var: '--destructive', class: 'bg-destructive' },
        { name: 'Success', var: '--success', class: 'bg-success' },
        { name: 'Warning', var: '--warning', class: 'bg-warning' },
        { name: 'Info', var: '--info', class: 'bg-info' },
        { name: 'Neutral', var: '--neutral', class: 'bg-neutral' },
        { name: 'Card', var: '--card', class: 'bg-card' },
        { name: 'Popover', var: '--popover', class: 'bg-popover' },
        { name: 'Border', var: '--border', class: 'bg-border' },
        { name: 'Input', var: '--input', class: 'bg-input' },
        { name: 'Ring', var: '--ring', class: 'bg-ring' },
      ]

      const sidebarColors = [
        { name: 'Sidebar', var: '--sidebar', class: 'bg-sidebar' },
        { name: 'Sidebar Foreground', var: '--sidebar-foreground', class: 'bg-sidebar-foreground' },
        { name: 'Sidebar Primary', var: '--sidebar-primary', class: 'bg-sidebar-primary' },
        { name: 'Sidebar Accent', var: '--sidebar-accent', class: 'bg-sidebar-accent' },
        { name: 'Sidebar Border', var: '--sidebar-border', class: 'bg-sidebar-border' },
      ]

      return { colors, sidebarColors }
    },
    template: `
      <div class="p-8 space-y-8">
        <div>
          <h2 class="text-xl font-semibold mb-4">Base Colors</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div v-for="color in colors" :key="color.var" class="space-y-2">
              <div :class="[color.class, 'h-16 rounded-lg border border-border']"></div>
              <p class="text-sm font-medium">{{ color.name }}</p>
              <code class="text-xs text-muted-foreground">{{ color.var }}</code>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-4">Sidebar Colors</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div v-for="color in sidebarColors" :key="color.var" class="space-y-2">
              <div :class="[color.class, 'h-16 rounded-lg border border-border']"></div>
              <p class="text-sm font-medium">{{ color.name }}</p>
              <code class="text-xs text-muted-foreground">{{ color.var }}</code>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All available CSS color variables in the default theme.',
      },
    },
  },
}

export const DarkModeComparison: Story = {
  render: () => ({
    components: { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label },
    template: `
      <div class="grid md:grid-cols-2 gap-0">
        <!-- Light Mode -->
        <div class="p-8 bg-background text-foreground">
          <h2 class="text-lg font-semibold mb-4">Light Mode</h2>
          <Card>
            <CardHeader>
              <CardTitle>Sample Card</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
              <div class="flex gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
              </div>
              <div class="space-y-2">
                <Label>Input Field</Label>
                <Input placeholder="Type here..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Dark Mode -->
        <div class="dark p-8 bg-background text-foreground">
          <h2 class="text-lg font-semibold mb-4">Dark Mode</h2>
          <Card>
            <CardHeader>
              <CardTitle>Sample Card</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
              </div>
              <div class="flex gap-2">
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
              </div>
              <div class="space-y-2">
                <Label>Input Field</Label>
                <Input placeholder="Type here..." />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    `,
  }),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Side-by-side comparison of light and dark mode.',
      },
    },
  },
}
