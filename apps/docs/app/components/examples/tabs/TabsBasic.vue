<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@meldui/vue'
</script>

<template>
  <Tabs default-value="account" class="w-[400px]">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">
      <p class="text-sm text-muted-foreground">
        Make changes to your account here. Click save when you are done.
      </p>
    </TabsContent>
    <TabsContent value="password">
      <p class="text-sm text-muted-foreground">
        Change your password here. After saving, you will be logged out.
      </p>
    </TabsContent>
  </Tabs>
</template>
