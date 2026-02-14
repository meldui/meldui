<script setup lang="ts">
const { data: navigation } = await useAsyncData('docs-navigation', () =>
  queryCollectionNavigation('docs'),
)

const route = useRoute()

function isActive(path: string) {
  return route.path === path
}

function formatTitle(title: string) {
  return title
}
</script>

<template>
  <nav class="py-4 pr-4 pl-4">
    <template v-if="navigation">
      <div v-for="section in navigation" :key="section.path" class="mb-4">
        <h4 class="mb-1 px-2 text-sm font-semibold tracking-tight">
          {{ formatTitle(section.title) }}
        </h4>
        <ul v-if="section.children?.length" class="space-y-0.5">
          <template v-for="child in section.children" :key="child.path">
            <!-- Direct page link -->
            <li v-if="!child.children?.length">
              <NuxtLink
                :to="child.path"
                class="block rounded-md px-2 py-1.5 text-sm transition-colors"
                :class="
                  isActive(child.path)
                    ? 'bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                "
              >
                {{ child.title }}
              </NuxtLink>
            </li>
            <!-- Subcategory with children -->
            <li v-else>
              <h5
                class="mt-3 mb-1 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {{ child.title }}
              </h5>
              <ul class="space-y-0.5">
                <li v-for="subChild in child.children" :key="subChild.path">
                  <NuxtLink
                    :to="subChild.path"
                    class="block rounded-md px-2 py-1.5 text-sm transition-colors"
                    :class="
                      isActive(subChild.path)
                        ? 'bg-accent font-medium text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                    "
                  >
                    {{ subChild.title }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </template>
  </nav>
</template>
