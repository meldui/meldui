<script setup lang="ts">
import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from '@meldui/vue'
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <Button variant="link">@meldui</Button>
    </HoverCardTrigger>
    <HoverCardContent class="w-80">
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">MeldUI</h4>
        <p class="text-sm">
          An internal design system built on shadcn components for Vue and React.
        </p>
        <div class="flex items-center pt-2">
          <span class="text-xs text-muted-foreground"> Joined December 2024 </span>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
