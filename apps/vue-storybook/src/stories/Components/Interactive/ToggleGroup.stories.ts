import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconCode,
  IconFileText,
  IconHeading,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconMusic,
  IconPhoto,
  IconQuote,
  IconStrikethrough,
  IconTable,
  IconUnderline,
  IconVideo,
} from '@meldui/tabler-vue'
import { ToggleGroup, ToggleGroupItem } from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/Interactive/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A set of two-state buttons that can be toggled on or off. Supports single or multiple selection modes, perfect for toolbars and option groups.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconBold, IconItalic, IconUnderline },
    template: `
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconBold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconItalic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconUnderline />
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const SingleSelection: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconAlignLeft, IconAlignCenter, IconAlignRight },
    setup() {
      const alignment = ref('left')
      return { alignment }
    },
    template: `
      <div class="space-y-4">
        <ToggleGroup v-model="alignment" type="single">
          <ToggleGroupItem value="left" aria-label="Align left">
            <IconAlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <IconAlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <IconAlignRight />
          </ToggleGroupItem>
        </ToggleGroup>
        <div class="text-sm text-muted-foreground">Selected: {{ alignment }}</div>
      </div>
    `,
  }),
}

export const MultipleSelection: Story = {
  render: () => ({
    components: {
      ToggleGroup,
      ToggleGroupItem,
      IconBold,
      IconItalic,
      IconUnderline,
      IconStrikethrough,
    },
    setup() {
      const formatting = ref<string[]>([])
      return { formatting }
    },
    template: `
      <div class="space-y-4">
        <ToggleGroup v-model="formatting" type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <IconBold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <IconItalic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <IconUnderline />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
            <IconStrikethrough />
          </ToggleGroupItem>
        </ToggleGroup>
        <div class="text-sm text-muted-foreground">
          Selected: {{ formatting.length > 0 ? formatting.join(', ') : 'None' }}
        </div>
      </div>
    `,
  }),
}

export const Outline: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconBold, IconItalic, IconUnderline },
    template: `
      <ToggleGroup variant="outline" type="multiple">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconBold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconItalic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconUnderline />
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconBold, IconItalic, IconUnderline },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <div class="mb-2 text-xs text-muted-foreground">Small</div>
          <ToggleGroup size="sm" type="multiple">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <IconBold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <IconItalic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <IconUnderline />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <div class="mb-2 text-xs text-muted-foreground">Default</div>
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <IconBold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <IconItalic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <IconUnderline />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <div class="mb-2 text-xs text-muted-foreground">Large</div>
          <ToggleGroup size="lg" type="multiple">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <IconBold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <IconItalic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <IconUnderline />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    `,
  }),
}

export const WithText: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconBold, IconItalic, IconUnderline },
    template: `
      <ToggleGroup variant="outline" type="multiple">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconBold />
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconItalic />
          Italic
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconUnderline />
          Underline
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const TextAlignment: Story = {
  render: () => ({
    components: {
      ToggleGroup,
      ToggleGroupItem,
      IconAlignLeft,
      IconAlignCenter,
      IconAlignRight,
      IconAlignJustified,
    },
    setup() {
      const alignment = ref('left')
      return { alignment }
    },
    template: `
      <ToggleGroup v-model="alignment" variant="outline" type="single">
        <ToggleGroupItem value="left" aria-label="Align left">
          <IconAlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <IconAlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <IconAlignRight />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Align justify">
          <IconAlignJustified />
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const ListOptions: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconList, IconListNumbers },
    setup() {
      const listType = ref<string>()
      return { listType }
    },
    template: `
      <ToggleGroup v-model="listType" variant="outline" type="single">
        <ToggleGroupItem value="bullet" aria-label="Bullet list">
          <IconList />
          Bullet List
        </ToggleGroupItem>
        <ToggleGroupItem value="numbered" aria-label="Numbered list">
          <IconListNumbers />
          Numbered List
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const InsertOptions: Story = {
  render: () => ({
    components: {
      ToggleGroup,
      ToggleGroupItem,
      IconCode,
      IconLink,
      IconQuote,
      IconTable,
    },
    template: `
      <ToggleGroup variant="outline" type="multiple">
        <ToggleGroupItem value="code" aria-label="Insert code">
          <IconCode />
        </ToggleGroupItem>
        <ToggleGroupItem value="link" aria-label="Insert link">
          <IconLink />
        </ToggleGroupItem>
        <ToggleGroupItem value="quote" aria-label="Insert quote">
          <IconQuote />
        </ToggleGroupItem>
        <ToggleGroupItem value="table" aria-label="Insert table">
          <IconTable />
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const HeadingLevels: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconHeading },
    setup() {
      const heading = ref<string>()
      return { heading }
    },
    template: `
      <ToggleGroup v-model="heading" variant="outline" type="single">
        <ToggleGroupItem value="h1" aria-label="Heading 1">
          <IconHeading />
          H1
        </ToggleGroupItem>
        <ToggleGroupItem value="h2" aria-label="Heading 2">
          <IconHeading />
          H2
        </ToggleGroupItem>
        <ToggleGroupItem value="h3" aria-label="Heading 3">
          <IconHeading />
          H3
        </ToggleGroupItem>
        <ToggleGroupItem value="h4" aria-label="Heading 4">
          <IconHeading />
          H4
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const MediaTypes: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconPhoto, IconVideo, IconMusic, IconFileText },
    setup() {
      const mediaTypes = ref<string[]>([])
      return { mediaTypes }
    },
    template: `
      <ToggleGroup v-model="mediaTypes" variant="outline" type="multiple">
        <ToggleGroupItem value="image" aria-label="Images">
          <IconPhoto />
          Images
        </ToggleGroupItem>
        <ToggleGroupItem value="video" aria-label="Videos">
          <IconVideo />
          Videos
        </ToggleGroupItem>
        <ToggleGroupItem value="audio" aria-label="Audio">
          <IconMusic />
          Audio
        </ToggleGroupItem>
        <ToggleGroupItem value="document" aria-label="Documents">
          <IconFileText />
          Docs
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const SocialPlatforms: Story = {
  render: () => ({
    components: {
      ToggleGroup,
      ToggleGroupItem,
      IconBrandTwitter,
      IconBrandFacebook,
      IconBrandInstagram,
      IconBrandLinkedin,
    },
    setup() {
      const platforms = ref<string[]>(['twitter', 'instagram'])
      return { platforms }
    },
    template: `
      <div class="space-y-4">
        <ToggleGroup v-model="platforms" variant="outline" type="multiple">
          <ToggleGroupItem value="twitter" aria-label="Twitter">
            <IconBrandTwitter />
          </ToggleGroupItem>
          <ToggleGroupItem value="facebook" aria-label="Facebook">
            <IconBrandFacebook />
          </ToggleGroupItem>
          <ToggleGroupItem value="instagram" aria-label="Instagram">
            <IconBrandInstagram />
          </ToggleGroupItem>
          <ToggleGroupItem value="linkedin" aria-label="LinkedIn">
            <IconBrandLinkedin />
          </ToggleGroupItem>
        </ToggleGroup>
        <div class="text-sm text-muted-foreground">
          Share to: {{ platforms.length > 0 ? platforms.join(', ') : 'None selected' }}
        </div>
      </div>
    `,
  }),
}

export const WithSpacing: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconBold, IconItalic, IconUnderline },
    template: `
      <div class="flex flex-col gap-6">
        <div>
          <div class="mb-2 text-xs text-muted-foreground">No spacing (default)</div>
          <ToggleGroup variant="outline" type="multiple">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <IconBold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <IconItalic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <IconUnderline />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <div class="mb-2 text-xs text-muted-foreground">With spacing</div>
          <ToggleGroup variant="outline" type="multiple" :spacing="2">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <IconBold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <IconItalic />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <IconUnderline />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconBold, IconItalic, IconUnderline },
    template: `
      <ToggleGroup disabled variant="outline" type="multiple">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconBold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconItalic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconUnderline />
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const DisabledItems: Story = {
  render: () => ({
    components: { ToggleGroup, ToggleGroupItem, IconBold, IconItalic, IconUnderline },
    template: `
      <ToggleGroup variant="outline" type="multiple">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconBold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" disabled aria-label="Toggle italic">
          <IconItalic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconUnderline />
        </ToggleGroupItem>
      </ToggleGroup>
    `,
  }),
}

export const EditorToolbar: Story = {
  render: () => ({
    components: {
      ToggleGroup,
      ToggleGroupItem,
      IconBold,
      IconItalic,
      IconUnderline,
      IconStrikethrough,
      IconAlignLeft,
      IconAlignCenter,
      IconAlignRight,
      IconList,
      IconListNumbers,
      IconCode,
      IconLink,
    },
    setup() {
      const formatting = ref<string[]>([])
      const alignment = ref('left')
      const insertOptions = ref<string[]>([])
      return { formatting, alignment, insertOptions }
    },
    template: `
      <div class="flex flex-wrap items-center gap-2 rounded-lg border p-3">
        <ToggleGroup v-model="formatting" size="sm" type="multiple">
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <IconBold />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <IconItalic />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <IconUnderline />
          </ToggleGroupItem>
          <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
            <IconStrikethrough />
          </ToggleGroupItem>
        </ToggleGroup>

        <div class="h-6 w-px bg-border" />

        <ToggleGroup v-model="alignment" size="sm" type="single">
          <ToggleGroupItem value="left" aria-label="Align left">
            <IconAlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <IconAlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <IconAlignRight />
          </ToggleGroupItem>
        </ToggleGroup>

        <div class="h-6 w-px bg-border" />

        <ToggleGroup v-model="insertOptions" size="sm" type="multiple">
          <ToggleGroupItem value="list" aria-label="Bullet list">
            <IconList />
          </ToggleGroupItem>
          <ToggleGroupItem value="numbered" aria-label="Numbered list">
            <IconListNumbers />
          </ToggleGroupItem>
          <ToggleGroupItem value="code" aria-label="Code block">
            <IconCode />
          </ToggleGroupItem>
          <ToggleGroupItem value="link" aria-label="Insert link">
            <IconLink />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: {
      ToggleGroup,
      ToggleGroupItem,
      IconBrandTwitter,
      IconBrandFacebook,
      IconBrandInstagram,
      IconBrandLinkedin,
    },
    setup() {
      const platforms = ref<string[]>(['twitter'])
      return { platforms }
    },
    template: `
      <div class="mx-auto w-full max-w-md rounded-lg border p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Share Settings</h3>
          <p class="text-sm text-muted-foreground">Choose where to share your content</p>
        </div>
        <ToggleGroup v-model="platforms" variant="outline" type="multiple">
          <ToggleGroupItem value="twitter" aria-label="Twitter">
            <IconBrandTwitter />
            Twitter
          </ToggleGroupItem>
          <ToggleGroupItem value="facebook" aria-label="Facebook">
            <IconBrandFacebook />
            Facebook
          </ToggleGroupItem>
          <ToggleGroupItem value="instagram" aria-label="Instagram">
            <IconBrandInstagram />
            Instagram
          </ToggleGroupItem>
          <ToggleGroupItem value="linkedin" aria-label="LinkedIn">
            <IconBrandLinkedin />
            LinkedIn
          </ToggleGroupItem>
        </ToggleGroup>
        <div v-if="platforms.length > 0" class="mt-4 text-sm text-muted-foreground">
          Selected {{ platforms.length }} platform{{ platforms.length !== 1 ? 's' : '' }}
        </div>
      </div>
    `,
  }),
}
