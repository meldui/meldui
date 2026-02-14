<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@meldui/vue'
import { resolveExample } from '~/utils/exampleRegistry'
import { useComponentSource } from '~/composables/useComponentSource'

const props = defineProps<{
  name: string
}>()

const ExampleComponent = resolveExample(props.name)
const source = useComponentSource(props.name)
const { copied, copy } = useCopyCode()
</script>

<template>
  <div class="not-prose my-6">
    <ClientOnly>
      <Tabs default-value="preview">
        <TabsList variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" class="mt-0">
          <div
            class="flex min-h-[200px] items-center justify-center rounded-b-lg border border-t-0 border-border p-6"
          >
            <component :is="ExampleComponent" v-if="ExampleComponent" />
            <p v-else class="text-sm text-muted-foreground">Example "{{ name }}" not found.</p>
          </div>
        </TabsContent>
        <TabsContent value="code" class="mt-0">
          <div class="relative">
            <button
              class="absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/50 bg-background/80 text-muted-foreground backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground"
              @click="copy(source)"
            >
              <svg
                v-if="copied"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
            <pre
              class="max-h-[400px] overflow-auto rounded-b-lg border border-t-0 border-border bg-muted/50 p-4 text-sm leading-relaxed"
            ><code>{{ source }}</code></pre>
          </div>
        </TabsContent>
      </Tabs>
      <template #fallback>
        <div class="rounded-lg border border-border p-6">
          <div class="flex min-h-[200px] items-center justify-center">
            <p class="text-sm text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
