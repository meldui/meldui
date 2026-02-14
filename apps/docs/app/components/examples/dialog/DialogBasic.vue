<script setup lang="ts">
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@meldui/vue'
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">Edit Profile</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you are done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <label class="text-right text-sm">Name</label>
          <input class="col-span-3 rounded-md border px-3 py-2 text-sm" placeholder="Your name" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <label class="text-right text-sm">Username</label>
          <input class="col-span-3 rounded-md border px-3 py-2 text-sm" placeholder="@username" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
