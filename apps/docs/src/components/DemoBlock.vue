<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Tabs, TabsList, TabsTrigger, TabsContent, ClipboardCopyButton } from '@meldui/vue'
import { codeToHtml } from 'shiki'

const props = defineProps<{
  code: string
}>()

const highlightedHtml = ref('')

async function highlight(code: string) {
  highlightedHtml.value = await codeToHtml(code, {
    lang: 'vue',
    themes: { light: 'github-light', dark: 'github-dark' },
  })
}

onMounted(() => highlight(props.code))
watch(() => props.code, highlight)
</script>

<template>
  <div class="my-6 overflow-hidden rounded-lg border border-border">
    <Tabs default-value="example">
      <div class="border-b border-border bg-muted/30 px-4">
        <TabsList class="h-auto bg-transparent p-0">
          <TabsTrigger
            value="example"
            class="rounded-none border-b-2 border-transparent px-3 py-2 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Example
          </TabsTrigger>
          <TabsTrigger
            value="code"
            class="rounded-none border-b-2 border-transparent px-3 py-2 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Code
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="example" class="mt-0 p-6">
        <div class="flex min-h-[120px] items-center justify-center">
          <slot />
        </div>
      </TabsContent>

      <TabsContent value="code" class="mt-0">
        <div class="relative">
          <div class="absolute top-2 right-2 z-10">
            <ClipboardCopyButton
              :text="code"
              variant="ghost"
              size="icon-sm"
              label=""
              copied-label=""
            />
          </div>
          <div
            v-if="highlightedHtml"
            class="overflow-x-auto text-sm [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_pre]:p-4"
            v-html="highlightedHtml"
          />
          <pre
            v-else
            class="m-0 overflow-x-auto rounded-none border-0 p-4 text-sm"
          ><code class="font-mono">{{ code }}</code></pre>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
