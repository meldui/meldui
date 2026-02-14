<script setup lang="ts">
const route = useRoute()

const { data: navigation } = await useAsyncData('footer-navigation', () =>
  queryCollectionNavigation('docs'),
)

// Flatten all navigation items to find prev/next
const flatPages = computed(() => {
  if (!navigation.value) return []
  const pages: { title: string; path: string }[] = []

  function flatten(items: any[]) {
    for (const item of items) {
      if (item.path && !item.children?.length) {
        pages.push({ title: item.title, path: item.path })
      }
      if (item.children) {
        flatten(item.children)
      }
    }
  }

  flatten(navigation.value)
  return pages
})

const currentIndex = computed(() => flatPages.value.findIndex((p) => p.path === route.path))

const prevPage = computed(() =>
  currentIndex.value > 0 ? flatPages.value[currentIndex.value - 1] : null,
)

const nextPage = computed(() =>
  currentIndex.value < flatPages.value.length - 1 ? flatPages.value[currentIndex.value + 1] : null,
)
</script>

<template>
  <nav
    v-if="prevPage || nextPage"
    class="mt-12 flex items-center justify-between border-t border-border pt-6"
  >
    <NuxtLink
      v-if="prevPage"
      :to="prevPage.path"
      class="group flex flex-col items-start gap-1 text-sm"
    >
      <span class="text-muted-foreground">Previous</span>
      <span class="font-medium group-hover:underline">{{ prevPage.title }}</span>
    </NuxtLink>
    <div v-else />
    <NuxtLink
      v-if="nextPage"
      :to="nextPage.path"
      class="group flex flex-col items-end gap-1 text-sm"
    >
      <span class="text-muted-foreground">Next</span>
      <span class="font-medium group-hover:underline">{{ nextPage.title }}</span>
    </NuxtLink>
  </nav>
</template>
