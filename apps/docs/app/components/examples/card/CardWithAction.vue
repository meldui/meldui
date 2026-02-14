<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  Button,
} from '@meldui/vue'
import { IconDotsVertical } from '@meldui/tabler-vue'
</script>

<template>
  <Card class="w-[350px]">
    <CardHeader>
      <CardTitle>Notifications</CardTitle>
      <CardDescription>You have 3 unread messages.</CardDescription>
      <CardAction>
        <Button variant="ghost" size="icon">
          <IconDotsVertical />
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground">View and manage your notification preferences.</p>
    </CardContent>
  </Card>
</template>
