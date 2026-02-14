<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()
const slug = computed(() => {
  const parts = (route.params.slug as string[]) || []
  return parts.join('/')
})

const { data: page } = await useAsyncData(`doc-${slug.value}`, () =>
  queryCollection('docs').path(`/${slug.value}`).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

// SEO meta
const pageTitle = page.value.title ? `${page.value.title} - MeldUI` : 'MeldUI'
const pageDescription = page.value.description || 'MeldUI documentation'
const pageUrl = `https://meldui.dev${route.path}`

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: pageUrl },
    { property: 'og:type', content: 'article' },
    { property: 'og:site_name', content: 'MeldUI' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
  ],
})
</script>

<template>
  <article v-if="page" class="prose prose-neutral dark:prose-invert mx-auto max-w-3xl">
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">{{ page.title }}</h1>
      <p v-if="page.description" class="mt-2 text-lg text-muted-foreground">
        {{ page.description }}
      </p>
    </header>
    <ContentRenderer :value="page" />
    <DocsFooter />
  </article>
</template>
