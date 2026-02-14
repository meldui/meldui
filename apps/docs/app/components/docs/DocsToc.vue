<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`toc-${route.path}`, () =>
  queryCollection('docs').path(route.path).first(),
)

const activeId = useScrollSpy()
</script>

<template>
  <div v-if="page?.body?.toc?.links?.length" class="py-4 pr-4 pl-4">
    <h4 class="mb-3 text-sm font-semibold">On this page</h4>
    <ul class="space-y-1.5 text-sm">
      <li v-for="link in page.body.toc.links" :key="link.id">
        <a
          :href="`#${link.id}`"
          class="block transition-colors"
          :class="
            activeId === link.id
              ? 'font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          {{ link.text }}
        </a>
        <ul v-if="link.children?.length" class="mt-1 ml-3 space-y-1">
          <li v-for="child in link.children" :key="child.id">
            <a
              :href="`#${child.id}`"
              class="block transition-colors"
              :class="
                activeId === child.id
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              "
            >
              {{ child.text }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
