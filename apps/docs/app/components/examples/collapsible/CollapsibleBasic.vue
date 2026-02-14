<script setup lang="ts">
import { ref } from 'vue'
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@meldui/vue'
import { IconSelector } from '@meldui/tabler-vue'
</script>

<template>
  <Collapsible class="w-[350px] space-y-2">
    <div class="flex items-center justify-between space-x-4 px-4">
      <h4 class="text-sm font-semibold">3 items tagged</h4>
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="icon-sm">
          <IconSelector />
          <span class="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">@meldui/vue</div>
    <CollapsibleContent class="space-y-2">
      <div class="rounded-md border px-4 py-3 font-mono text-sm">@meldui/tabler-vue</div>
      <div class="rounded-md border px-4 py-3 font-mono text-sm">@meldui/shared</div>
    </CollapsibleContent>
  </Collapsible>
</template>
