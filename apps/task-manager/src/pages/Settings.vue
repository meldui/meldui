<script setup lang="ts">
import {
  IconDeviceDesktop,
  IconDownload,
  IconMoon,
  IconSun,
  IconTrash,
  IconUpload,
} from '@meldui/tabler-vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toast,
} from '@meldui/vue'
import { ref } from 'vue'
import { clearAllStorage, exportData, importData } from '@/composables/useLocalStorage'
import { defaultView, resetSettings, setDefaultView, setTheme, theme } from '@/stores/settings'
import type { DefaultView, ThemeMode } from '@/types'

const importTextarea = ref('')

const handleThemeChange = (value: string) => {
  setTheme(value as ThemeMode)
  toast.success('Theme updated')
}

const handleDefaultViewChange = (value: unknown) => {
  if (value && typeof value === 'string') {
    setDefaultView(value as DefaultView)
    toast.success('Default view updated')
  }
}

const handleExport = () => {
  const data = exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('Data exported successfully')
}

const handleImport = () => {
  if (!importTextarea.value.trim()) {
    toast.error('Please paste JSON data to import')
    return
  }
  const success = importData(importTextarea.value)
  if (success) {
    toast.success('Data imported successfully', { description: 'Refresh the page to see changes' })
    importTextarea.value = ''
  } else {
    toast.error('Invalid JSON data')
  }
}

const handleClearData = () => {
  clearAllStorage()
  toast.success('All data cleared', { description: 'Refresh the page to reset' })
}

const handleResetSettings = () => {
  resetSettings()
  toast.success('Settings reset to defaults')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
      <p class="text-muted-foreground">Manage your preferences and data</p>
    </div>

    <!-- Tabs -->
    <Tabs default-value="appearance" class="space-y-4">
      <TabsList>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="data">Data</TabsTrigger>
      </TabsList>

      <!-- Appearance Tab -->
      <TabsContent value="appearance" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Choose how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              :model-value="theme"
              class="grid grid-cols-3 gap-4"
              @update:model-value="handleThemeChange"
            >
              <div>
                <RadioGroupItem id="theme-light" value="light" class="peer sr-only" />
                <Label
                  for="theme-light"
                  class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <IconSun class="mb-3 h-6 w-6" />
                  Light
                </Label>
              </div>
              <div>
                <RadioGroupItem id="theme-dark" value="dark" class="peer sr-only" />
                <Label
                  for="theme-dark"
                  class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <IconMoon class="mb-3 h-6 w-6" />
                  Dark
                </Label>
              </div>
              <div>
                <RadioGroupItem id="theme-system" value="system" class="peer sr-only" />
                <Label
                  for="theme-system"
                  class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <IconDeviceDesktop class="mb-3 h-6 w-6" />
                  System
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Preferences Tab -->
      <TabsContent value="preferences" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Default View</CardTitle>
            <CardDescription>Choose the default task view</CardDescription>
          </CardHeader>
          <CardContent>
            <Select :model-value="defaultView" @update:model-value="handleDefaultViewChange">
              <SelectTrigger class="w-[200px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">List View</SelectItem>
                <SelectItem value="board">Board View</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Settings</CardTitle>
            <CardDescription>Restore all settings to their defaults</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" @click="handleResetSettings">
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Data Tab -->
      <TabsContent value="data" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>Download all your tasks and projects as JSON</CardDescription>
          </CardHeader>
          <CardContent>
            <Button @click="handleExport">
              <IconDownload class="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>Restore data from a JSON backup</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <Textarea
              v-model="importTextarea"
              placeholder="Paste JSON data here..."
              :rows="4"
            />
            <Button @click="handleImport">
              <IconUpload class="mr-2 h-4 w-4" />
              Import Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clear All Data</CardTitle>
            <CardDescription>
              Permanently delete all tasks, projects, and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="destructive">
                  <IconTrash class="mr-2 h-4 w-4" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your tasks, projects, and settings.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="handleClearData">
                    Yes, clear all data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
