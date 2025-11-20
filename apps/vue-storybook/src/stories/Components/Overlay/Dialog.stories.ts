import { IconCamera, IconMail, IconMapPin, IconPhone, IconUser } from '@meldui/tabler-vue'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert. Used for important interactions that require user attention without navigating away from the current page.',
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
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>
              This is a description of the dialog. It provides context about what the dialog is for.
            </DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <p class="text-sm text-muted-foreground">
              Dialog content goes here. You can add any content you need.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const WithForm: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      Input,
      Label,
    },
    setup() {
      const name = ref('')
      const email = ref('')

      return { name, email }
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button>Add Contact</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Enter the contact information below.
            </DialogDescription>
          </DialogHeader>
          <div class="flex flex-col gap-4 py-4">
            <div class="flex flex-col gap-2">
              <Label for="name">Name</Label>
              <Input id="name" v-model="name" placeholder="John Doe" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="email" type="email" placeholder="john@example.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const ScrollableContent: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogScrollContent,
      DialogTitle,
      DialogTrigger,
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline">View Privacy Policy</Button>
        </DialogTrigger>
        <DialogScrollContent>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              Last updated: January 2024
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-4 text-sm">
            <div>
              <h3 class="mb-2 font-semibold">1. Information We Collect</h3>
              <p class="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an
                account, make a purchase, or contact us for support. This may include your name,
                email address, postal address, phone number, and payment information.
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">2. How We Use Your Information</h3>
              <p class="text-muted-foreground">
                We use the information we collect to provide, maintain, and improve our services,
                process transactions, send you technical notices and support messages, and respond
                to your comments and questions.
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">3. Information Sharing</h3>
              <p class="text-muted-foreground">
                We do not share your personal information with third parties except as described
                in this policy. We may share information with vendors, consultants, and other
                service providers who need access to such information to carry out work on our
                behalf.
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">4. Data Security</h3>
              <p class="text-muted-foreground">
                We take reasonable measures to help protect your personal information from loss,
                theft, misuse, and unauthorized access. However, no method of transmission over
                the Internet is 100% secure.
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">5. Cookies and Tracking</h3>
              <p class="text-muted-foreground">
                We use cookies and similar tracking technologies to collect information about your
                browsing activities. You can control cookies through your browser settings.
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">6. Your Rights</h3>
              <p class="text-muted-foreground">
                You have the right to access, update, or delete your personal information. You may
                also have the right to object to or restrict certain processing of your data.
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">7. Changes to This Policy</h3>
              <p class="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated"
                date.
              </p>
            </div>
            <div>
              <h3 class="mb-2 font-semibold">8. Contact Us</h3>
              <p class="text-muted-foreground">
                If you have any questions about this privacy policy, please contact us at
                privacy@example.com.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </DialogScrollContent>
      </Dialog>
    `,
  }),
}

export const WithoutCloseButton: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent :show-close-button="false">
          <DialogHeader>
            <DialogTitle>Required Action</DialogTitle>
            <DialogDescription>
              Please complete this action before proceeding. You must click one of the buttons below.
            </DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <p class="text-sm text-muted-foreground">
              This dialog cannot be closed using the X button. You must choose an option.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline">Decline</Button>
            <Button>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const SmallDialog: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline">Small Dialog</Button>
        </DialogTrigger>
        <DialogContent class="max-w-md sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Small Dialog</DialogTitle>
            <DialogDescription>This is a smaller dialog (max-width: 28rem / 448px).</DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <p class="text-sm text-muted-foreground">Content fits in a compact space.</p>
          </div>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const LargeDialog: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline">Large Dialog</Button>
        </DialogTrigger>
        <DialogContent class="max-w-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Large Dialog</DialogTitle>
            <DialogDescription>This dialog has more space for content (max-width: 42rem / 672px).</DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <p class="text-sm text-muted-foreground">
              This larger dialog can accommodate more content, wider forms, or additional
              information that needs more horizontal space.
            </p>
          </div>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const ExtraLargeDialog: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="outline">Extra Large Dialog</Button>
        </DialogTrigger>
        <DialogContent class="max-w-5xl sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Extra Large Dialog</DialogTitle>
            <DialogDescription>This dialog takes up more space (max-width: 64rem / 1024px).</DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <p class="text-sm text-muted-foreground">
              Useful for complex layouts, wide tables, or when you need significant horizontal space.
            </p>
          </div>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const EditProfile: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      Input,
      Label,
      Textarea,
      IconUser,
      IconMail,
      IconPhone,
      IconMapPin,
    },
    setup() {
      const name = ref('John Doe')
      const email = ref('john@example.com')
      const phone = ref('+1 (555) 123-4567')
      const address = ref('123 Main St, City, State 12345')
      const bio = ref('Software developer and tech enthusiast.')

      return { name, email, phone, address, bio }
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button>
            <IconUser :size="16" />
            Edit Profile
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here.
            </DialogDescription>
          </DialogHeader>
          <div class="flex flex-col gap-4 py-4">
            <div class="flex flex-col gap-2">
              <Label for="edit-name" class="flex items-center gap-2">
                <IconUser :size="16" />
                Name
              </Label>
              <Input id="edit-name" v-model="name" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="edit-email" class="flex items-center gap-2">
                <IconMail :size="16" />
                Email
              </Label>
              <Input id="edit-email" v-model="email" type="email" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="edit-phone" class="flex items-center gap-2">
                <IconPhone :size="16" />
                Phone
              </Label>
              <Input id="edit-phone" v-model="phone" type="tel" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="edit-address" class="flex items-center gap-2">
                <IconMapPin :size="16" />
                Address
              </Label>
              <Input id="edit-address" v-model="address" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="edit-bio">Bio</Label>
              <Textarea id="edit-bio" v-model="bio" rows="3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const CreateItem: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
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
      const title = ref('')
      const category = ref('')
      const description = ref('')

      return { title, category, description }
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button>Create New Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new project.
            </DialogDescription>
          </DialogHeader>
          <div class="flex flex-col gap-4 py-4">
            <div class="flex flex-col gap-2">
              <Label for="project-title">Project Title</Label>
              <Input id="project-title" v-model="title" placeholder="My Awesome Project" />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="project-category">Category</Label>
              <Select v-model="category">
                <SelectTrigger id="project-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="project-description">Description</Label>
              <Textarea
                id="project-description"
                v-model="description"
                placeholder="Describe your project..."
                rows="4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const ViewDetails: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    },
    template: `
      <div class="rounded-lg border p-4">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-sm font-semibold">Task #1234</h3>
            <p class="text-sm text-muted-foreground">Created 2 days ago</p>
          </div>
          <Dialog>
            <DialogTrigger as-child>
              <Button variant="ghost" size="sm">View Details</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Task Details</DialogTitle>
              </DialogHeader>
              <div class="space-y-4 py-4">
                <div>
                  <h4 class="mb-1 text-sm font-semibold">Title</h4>
                  <p class="text-sm text-muted-foreground">Implement user authentication</p>
                </div>
                <div>
                  <h4 class="mb-1 text-sm font-semibold">Status</h4>
                  <p class="text-sm text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <h4 class="mb-1 text-sm font-semibold">Assigned To</h4>
                  <p class="text-sm text-muted-foreground">John Doe</p>
                </div>
                <div>
                  <h4 class="mb-1 text-sm font-semibold">Due Date</h4>
                  <p class="text-sm text-muted-foreground">January 30, 2024</p>
                </div>
                <div>
                  <h4 class="mb-1 text-sm font-semibold">Description</h4>
                  <p class="text-sm text-muted-foreground">
                    Add OAuth support for Google and GitHub authentication. Include proper
                    error handling and session management.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    `,
  }),
}

export const ConfirmationWithInput: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
      Input,
      Label,
    },
    setup() {
      const confirmText = ref('')

      return { confirmText }
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="destructive">Delete Account</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type "DELETE" to confirm.
            </DialogDescription>
          </DialogHeader>
          <div class="py-4">
            <Label for="confirm-delete">Type DELETE to confirm</Label>
            <Input
              id="confirm-delete"
              v-model="confirmText"
              placeholder="DELETE"
              class="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button
              variant="destructive"
              :disabled="confirmText !== 'DELETE'"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    `,
  }),
}

