import {
  IconBell,
  IconFilter,
  IconMenu,
  IconSearch,
  IconSettings,
  IconShoppingCart,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Switch,
  Textarea,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Sheet> = {
  title: 'Components/Overlay/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Extends the Dialog component to display content that slides in from the edge of the screen. Perfect for navigation menus, sidebars, filters, and forms that need to overlay the main content.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline">Open Sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>
              This is a sheet description providing context about the content.
            </SheetDescription>
          </SheetHeader>
          <div class="p-4">
            <p class="text-sm text-muted-foreground">
              Sheet content goes here. Add any content you need.
            </p>
          </div>
          <SheetFooter>
            <SheetClose as-child>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const FromLeft: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      IconMenu,
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconMenu :size="16" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Navigate through the main sections of the app.
            </SheetDescription>
          </SheetHeader>
          <nav class="flex flex-col gap-2 p-4">
            <Button variant="ghost" class="justify-start">Home</Button>
            <Button variant="ghost" class="justify-start">Projects</Button>
            <Button variant="ghost" class="justify-start">Tasks</Button>
            <Button variant="ghost" class="justify-start">Team</Button>
            <Button variant="ghost" class="justify-start">Calendar</Button>
            <Button variant="ghost" class="justify-start">Reports</Button>
          </nav>
          <SheetFooter>
            <SheetClose as-child>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const FromTop: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      IconBell,
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconBell :size="16" />
            Notifications
          </Button>
        </SheetTrigger>
        <SheetContent side="top">
          <div class="mx-auto max-w-3xl">
            <SheetHeader>
              <SheetTitle>Recent Notifications</SheetTitle>
              <SheetDescription>You have 5 unread notifications</SheetDescription>
            </SheetHeader>
            <div class="grid gap-3 p-4 sm:grid-cols-2">
              <div class="rounded-lg border p-3">
                <p class="text-sm font-semibold">New message</p>
                <p class="text-sm text-muted-foreground">You have a new message from John</p>
              </div>
              <div class="rounded-lg border p-3">
                <p class="text-sm font-semibold">Task completed</p>
                <p class="text-sm text-muted-foreground">Your task was marked as complete</p>
              </div>
              <div class="rounded-lg border p-3">
                <p class="text-sm font-semibold">New follower</p>
                <p class="text-sm text-muted-foreground">Jane started following you</p>
              </div>
              <div class="rounded-lg border p-3">
                <p class="text-sm font-semibold">Comment reply</p>
                <p class="text-sm text-muted-foreground">Someone replied to your comment</p>
              </div>
            </div>
            <SheetFooter>
              <Button size="sm">Mark All as Read</Button>
              <SheetClose as-child>
                <Button variant="outline" size="sm">Close</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const FromBottom: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      IconSearch,
    },
    setup() {
      const search = ref('')

      return { search }
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconSearch :size="16" />
            Search
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <div class="mx-auto max-w-3xl">
            <SheetHeader>
              <SheetTitle>Search</SheetTitle>
              <SheetDescription>Search for anything in your workspace</SheetDescription>
            </SheetHeader>
            <div class="p-4">
              <Input
                v-model="search"
                placeholder="Type to search..."
                class="mb-4"
              />
              <div class="space-y-2">
                <div class="rounded-lg border p-3">
                  <p class="text-sm font-semibold">Project Alpha</p>
                  <p class="text-sm text-muted-foreground">Web development project</p>
                </div>
                <div class="rounded-lg border p-3">
                  <p class="text-sm font-semibold">Design System</p>
                  <p class="text-sm text-muted-foreground">Component library project</p>
                </div>
                <div class="rounded-lg border p-3">
                  <p class="text-sm font-semibold">Marketing Campaign</p>
                  <p class="text-sm text-muted-foreground">Q1 2024 campaign</p>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetClose as-child>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const WithForm: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      Input,
      Label,
      Textarea,
    },
    setup() {
      const name = ref('')
      const email = ref('')
      const subject = ref('')
      const message = ref('')

      return { name, email, subject, message }
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button>Send Feedback</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Send Feedback</SheetTitle>
            <SheetDescription>
              We'd love to hear your thoughts, suggestions, or issues.
            </SheetDescription>
          </SheetHeader>
          <div class="flex flex-col gap-4 p-4">
            <div class="flex flex-col gap-2">
              <Label for="feedback-name">Name</Label>
              <Input id="feedback-name" v-model="name" placeholder="Your name" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="feedback-email">Email</Label>
              <Input id="feedback-email" v-model="email" type="email" placeholder="your@email.com" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="feedback-subject">Subject</Label>
              <Input id="feedback-subject" v-model="subject" placeholder="Brief description" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="feedback-message">Message</Label>
              <Textarea
                id="feedback-message"
                v-model="message"
                placeholder="Your feedback..."
                rows="5"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose as-child>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button>Send Feedback</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const SettingsPanel: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      Label,
      Switch,
      IconSettings,
    },
    setup() {
      const emailNotifications = ref(true)
      const pushNotifications = ref(true)
      const smsNotifications = ref(false)
      const darkMode = ref(false)

      return { emailNotifications, pushNotifications, smsNotifications, darkMode }
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconSettings :size="16" />
            Settings
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Account Settings</SheetTitle>
            <SheetDescription>Manage your account preferences</SheetDescription>
          </SheetHeader>
          <div class="flex-1 space-y-6 overflow-y-auto p-4">
            <div>
              <h3 class="mb-3 text-sm font-semibold">Notifications</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <Label for="setting-email">Email Notifications</Label>
                    <span class="text-sm text-muted-foreground">Receive updates via email</span>
                  </div>
                  <Switch id="setting-email" v-model:checked="emailNotifications" />
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <Label for="setting-push">Push Notifications</Label>
                    <span class="text-sm text-muted-foreground">Get desktop notifications</span>
                  </div>
                  <Switch id="setting-push" v-model:checked="pushNotifications" />
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <Label for="setting-sms">SMS Notifications</Label>
                    <span class="text-sm text-muted-foreground">Receive text messages</span>
                  </div>
                  <Switch id="setting-sms" v-model:checked="smsNotifications" />
                </div>
              </div>
            </div>
            <div>
              <h3 class="mb-3 text-sm font-semibold">Appearance</h3>
              <div class="flex items-center justify-between">
                <div class="flex flex-col gap-1">
                  <Label for="setting-dark">Dark Mode</Label>
                  <span class="text-sm text-muted-foreground">Use dark color scheme</span>
                </div>
                <Switch id="setting-dark" v-model:checked="darkMode" />
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose as-child>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const ShoppingCart: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      IconShoppingCart,
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconShoppingCart :size="16" />
            Cart (3)
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>3 items in your cart</SheetDescription>
          </SheetHeader>
          <div class="flex-1 space-y-4 overflow-y-auto p-4">
            <div class="flex gap-4 rounded-lg border p-3">
              <div class="flex h-20 w-20 items-center justify-center rounded bg-muted text-xs">
                Product
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold">Premium Headphones</h4>
                <p class="text-sm text-muted-foreground">Black, Wireless</p>
                <p class="mt-1 text-sm font-semibold">$299.99</p>
              </div>
            </div>
            <div class="flex gap-4 rounded-lg border p-3">
              <div class="flex h-20 w-20 items-center justify-center rounded bg-muted text-xs">
                Product
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold">Wireless Mouse</h4>
                <p class="text-sm text-muted-foreground">Silver, Ergonomic</p>
                <p class="mt-1 text-sm font-semibold">$79.99</p>
              </div>
            </div>
            <div class="flex gap-4 rounded-lg border p-3">
              <div class="flex h-20 w-20 items-center justify-center rounded bg-muted text-xs">
                Product
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold">Keyboard</h4>
                <p class="text-sm text-muted-foreground">Mechanical, RGB</p>
                <p class="mt-1 text-sm font-semibold">$149.99</p>
              </div>
            </div>
          </div>
          <div class="border-t p-4">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>$529.97</span>
            </div>
            <div class="mb-2 flex items-center justify-between text-sm">
              <span>Shipping</span>
              <span>$10.00</span>
            </div>
            <div class="flex items-center justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>$539.97</span>
            </div>
          </div>
          <SheetFooter>
            <SheetClose as-child>
              <Button variant="outline">Continue Shopping</Button>
            </SheetClose>
            <Button>Checkout</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const FiltersPanel: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Switch,
      IconFilter,
    },
    setup() {
      const category = ref('')
      const brand = ref('')
      const priceRange = ref('')
      const inStock = ref(true)
      const freeShipping = ref(false)

      return { category, brand, priceRange, inStock, freeShipping }
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconFilter :size="16" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Product Filters</SheetTitle>
            <SheetDescription>Refine your product search</SheetDescription>
          </SheetHeader>
          <div class="flex-1 space-y-6 overflow-y-auto p-4">
            <div class="flex flex-col gap-2">
              <Label for="filter-category">Category</Label>
              <Select v-model="category">
                <SelectTrigger id="filter-category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="filter-brand">Brand</Label>
              <Select v-model="brand">
                <SelectTrigger id="filter-brand">
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="samsung">Samsung</SelectItem>
                  <SelectItem value="sony">Sony</SelectItem>
                  <SelectItem value="nike">Nike</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="filter-price">Price Range</Label>
              <Select v-model="priceRange">
                <SelectTrigger id="filter-price">
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200+">$200+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <Label for="filter-stock">In Stock Only</Label>
                <Switch id="filter-stock" v-model:checked="inStock" />
              </div>
              <div class="flex items-center justify-between">
                <Label for="filter-shipping">Free Shipping</Label>
                <Switch id="filter-shipping" v-model:checked="freeShipping" />
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose as-child>
              <Button variant="outline">Clear Filters</Button>
            </SheetClose>
            <Button>Apply Filters</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const UserProfile: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
      IconUser,
    },
    template: `
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconUser :size="16" />
            Profile
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <div class="flex items-center gap-4">
              <div class="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                JS
              </div>
              <div>
                <SheetTitle>Jane Smith</SheetTitle>
                <p class="text-sm text-muted-foreground">jane.smith@example.com</p>
              </div>
            </div>
          </SheetHeader>
          <div class="flex-1 space-y-6 overflow-y-auto p-4">
            <div>
              <h3 class="mb-2 text-sm font-semibold">About</h3>
              <p class="text-sm text-muted-foreground">
                Product designer with a passion for creating intuitive and beautiful user interfaces.
                Currently working on web and mobile applications.
              </p>
            </div>
            <div>
              <h3 class="mb-2 text-sm font-semibold">Location</h3>
              <p class="text-sm">New York, NY</p>
            </div>
            <div>
              <h3 class="mb-2 text-sm font-semibold">Member Since</h3>
              <p class="text-sm">January 2024</p>
            </div>
            <div>
              <h3 class="mb-2 text-sm font-semibold">Statistics</h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-lg border p-3 text-center">
                  <p class="text-2xl font-bold">156</p>
                  <p class="text-sm text-muted-foreground">Projects</p>
                </div>
                <div class="rounded-lg border p-3 text-center">
                  <p class="text-2xl font-bold">2.4K</p>
                  <p class="text-sm text-muted-foreground">Followers</p>
                </div>
                <div class="rounded-lg border p-3 text-center">
                  <p class="text-2xl font-bold">892</p>
                  <p class="text-sm text-muted-foreground">Following</p>
                </div>
                <div class="rounded-lg border p-3 text-center">
                  <p class="text-2xl font-bold">4.8</p>
                  <p class="text-sm text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button>Edit Profile</Button>
            <SheetClose as-child>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    `,
  }),
}

