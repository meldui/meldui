import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBell,
  IconBellOff,
  IconBold,
  IconCode,
  IconHeart,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconMicrophone,
  IconMicrophoneOff,
  IconQuote,
  IconStar,
  IconStrikethrough,
  IconUnderline,
  IconVolume,
  IconVolumeOff,
} from '@meldui/tabler-vue'
import { Toggle } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Toggle> = {
  title: 'Components/Interactive/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A two-state button that can be toggled on or off. Perfect for toolbar actions, formatting options, and settings that have an on/off state.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <Toggle aria-label="Toggle bold">
        <IconBold />
      </Toggle>
    `,
  }),
}

export const WithText: Story = {
  render: () => ({
    components: { Toggle },
    template: `
      <Toggle aria-label="Toggle italic">Italic</Toggle>
    `,
  }),
}

export const WithIconAndText: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <Toggle aria-label="Toggle bold">
        <IconBold />
        Bold
      </Toggle>
    `,
  }),
}

export const Outline: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <Toggle variant="outline" aria-label="Toggle bold">
        <IconBold />
      </Toggle>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <div class="flex items-center gap-4">
        <Toggle size="sm" aria-label="Toggle bold small">
          <IconBold />
        </Toggle>
        <Toggle aria-label="Toggle bold default">
          <IconBold />
        </Toggle>
        <Toggle size="lg" aria-label="Toggle bold large">
          <IconBold />
        </Toggle>
      </div>
    `,
  }),
}

export const SizesWithText: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <div class="flex items-center gap-4">
        <Toggle size="sm" aria-label="Toggle bold">
          <IconBold />
          Bold
        </Toggle>
        <Toggle aria-label="Toggle bold">
          <IconBold />
          Bold
        </Toggle>
        <Toggle size="lg" aria-label="Toggle bold">
          <IconBold />
          Bold
        </Toggle>
      </div>
    `,
  }),
}

