import { IconHeart, IconQuote, IconShoppingCart, IconStar } from '@meldui/tabler-vue'
import type { CarouselApi } from '@meldui/vue'
import {
  Badge,
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@meldui/vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

const meta: Meta<typeof Carousel> = {
  title: 'Components/Interactive/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A responsive carousel component for cycling through elements like images, cards, or custom content. Built on Embla Carousel with support for keyboard navigation and multiple display options.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Carousel>

export const Default: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    template: `
      <div class="w-full max-w-xl mx-auto">
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="i in 5" :key="i">
              <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                <span class="text-4xl font-semibold">{{ i }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const MultipleItems: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    template: `
      <div class="w-full max-w-4xl mx-auto">
        <Carousel :opts="{ align: 'start' }">
          <CarouselContent>
            <CarouselItem v-for="i in 10" :key="i" class="md:basis-1/2 lg:basis-1/3">
              <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                <span class="text-3xl font-semibold">{{ i }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const WithImages: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    setup() {
      const images = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
      ]
      return { images }
    },
    template: `
      <div class="w-full max-w-xl mx-auto">
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="(image, index) in images" :key="index">
              <div class="aspect-video overflow-hidden rounded-lg">
                <img
                  :src="image + '?w=800&h=600&fit=crop'"
                  :alt="'Slide ' + (index + 1)"
                  class="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const WithCaptions: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    setup() {
      const slides = [
        { title: 'Mountain Vista', description: 'Breathtaking mountain landscape' },
        { title: 'Ocean Waves', description: 'Peaceful ocean scenery' },
        { title: 'Forest Path', description: 'Serene forest walkway' },
        { title: 'Desert Sunset', description: 'Golden desert at dusk' },
      ]
      return { slides }
    },
    template: `
      <div class="w-full max-w-xl mx-auto">
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="(slide, index) in slides" :key="index">
              <div class="rounded-lg border bg-muted/50">
                <div class="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <span class="text-6xl font-bold text-primary/40">{{ index + 1 }}</span>
                </div>
                <div class="p-6">
                  <h3 class="text-lg font-semibold">{{ slide.title }}</h3>
                  <p class="text-sm text-muted-foreground">{{ slide.description }}</p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const ProductShowcase: Story = {
  render: () => ({
    components: {
      Carousel,
      CarouselContent,
      CarouselItem,
      CarouselNext,
      CarouselPrevious,
      Button,
      IconStar,
      IconShoppingCart,
      IconHeart,
    },
    setup() {
      const products = [
        { name: 'Wireless Headphones', price: '$129', rating: 4.5 },
        { name: 'Smart Watch', price: '$299', rating: 4.8 },
        { name: 'Laptop Stand', price: '$49', rating: 4.3 },
        { name: 'Mechanical Keyboard', price: '$159', rating: 4.7 },
      ]
      return { products }
    },
    template: `
      <div class="w-full max-w-xl mx-auto">
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="(product, index) in products" :key="index">
              <div class="rounded-lg border bg-background">
                <div class="flex aspect-square items-center justify-center bg-muted/50 p-8">
                  <div class="text-center">
                    <div class="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-primary/10">
                      <span class="text-3xl">📦</span>
                    </div>
                    <h3 class="text-lg font-semibold">{{ product.name }}</h3>
                  </div>
                </div>
                <div class="space-y-4 p-6">
                  <div class="flex items-center justify-between">
                    <span class="text-2xl font-bold">{{ product.price }}</span>
                    <div class="flex items-center gap-1">
                      <IconStar :size="16" class="fill-yellow-400 text-yellow-400" />
                      <span class="text-sm font-medium">{{ product.rating }}</span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <Button class="flex-1">
                      <IconShoppingCart :size="16" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon">
                      <IconHeart :size="16" />
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const Testimonials: Story = {
  render: () => ({
    components: {
      Carousel,
      CarouselContent,
      CarouselItem,
      CarouselNext,
      CarouselPrevious,
      IconQuote,
    },
    setup() {
      const testimonials = [
        {
          quote: 'This product has completely transformed how we work. Highly recommended!',
          author: 'Sarah Johnson',
          role: 'CEO, TechCorp',
        },
        {
          quote: 'Outstanding quality and excellent customer service. Worth every penny.',
          author: 'Michael Chen',
          role: 'Designer, Creative Studio',
        },
        {
          quote: 'The best investment we made this year. Our team productivity has doubled.',
          author: 'Emma Williams',
          role: 'Manager, StartupCo',
        },
      ]
      return { testimonials }
    },
    template: `
      <div class="w-full max-w-2xl mx-auto">
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="(testimonial, index) in testimonials" :key="index">
              <div class="rounded-lg border bg-background p-8">
                <IconQuote :size="40" class="mb-4 text-primary/30" />
                <blockquote class="mb-6 text-lg">{{ testimonial.quote }}</blockquote>
                <div class="flex items-center gap-4">
                  <div class="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <span class="text-lg font-semibold">{{ testimonial.author[0] }}</span>
                  </div>
                  <div>
                    <div class="font-semibold">{{ testimonial.author }}</div>
                    <div class="text-sm text-muted-foreground">{{ testimonial.role }}</div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const WithIndicators: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    setup() {
      const current = ref(0)
      const total = 5

      const onInitApi = (api: CarouselApi) => {
        if (!api) return
        current.value = api.selectedScrollSnap()
        api.on('select', () => {
          current.value = api.selectedScrollSnap()
        })
      }

      return { current, total, onInitApi }
    },
    template: `
      <div class="w-full max-w-xl mx-auto">
        <Carousel @init-api="onInitApi">
          <CarouselContent>
            <CarouselItem v-for="i in total" :key="i">
              <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                <span class="text-4xl font-semibold">{{ i }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div class="mt-4 flex justify-center gap-2">
          <button
            v-for="i in total"
            :key="i"
            :class="[
              'size-2 rounded-full transition-all',
              current === i - 1 ? 'bg-primary w-8' : 'bg-primary/30'
            ]"
            :aria-label="'Go to slide ' + i"
          />
        </div>
      </div>
    `,
  }),
}

export const Vertical: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    template: `
      <div class="mx-auto flex max-w-xs items-center justify-center">
        <Carousel orientation="vertical" class="w-full max-w-xs">
          <CarouselContent class="h-[400px]">
            <CarouselItem v-for="i in 5" :key="i">
              <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                <span class="text-4xl font-semibold">{{ i }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    template: `
      <div class="space-y-8">
        <div>
          <h4 class="mb-3 text-sm font-medium">Small</h4>
          <div class="w-full max-w-xs">
            <Carousel>
              <CarouselContent>
                <CarouselItem v-for="i in 5" :key="i">
                  <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-4">
                    <span class="text-2xl font-semibold">{{ i }}</span>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        <div>
          <h4 class="mb-3 text-sm font-medium">Medium</h4>
          <div class="w-full max-w-xl">
            <Carousel>
              <CarouselContent>
                <CarouselItem v-for="i in 5" :key="i">
                  <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                    <span class="text-3xl font-semibold">{{ i }}</span>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        <div>
          <h4 class="mb-3 text-sm font-medium">Large</h4>
          <div class="w-full max-w-3xl">
            <Carousel>
              <CarouselContent>
                <CarouselItem v-for="i in 5" :key="i">
                  <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-8">
                    <span class="text-4xl font-semibold">{{ i }}</span>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    `,
  }),
}

export const CardCarousel: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Badge },
    setup() {
      const cards = [
        { tag: 'Technology', title: 'AI Revolution', description: 'How AI is changing the world' },
        { tag: 'Design', title: 'UI Trends 2024', description: 'Latest design patterns' },
        { tag: 'Development', title: 'Vue 3 Guide', description: 'Master Vue composition API' },
        { tag: 'Business', title: 'Startup Tips', description: 'Building successful products' },
      ]
      return { cards }
    },
    template: `
      <div class="w-full max-w-xl mx-auto">
        <Carousel :opts="{ align: 'start' }">
          <CarouselContent>
            <CarouselItem v-for="(card, index) in cards" :key="index" class="md:basis-1/2">
              <div class="rounded-lg border bg-background p-6">
                <Badge class="mb-3">{{ card.tag }}</Badge>
                <h3 class="mb-2 text-lg font-semibold">{{ card.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ card.description }}</p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const WithLoop: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    template: `
      <div class="w-full max-w-xl mx-auto">
        <Carousel :opts="{ loop: true }">
          <CarouselContent>
            <CarouselItem v-for="i in 5" :key="i">
              <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                <span class="text-4xl font-semibold">{{ i }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div class="mt-2 text-center text-xs text-muted-foreground">Loop mode enabled</div>
      </div>
    `,
  }),
}