export const AllSides: Story = {
  render: () => ({
    components: {
      Button,
      Sheet,
      SheetClose,
      SheetContent,
      SheetDescription,
      SheetFooter,
      SheetHeader,
      SheetTitle,
      SheetTrigger,
    },
    template: `
      <div class="flex flex-wrap gap-4">
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline">From Left</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Left Sheet</SheetTitle>
              <SheetDescription>This sheet slides in from the left</SheetDescription>
            </SheetHeader>
            <div class="p-4">
              <p class="text-sm text-muted-foreground">Content goes here</p>
            </div>
            <SheetFooter>
              <SheetClose as-child>
                <Button>Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline">From Right</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Right Sheet</SheetTitle>
              <SheetDescription>This sheet slides in from the right</SheetDescription>
            </SheetHeader>
            <div class="p-4">
              <p class="text-sm text-muted-foreground">Content goes here</p>
            </div>
            <SheetFooter>
              <SheetClose as-child>
                <Button>Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline">From Top</Button>
          </SheetTrigger>
          <SheetContent side="top">
            <div class="mx-auto max-w-3xl">
              <SheetHeader>
                <SheetTitle>Top Sheet</SheetTitle>
                <SheetDescription>This sheet slides in from the top</SheetDescription>
              </SheetHeader>
              <div class="p-4">
                <p class="text-sm text-muted-foreground">Content goes here</p>
              </div>
              <SheetFooter>
                <SheetClose as-child>
                  <Button>Close</Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline">From Bottom</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <div class="mx-auto max-w-3xl">
              <SheetHeader>
                <SheetTitle>Bottom Sheet</SheetTitle>
                <SheetDescription>This sheet slides in from the bottom</SheetDescription>
              </SheetHeader>
              <div class="p-4">
                <p class="text-sm text-muted-foreground">Content goes here</p>
              </div>
              <SheetFooter>
                <SheetClose as-child>
                  <Button>Close</Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    `,
  }),
}
