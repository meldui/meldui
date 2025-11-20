import { IconAlertTriangle, IconLogout, IconTrash } from '@meldui/tabler-vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'

const meta: Meta<typeof AlertDialog> = {
  title: 'Components/Overlay/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A modal dialog that interrupts the user with important content and expects a response. Used for confirmations, warnings, or critical decisions that require user attention.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const Destructive: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone
              and all your data will be permanently removed from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
      IconAlertTriangle,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline">Show Warning</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div class="flex items-center gap-2">
              <IconAlertTriangle class="text-destructive" />
              <AlertDialogTitle>Warning</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              You are about to perform a potentially dangerous action. Please review
              carefully before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>I understand, proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const WithLongContent: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline">Show Terms</Button>
        </AlertDialogTrigger>
        <AlertDialogContent class="max-h-[calc(100vh-4rem)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
            <AlertDialogDescription>
              Please read and accept our terms and conditions before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div class="max-h-[400px] overflow-y-auto rounded-md border p-4 text-sm">
            <h3 class="mb-2 font-semibold">1. Introduction</h3>
            <p class="mb-4 text-muted-foreground">
              These terms and conditions outline the rules and regulations for the use of
              our service. By accessing this service we assume you accept these terms and
              conditions.
            </p>
            <h3 class="mb-2 font-semibold">2. Intellectual Property Rights</h3>
            <p class="mb-4 text-muted-foreground">
              Other than the content you own, under these Terms, we and/or our licensors
              own all the intellectual property rights and materials contained in this
              service.
            </p>
            <h3 class="mb-2 font-semibold">3. Restrictions</h3>
            <p class="mb-4 text-muted-foreground">
              You are specifically restricted from all of the following: publishing any
              service material in any other media; selling, sublicensing and/or otherwise
              commercializing any service material.
            </p>
            <h3 class="mb-2 font-semibold">4. Your Privacy</h3>
            <p class="mb-4 text-muted-foreground">
              Please read our Privacy Policy, which also governs your visit to our
              service, to understand our practices.
            </p>
            <h3 class="mb-2 font-semibold">5. No warranties</h3>
            <p class="mb-4 text-muted-foreground">
              This service is provided "as is," with all faults, and we express no
              representations or warranties, of any kind related to this service.
            </p>
            <h3 class="mb-2 font-semibold">6. Limitation of liability</h3>
            <p class="mb-4 text-muted-foreground">
              In no event shall we, nor any of our officers, directors and employees, be
              held liable for anything arising out of or in any way connected with your
              use of this service.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Decline</AlertDialogCancel>
            <AlertDialogAction>Accept Terms</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const WithoutCancel: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline">Show Notification</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Complete</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile has been successfully updated. All changes have been saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const DeleteConfirmation: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
      IconTrash,
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="rounded-lg border p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-semibold">Project Alpha</h3>
              <p class="text-sm text-muted-foreground">Last updated 2 days ago</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="ghost" size="sm" class="gap-2">
                  <IconTrash :size="16" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "Project Alpha"? This will permanently
                    delete the project and all its associated data. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    `,
  }),
}

export const LogoutConfirmation: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
      IconLogout,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline" class="gap-2">
            <IconLogout :size="16" />
            Logout
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay Logged In</AlertDialogCancel>
            <AlertDialogAction>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const UnsavedChanges: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
      IconAlertTriangle,
    },
    template: `
      <div class="flex flex-col gap-4">
        <div class="rounded-lg border p-4">
          <h3 class="mb-2 text-sm font-semibold">Edit Profile</h3>
          <div class="space-y-2">
            <input
              type="text"
              placeholder="Name"
              class="w-full rounded border px-3 py-2 text-sm"
            />
            <input
              type="email"
              placeholder="Email"
              class="w-full rounded border px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Bio"
              rows="3"
              class="w-full rounded border px-3 py-2 text-sm"
            ></textarea>
          </div>
        </div>
        <div class="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="outline">Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div class="flex items-center gap-2">
                  <IconAlertTriangle class="text-warning" />
                  <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  You have unsaved changes. Are you sure you want to discard them?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                <AlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Discard Changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button>Save Changes</Button>
        </div>
      </div>
    `,
  }),
}

export const CustomStyling: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button>Custom Style</Button>
        </AlertDialogTrigger>
        <AlertDialogContent class="border-primary">
          <AlertDialogHeader class="border-b pb-4">
            <AlertDialogTitle class="text-primary">Custom Styled Dialog</AlertDialogTitle>
            <AlertDialogDescription class="text-base">
              This dialog demonstrates custom styling capabilities. You can customize
              borders, colors, spacing, and more.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div class="py-4">
            <p class="text-sm text-muted-foreground">
              Additional content can be added here with custom styling as needed.
            </p>
          </div>
          <AlertDialogFooter class="border-t pt-4">
            <AlertDialogCancel class="border-primary text-primary hover:bg-primary/10">
              Custom Cancel
            </AlertDialogCancel>
            <AlertDialogAction class="bg-primary hover:bg-primary/90">
              Custom Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}

export const MultipleActions: Story = {
  render: () => ({
    components: {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
      Button,
    },
    template: `
      <AlertDialog>
        <AlertDialogTrigger as-child>
          <Button variant="outline">Save Options</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Your Work</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you want to save your document before closing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter class="flex-col gap-2 sm:flex-col">
            <AlertDialogAction>Save and Close</AlertDialogAction>
            <AlertDialogAction class="bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Save as Draft
            </AlertDialogAction>
            <AlertDialogCancel>Don't Save</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    `,
  }),
}