export const Variants: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <div class="flex items-center gap-4">
        <Toggle variant="default" aria-label="Toggle bold">
          <IconBold />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle bold">
          <IconBold />
        </Toggle>
      </div>
    `,
  }),
}

export const TextFormatting: Story = {
  render: () => ({
    components: { Toggle, IconBold, IconItalic, IconUnderline, IconStrikethrough },
    template: `
      <div class="flex items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle bold">
          <IconBold />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle italic">
          <IconItalic />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle underline">
          <IconUnderline />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle strikethrough">
          <IconStrikethrough />
        </Toggle>
      </div>
    `,
  }),
}

export const TextAlignment: Story = {
  render: () => ({
    components: { Toggle, IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustified },
    setup() {
      const alignment = ref<string>('left')
      return { alignment }
    },
    template: `
      <div class="flex items-center gap-2">
        <Toggle
          variant="outline"
          :pressed="alignment === 'left'"
          @update:pressed="(pressed) => pressed && (alignment = 'left')"
          aria-label="Align left"
        >
          <IconAlignLeft />
        </Toggle>
        <Toggle
          variant="outline"
          :pressed="alignment === 'center'"
          @update:pressed="(pressed) => pressed && (alignment = 'center')"
          aria-label="Align center"
        >
          <IconAlignCenter />
        </Toggle>
        <Toggle
          variant="outline"
          :pressed="alignment === 'right'"
          @update:pressed="(pressed) => pressed && (alignment = 'right')"
          aria-label="Align right"
        >
          <IconAlignRight />
        </Toggle>
        <Toggle
          variant="outline"
          :pressed="alignment === 'justify'"
          @update:pressed="(pressed) => pressed && (alignment = 'justify')"
          aria-label="Align justify"
        >
          <IconAlignJustified />
        </Toggle>
      </div>
    `,
  }),
}

export const ListTypes: Story = {
  render: () => ({
    components: { Toggle, IconList, IconListNumbers },
    template: `
      <div class="flex items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle bullet list">
          <IconList />
          Bullet List
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle numbered list">
          <IconListNumbers />
          Numbered List
        </Toggle>
      </div>
    `,
  }),
}

export const CodeAndQuote: Story = {
  render: () => ({
    components: { Toggle, IconCode, IconQuote, IconLink },
    template: `
      <div class="flex items-center gap-2">
        <Toggle variant="outline" aria-label="Toggle code">
          <IconCode />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle quote">
          <IconQuote />
        </Toggle>
        <Toggle variant="outline" aria-label="Toggle link">
          <IconLink />
        </Toggle>
      </div>
    `,
  }),
}

export const Controlled: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    setup() {
      const pressed = ref(false)
      return { pressed }
    },
    template: `
      <div class="space-y-4">
        <Toggle
          v-model:pressed="pressed"
          variant="outline"
          aria-label="Toggle bold"
        >
          <IconBold />
          Bold
        </Toggle>
        <div class="text-sm text-muted-foreground">
          State: {{ pressed ? 'On' : 'Off' }}
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <div class="flex items-center gap-4">
        <Toggle disabled aria-label="Toggle bold">
          <IconBold />
        </Toggle>
        <Toggle variant="outline" disabled aria-label="Toggle bold">
          <IconBold />
        </Toggle>
        <Toggle disabled aria-label="Toggle bold">
          <IconBold />
          Bold
        </Toggle>
      </div>
    `,
  }),
}

export const DisabledPressed: Story = {
  render: () => ({
    components: { Toggle, IconBold },
    template: `
      <div class="flex items-center gap-4">
        <Toggle :pressed="true" disabled aria-label="Toggle bold">
          <IconBold />
        </Toggle>
        <Toggle variant="outline" :pressed="true" disabled aria-label="Toggle bold">
          <IconBold />
        </Toggle>
      </div>
    `,
  }),
}

export const MicrophoneToggle: Story = {
  render: () => ({
    components: { Toggle, IconMicrophone, IconMicrophoneOff },
    setup() {
      const isMuted = ref(false)
      return { isMuted }
    },
    template: `
      <div class="space-y-4">
        <Toggle
          v-model:pressed="isMuted"
          variant="outline"
          aria-label="Toggle microphone"
        >
          <IconMicrophoneOff v-if="isMuted" />
          <IconMicrophone v-else />
          {{ isMuted ? 'Unmute' : 'Mute' }}
        </Toggle>
        <div class="text-sm text-muted-foreground">
          Microphone: {{ isMuted ? 'Muted' : 'Active' }}
        </div>
      </div>
    `,
  }),
}

export const VolumeToggle: Story = {
  render: () => ({
    components: { Toggle, IconVolume, IconVolumeOff },
    setup() {
      const isMuted = ref(false)
      return { isMuted }
    },
    template: `
      <Toggle
        v-model:pressed="isMuted"
        variant="outline"
        size="lg"
        aria-label="Toggle volume"
      >
        <IconVolumeOff v-if="isMuted" class="text-destructive" />
        <IconVolume v-else class="text-primary" />
      </Toggle>
    `,
  }),
}

export const FavoriteToggle: Story = {
  render: () => ({
    components: { Toggle, IconStar },
    setup() {
      const isFavorite = ref(false)
      return { isFavorite }
    },
    template: `
      <Toggle
        v-model:pressed="isFavorite"
        variant="outline"
        aria-label="Toggle favorite"
      >
        <IconStar :class="isFavorite ? 'fill-yellow-400 text-yellow-400' : ''" />
        {{ isFavorite ? 'Favorited' : 'Favorite' }}
      </Toggle>
    `,
  }),
}

export const LikeToggle: Story = {
  render: () => ({
    components: { Toggle, IconHeart },
    setup() {
      const isLiked = ref(false)
      return { isLiked }
    },
    template: `
      <Toggle
        v-model:pressed="isLiked"
        variant="outline"
        aria-label="Toggle like"
      >
        <IconHeart :class="isLiked ? 'fill-red-500 text-red-500' : ''" />
      </Toggle>
    `,
  }),
}

export const NotificationToggle: Story = {
  render: () => ({
    components: { Toggle, IconBell, IconBellOff },
    setup() {
      const notificationsEnabled = ref(true)
      return { notificationsEnabled }
    },
    template: `
      <div class="space-y-4">
        <Toggle
          v-model:pressed="notificationsEnabled"
          variant="outline"
          aria-label="Toggle notifications"
        >
          <IconBell v-if="notificationsEnabled" />
          <IconBellOff v-else />
          Notifications
        </Toggle>
        <div class="text-sm text-muted-foreground">
          Notifications: {{ notificationsEnabled ? 'Enabled' : 'Disabled' }}
        </div>
      </div>
    `,
  }),
}

export const Toolbar: Story = {
  render: () => ({
    components: {
      Toggle,
      IconBold,
      IconItalic,
      IconUnderline,
      IconAlignLeft,
      IconAlignCenter,
      IconAlignRight,
      IconList,
      IconLink,
    },
    setup() {
      const bold = ref(false)
      const italic = ref(false)
      const underline = ref(false)
      const alignment = ref<string>('left')
      const bulletList = ref(false)
      const link = ref(false)
      return { bold, italic, underline, alignment, bulletList, link }
    },
    template: `
      <div class="flex flex-wrap items-center gap-1 rounded-lg border p-2">
        <div class="flex items-center gap-1">
          <Toggle v-model:pressed="bold" size="sm" aria-label="Toggle bold">
            <IconBold />
          </Toggle>
          <Toggle v-model:pressed="italic" size="sm" aria-label="Toggle italic">
            <IconItalic />
          </Toggle>
          <Toggle v-model:pressed="underline" size="sm" aria-label="Toggle underline">
            <IconUnderline />
          </Toggle>
        </div>
        <div class="mx-1 h-6 w-px bg-border" />
        <div class="flex items-center gap-1">
          <Toggle
            :pressed="alignment === 'left'"
            @update:pressed="(pressed) => pressed && (alignment = 'left')"
            size="sm"
            aria-label="Align left"
          >
            <IconAlignLeft />
          </Toggle>
          <Toggle
            :pressed="alignment === 'center'"
            @update:pressed="(pressed) => pressed && (alignment = 'center')"
            size="sm"
            aria-label="Align center"
          >
            <IconAlignCenter />
          </Toggle>
          <Toggle
            :pressed="alignment === 'right'"
            @update:pressed="(pressed) => pressed && (alignment = 'right')"
            size="sm"
            aria-label="Align right"
          >
            <IconAlignRight />
          </Toggle>
        </div>
        <div class="mx-1 h-6 w-px bg-border" />
        <div class="flex items-center gap-1">
          <Toggle v-model:pressed="bulletList" size="sm" aria-label="Toggle list">
            <IconList />
          </Toggle>
          <Toggle v-model:pressed="link" size="sm" aria-label="Toggle link">
            <IconLink />
          </Toggle>
        </div>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: { Toggle, IconBell, IconBellOff },
    setup() {
      const notifications = ref(true)
      return { notifications }
    },
    template: `
      <div class="mx-auto w-full max-w-md rounded-lg border p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Notification Settings</h3>
          <p class="text-sm text-muted-foreground">Manage your notification preferences</p>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium">Push Notifications</div>
            <div class="text-xs text-muted-foreground">
              Receive notifications about updates
            </div>
          </div>
          <Toggle
            v-model:pressed="notifications"
            variant="outline"
            aria-label="Toggle notifications"
          >
            <IconBell v-if="notifications" />
            <IconBellOff v-else />
          </Toggle>
        </div>
      </div>
    `,
  }),
}
