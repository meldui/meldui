<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@meldui/vue'

const code = `\u003ctemplate>
  <Tabs default-value="tab1" variant="pill">
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </Tabs>
\u003c/template>`
</script>

<template>
  <DemoBlock :code="code">
    <Tabs default-value="tab1" variant="pill" class="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  </DemoBlock>
</template>
