import { Button, Label, Textarea } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A multi-line text input component with auto-resize support. Perfect for comments, descriptions, and long-form content. Built with accessibility in mind.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { Textarea },
    setup() {
      const content = ref('')
      return { content }
    },
    template: `
      <div class="max-w-md">
        <Textarea v-model="content" placeholder="Type your message..." />
      </div>
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const message = ref('')
      return { message }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="message">Message</Label>
        <Textarea id="message" v-model="message" placeholder="Enter your message..." />
      </div>
    `,
  }),
}

export const WithValue: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const description = ref(
        'This is a pre-filled description that demonstrates how the textarea component handles existing content.',
      )
      return { description }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="description">Description</Label>
        <Textarea id="description" v-model="description" />
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Button, Label, Textarea },
    setup() {
      const text = ref('')

      const wordCount = computed(() => {
        return text.value.trim().split(/\s+/).filter(Boolean).length
      })

      const charCount = computed(() => {
        return text.value.length
      })

      const clear = () => {
        text.value = ''
      }

      return { text, wordCount, charCount, clear }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md">
        <div class="flex flex-col gap-2">
          <Label for="controlled">Your Text</Label>
          <Textarea
            id="controlled"
            v-model="text"
            placeholder="Start typing..."
          />
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span>{{ charCount }} characters</span>
            <span>{{ wordCount }} words</span>
          </div>
        </div>

        <Button size="sm" variant="outline" @click="clear">
          Clear Text
        </Button>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const content = ref('This textarea is disabled and cannot be edited.')
      return { content }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="disabled">Disabled Textarea</Label>
        <Textarea id="disabled" v-model="content" disabled />
      </div>
    `,
  }),
}

export const WithError: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const feedback = ref('')
      return { feedback }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="feedback-error">
          Feedback
          <span class="text-destructive ml-1">*</span>
        </Label>
        <Textarea
          id="feedback-error"
          v-model="feedback"
          placeholder="Please provide your feedback..."
          aria-invalid="true"
          aria-describedby="feedback-error-message"
        />
        <p id="feedback-error-message" class="text-xs text-destructive">
          Feedback is required and must be at least 10 characters
        </p>
      </div>
    `,
  }),
}

