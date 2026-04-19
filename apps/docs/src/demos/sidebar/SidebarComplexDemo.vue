<script setup>
import { ref } from 'vue'
import DemoBlock from '../../components/DemoBlock.vue'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@meldui/vue'
import {
  IconHome, IconSettings, IconFolder,
  IconChartBar, IconMail, IconCalendar, IconChevronDown,
} from '@meldui/tabler-vue'

const projectsOpen = ref(true)

const code = `\u003cscript setup>
import { ref } from 'vue'
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarSeparator, SidebarTrigger, SidebarInset,
  Collapsible, CollapsibleTrigger, CollapsibleContent,
} from '@meldui/vue'
import {
  IconHome, IconSettings, IconFolder,
  IconChartBar, IconMail, IconCalendar, IconChevronDown,
} from '@meldui/tabler-vue'

const projectsOpen = ref(true)
\u003c/script>

\u003ctemplate>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <span class="font-bold">Acme Inc</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton is-active>
                  <IconHome class="size-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconChartBar class="size-4" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconMail class="size-4" />
                  <span>Messages</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>12</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <Collapsible v-model:open="projectsOpen" class="group/collapsible">
            <SidebarGroupLabel as-child>
              <CollapsibleTrigger>
                Projects
                <IconChevronDown class="ml-auto size-4 transition-transform
                  group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconFolder class="size-4" />
                      <span>Design System</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton is-active>Components</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Tokens</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Icons</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <IconFolder class="size-4" />
                      <span>Marketing Site</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Landing Page</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Blog</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <IconSettings class="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header class="flex items-center gap-2 border-b p-4">
        <SidebarTrigger />
        <span>Dashboard</span>
      </header>
    </SidebarInset>
  </SidebarProvider>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <!-- Preview uses plain HTML since sidebar sub-components require SidebarProvider context -->
    <div class="flex h-[420px] w-full max-w-xl overflow-hidden rounded-lg border text-sm">
      <div class="flex w-[220px] shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
        <!-- Header -->
        <div class="px-4 pt-4 pb-2 font-bold">Acme Inc</div>

        <!-- Main nav -->
        <div class="flex-1 overflow-y-auto px-3">
          <div class="mb-1 mt-2 px-2 text-xs font-medium text-muted-foreground">Platform</div>
          <div class="space-y-0.5">
            <div>
              <div class="flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-1.5 font-medium text-sidebar-accent-foreground">
                <IconHome class="size-4" /> Dashboard
              </div>
            </div>
            <div>
              <div class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
                <IconChartBar class="size-4" /> Analytics
              </div>
            </div>
            <div class="relative">
              <div class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
                <IconMail class="size-4" /> Messages
              </div>
              <span class="absolute right-1 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium">12</span>
            </div>
            <div>
              <div class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
                <IconCalendar class="size-4" /> Calendar
              </div>
            </div>
          </div>

          <div class="my-3 h-px bg-sidebar-border"></div>

          <!-- Collapsible projects -->
          <Collapsible v-model:open="projectsOpen" class="group/collapsible">
            <CollapsibleTrigger class="flex w-full cursor-pointer items-center px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              Projects
              <IconChevronDown class="ml-auto size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="mt-1 space-y-0.5">
                <!-- Design System with sub-items -->
                <div>
                  <div class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
                    <IconFolder class="size-4" /> Design System
                  </div>
                  <div class="ml-[18px] mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2.5">
                    <div>
                      <div class="flex cursor-pointer items-center rounded-md bg-sidebar-accent px-2 py-1 text-sidebar-accent-foreground">Components</div>
                    </div>
                    <div>
                      <div class="flex cursor-pointer items-center rounded-md px-2 py-1 text-sidebar-foreground hover:bg-sidebar-accent">Tokens</div>
                    </div>
                    <div>
                      <div class="flex cursor-pointer items-center rounded-md px-2 py-1 text-sidebar-foreground hover:bg-sidebar-accent">Icons</div>
                    </div>
                  </div>
                </div>
                <!-- Marketing Site with sub-items -->
                <div>
                  <div class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
                    <IconFolder class="size-4" /> Marketing Site
                  </div>
                  <div class="ml-[18px] mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2.5">
                    <div>
                      <div class="flex cursor-pointer items-center rounded-md px-2 py-1 text-sidebar-foreground hover:bg-sidebar-accent">Landing Page</div>
                    </div>
                    <div>
                      <div class="flex cursor-pointer items-center rounded-md px-2 py-1 text-sidebar-foreground hover:bg-sidebar-accent">Blog</div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <!-- Footer -->
        <div class="border-t border-sidebar-border p-3">
          <div class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent">
            <IconSettings class="size-4" /> Settings
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 bg-background">
        <div class="border-b p-4 font-medium">Dashboard</div>
        <div class="p-6 text-muted-foreground">
          Collapsible project groups with nested sub-menus and badge counts. Click "Projects" to toggle.
        </div>
      </div>
    </div>
  </DemoBlock>
</template>
