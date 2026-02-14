<script setup lang="ts">
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@meldui/vue'
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline">Open Sheet</Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you are done.
        </SheetDescription>
      </SheetHeader>
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
      <SheetFooter>
        <SheetClose as-child>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
