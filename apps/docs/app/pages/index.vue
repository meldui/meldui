<script setup lang="ts">
import { Button, Badge, Card, CardHeader, CardTitle, CardDescription } from '@meldui/vue'
import {
  IconArrowRight,
  IconPalette,
  IconComponents,
  IconMoon,
  IconCode,
  IconBrandVue,
  IconPuzzle,
} from '@meldui/tabler-vue'

definePageMeta({ layout: 'blank' })
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-border">
      <div class="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <Badge variant="secondary" class="mb-4">Open Source Design System</Badge>
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
          Build beautiful Vue apps
          <span class="text-primary">faster</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          70+ accessible Vue 3 components built on shadcn-vue, with Tailwind CSS v4, 5000+ icons,
          charts, and production-ready blocks.
        </p>
        <div class="mt-10 flex items-center justify-center gap-4">
          <NuxtLink to="/getting-started/introduction">
            <Button size="lg">
              Get Started
              <IconArrowRight class="ml-2 size-4" />
            </Button>
          </NuxtLink>
          <NuxtLink to="/components/interactive/button">
            <Button variant="outline" size="lg">Browse Components</Button>
          </NuxtLink>
        </div>
        <div class="mt-8">
          <div
            class="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 font-mono text-sm"
          >
            <span class="text-muted-foreground">$</span>
            <span>pnpm add @meldui/vue @meldui/tabler-vue</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="border-b border-border py-24">
      <div class="mx-auto max-w-5xl px-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight">Everything you need to build</h2>
          <p class="mt-4 text-lg text-muted-foreground">
            A complete design system with components, icons, charts, and patterns.
          </p>
        </div>
        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div
                class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <IconComponents :size="20" />
              </div>
              <CardTitle class="text-lg">70+ Components</CardTitle>
              <CardDescription>
                Buttons, forms, dialogs, tables, navigation, and more. All accessible and
                customizable.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div
                class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <IconPalette :size="20" />
              </div>
              <CardTitle class="text-lg">Tailwind CSS v4</CardTitle>
              <CardDescription>
                Modern CSS-first configuration with design tokens, OKLCH colors, and full dark mode
                support.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div
                class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <IconMoon :size="20" />
              </div>
              <CardTitle class="text-lg">Dark Mode</CardTitle>
              <CardDescription>
                Built-in dark mode with system preference detection and zero-flash rendering.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div
                class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <IconBrandVue :size="20" />
              </div>
              <CardTitle class="text-lg">Vue 3 Native</CardTitle>
              <CardDescription>
                Built with Composition API, TypeScript, and tree-shakeable exports for optimal
                bundle size.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div
                class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <IconCode :size="20" />
              </div>
              <CardTitle class="text-lg">Copy & Customize</CardTitle>
              <CardDescription>
                Components are copied into your project. Full source access — modify anything you
                need.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div
                class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <IconPuzzle :size="20" />
              </div>
              <CardTitle class="text-lg">Composite Components</CardTitle>
              <CardDescription>
                DataTable, DateRangePicker, MultiSelect, Timeline, and other high-level patterns
                ready to use.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>

    <!-- Component Showcase -->
    <section class="border-b border-border py-24">
      <div class="mx-auto max-w-5xl px-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight">Component Categories</h2>
          <p class="mt-4 text-lg text-muted-foreground">
            Organized into logical groups for easy discovery.
          </p>
        </div>
        <div class="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="category in [
              {
                name: 'Data Display',
                count: 9,
                path: '/components/data-display/avatar',
                desc: 'Avatar, Badge, Calendar, Card, Table',
              },
              {
                name: 'Data Entry',
                count: 21,
                path: '/components/data-entry/input',
                desc: 'Input, Select, Checkbox, Slider, Form',
              },
              {
                name: 'Feedback',
                count: 9,
                path: '/components/feedback/alert',
                desc: 'Alert, Progress, Skeleton, Spinner',
              },
              {
                name: 'Interactive',
                count: 6,
                path: '/components/interactive/button',
                desc: 'Button, Toggle, Command, Carousel',
              },
              {
                name: 'Layout',
                count: 7,
                path: '/components/layout/accordion',
                desc: 'Accordion, Resizable, Sidebar',
              },
              {
                name: 'Navigation',
                count: 7,
                path: '/components/navigation/tabs',
                desc: 'Tabs, Breadcrumb, Pagination, Menu',
              },
              {
                name: 'Overlay',
                count: 7,
                path: '/components/overlay/dialog',
                desc: 'Dialog, Drawer, Popover, Tooltip',
              },
              {
                name: 'Data Table',
                count: 9,
                path: '/data-table/overview',
                desc: 'Sorting, filtering, selection, pinning',
              },
              {
                name: 'Charts',
                count: 12,
                path: '/charts/overview',
                desc: 'Line, Bar, Pie, Area, Radar, Scatter',
              },
            ]"
            :key="category.name"
            :to="category.path"
            class="group rounded-lg border border-border p-6 transition-colors hover:border-primary/50 hover:bg-accent/50"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ category.name }}</h3>
              <Badge variant="secondary">{{ category.count }}</Badge>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">{{ category.desc }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24">
      <div class="mx-auto max-w-5xl px-6 text-center">
        <h2 class="text-3xl font-bold tracking-tight">Ready to get started?</h2>
        <p class="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Install MeldUI and start building beautiful, accessible interfaces in minutes.
        </p>
        <div class="mt-8 flex items-center justify-center gap-4">
          <NuxtLink to="/getting-started/installation">
            <Button size="lg">
              Read the Docs
              <IconArrowRight class="ml-2 size-4" />
            </Button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
