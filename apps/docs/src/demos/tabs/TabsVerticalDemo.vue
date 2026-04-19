<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@meldui/vue'

const code = `\u003ctemplate>
  <Tabs default-value="general" orientation="vertical">
    <TabsList>
      <TabsTrigger value="general">General</TabsTrigger>
      <TabsTrigger value="security">Security</TabsTrigger>
      <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
    </TabsList>
    <TabsContent value="general">General settings content.</TabsContent>
    <TabsContent value="security">Security settings content.</TabsContent>
  </Tabs>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Tabs default-value="general" orientation="vertical" class="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications" disabled>Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general" class="p-4 text-sm">General settings content.</TabsContent>
      <TabsContent value="security" class="p-4 text-sm">Security settings content.</TabsContent>
    </Tabs>
  </DemoBlock>
</template>