export const ComplexForm: Story = {
  render: () => ({
    components: {
      Button,
      Dialog,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogScrollContent,
      DialogTitle,
      DialogTrigger,
      Input,
      Label,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
      Textarea,
      IconCamera,
    },
    setup() {
      const firstName = ref('')
      const lastName = ref('')
      const email = ref('')
      const phone = ref('')
      const country = ref('')
      const city = ref('')
      const address = ref('')
      const bio = ref('')

      return { firstName, lastName, email, phone, country, city, address, bio }
    },
    template: `
      <Dialog>
        <DialogTrigger as-child>
          <Button>Complete Registration</Button>
        </DialogTrigger>
        <DialogScrollContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Please provide additional information to complete your registration.
            </DialogDescription>
          </DialogHeader>
          <div class="space-y-6">
            <div class="flex flex-col items-center gap-2 border-b pb-6">
              <div class="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <IconCamera class="text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">Upload Photo</Button>
            </div>

            <div>
              <h3 class="mb-3 text-sm font-semibold">Personal Information</h3>
              <div class="flex flex-col gap-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-2">
                    <Label for="first-name">First Name</Label>
                    <Input id="first-name" v-model="firstName" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <Label for="last-name">Last Name</Label>
                    <Input id="last-name" v-model="lastName" />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="reg-email">Email</Label>
                  <Input id="reg-email" v-model="email" type="email" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="reg-phone">Phone Number</Label>
                  <Input id="reg-phone" v-model="phone" type="tel" />
                </div>
              </div>
            </div>

            <div>
              <h3 class="mb-3 text-sm font-semibold">Location</h3>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <Label for="country">Country</Label>
                  <Select v-model="country">
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="city">City</Label>
                  <Input id="city" v-model="city" />
                </div>
                <div class="flex flex-col gap-2">
                  <Label for="reg-address">Address</Label>
                  <Input id="reg-address" v-model="address" />
                </div>
              </div>
            </div>

            <div>
              <h3 class="mb-3 text-sm font-semibold">About You</h3>
              <div class="flex flex-col gap-2">
                <Label for="reg-bio">Bio</Label>
                <Textarea id="reg-bio" v-model="bio" rows="4" placeholder="Tell us about yourself..." />
              </div>
            </div>
          </div>
          <DialogFooter class="mt-6">
            <Button variant="outline">Save as Draft</Button>
            <Button>Complete Registration</Button>
          </DialogFooter>
        </DialogScrollContent>
      </Dialog>
    `,
  }),
}
