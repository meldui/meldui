<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <header
    class="sticky top-0 z-50 flex h-14 items-center border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="flex w-full items-center justify-between">
      <!-- Left: Logo + nav -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold"> MeldUI </NuxtLink>
        <nav class="hidden items-center gap-4 text-sm md:flex">
          <NuxtLink
            to="/getting-started/introduction"
            class="text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Docs
          </NuxtLink>
          <NuxtLink
            to="/components/interactive/button"
            class="text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Components
          </NuxtLink>
          <NuxtLink
            to="/blocks/authentication"
            class="text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Blocks
          </NuxtLink>
        </nav>
      </div>

      <!-- Right: Search + actions -->
      <div class="flex items-center gap-2">
        <SearchButton />
        <ClientOnly>
          <SearchDialog />
        </ClientOnly>

        <ThemeToggle />

        <!-- Mobile nav trigger -->
        <DocsMobileNav class="lg:hidden" />
      </div>
    </div>
  </header>
</template>
