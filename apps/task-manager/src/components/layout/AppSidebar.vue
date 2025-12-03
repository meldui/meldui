<script setup lang="ts">
import {
  IconBrandGithub,
  IconChecklist,
  IconFolders,
  IconLayoutDashboard,
  IconSettings,
} from '@meldui/tabler-vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@meldui/vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: IconLayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: IconChecklist },
  { name: 'Projects', path: '/projects', icon: IconFolders },
]

const isActive = (path: string) => route.path.startsWith(path)
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="p-4">
      <div class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <IconChecklist :size="18" />
        </div>
        <span class="font-semibold group-data-[collapsible=icon]:hidden">Task Manager</span>
      </div>
    </SidebarHeader>

    <SidebarSeparator />

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navigation" :key="item.path">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <SidebarMenuButton
                      :is-active="isActive(item.path)"
                      @click="router.push(item.path)"
                    >
                      <component :is="item.icon" />
                      <span>{{ item.name }}</span>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" class="group-data-[collapsible=icon]:block hidden">
                    {{ item.name }}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <SidebarMenuButton
                  :is-active="isActive('/settings')"
                  @click="router.push('/settings')"
                >
                  <IconSettings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right" class="group-data-[collapsible=icon]:block hidden">
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <SidebarMenuButton as="a" href="https://github.com/meldui/meldui" target="_blank">
                  <IconBrandGithub />
                  <span>GitHub</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right" class="group-data-[collapsible=icon]:block hidden">
                View on GitHub
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