export const Centered: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    template: `
      <div class="w-full max-w-4xl mx-auto">
        <Carousel :opts="{ align: 'center', loop: true }">
          <CarouselContent>
            <CarouselItem v-for="i in 7" :key="i" class="basis-1/3">
              <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                <span class="text-3xl font-semibold">{{ i }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const FullWidth: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    setup() {
      const colors = [
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-orange-500',
        'bg-green-500',
      ]
      return { colors }
    },
    template: `
      <div class="w-full">
        <Carousel class="w-full">
          <CarouselContent>
            <CarouselItem v-for="(color, index) in colors" :key="index">
              <div :class="['flex aspect-[21/9] items-center justify-center rounded-lg', color]">
                <span class="text-6xl font-bold text-white">{{ index + 1 }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const VariableWidths: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    setup() {
      const items = [
        { width: 'basis-1/2', label: '1/2' },
        { width: 'basis-1/3', label: '1/3' },
        { width: 'basis-2/3', label: '2/3' },
        { width: 'basis-1/4', label: '1/4' },
        { width: 'basis-3/4', label: '3/4' },
      ]
      return { items }
    },
    template: `
      <div class="w-full max-w-4xl mx-auto">
        <Carousel :opts="{ align: 'start' }">
          <CarouselContent>
            <CarouselItem v-for="(item, index) in items" :key="index" :class="item.width">
              <div class="flex aspect-square items-center justify-center rounded-lg border bg-muted/50 p-6">
                <span class="text-2xl font-semibold">{{ item.label }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}

export const InCard: Story = {
  render: () => ({
    components: { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious },
    template: `
      <div class="mx-auto w-full max-w-2xl rounded-lg border p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold">Featured Items</h3>
          <p class="text-sm text-muted-foreground">Browse through our collection</p>
        </div>
        <Carousel>
          <CarouselContent>
            <CarouselItem v-for="i in 6" :key="i">
              <div class="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                <span class="text-5xl font-bold text-primary/40">{{ i }}</span>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    `,
  }),
}
