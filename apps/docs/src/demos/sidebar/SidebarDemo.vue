<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
} from '@meldui/vue'
import { IconHome, IconSettings } from '@meldui/tabler-vue'

const code = `\u003cscript setup>
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarTrigger, SidebarInset
} from '@meldui/vue'
import { IconHome, IconSettings } from '@meldui/tabler-vue'
\u003c/script>

\u003ctemplate>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <h2>My App</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconHome class="size-4" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconSettings class="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <SidebarTrigger />
      <main>Content</main>
    </SidebarInset>
  </SidebarProvider>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <div class="flex h-[300px] w-full max-w-lg overflow-hidden rounded-lg border">
      <div class="w-[200px] shrink-0 border-r bg-sidebar p-4">
        <h2 class="mb-4 text-sm font-semibold">My App</h2>
        <p class="mb-1 text-xs text-muted-foreground">Navigation</p>
        <div class="space-y-1">
          <div class="flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-1.5 text-sm">
            <IconHome class="size-4" />
            <span>Home</span>
          </div>
          <div class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground">
            <IconSettings class="size-4" />
            <span>Settings</span>
          </div>
        </div>
      </div>
      <div class="flex-1 p-4 text-sm text-muted-foreground">Main content area</div>
    </div>
  </DemoBlock>
</template>
