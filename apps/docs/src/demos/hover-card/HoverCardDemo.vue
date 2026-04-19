<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { HoverCard, HoverCardTrigger, HoverCardContent, Avatar, AvatarImage, AvatarFallback } from '@meldui/vue'
import { IconCalendar } from '@meldui/tabler-vue'

const code = `\u003cscript setup>
import { HoverCard, HoverCardTrigger, HoverCardContent, Avatar, AvatarImage, AvatarFallback } from '@meldui/vue'
import { IconCalendar } from '@meldui/tabler-vue'
\u003c/script>

\u003ctemplate>
  <HoverCard>
    <HoverCardTrigger as-child>
      <a href="#" class="font-medium underline underline-offset-4">@meldui</a>
    </HoverCardTrigger>
    <HoverCardContent class="w-80">
      <div class="flex gap-4">
        <Avatar>
          <AvatarFallback>MU</AvatarFallback>
        </Avatar>
        <div class="space-y-1">
          <h4 class="text-sm font-semibold">@meldui</h4>
          <p class="text-sm">A Vue 3 component library built on shadcn-vue with Tailwind CSS v4.</p>
          <div class="flex items-center pt-2">
            <IconCalendar class="mr-2 size-4 opacity-70" />
            <span class="text-xs text-muted-foreground">Joined December 2024</span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <HoverCard>
      <HoverCardTrigger as-child>
        <a href="#" class="font-medium underline underline-offset-4">@meldui</a>
      </HoverCardTrigger>
      <HoverCardContent class="w-80">
        <div class="flex gap-4">
          <Avatar>
            <AvatarFallback>MU</AvatarFallback>
          </Avatar>
          <div class="space-y-1">
            <div class="text-sm font-semibold">@meldui</div>
            <div class="text-sm">A Vue 3 component library built on shadcn-vue with Tailwind CSS v4.</div>
            <div class="flex items-center pt-2">
              <IconCalendar class="mr-2 size-4 opacity-70" />
              <span class="text-xs text-muted-foreground">Joined December 2024</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </DemoBlock>
</template>
