import {
  IconBell,
  IconFilter,
  IconHome,
  IconMenu,
  IconSettings,
  IconShoppingCart,
  IconUser,
} from '@meldui/tabler-vue'
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
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

const meta: Meta<typeof Drawer> = {
  title: 'Components/Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A panel that slides in from the edge of the screen. Can be used for navigation, forms, details, or any content that needs to overlay the main interface. Supports dragging to close on mobile devices.',
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
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
    },
    template: `
      <Drawer>
        <DrawerTrigger as-child>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Drawer Title</DrawerTitle>
            <DrawerDescription>This is a drawer description.</DrawerDescription>
          </DrawerHeader>
          <div class="p-4">
            <p class="text-sm text-muted-foreground">
              Drawer content goes here. You can add any content you need.
            </p>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose as-child>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const FromLeft: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
      IconMenu,
    },
    template: `
      <Drawer direction="left">
        <DrawerTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconMenu :size="16" />
            Open Menu
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Navigation Menu</DrawerTitle>
            <DrawerDescription>Quick access to main sections</DrawerDescription>
          </DrawerHeader>
          <div class="flex flex-col gap-2 p-4">
            <Button variant="ghost" class="justify-start">Dashboard</Button>
            <Button variant="ghost" class="justify-start">Projects</Button>
            <Button variant="ghost" class="justify-start">Team</Button>
            <Button variant="ghost" class="justify-start">Calendar</Button>
            <Button variant="ghost" class="justify-start">Settings</Button>
          </div>
          <DrawerFooter>
            <DrawerClose as-child>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const FromRight: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
      IconShoppingCart,
    },
    template: `
      <Drawer direction="right">
        <DrawerTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconShoppingCart :size="16" />
            Shopping Cart (3)
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Shopping Cart</DrawerTitle>
            <DrawerDescription>3 items in your cart</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 space-y-4 overflow-y-auto p-4">
            <div class="flex items-center gap-4 rounded-lg border p-3">
              <div class="flex h-16 w-16 items-center justify-center rounded bg-muted">
                <span class="text-xs">IMG</span>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold">Product Name</h4>
                <p class="text-sm text-muted-foreground">$29.99</p>
              </div>
            </div>
            <div class="flex items-center gap-4 rounded-lg border p-3">
              <div class="flex h-16 w-16 items-center justify-center rounded bg-muted">
                <span class="text-xs">IMG</span>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold">Another Product</h4>
                <p class="text-sm text-muted-foreground">$49.99</p>
              </div>
            </div>
            <div class="flex items-center gap-4 rounded-lg border p-3">
              <div class="flex h-16 w-16 items-center justify-center rounded bg-muted">
                <span class="text-xs">IMG</span>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-semibold">Third Product</h4>
                <p class="text-sm text-muted-foreground">$19.99</p>
              </div>
            </div>
          </div>
          <div class="border-t p-4">
            <div class="mb-4 flex items-center justify-between text-sm">
              <span class="font-semibold">Total</span>
              <span class="font-bold">$99.97</span>
            </div>
          </div>
          <DrawerFooter>
            <Button>Checkout</Button>
            <DrawerClose as-child>
              <Button variant="outline">Continue Shopping</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const FromTop: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
      IconBell,
    },
    template: `
      <Drawer direction="top">
        <DrawerTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconBell :size="16" />
            Notifications
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>You have 3 unread notifications</DrawerDescription>
          </DrawerHeader>
          <div class="space-y-3 p-4">
            <div class="rounded-lg border p-3">
              <p class="text-sm font-semibold">New comment on your post</p>
              <p class="text-sm text-muted-foreground">John Doe commented on your post.</p>
              <p class="mt-1 text-xs text-muted-foreground">2 minutes ago</p>
            </div>
            <div class="rounded-lg border p-3">
              <p class="text-sm font-semibold">New follower</p>
              <p class="text-sm text-muted-foreground">Jane Smith started following you.</p>
              <p class="mt-1 text-xs text-muted-foreground">1 hour ago</p>
            </div>
            <div class="rounded-lg border p-3">
              <p class="text-sm font-semibold">Your post was liked</p>
              <p class="text-sm text-muted-foreground">Your post received 10 new likes.</p>
              <p class="mt-1 text-xs text-muted-foreground">3 hours ago</p>
            </div>
          </div>
          <DrawerFooter>
            <Button>Mark All as Read</Button>
            <DrawerClose as-child>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const WithForm: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
      Input,
      Label,
      Textarea,
    },
    setup() {
      const name = ref('')
      const email = ref('')
      const message = ref('')

      return { name, email, message }
    },
    template: `
      <Drawer>
        <DrawerTrigger as-child>
          <Button>Contact Us</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Contact Us</DrawerTitle>
            <DrawerDescription>Send us a message and we'll get back to you.</DrawerDescription>
          </DrawerHeader>
          <div class="flex flex-col gap-4 p-4">
            <div class="flex flex-col gap-2">
              <Label for="contact-name">Name</Label>
              <Input id="contact-name" v-model="name" placeholder="Your name" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="contact-email">Email</Label>
              <Input id="contact-email" v-model="email" type="email" placeholder="your@email.com" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="contact-message">Message</Label>
              <Textarea id="contact-message" v-model="message" placeholder="Your message..." rows="4" />
            </div>
          </div>
          <DrawerFooter>
            <Button>Send Message</Button>
            <DrawerClose as-child>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const SettingsPanel: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
      Label,
      Switch,
      IconSettings,
    },
    setup() {
      const notifications = ref(true)
      const marketing = ref(false)
      const analytics = ref(true)

      return { notifications, marketing, analytics }
    },
    template: `
      <Drawer direction="right">
        <DrawerTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconSettings :size="16" />
            Settings
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>Manage your preferences</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 space-y-6 overflow-y-auto p-4">
            <div>
              <h3 class="mb-3 text-sm font-semibold">Notifications</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <Label for="notif-email">Email Notifications</Label>
                    <span class="text-sm text-muted-foreground">Receive notifications via email</span>
                  </div>
                  <Switch id="notif-email" v-model:checked="notifications" />
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <Label for="notif-marketing">Marketing Emails</Label>
                    <span class="text-sm text-muted-foreground">Receive marketing updates</span>
                  </div>
                  <Switch id="notif-marketing" v-model:checked="marketing" />
                </div>
              </div>
            </div>
            <div>
              <h3 class="mb-3 text-sm font-semibold">Privacy</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-1">
                    <Label for="privacy-analytics">Analytics</Label>
                    <span class="text-sm text-muted-foreground">Help us improve by sharing usage data</span>
                  </div>
                  <Switch id="privacy-analytics" v-model:checked="analytics" />
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Save Changes</Button>
            <DrawerClose as-child>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const FiltersPanel: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
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
      const priceRange = ref('')
      const inStock = ref(true)
      const onSale = ref(false)

      return { category, priceRange, inStock, onSale }
    },
    template: `
      <Drawer direction="left">
        <DrawerTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconFilter :size="16" />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Refine your search results</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 space-y-6 overflow-y-auto p-4">
            <div class="flex flex-col gap-2">
              <Label for="filter-category">Category</Label>
              <Select v-model="category">
                <SelectTrigger id="filter-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="filter-price">Price Range</Label>
              <Select v-model="priceRange">
                <SelectTrigger id="filter-price">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-25">Under $25</SelectItem>
                  <SelectItem value="25-50">$25 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100+">$100+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <Label for="filter-stock">In Stock Only</Label>
                <Switch id="filter-stock" v-model:checked="inStock" />
              </div>
              <div class="flex items-center justify-between">
                <Label for="filter-sale">On Sale</Label>
                <Switch id="filter-sale" v-model:checked="onSale" />
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Apply Filters</Button>
            <DrawerClose as-child>
              <Button variant="outline">Clear All</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const UserProfile: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
      IconUser,
      IconHome,
    },
    template: `
      <Drawer direction="right">
        <DrawerTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconUser :size="16" />
            View Profile
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div class="flex items-center gap-4">
              <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                JD
              </div>
              <div>
                <DrawerTitle>John Doe</DrawerTitle>
                <p class="text-sm text-muted-foreground">john.doe@example.com</p>
              </div>
            </div>
          </DrawerHeader>
          <div class="flex-1 space-y-6 overflow-y-auto p-4">
            <div>
              <h3 class="mb-2 text-sm font-semibold">About</h3>
              <p class="text-sm text-muted-foreground">
                Software developer passionate about building great user experiences.
                Love working with Vue, React, and modern web technologies.
              </p>
            </div>
            <div>
              <h3 class="mb-2 text-sm font-semibold">Details</h3>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <IconHome :size="16" class="text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
                <div class="flex items-center gap-2">
                  <IconUser :size="16" class="text-muted-foreground" />
                  <span>Joined January 2024</span>
                </div>
              </div>
            </div>
            <div>
              <h3 class="mb-2 text-sm font-semibold">Stats</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="rounded-lg border p-3">
                  <p class="text-2xl font-bold">42</p>
                  <p class="text-sm text-muted-foreground">Projects</p>
                </div>
                <div class="rounded-lg border p-3">
                  <p class="text-2xl font-bold">128</p>
                  <p class="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Edit Profile</Button>
            <DrawerClose as-child>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const MobileNavigation: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
      IconMenu,
      IconHome,
      IconUser,
      IconSettings,
    },
    template: `
      <Drawer direction="left">
        <DrawerTrigger as-child>
          <Button variant="ghost" size="icon">
            <IconMenu />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <nav class="flex flex-col p-2">
            <Button variant="ghost" class="justify-start gap-3">
              <IconHome :size="20" />
              Home
            </Button>
            <Button variant="ghost" class="justify-start gap-3">
              <IconUser :size="20" />
              Profile
            </Button>
            <Button variant="ghost" class="justify-start gap-3">
              <IconSettings :size="20" />
              Settings
            </Button>
            <div class="my-2 border-t" />
            <DrawerClose as-child>
              <Button variant="ghost" class="justify-start">
                Close Menu
              </Button>
            </DrawerClose>
          </nav>
        </DrawerContent>
      </Drawer>
    `,
  }),
}

