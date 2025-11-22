import { IconBell, IconHeart, IconShare, IconStar, IconUser } from '@meldui/tabler-vue'
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof Card> = {
  title: 'Components/DataDisplay/Card',
  component: Card,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
    template: `
      <Card style="max-width: 400px;">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here.</p>
        </CardContent>
      </Card>
    `,
  }),
}

export const WithFooter: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardContent, CardFooter, Button },
    template: `
      <Card style="max-width: 400px;">
        <CardHeader>
          <CardTitle>Confirm Action</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Are you sure you want to proceed?</p>
        </CardContent>
        <CardFooter class="flex gap-2">
          <Button variant="default">Confirm</Button>
          <Button variant="outline">Cancel</Button>
        </CardFooter>
      </Card>
    `,
  }),
}

export const WithAction: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction, IconBell },
    template: `
      <Card style="max-width: 400px;">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>You have 3 unread messages</CardDescription>
          <CardAction>
            <IconBell :size="20" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="text-sm">New comment on your post</div>
            <div class="text-sm">Your order has been shipped</div>
            <div class="text-sm">System update available</div>
          </div>
        </CardContent>
      </Card>
    `,
  }),
}

export const UserProfile: Story = {
  render: () => ({
    components: {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
      Button,
      Badge,
      IconUser,
    },
    template: `
      <Card style="max-width: 400px;">
        <CardHeader>
          <div class="flex items-start gap-4">
            <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <IconUser :size="32" />
            </div>
            <div class="flex-1">
              <CardTitle>Sarah Johnson</CardTitle>
              <CardDescription>Product Designer</CardDescription>
              <div class="flex gap-2 mt-2">
                <Badge variant="secondary">Pro</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Passionate about creating beautiful and functional user experiences.
            5+ years of experience in digital product design.
          </p>
        </CardContent>
        <CardFooter class="flex gap-2">
          <Button variant="default" class="flex-1">Follow</Button>
          <Button variant="outline" class="flex-1">Message</Button>
        </CardFooter>
      </Card>
    `,
  }),
}

export const StatsCard: Story = {
  render: () => ({
    components: { Card, CardHeader, CardTitle, CardDescription, CardContent },
    template: `
      <Card style="max-width: 300px;">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle class="text-3xl">$45,231.89</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-success">+20.1% from last month</p>
        </CardContent>
      </Card>
    `,
  }),
}

export const PricingCard: Story = {
  render: () => ({
    components: {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
      Button,
      Badge,
      Separator,
    },
    template: `
      <Card style="max-width: 350px;">
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle>Pro Plan</CardTitle>
            <Badge variant="default">Popular</Badge>
          </div>
          <div class="mt-4">
            <span class="text-4xl font-bold">$29</span>
            <span class="text-muted-foreground">/month</span>
          </div>
          <CardDescription class="mt-2">Perfect for growing teams</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator class="mb-4" />
          <ul class="space-y-3 text-sm">
            <li class="flex items-center gap-2">
              <span class="text-success">✓</span>
              <span>Unlimited projects</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-success">✓</span>
              <span>Advanced analytics</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-success">✓</span>
              <span>Priority support</span>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-success">✓</span>
              <span>Custom integrations</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="default" class="w-full">Get Started</Button>
        </CardFooter>
      </Card>
    `,
  }),
}

export const ProductCard: Story = {
  render: () => ({
    components: {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
      Button,
      Badge,
      IconHeart,
      IconShare,
      IconStar,
    },
    template: `
      <Card style="max-width: 350px;">
        <CardHeader class="p-0">
          <div class="aspect-video bg-muted rounded-t-lg flex items-center justify-center text-muted-foreground">
            Product Image
          </div>
        </CardHeader>
        <CardContent class="pt-4">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <CardTitle class="text-lg">Wireless Headphones</CardTitle>
              <CardDescription>Premium audio experience</CardDescription>
            </div>
            <Badge variant="success">New</Badge>
          </div>
          <div class="flex items-center gap-1 mb-3">
            <IconStar :size="16" class="text-warning fill-warning" />
            <IconStar :size="16" class="text-warning fill-warning" />
            <IconStar :size="16" class="text-warning fill-warning" />
            <IconStar :size="16" class="text-warning fill-warning" />
            <IconStar :size="16" class="text-muted-foreground" />
            <span class="text-sm text-muted-foreground ml-1">(128)</span>
          </div>
          <div class="text-2xl font-bold">$299.99</div>
        </CardContent>
        <CardFooter class="flex gap-2">
          <Button variant="default" class="flex-1">Add to Cart</Button>
          <Button variant="outline" size="icon">
            <IconHeart :size="20" />
          </Button>
          <Button variant="outline" size="icon">
            <IconShare :size="20" />
          </Button>
        </CardFooter>
      </Card>
    `,
  }),
}

export const LoginCard: Story = {
  render: () => ({
    components: {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
      Button,
      Input,
      Label,
    },
    template: `
      <Card style="max-width: 400px;">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button variant="default" class="w-full">Sign In</Button>
          <Button variant="ghost" class="w-full text-sm">Forgot password?</Button>
        </CardFooter>
      </Card>
    `,
  }),
}

export const ArticleCard: Story = {
  render: () => ({
    components: {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      Badge,
    },
    template: `
      <Card style="max-width: 500px;">
        <CardHeader>
          <div class="flex gap-2 mb-2">
            <Badge variant="secondary">Technology</Badge>
            <Badge variant="outline">5 min read</Badge>
          </div>
          <CardTitle>The Future of Web Development</CardTitle>
          <CardDescription>Published on Nov 23, 2025 by John Doe</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground">
            Exploring the latest trends and technologies shaping the future of web development.
            From new frameworks to innovative design patterns, discover what's coming next in the world of web development.
          </p>
        </CardContent>
      </Card>
    `,
  }),
}

export const CardGrid: Story = {
  render: () => ({
    components: {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      IconBell,
      IconUser,
      IconHeart,
    },
    template: `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="max-width: 1000px;">
        <Card>
          <CardHeader>
            <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <IconUser :size="24" class="text-primary" />
            </div>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold">2,543</div>
            <p class="text-sm text-success mt-1">+12% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div class="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center mb-2">
              <IconBell :size="24" class="text-warning" />
            </div>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold">127</div>
            <p class="text-sm text-muted-foreground mt-1">Unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div class="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <IconHeart :size="24" class="text-destructive" />
            </div>
            <CardTitle>Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold">48</div>
            <p class="text-sm text-success mt-1">+5 new today</p>
          </CardContent>
        </Card>
      </div>
    `,
  }),
}
