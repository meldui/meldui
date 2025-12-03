<script setup lang="ts">
import { IconLogout, IconMoon, IconSearch, IconSun, IconUser } from '@meldui/tabler-vue'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Separator,
  SidebarTrigger,
} from '@meldui/vue'
import { ref } from 'vue'
import { setTheme, theme } from '@/stores/settings'
import AppBreadcrumb from './AppBreadcrumb.vue'

const searchQuery = ref('')

const toggleTheme = () => {
  setTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4"
  >
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="h-6" />

    <AppBreadcrumb class="hidden md:flex" />

    <div class="ml-auto flex items-center gap-4">
      <!-- Search -->
      <div class="relative hidden md:block">
        <IconSearch class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchQuery"
          placeholder="Search tasks..."
          class="w-64 pl-9"
        />
      </div>

      <!-- Theme Toggle -->
      <Button variant="ghost" size="icon" @click="toggleTheme">
        <IconSun v-if="theme === 'dark'" class="h-5 w-5" />
        <IconMoon v-else class="h-5 w-5" />
        <span class="sr-only">Toggle theme</span>
      </Button>

      <!-- User Menu -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" class="relative h-9 w-9 rounded-full">
            <Avatar class="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuLabel>
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium">John Doe</p>
              <p class="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconUser class="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive">
            <IconLogout class="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