export const NestedContent: Story = {
  render: () => ({
    components: {
      Button,
      Drawer,
      DrawerClose,
      DrawerContent,
      DrawerDescription,
      DrawerFooter,
      DrawerHeader,
      DrawerTitle,
      DrawerTrigger,
    },
    template: `
      <Drawer>
        <DrawerTrigger as-child>
          <Button variant="outline">View Details</Button>
        </DrawerTrigger>
        <DrawerContent class="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Product Details</DrawerTitle>
            <DrawerDescription>Complete product information</DrawerDescription>
          </DrawerHeader>
          <div class="flex-1 space-y-4 overflow-y-auto p-4">
            <div class="aspect-video rounded-lg bg-muted" />
            <div>
              <h3 class="mb-2 text-lg font-semibold">Premium Headphones</h3>
              <p class="text-2xl font-bold">$299.99</p>
            </div>
            <div>
              <h4 class="mb-2 text-sm font-semibold">Description</h4>
              <p class="text-sm text-muted-foreground">
                Experience audio like never before with our premium wireless headphones.
                Featuring active noise cancellation, 30-hour battery life, and studio-quality sound.
              </p>
            </div>
            <div>
              <h4 class="mb-2 text-sm font-semibold">Features</h4>
              <ul class="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Active Noise Cancellation</li>
                <li>30-hour battery life</li>
                <li>Bluetooth 5.0</li>
                <li>Premium materials</li>
                <li>Foldable design</li>
              </ul>
            </div>
            <div>
              <h4 class="mb-2 text-sm font-semibold">Specifications</h4>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Weight</span>
                  <span>250g</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Driver Size</span>
                  <span>40mm</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Frequency Response</span>
                  <span>20Hz - 20kHz</span>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button>Add to Cart</Button>
            <DrawerClose as-child>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    `,
  }),
}