export const CommentBox: Story = {
  render: () => ({
    components: { Button, Label, Textarea },
    setup() {
      const comment = ref('')

      const postComment = () => {
        if (comment.value.trim()) {
          alert(`Comment posted: ${comment.value}`)
          comment.value = ''
        }
      }

      return { comment, postComment }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-md p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <Label for="comment">Add a comment</Label>
          <Textarea
            id="comment"
            v-model="comment"
            placeholder="Share your thoughts..."
            class="min-h-24"
          />
          <p class="text-xs text-muted-foreground">
            {{ comment.length }}/500 characters
          </p>
        </div>

        <div class="flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" @click="comment = ''">
            Cancel
          </Button>
          <Button size="sm" @click="postComment">
            Post Comment
          </Button>
        </div>
      </div>
    `,
  }),
}

export const BioField: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const bio = ref('')
      const maxLength = 200

      const remaining = computed(() => maxLength - bio.value.length)

      return { bio, maxLength, remaining }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="bio">Bio</Label>
        <Textarea
          id="bio"
          v-model="bio"
          placeholder="Tell us about yourself..."
          :maxlength="maxLength"
        />
        <p class="text-xs text-muted-foreground text-right">
          {{ remaining }} characters remaining
        </p>
      </div>
    `,
  }),
}

export const MessageComposer: Story = {
  render: () => ({
    components: { Button, Label, Textarea },
    setup() {
      const message = ref('')

      const sendMessage = () => {
        if (message.value.trim()) {
          alert(`Message sent: ${message.value}`)
          message.value = ''
        }
      }

      return { message, sendMessage }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-lg p-6 border rounded-lg">
        <h3 class="text-lg font-semibold">New Message</h3>

        <div class="flex flex-col gap-2">
          <Label for="message-composer">Message</Label>
          <Textarea
            id="message-composer"
            v-model="message"
            placeholder="Type your message here..."
            class="min-h-32"
          />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">
            {{ message.length }} characters
          </span>
          <Button @click="sendMessage" :disabled="!message.trim()">
            Send Message
          </Button>
        </div>
      </div>
    `,
  }),
}

export const FeedbackForm: Story = {
  render: () => ({
    components: { Button, Label, Textarea },
    setup() {
      const formData = ref({
        experience: '',
        improvements: '',
        additional: '',
      })

      const errors = ref({
        experience: '',
        improvements: '',
      })

      const handleSubmit = () => {
        errors.value = { experience: '', improvements: '' }

        if (formData.value.experience.trim().length < 10) {
          errors.value.experience = 'Please provide at least 10 characters'
        }

        if (formData.value.improvements.trim().length < 10) {
          errors.value.improvements = 'Please provide at least 10 characters'
        }

        if (!errors.value.experience && !errors.value.improvements) {
          alert(JSON.stringify(formData.value, null, 2))
        }
      }

      return { formData, errors, handleSubmit }
    },
    template: `
      <form @submit.prevent="handleSubmit" class="max-w-lg flex flex-col gap-6 p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Product Feedback</h3>
          <p class="text-sm text-muted-foreground">
            Help us improve by sharing your experience
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="experience">
            How was your experience?
            <span class="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="experience"
            v-model="formData.experience"
            placeholder="Tell us about your experience..."
            :aria-invalid="!!errors.experience"
            :aria-describedby="errors.experience ? 'experience-error' : undefined"
          />
          <p v-if="errors.experience" id="experience-error" class="text-xs text-destructive">
            {{ errors.experience }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="improvements">
            What could be improved?
            <span class="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="improvements"
            v-model="formData.improvements"
            placeholder="Share your suggestions..."
            :aria-invalid="!!errors.improvements"
            :aria-describedby="errors.improvements ? 'improvements-error' : undefined"
          />
          <p v-if="errors.improvements" id="improvements-error" class="text-xs text-destructive">
            {{ errors.improvements }}
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="additional">Additional comments (optional)</Label>
          <Textarea
            id="additional"
            v-model="formData.additional"
            placeholder="Any other feedback..."
          />
        </div>

        <Button type="submit" class="w-full">
          Submit Feedback
        </Button>
      </form>
    `,
  }),
}

export const LongText: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const article = ref(
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
      )
      return { article }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-2xl">
        <Label for="article">Article Content</Label>
        <Textarea id="article" v-model="article" class="min-h-64" />
      </div>
    `,
  }),
}

export const CharacterLimit: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const tweet = ref('')
      const maxChars = 280

      const remaining = computed(() => maxChars - tweet.value.length)
      const isOverLimit = computed(() => remaining.value < 0)
      const isNearLimit = computed(() => remaining.value <= 20 && remaining.value >= 0)

      return { tweet, maxChars, remaining, isOverLimit, isNearLimit }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <Label for="tweet">Compose Tweet</Label>
        <Textarea
          id="tweet"
          v-model="tweet"
          placeholder="What's happening?"
          :aria-invalid="isOverLimit"
        />
        <div class="flex items-center justify-between">
          <p
            class="text-xs"
            :class="{
              'text-destructive': isOverLimit,
              'text-orange-500': isNearLimit,
              'text-muted-foreground': !isNearLimit && !isOverLimit
            }"
          >
            {{ remaining }} characters remaining
          </p>
          <p class="text-xs text-muted-foreground">
            {{ tweet.length }}/{{ maxChars }}
          </p>
        </div>
      </div>
    `,
  }),
}

export const CodeSnippet: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const code = ref('')
      return { code }
    },
    template: `
      <div class="flex flex-col gap-2 max-w-2xl">
        <Label for="code">Code Snippet</Label>
        <Textarea
          id="code"
          v-model="code"
          placeholder="Paste your code here..."
          class="min-h-48 font-mono text-sm"
        />
        <p class="text-xs text-muted-foreground">
          Use monospace font for better code readability
        </p>
      </div>
    `,
  }),
}

export const MultipleTextareas: Story = {
  render: () => ({
    components: { Label, Textarea },
    setup() {
      const profile = ref({
        bio: '',
        experience: '',
        interests: '',
        goals: '',
      })
      return { profile }
    },
    template: `
      <div class="flex flex-col gap-6 max-w-2xl p-6 border rounded-lg">
        <h3 class="text-lg font-semibold">Complete Your Profile</h3>

        <div class="flex flex-col gap-2">
          <Label for="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            v-model="profile.bio"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="profile-experience">Work Experience</Label>
          <Textarea
            id="profile-experience"
            v-model="profile.experience"
            placeholder="Describe your professional background..."
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="profile-interests">Interests</Label>
          <Textarea
            id="profile-interests"
            v-model="profile.interests"
            placeholder="What are you passionate about?"
          />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="profile-goals">Career Goals</Label>
          <Textarea
            id="profile-goals"
            v-model="profile.goals"
            placeholder="What are your aspirations?"
          />
        </div>
      </div>
    `,
  }),
}

export const ReviewForm: Story = {
  render: () => ({
    components: { Button, Label, Textarea },
    setup() {
      const review = ref({
        title: '',
        content: '',
      })

      const submitReview = () => {
        if (review.value.content.trim()) {
          alert(JSON.stringify(review.value, null, 2))
          review.value = { title: '', content: '' }
        }
      }

      return { review, submitReview }
    },
    template: `
      <div class="flex flex-col gap-4 max-w-lg p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Write a Review</h3>
          <p class="text-sm text-muted-foreground">
            Share your thoughts about this product
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="review-content">Your Review</Label>
          <Textarea
            id="review-content"
            v-model="review.content"
            placeholder="What did you think about this product?"
            class="min-h-32"
          />
          <p class="text-xs text-muted-foreground">
            Minimum 50 characters ({{ review.content.length }}/50)
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="outline" @click="review = { title: '', content: '' }">
            Cancel
          </Button>
          <Button
            @click="submitReview"
            :disabled="review.content.length < 50"
          >
            Submit Review
          </Button>
        </div>
      </div>
    `,
  }),
}

export const SupportTicket: Story = {
  render: () => ({
    components: { Button, Label, Textarea },
    setup() {
      const ticket = ref({
        subject: '',
        description: '',
      })

      const priority = ref<'low' | 'medium' | 'high'>('medium')

      const submitTicket = () => {
        alert(JSON.stringify({ ...ticket.value, priority: priority.value }, null, 2))
      }

      return { ticket, priority, submitTicket }
    },
    template: `
      <div class="flex flex-col gap-6 max-w-lg p-6 border rounded-lg">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">Submit Support Ticket</h3>
          <p class="text-sm text-muted-foreground">
            Describe your issue and we'll help you resolve it
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="ticket-description">
            Description
            <span class="text-destructive ml-1">*</span>
          </Label>
          <Textarea
            id="ticket-description"
            v-model="ticket.description"
            placeholder="Please provide a detailed description of your issue..."
            class="min-h-40"
          />
          <p class="text-xs text-muted-foreground">
            Be as specific as possible to help us assist you better
          </p>
        </div>

        <Button
          @click="submitTicket"
          :disabled="ticket.description.length < 20"
          class="w-full"
        >
          Submit Ticket
        </Button>
      </div>
    `,
  }),
}
