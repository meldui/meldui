<script setup lang="ts">
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@meldui/vue'
import { IconUser, IconSettings, IconMail } from '@meldui/tabler-vue'
</script>

<template>
  <div class="space-y-2 w-[300px]">
    <Item>
      <ItemMedia>
        <IconUser :size="20" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Profile</ItemTitle>
        <ItemDescription>View and edit your profile</ItemDescription>
      </ItemContent>
    </Item>
    <Item>
      <ItemMedia>
        <IconMail :size="20" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Messages</ItemTitle>
        <ItemDescription>Read your latest messages</ItemDescription>
      </ItemContent>
    </Item>
    <Item>
      <ItemMedia>
        <IconSettings :size="20" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Settings</ItemTitle>
        <ItemDescription>Manage your preferences</ItemDescription>
      </ItemContent>
    </Item>
  </div>
</template>
